import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getSiteConfig,
  getAllArticles,
  computeSourceHash
} from './lib/content.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const translationsDir = path.join(rootDir, 'content', 'translations');

const args = process.argv.slice(2);
const forceFlag = args.includes('--force');

const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

const siteConfig = getSiteConfig();
const defaultLang = siteConfig.defaultLanguage || 'en';
const targetLanguages = siteConfig.languages
  .map(l => l.code)
  .filter(code => code !== defaultLang);

const DELIMITER = ' §|§ ';

/**
 * Free Google Translate Web Endpoint with retries
 */
async function translateChunkFree(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data || !Array.isArray(data[0])) throw new Error('Malformed translation response');
      return data[0].map(s => s[0]).join('');
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise(r => setTimeout(r, 600 * attempt));
    }
  }
}

/**
 * Translate an array of strings into target language with batching
 * NEVER output any [es], [de], [fr], [ar], [ur] prefixes!
 */
async function translateStrings(strings, targetLang) {
  if (strings.length === 0) return [];

  // Strip any old mock language prefixes
  const cleaned = strings.map(s => {
    if (typeof s !== 'string') return s;
    return s.replace(/^\[(?:es|de|fr|ar|ur|en)\]\s*/i, '').trim();
  });

  if (apiKey) {
    const results = [];
    const BATCH_SIZE = 100;
    for (let i = 0; i < cleaned.length; i += BATCH_SIZE) {
      const batch = cleaned.slice(i, i + BATCH_SIZE);
      const endpoint = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: batch,
          target: targetLang,
          source: defaultLang,
          format: 'text',
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Google Translate API error (${res.status}): ${errText}`);
      }
      const data = await res.json();
      for (const t of data?.data?.translations || []) {
        results.push(t.translatedText);
      }
    }
    return results;
  }

  // Free Google Translate client API with batch delimiter
  const results = [];
  let currentBatch = [];
  let currentLen = 0;

  const flushBatch = async () => {
    if (currentBatch.length === 0) return;
    const joined = currentBatch.join(DELIMITER);
    try {
      const translated = await translateChunkFree(joined, targetLang);
      const parts = translated.split(/\s*§\|§\s*/);
      if (parts.length === currentBatch.length) {
        results.push(...parts.map(p => p.trim()));
      } else {
        // Fallback: translate individually
        for (const item of currentBatch) {
          try {
            const single = await translateChunkFree(item, targetLang);
            results.push(single.trim());
          } catch {
            results.push(item);
          }
          await new Promise(r => setTimeout(r, 40));
        }
      }
    } catch {
      // Offline fallback: keep the clean original text without any prefix
      results.push(...currentBatch);
    }
    currentBatch = [];
    currentLen = 0;
    await new Promise(r => setTimeout(r, 80));
  };

  for (const str of cleaned) {
    if (currentLen + str.length > 1400 || currentBatch.length >= 15) {
      await flushBatch();
    }
    currentBatch.push(str);
    currentLen += str.length;
  }
  await flushBatch();

  return results;
}

/**
 * Translate a single article into target language
 */
async function translateArticle(article, targetLang) {
  const stringPool = [];

  // Title & Excerpt
  stringPool.push(article.title);
  stringPool.push(article.excerpt);

  let imageAltIdx = null;
  if (typeof article.imageAlt === 'string') {
    imageAltIdx = stringPool.length;
    stringPool.push(article.imageAlt);
  }

  const bodyMapping = [];

  for (let bi = 0; bi < article.body.length; bi++) {
    const block = article.body[bi];
    if (['p', 'h2', 'h3'].includes(block.type)) {
      const idx = stringPool.length;
      stringPool.push(block.text);
      bodyMapping.push({ blockIndex: bi, type: block.type, textIdx: idx });
    } else if (block.type === 'quote') {
      const textIdx = stringPool.length;
      stringPool.push(block.text);
      let citeIdx = null;
      if (block.cite) {
        citeIdx = stringPool.length;
        stringPool.push(block.cite);
      }
      bodyMapping.push({ blockIndex: bi, type: 'quote', textIdx, citeIdx });
    } else if (['ul', 'ol'].includes(block.type)) {
      const itemIndices = [];
      for (const item of block.items) {
        itemIndices.push(stringPool.length);
        stringPool.push(item);
      }
      bodyMapping.push({ blockIndex: bi, type: block.type, itemIndices });
    } else if (block.type === 'image') {
      let altIdx = null;
      let captionIdx = null;
      if (block.alt) {
        altIdx = stringPool.length;
        stringPool.push(block.alt);
      }
      if (block.caption) {
        captionIdx = stringPool.length;
        stringPool.push(block.caption);
      }
      bodyMapping.push({ blockIndex: bi, type: 'image', raw: block, altIdx, captionIdx });
    } else if (block.type === 'video') {
      let titleIdx = null;
      let captionIdx = null;
      if (block.title) {
        titleIdx = stringPool.length;
        stringPool.push(block.title);
      }
      if (block.caption) {
        captionIdx = stringPool.length;
        stringPool.push(block.caption);
      }
      bodyMapping.push({ blockIndex: bi, type: 'video', raw: block, titleIdx, captionIdx });
    } else if (block.type === 'code') {
      bodyMapping.push({ blockIndex: bi, type: 'code', raw: block });
    }
  }

  const translatedPool = await translateStrings(stringPool, targetLang);

  const translatedTitle = translatedPool[0] || article.title;
  const translatedExcerpt = translatedPool[1] || article.excerpt;
  const translatedImageAlt = imageAltIdx !== null ? translatedPool[imageAltIdx] : undefined;

  const translatedBody = [];

  for (const m of bodyMapping) {
    if (['p', 'h2', 'h3'].includes(m.type)) {
      translatedBody.push({
        type: m.type,
        text: translatedPool[m.textIdx] || '',
      });
    } else if (m.type === 'quote') {
      const block = {
        type: 'quote',
        text: translatedPool[m.textIdx] || '',
      };
      if (m.citeIdx !== null) {
        block.cite = translatedPool[m.citeIdx];
      }
      translatedBody.push(block);
    } else if (['ul', 'ol'].includes(m.type)) {
      translatedBody.push({
        type: m.type,
        items: m.itemIndices.map(idx => translatedPool[idx] || ''),
      });
    } else if (m.type === 'image') {
      translatedBody.push({
        type: 'image',
        src: m.raw.src,
        alt: m.altIdx !== null ? translatedPool[m.altIdx] : m.raw.alt,
        ...(m.captionIdx !== null ? { caption: translatedPool[m.captionIdx] } : (m.raw.caption ? { caption: m.raw.caption } : {})),
      });
    } else if (m.type === 'video') {
      translatedBody.push({
        type: 'video',
        src: m.raw.src,
        ...(m.raw.poster ? { poster: m.raw.poster } : {}),
        ...(m.titleIdx !== null ? { title: translatedPool[m.titleIdx] } : (m.raw.title ? { title: m.raw.title } : {})),
        ...(m.captionIdx !== null ? { caption: translatedPool[m.captionIdx] } : (m.raw.caption ? { caption: m.raw.caption } : {})),
      });
    } else if (m.type === 'code') {
      // NEVER translate code blocks
      translatedBody.push({ ...m.raw });
    }
  }

  const sourceHash = computeSourceHash(article);

  return {
    slug: article.slug,
    title: translatedTitle,
    excerpt: translatedExcerpt,
    date: article.date,
    ...(article.updated ? { updated: article.updated } : {}),
    author: article.author,
    tags: [...article.tags],
    ...(article.image ? { image: article.image } : {}),
    ...(translatedImageAlt ? { imageAlt: translatedImageAlt } : (article.imageAlt ? { imageAlt: article.imageAlt } : {})),
    ...(article.featured !== undefined ? { featured: article.featured } : {}),
    body: translatedBody,
    sourceHash,
  };
}

async function run() {
  const articles = getAllArticles();
  console.log(`\n🌐 Translating ${articles.length} article(s) into: ${targetLanguages.join(', ')}`);

  for (const targetLang of targetLanguages) {
    const langDir = path.join(translationsDir, targetLang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }

    for (const article of articles) {
      const targetPath = path.join(langDir, `${article.slug}.json`);
      const currentSourceHash = computeSourceHash(article);

      let shouldTranslate = forceFlag || !fs.existsSync(targetPath);

      if (!shouldTranslate && fs.existsSync(targetPath)) {
        try {
          const raw = fs.readFileSync(targetPath, 'utf8');
          // If the translation has the old mock [lang] prefix, re-translate!
          if (raw.includes(`[${targetLang}]`)) {
            console.log(`   [Mock detected] "${article.slug}" has old [${targetLang}] prefix. Re-translating...`);
            shouldTranslate = true;
          } else {
            const existing = JSON.parse(raw);
            if (existing.sourceHash !== currentSourceHash) {
              console.log(`   [Hash Mismatch] "${article.slug}" has changed for ${targetLang}. Re-translating...`);
              shouldTranslate = true;
            }
          }
        } catch {
          shouldTranslate = true;
        }
      }

      if (shouldTranslate) {
        console.log(`   Translating "${article.slug}" -> ${targetLang}...`);
        const translatedArticle = await translateArticle(article, targetLang);
        fs.writeFileSync(targetPath, JSON.stringify(translatedArticle, null, 2) + '\n', 'utf8');
        console.log(`   ✓ Saved ${path.relative(rootDir, targetPath)}`);
      } else {
        console.log(`   ⚡ Skipped "${article.slug}" (${targetLang}) - verified.`);
      }
    }
  }

  console.log('✅ Translation process finished.\n');
}

run().catch(err => {
  console.error('\n❌ Translation failed:', err);
  process.exit(1);
});

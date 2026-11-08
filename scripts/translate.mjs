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
const mockFlag = args.includes('--mock') || process.env.MOCK_TRANSLATION === 'true';

const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

if (!apiKey && !mockFlag) {
  console.warn('⚠️  GOOGLE_TRANSLATE_API_KEY is not defined. Skipping translation step.');
  console.warn('    Translations will not be fetched. Set GOOGLE_TRANSLATE_API_KEY or pass --mock to test.');
  process.exit(0);
}

const siteConfig = getSiteConfig();
const defaultLang = siteConfig.defaultLanguage || 'en';
const targetLanguages = siteConfig.languages
  .map(l => l.code)
  .filter(code => code !== defaultLang);

/**
 * Call Google Cloud Translation API (v2 REST) in batches of at most 100 strings.
 */
async function translateStrings(strings, targetLang) {
  if (strings.length === 0) return [];

  if (mockFlag && !apiKey) {
    // Deterministic mock translation for testing pipeline
    return strings.map(str => `[${targetLang}] ${str}`);
  }

  const results = [];
  const BATCH_SIZE = 100;

  for (let i = 0; i < strings.length; i += BATCH_SIZE) {
    const batch = strings.slice(i, i + BATCH_SIZE);
    const endpoint = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const translations = data?.data?.translations;
    if (!translations || !Array.isArray(translations)) {
      throw new Error(`Unexpected Google Translate API response format: ${JSON.stringify(data)}`);
    }

    for (const t of translations) {
      results.push(t.translatedText);
    }
  }

  return results;
}

/**
 * Translate a single article into target language
 */
async function translateArticle(article, targetLang) {
  // Collect strings to translate and map positions
  const stringPool = [];

  // Title
  stringPool.push(article.title);
  // Excerpt
  stringPool.push(article.excerpt);

  // Body translatable elements
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
    } else if (block.type === 'code') {
      bodyMapping.push({ blockIndex: bi, type: 'code', raw: block });
    }
  }

  const translatedPool = await translateStrings(stringPool, targetLang);

  const translatedTitle = translatedPool[0];
  const translatedExcerpt = translatedPool[1];

  const translatedBody = [];

  for (const m of bodyMapping) {
    if (['p', 'h2', 'h3'].includes(m.type)) {
      translatedBody.push({
        type: m.type,
        text: translatedPool[m.textIdx],
      });
    } else if (m.type === 'quote') {
      const block = {
        type: 'quote',
        text: translatedPool[m.textIdx],
      };
      if (m.citeIdx !== null) {
        block.cite = translatedPool[m.citeIdx];
      }
      translatedBody.push(block);
    } else if (['ul', 'ol'].includes(m.type)) {
      translatedBody.push({
        type: m.type,
        items: m.itemIndices.map(idx => translatedPool[idx]),
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
    body: translatedBody,
    sourceHash,
  };
}

async function run() {
  const articles = getAllArticles();
  console.log(`\n🌐 Translating ${articles.length} article(s) into: ${targetLanguages.join(', ')}`);

  for (const targetLang of targetLanguages) {
    const langDir = path.join(translationsDir, targetLang);
    // Explicit directory creation without relying on sh brace expansion
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }

    for (const article of articles) {
      const targetPath = path.join(langDir, `${article.slug}.json`);
      const currentSourceHash = computeSourceHash(article);

      let shouldTranslate = forceFlag || !fs.existsSync(targetPath);

      if (!shouldTranslate && fs.existsSync(targetPath)) {
        try {
          const existing = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
          if (existing.sourceHash !== currentSourceHash) {
            console.log(`   [Hash Mismatch] Article "${article.slug}" has changed for ${targetLang}. Re-translating...`);
            shouldTranslate = true;
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
        console.log(`   ⚡ Skipped "${article.slug}" (${targetLang}) - hash ${currentSourceHash.slice(0, 7)} unchanged.`);
      }
    }
  }

  console.log('✅ Translation process finished.\n');
}

run().catch(err => {
  console.error('\n❌ Translation failed:', err);
  process.exit(1);
});


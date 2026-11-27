import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content');
const articlesDir = path.join(contentDir, 'articles');
const translationsDir = path.join(contentDir, 'translations');
const outputDir = path.join(rootDir, 'src', 'data');

const SHARD_COUNT = 40;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const siteConfigPath = path.join(rootDir, 'site.config.json');
const siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, 'utf8'));
const defaultLang = siteConfig.defaultLanguage || 'en';
const languages = siteConfig.languages || [{ code: 'en', name: 'English', dir: 'ltr' }];

const articleFiles = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.json')).sort();
const baseArticles = articleFiles.map((file) => {
  const filePath = path.join(articlesDir, file);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

// Sort base articles newest-first so shard 0 always holds newest flagship articles
baseArticles.sort((a, b) => b.date.localeCompare(a.date));

console.log(`📦 Bundling master article data for ${articleFiles.length} base articles across ${languages.length} locales (${SHARD_COUNT} shards)...`);

const availableLanguagesMap = {};
const slugShardMap = {};

for (let i = 0; i < baseArticles.length; i++) {
  const article = baseArticles[i];
  const slug = article.slug;
  slugShardMap[slug] = i % SHARD_COUNT;

  const available = [defaultLang];
  for (const lang of languages) {
    if (lang.code === defaultLang) continue;
    const transPath = path.join(translationsDir, lang.code, `${slug}.json`);
    if (fs.existsSync(transPath)) {
      available.push(lang.code);
    }
  }
  availableLanguagesMap[slug] = available;
}

const publicDataDir = path.join(rootDir, 'public', 'data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}
const availJson = JSON.stringify(availableLanguagesMap);
const shardMapJson = JSON.stringify(slugShardMap);
fs.writeFileSync(path.join(outputDir, 'available-languages.json'), availJson, 'utf8');
fs.writeFileSync(path.join(outputDir, 'slug-shard-map.json'), shardMapJson, 'utf8');
fs.writeFileSync(path.join(publicDataDir, 'available-languages.json.gz'), zlib.gzipSync(availJson, { level: 9 }));
fs.writeFileSync(path.join(publicDataDir, 'slug-shard-map.json.gz'), zlib.gzipSync(shardMapJson, { level: 9 }));

// Clean old shards/indexes in public/data/ and src/data/master-articles.* before writing
for (const f of fs.readdirSync(publicDataDir)) {
  if (/^(master-articles|cards-index|translations|cards-translations)\./.test(f)) {
    fs.unlinkSync(path.join(publicDataDir, f));
  }
}
for (const f of fs.readdirSync(outputDir)) {
  if (/^(master-articles|cards-index|translations|cards-translations)\./.test(f)) {
    fs.unlinkSync(path.join(outputDir, f));
  }
}

function stripMockPrefix(val) {
  if (typeof val === 'string') {
    return val.replace(/^\[(?:es|de|fr|ar|ur|en)\]\s*/i, '').trim();
  }
  if (Array.isArray(val)) {
    return val.map(stripMockPrefix);
  }
  if (val && typeof val === 'object') {
    const res = {};
    for (const [k, v] of Object.entries(val)) {
      res[k] = stripMockPrefix(v);
    }
    return res;
  }
  return val;
}

for (const lang of languages) {
  const isDefault = lang.code === defaultLang;

  if (isDefault) {
    const shards = Array.from({ length: SHARD_COUNT }, () => []);
    const cardIndex = [];

    for (let i = 0; i < baseArticles.length; i++) {
      const baseArticle = baseArticles[i];
      const shardIdx = i % SHARD_COUNT;
      const resolved = { ...baseArticle, isFallback: false };

      shards[shardIdx].push(resolved);
      cardIndex.push({
        slug: resolved.slug,
        title: resolved.title,
        excerpt: resolved.excerpt,
        date: resolved.date,
        updated: resolved.updated,
        author: resolved.author,
        tags: resolved.tags,
        category: resolved.category,
        subcategory: resolved.subcategory,
        image: resolved.image,
        imageAlt: resolved.imageAlt,
        featured: resolved.featured,
        isFallback: false,
      });
    }

    let totalLangBytes = 0;
    let totalGzBytes = 0;
    for (let s = 0; s < SHARD_COUNT; s++) {
      const shardJson = JSON.stringify(shards[s]);
      totalLangBytes += Buffer.byteLength(shardJson);
      fs.writeFileSync(path.join(outputDir, `master-articles.${lang.code}.${s}.json`), shardJson, 'utf8');
      const shardGz = zlib.gzipSync(shardJson, { level: 9 });
      totalGzBytes += shardGz.byteLength;
      fs.writeFileSync(path.join(publicDataDir, `master-articles.${lang.code}.${s}.json.gz`), shardGz);
    }

    const cardsJson = JSON.stringify(cardIndex);
    fs.writeFileSync(path.join(outputDir, `cards-index.${lang.code}.json`), cardsJson, 'utf8');
    const cardsGz = zlib.gzipSync(cardsJson, { level: 9 });
    fs.writeFileSync(path.join(publicDataDir, `cards-index.${lang.code}.json.gz`), cardsGz);

    const legacyPublicCards = path.join(rootDir, 'public', `cards-index.${lang.code}.json`);
    if (fs.existsSync(legacyPublicCards)) {
      fs.unlinkSync(legacyPublicCards);
    }
    const sizeKb = (totalLangBytes / 1024).toFixed(1);
    const gzKb = (totalGzBytes / 1024).toFixed(1);
    console.log(`  ✓ [${lang.code}] ${cardIndex.length} articles -> ${SHARD_COUNT} master shards (${sizeKb} KB raw / ${gzKb} KB gz) + cards-index.${lang.code}.json.gz`);
  } else {
    // Delta-only translation overlay (eliminates 5x duplicate English fallback storage)
    const transMap = {};
    const cardsTransMap = {};
    let count = 0;

    for (let i = 0; i < baseArticles.length; i++) {
      const slug = baseArticles[i].slug;
      const transPath = path.join(translationsDir, lang.code, `${slug}.json`);
      if (!fs.existsSync(transPath)) continue;
      try {
        const transArticle = JSON.parse(fs.readFileSync(transPath, 'utf8'));
        const cleaned = stripMockPrefix(transArticle);
        const resolved = { ...cleaned, isFallback: false };
        transMap[slug] = resolved;
        cardsTransMap[slug] = {
          slug: resolved.slug,
          title: resolved.title,
          excerpt: resolved.excerpt,
          date: resolved.date,
          updated: resolved.updated,
          author: resolved.author,
          tags: resolved.tags,
          category: resolved.category,
          subcategory: resolved.subcategory,
          image: resolved.image,
          imageAlt: resolved.imageAlt,
          featured: resolved.featured,
          isFallback: false,
        };
        count++;
      } catch {
        // Ignore corrupt translation
      }
    }

    const transJson = JSON.stringify(transMap);
    const cardsTransJson = JSON.stringify(cardsTransMap);
    fs.writeFileSync(path.join(outputDir, `translations.${lang.code}.json`), transJson, 'utf8');
    fs.writeFileSync(path.join(outputDir, `cards-translations.${lang.code}.json`), cardsTransJson, 'utf8');
    const transGz = zlib.gzipSync(transJson, { level: 9 });
    const cardsTransGz = zlib.gzipSync(cardsTransJson, { level: 9 });
    fs.writeFileSync(path.join(publicDataDir, `translations.${lang.code}.json.gz`), transGz);
    fs.writeFileSync(path.join(publicDataDir, `cards-translations.${lang.code}.json.gz`), cardsTransGz);
    console.log(`  ✓ [${lang.code}] ${count} real translations -> delta (${(transGz.byteLength / 1024).toFixed(1)} KB gz)`);
  }
}

// Automatically sync ultra-lightweight ebooks card index for high-speed catalog browsing
const fullEbooksPath = path.join(outputDir, 'ebooks.json');
const cardsEbooksPath = path.join(outputDir, 'ebooks-cards.json');
if (fs.existsSync(fullEbooksPath)) {
  const rawEbooksStr = fs.readFileSync(fullEbooksPath, 'utf8');
  fs.writeFileSync(path.join(publicDataDir, 'ebooks.json.gz'), zlib.gzipSync(rawEbooksStr, { level: 9 }));
  const rawEbooks = JSON.parse(rawEbooksStr);
  const cards = rawEbooks.map((b) => ({
    slug: b.slug,
    title: b.title,
    author: b.author,
    year: b.year,
    category: b.category,
    subdiscipline: b.subdiscipline || b.category,
    coverUrl: b.coverUrl || '',
    pdfUrl: b.pdfUrl || '',
    curatedContext: (b.curatedContext || '').slice(0, 120),
    pageCount: b.pageCount || 200,
    readingTimeHours: b.readingTimeHours || 4,
  }));
  fs.writeFileSync(cardsEbooksPath, JSON.stringify(cards, null, 2), 'utf8');
  const ebSizeKb = (Buffer.byteLength(JSON.stringify(cards)) / 1024).toFixed(1);
  console.log(`  ✓ E-Books card index synced -> ebooks-cards.json (${ebSizeKb} KB)`);
}

console.log('✅ Master JSON bundling complete.');

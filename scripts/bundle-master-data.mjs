import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content');
const articlesDir = path.join(contentDir, 'articles');
const translationsDir = path.join(contentDir, 'translations');
const outputDir = path.join(rootDir, 'src', 'data');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read site config
const siteConfigPath = path.join(rootDir, 'site.config.json');
const siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, 'utf8'));
const defaultLang = siteConfig.defaultLanguage || 'en';
const languages = siteConfig.languages || [{ code: 'en', name: 'English', dir: 'ltr' }];

// Read all base English articles
const articleFiles = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.json')).sort();
const baseArticles = articleFiles.map((file) => {
  const filePath = path.join(articlesDir, file);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

console.log(`📦 Bundling master article data for ${articleFiles.length} base articles across ${languages.length} locales...`);

const availableLanguagesMap = {};

// Map out available real languages for each slug
for (const article of baseArticles) {
  const slug = article.slug;
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

// Write available languages map
const availLangsPath = path.join(outputDir, 'available-languages.json');
fs.writeFileSync(availLangsPath, JSON.stringify(availableLanguagesMap, null, 2), 'utf8');

// For each language, bundle all articles into a grouped master array
for (const lang of languages) {
  const isDefault = lang.code === defaultLang;
  const bundledArticles = [];

  for (const baseArticle of baseArticles) {
    const slug = baseArticle.slug;
    const transPath = path.join(translationsDir, lang.code, `${slug}.json`);

    if (!isDefault && fs.existsSync(transPath)) {
      try {
        const transArticle = JSON.parse(fs.readFileSync(transPath, 'utf8'));
        bundledArticles.push({
          ...transArticle,
          isFallback: false,
        });
      } catch (err) {
        console.warn(`⚠️ Error reading translation for ${slug} [${lang.code}], falling back to base:`, err.message);
        bundledArticles.push({
          ...baseArticle,
          isFallback: true,
        });
      }
    } else {
      bundledArticles.push({
        ...baseArticle,
        isFallback: !isDefault,
      });
    }
  }

  // Sort descending by publication date
  bundledArticles.sort((a, b) => b.date.localeCompare(a.date));

  // Write minified grouped master JSON file
  const outPath = path.join(outputDir, `master-articles.${lang.code}.json`);
  fs.writeFileSync(outPath, JSON.stringify(bundledArticles), 'utf8');

  // Also write a lightweight card index (omits full body blocks for lightweight network transfers)
  const cardIndex = bundledArticles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    date: a.date,
    updated: a.updated,
    author: a.author,
    tags: a.tags,
    category: a.category,
    subcategory: a.subcategory,
    image: a.image,
    imageAlt: a.imageAlt,
    featured: a.featured,
    isFallback: a.isFallback,
  }));
  const cardIndexPath = path.join(outputDir, `cards-index.${lang.code}.json`);
  fs.writeFileSync(cardIndexPath, JSON.stringify(cardIndex), 'utf8');

  const sizeKb = (Buffer.byteLength(JSON.stringify(bundledArticles)) / 1024).toFixed(1);
  console.log(`  ✓ [${lang.code}] ${bundledArticles.length} articles bundled -> master-articles.${lang.code}.json (${sizeKb} KB)`);
}

console.log('✅ Master JSON bundling complete.\n');


import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

/**
 * Read and parse site.config.json
 */
export function getSiteConfig() {
  const configPath = path.join(rootDir, 'site.config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

/**
 * Get all base article files from content/articles
 */
export function getArticleFiles() {
  const articlesDir = path.join(rootDir, 'content', 'articles');
  if (!fs.existsSync(articlesDir)) {
    return [];
  }
  return fs
    .readdirSync(articlesDir)
    .filter((file) => file.endsWith('.json'))
    .sort();
}

/**
 * Read all base articles from content/articles
 */
export function getAllArticles() {
  const articlesDir = path.join(rootDir, 'content', 'articles');
  const files = getArticleFiles();
  return files.map((file) => {
    const filePath = path.join(articlesDir, file);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  });
}

/**
 * Get unique tags across all base articles
 */
export function getAllTags() {
  const articles = getAllArticles();
  const tagSet = new Set();
  for (const article of articles) {
    if (Array.isArray(article.tags)) {
      for (const tag of article.tags) {
        tagSet.add(tag);
      }
    }
  }
  return Array.from(tagSet).sort();
}

/**
 * Extract all translatable strings from an article in consistent order.
 * Strictly excludes code blocks and media URL sources.
 */
export function extractTranslatableStrings(article) {
  const strings = [];
  if (typeof article.title === 'string') {
    strings.push(article.title);
  }
  if (typeof article.excerpt === 'string') {
    strings.push(article.excerpt);
  }
  if (typeof article.imageAlt === 'string') {
    strings.push(article.imageAlt);
  }
  if (Array.isArray(article.body)) {
    for (const block of article.body) {
      if (!block || typeof block !== 'object') continue;
      if (['p', 'h2', 'h3'].includes(block.type) && typeof block.text === 'string') {
        strings.push(block.text);
      } else if (block.type === 'quote') {
        if (typeof block.text === 'string') strings.push(block.text);
        if (typeof block.cite === 'string') strings.push(block.cite);
      } else if (['ul', 'ol'].includes(block.type) && Array.isArray(block.items)) {
        for (const item of block.items) {
          if (typeof item === 'string') strings.push(item);
        }
      } else if (block.type === 'image') {
        if (typeof block.alt === 'string') strings.push(block.alt);
        if (typeof block.caption === 'string') strings.push(block.caption);
      } else if (block.type === 'video') {
        if (typeof block.title === 'string') strings.push(block.title);
        if (typeof block.caption === 'string') strings.push(block.caption);
      }
      // code blocks and media URLs (src, poster) are intentionally never translated
    }
  }
  return strings;
}

/**
 * Compute SHA-1 hash for the translatable strings of an article
 */
export function computeSourceHash(article) {
  const strings = extractTranslatableStrings(article);
  return crypto.createHash('sha1').update(JSON.stringify(strings)).digest('hex');
}

/**
 * Get all paths to be statically rendered by vite-react-ssg
 */
export function getIncludedRoutes() {
  const siteConfig = getSiteConfig();
  const articles = getAllArticles();
  const tags = getAllTags();
  const routes = [];

  const authorSlugs = [
    'mateo-silva',
    'saskia-lindqvist',
    'julian-mercer',
    'tariq-mahmood',
    'elena-vance',
    'anne-hardy',
  ];

  const categoryIds = [
    'architecture-and-space',
    'art-and-culture',
    'design-and-typography',
    'engineering-and-technology',
  ];

  for (const lang of siteConfig.languages) {
    const isDefault = lang.code === siteConfig.defaultLanguage;
    const prefix = isDefault ? '' : `/${lang.code}`;

    // Home
    routes.push(prefix ? prefix : '/');

    // Articles Index
    routes.push(`${prefix}/articles`);

    // Categories Index
    routes.push(`${prefix}/categories`);

    // Institutional Pages
    routes.push(`${prefix}/about`);
    routes.push(`${prefix}/contact`);
    routes.push(`${prefix}/terms`);
    routes.push(`${prefix}/privacy`);

    // Dedicated Category routes
    for (const catId of categoryIds) {
      routes.push(`${prefix}/categories/${catId}`);
    }

    // Dynamic Author routes
    for (const authorSlug of authorSlugs) {
      routes.push(`${prefix}/authors/${authorSlug}`);
    }

    // Dynamic Article routes
    for (const article of articles) {
      routes.push(`${prefix}/articles/${article.slug}`);
    }

    // Dynamic Tag routes
    for (const tag of tags) {
      routes.push(`${prefix}/tags/${tag}`);
    }
  }

  return routes;
}

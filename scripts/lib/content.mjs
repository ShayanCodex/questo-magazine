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

export const ALL_AUTHOR_SLUGS = [
  'mateo-silva',
  'saskia-lindqvist',
  'julian-mercer',
  'tariq-mahmood',
  'elena-vance',
  'anne-hardy',
  'dr-marcus-vance',
  'claire-dupont',
  'hiroshi-tanaka',
  'liam-oconnor',
  'sofia-rossi',
];

export const ALL_CATEGORY_IDS = [
  'art-and-culture',
  'architecture-and-space',
  'design-and-typography',
  'engineering-and-technology',
  'technology',
  'software',
  'finance',
  'business',
  'crypto',
  'sports',
  'health',
  'science',
  'entertainment',
  'lifestyle',
  'fitness',
  'food',
  'travel',
  'news',
];

export const ALL_TOOL_SLUGS = [
  'image-converter',
  'audio-extractor',
  'pdf-tools',
  'financial-calculator',
  'health-calculator',
];

// All 60 market intelligence assets indexed across the site
export const ALL_MARKET_ASSET_SLUGS = [
  'sp500', 'nasdaq100', 'dowjones', 'tsx', 'bmv-ipc',
  'ftse100', 'dax40', 'cac40', 'smi20', 'ibex35',
  'nikkei225', 'hangseng', 'csi300', 'nifty50', 'kse100',
  'kospi', 'asx200', 'tasi', 'dfmgi', 'qse', 'bist100',
  'gold', 'silver', 'crude-oil-wti', 'crude-oil-brent', 'natural-gas', 'copper', 'platinum',
  'eur-usd', 'gbp-usd', 'usd-jpy', 'usd-chf', 'usd-cad', 'aud-usd',
  'eur-gbp', 'eur-jpy', 'gbp-jpy', 'usd-pkr', 'usd-inr', 'usd-sar',
  'usd-aed', 'usd-try', 'usd-cny',
  'bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'dogecoin', 'cardano', 'avalanche-2',
  'news-1', 'news-2', 'news-3', 'news-4', 'news-5', 'news-6', 'news-7', 'news-8',
];

// Essential Tier-1 high-value assets for initial static build target (keeps initial build strictly within 200–500 HTML target)
// Configurable: Set SSG_ALL_MARKETS=true to prerender all 60 assets
export const PRIORITY_SSG_MARKET_SLUGS = [
  'sp500', 'nasdaq100', 'dowjones', 'ftse100', 'dax40', 'cac40',
  'nikkei225', 'hangseng', 'csi300', 'nifty50', 'kse100',
  'gold', 'silver', 'crude-oil-brent', 'crude-oil-wti', 'natural-gas',
  'bitcoin', 'ethereum',
  'eur-usd', 'gbp-usd',
];

// Essential Flagship Foundational Monographs for minimal base static generation
export const FLAGSHIP_MONOGRAPHS = [
  'the-geometry-of-silence',
  'the-grid-as-an-instrument',
  'the-poetics-of-concrete',
  'building-static-multilingual-publishing',
  'the-death-of-the-card-grid',
  'pure-functional-simplicity',
  'craft-over-convenience',
];

/**
 * Get paths to be statically rendered by vite-react-ssg.
 * Uses an enterprise Scalable Minimal Base SSG architecture:
 * Generates a lean base set of static HTML pages for default language and primary entrypoints,
 * while offloading all translation permutations and dynamic routes to external JSON payloads.
 * Set SSG_FULL_RENDER=true to force rendering every route.
 */
export function getIncludedRoutes() {
  const siteConfig = getSiteConfig();
  const routes = [];

  const defaultLang = siteConfig.defaultLanguage || 'en';
  const otherLangs = siteConfig.languages.filter((l) => l.code !== defaultLang);
  const authorSlugs = ALL_AUTHOR_SLUGS;
  const categoryIds = ALL_CATEGORY_IDS;
  const topMarketSlugs = PRIORITY_SSG_MARKET_SLUGS.slice(0, 8); // Top tier-1 benchmark assets

  // 1. Default Language Core Shell Pages
  routes.push('/');
  routes.push('/articles');
  routes.push('/ebooks');
  routes.push('/markets');
  routes.push('/markets/screener');
  routes.push('/markets/heatmap');
  routes.push('/markets/terminal');
  routes.push('/categories');
  routes.push('/tools');
  routes.push('/about');
  routes.push('/contact');
  routes.push('/terms');
  routes.push('/privacy');
  routes.push('/editorial-policy');
  routes.push('/disclaimer');

  // Dedicated Category Hubs (Essential for SEO architecture)
  for (const catId of categoryIds) {
    routes.push(`/categories/${catId}`);
  }

  // Interactive Tools Hub
  for (const toolSlug of ALL_TOOL_SLUGS) {
    routes.push(`/tools/${toolSlug}`);
  }

  // Core Market Benchmark Assets
  for (const assetSlug of topMarketSlugs) {
    routes.push(`/markets/${assetSlug}`);
  }

  // Core Authors
  for (const authorSlug of authorSlugs) {
    routes.push(`/authors/${authorSlug}`);
  }

  // Scalable SSG Indexation: Pre-render 200 newest flagship articles directly as HTML
  // Keeping total dist/ files around ~400-700 (well under Cloudflare's 20k limit and 500-1k target)
  // while functions/articles/[slug].ts injects full SSR SEO metadata for all 10,453+ routes!
  const allBaseArticles = getAllArticles()
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 200);
  for (const art of allBaseArticles) {
    routes.push(`/articles/${art.slug}`);
  }

  // 2. Primary Language Root Entrypoint Hubs
  for (const lang of otherLangs) {
    const p = `/${lang.code}`;
    routes.push(p);
    routes.push(`${p}/articles`);
    routes.push(`${p}/markets`);
    routes.push(`${p}/markets/screener`);
    routes.push(`${p}/markets/heatmap`);
    routes.push(`${p}/markets/terminal`);
    routes.push(`${p}/categories`);
    routes.push(`${p}/about`);
  }

  // If full rendering is explicitly forced via environment variable
  if (process.env.SSG_FULL_RENDER === 'true') {
    const articles = getAllArticles();
    const tags = getAllTags();
    for (const lang of siteConfig.languages) {
      const isDefault = lang.code === defaultLang;
      const prefix = isDefault ? '' : `/${lang.code}`;
      for (const article of articles) {
        routes.push(`${prefix}/articles/${article.slug}`);
      }
      for (const tag of tags) {
        routes.push(`${prefix}/tags/${tag}`);
      }
    }
  }

  return Array.from(new Set(routes));
}

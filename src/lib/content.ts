import type { ArticleData } from './types';
import { defaultLanguage } from './site';
import availableLangsData from '../data/available-languages.json';

const AVAILABLE_LANGS: Record<string, string[]> = availableLangsData as Record<string, string[]>;

// Dynamic chunk cache to prevent multi-megabyte bundle bloat on initial page load
const BUNDLE_CACHE: Record<string, ArticleData[]> = {};

async function fetchBundle(langCode: string): Promise<ArticleData[]> {
  if (BUNDLE_CACHE[langCode]) {
    return BUNDLE_CACHE[langCode];
  }

  let bundle: ArticleData[];
  switch (langCode) {
    case 'es':
      bundle = ((await import('../data/master-articles.es.json')).default as unknown) as ArticleData[];
      break;
    case 'fr':
      bundle = ((await import('../data/master-articles.fr.json')).default as unknown) as ArticleData[];
      break;
    case 'de':
      bundle = ((await import('../data/master-articles.de.json')).default as unknown) as ArticleData[];
      break;
    case 'ar':
      bundle = ((await import('../data/master-articles.ar.json')).default as unknown) as ArticleData[];
      break;
    case 'ur':
      bundle = ((await import('../data/master-articles.ur.json')).default as unknown) as ArticleData[];
      break;
    case 'en':
    default:
      bundle = ((await import('../data/master-articles.en.json')).default as unknown) as ArticleData[];
      break;
  }

  BUNDLE_CACHE[langCode] = bundle;
  return bundle;
}

export function slugifyHeading(text?: string, index = 0): string {
  if (!text || typeof text !== 'string') return `heading-${index}`;
  const cleaned = text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/gu, '-');
  return cleaned.length > 0 ? cleaned : `heading-${index}`;
}

/**
 * Format a YYYY-MM-DD date string with fixed UTC timezone to prevent hydration mismatches.
 */
export function formatDate(dateString: string, langCode: string): string {
  try {
    const parts = dateString.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      return dateString;
    }
    const [year, month, day] = parts;
    const date = new Date(Date.UTC(year, month - 1, day));
    return new Intl.DateTimeFormat(langCode, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Calculate reading time from article text
 */
export function calculateReadingTime(
  article: ArticleData,
  minReadLabel = 'min read'
): string {
  let wordCount = 0;
  if (article.title) wordCount += article.title.trim().split(/\s+/).length;
  if (article.excerpt) wordCount += article.excerpt.trim().split(/\s+/).length;
  if (Array.isArray(article.body)) {
    for (const block of article.body) {
      if (['p', 'h2', 'h3'].includes(block.type) && block.text) {
        wordCount += block.text.trim().split(/\s+/).length;
      } else if (block.type === 'quote' && block.text) {
        wordCount += block.text.trim().split(/\s+/).length;
      } else if (['ul', 'ol'].includes(block.type) && Array.isArray(block.items)) {
        for (const item of block.items) {
          wordCount += item.trim().split(/\s+/).length;
        }
      }
    }
  }
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} ${minReadLabel}`;
}

/**
 * Extract all unique slugs across content/articles synchronously from metadata index
 */
export function getAllArticleSlugs(): string[] {
  return Object.keys(AVAILABLE_LANGS).sort();
}

/**
 * Load a single article for a specific language from dynamically chunked master JSON.
 * Falls back to default English article if translation is missing.
 */
export async function loadArticle(
  slug: string,
  langCode: string
): Promise<ArticleData | null> {
  const bundle = await fetchBundle(langCode);
  const article = bundle.find((a) => a.slug === slug);
  if (article) {
    return article;
  }

  // Fallback to default language
  if (langCode !== defaultLanguage) {
    const defaultBundle = await fetchBundle(defaultLanguage);
    const fallback = defaultBundle.find((a) => a.slug === slug);
    if (fallback) {
      return { ...fallback, isFallback: true };
    }
  }

  return null;
}

/**
 * Load all articles for a specific language from chunked bundle, sorted by date descending.
 */
export async function loadAllArticles(langCode: string): Promise<ArticleData[]> {
  const bundle = await fetchBundle(langCode);
  return [...bundle].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Load all unique tags across all base articles.
 */
export async function loadAllTags(): Promise<string[]> {
  const articles = await loadAllArticles(defaultLanguage);
  const tagSet = new Set<string>();
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
 * Check which languages have a real (non-fallback) version of an article.
 */
export function getAvailableRealLanguages(slug: string): string[] {
  return AVAILABLE_LANGS[slug] || [defaultLanguage];
}

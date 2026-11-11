import type { ArticleData } from './types';
import { defaultLanguage } from './site';

// Grouped compressed master JSON bundles generated during build
import masterEn from '../data/master-articles.en.json';
import masterEs from '../data/master-articles.es.json';
import masterFr from '../data/master-articles.fr.json';
import masterDe from '../data/master-articles.de.json';
import masterAr from '../data/master-articles.ar.json';
import masterUr from '../data/master-articles.ur.json';
import availableLangsData from '../data/available-languages.json';

const MASTER_BUNDLES: Record<string, ArticleData[]> = {
  en: masterEn as unknown as ArticleData[],
  es: masterEs as unknown as ArticleData[],
  fr: masterFr as unknown as ArticleData[],
  de: masterDe as unknown as ArticleData[],
  ar: masterAr as unknown as ArticleData[],
  ur: masterUr as unknown as ArticleData[],
};

const AVAILABLE_LANGS: Record<string, string[]> = availableLangsData as Record<string, string[]>;

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
 * Extract all unique slugs across content/articles
 */
export function getAllArticleSlugs(): string[] {
  const baseArticles = MASTER_BUNDLES[defaultLanguage] || (masterEn as unknown as ArticleData[]);
  return baseArticles.map((a) => a.slug).sort();
}

/**
 * Load a single article for a specific language from grouped master JSON array.
 * Falls back to default English article if translation is missing.
 */
export async function loadArticle(
  slug: string,
  langCode: string
): Promise<ArticleData | null> {
  const bundle = MASTER_BUNDLES[langCode] || MASTER_BUNDLES[defaultLanguage] || (masterEn as unknown as ArticleData[]);
  const article = bundle.find((a) => a.slug === slug);
  if (article) {
    return article;
  }

  // Fallback to default language
  const defaultBundle = MASTER_BUNDLES[defaultLanguage] || (masterEn as unknown as ArticleData[]);
  const fallback = defaultBundle.find((a) => a.slug === slug);
  if (fallback) {
    return { ...fallback, isFallback: true };
  }

  return null;
}

/**
 * Load all articles for a specific language from grouped master JSON array, sorted by date descending.
 */
export async function loadAllArticles(langCode: string): Promise<ArticleData[]> {
  const bundle = MASTER_BUNDLES[langCode] || MASTER_BUNDLES[defaultLanguage] || (masterEn as unknown as ArticleData[]);
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


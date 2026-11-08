import type { ArticleData } from './types';
import { defaultLanguage } from './site';

// Lazy glob loaders for articles and translations
const articleModules = import.meta.glob<ArticleData>('/content/articles/*.json');
const translationModules = import.meta.glob<ArticleData>(
  '/content/translations/*/*.json'
);

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
  return Object.keys(articleModules)
    .map((path) => {
      const match = path.match(/\/([^/]+)\.json$/);
      return match ? match[1] : '';
    })
    .filter(Boolean)
    .sort();
}

/**
 * Load a single article for a specific language.
 * Falls back to default English article if translation is missing.
 */
export async function loadArticle(
  slug: string,
  langCode: string
): Promise<ArticleData | null> {
  const isDefaultLang = langCode === defaultLanguage;
  const baseKey = `/content/articles/${slug}.json`;
  const transKey = `/content/translations/${langCode}/${slug}.json`;

  if (!isDefaultLang && translationModules[transKey]) {
    const mod = await translationModules[transKey]();
    return { ...mod, isFallback: false };
  }

  if (articleModules[baseKey]) {
    const mod = await articleModules[baseKey]();
    return { ...mod, isFallback: !isDefaultLang };
  }

  return null;
}

/**
 * Load all articles for a specific language, sorted by date descending.
 */
export async function loadAllArticles(langCode: string): Promise<ArticleData[]> {
  const slugs = getAllArticleSlugs();
  const articles: ArticleData[] = [];

  for (const slug of slugs) {
    const article = await loadArticle(slug, langCode);
    if (article) {
      articles.push(article);
    }
  }

  return articles.sort((a, b) => b.date.localeCompare(a.date));
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
  const langs = [defaultLanguage];
  for (const path of Object.keys(translationModules)) {
    const match = path.match(/\/content\/translations\/([^/]+)\/([^/]+)\.json$/);
    if (match && match[2] === slug) {
      langs.push(match[1]);
    }
  }
  return Array.from(new Set(langs));
}


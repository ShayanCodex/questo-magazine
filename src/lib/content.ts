import type { ArticleData } from './types';
import { defaultLanguage } from './site';
import availableLangsData from '../data/available-languages.json';
import slugShardMapData from '../data/slug-shard-map.json';

const AVAILABLE_LANGS: Record<string, string[]> = availableLangsData as Record<string, string[]>;
const SLUG_SHARD_MAP: Record<string, number> = slugShardMapData as Record<string, number>;
const SHARD_COUNT = 5;

// Dynamic chunk caches to prevent multi-megabyte bundle bloat on initial page load
const SHARD_CACHE: Record<string, ArticleData[]> = {};
const CARDS_CACHE: Record<string, ArticleData[]> = {};

async function fetchShard(langCode: string, shardIdx: number): Promise<ArticleData[]> {
  const cacheKey = `${langCode}:${shardIdx}`;
  if (SHARD_CACHE[cacheKey]) {
    return SHARD_CACHE[cacheKey];
  }

  let shard: ArticleData[];
  const key = `${langCode}.${shardIdx}`;
  switch (key) {
    case 'es.0': shard = ((await import('../data/master-articles.es.0.json')).default as unknown) as ArticleData[]; break;
    case 'es.1': shard = ((await import('../data/master-articles.es.1.json')).default as unknown) as ArticleData[]; break;
    case 'es.2': shard = ((await import('../data/master-articles.es.2.json')).default as unknown) as ArticleData[]; break;
    case 'es.3': shard = ((await import('../data/master-articles.es.3.json')).default as unknown) as ArticleData[]; break;
    case 'es.4': shard = ((await import('../data/master-articles.es.4.json')).default as unknown) as ArticleData[]; break;
    case 'fr.0': shard = ((await import('../data/master-articles.fr.0.json')).default as unknown) as ArticleData[]; break;
    case 'fr.1': shard = ((await import('../data/master-articles.fr.1.json')).default as unknown) as ArticleData[]; break;
    case 'fr.2': shard = ((await import('../data/master-articles.fr.2.json')).default as unknown) as ArticleData[]; break;
    case 'fr.3': shard = ((await import('../data/master-articles.fr.3.json')).default as unknown) as ArticleData[]; break;
    case 'fr.4': shard = ((await import('../data/master-articles.fr.4.json')).default as unknown) as ArticleData[]; break;
    case 'de.0': shard = ((await import('../data/master-articles.de.0.json')).default as unknown) as ArticleData[]; break;
    case 'de.1': shard = ((await import('../data/master-articles.de.1.json')).default as unknown) as ArticleData[]; break;
    case 'de.2': shard = ((await import('../data/master-articles.de.2.json')).default as unknown) as ArticleData[]; break;
    case 'de.3': shard = ((await import('../data/master-articles.de.3.json')).default as unknown) as ArticleData[]; break;
    case 'de.4': shard = ((await import('../data/master-articles.de.4.json')).default as unknown) as ArticleData[]; break;
    case 'ar.0': shard = ((await import('../data/master-articles.ar.0.json')).default as unknown) as ArticleData[]; break;
    case 'ar.1': shard = ((await import('../data/master-articles.ar.1.json')).default as unknown) as ArticleData[]; break;
    case 'ar.2': shard = ((await import('../data/master-articles.ar.2.json')).default as unknown) as ArticleData[]; break;
    case 'ar.3': shard = ((await import('../data/master-articles.ar.3.json')).default as unknown) as ArticleData[]; break;
    case 'ar.4': shard = ((await import('../data/master-articles.ar.4.json')).default as unknown) as ArticleData[]; break;
    case 'ur.0': shard = ((await import('../data/master-articles.ur.0.json')).default as unknown) as ArticleData[]; break;
    case 'ur.1': shard = ((await import('../data/master-articles.ur.1.json')).default as unknown) as ArticleData[]; break;
    case 'ur.2': shard = ((await import('../data/master-articles.ur.2.json')).default as unknown) as ArticleData[]; break;
    case 'ur.3': shard = ((await import('../data/master-articles.ur.3.json')).default as unknown) as ArticleData[]; break;
    case 'ur.4': shard = ((await import('../data/master-articles.ur.4.json')).default as unknown) as ArticleData[]; break;
    case 'en.0': shard = ((await import('../data/master-articles.en.0.json')).default as unknown) as ArticleData[]; break;
    case 'en.1': shard = ((await import('../data/master-articles.en.1.json')).default as unknown) as ArticleData[]; break;
    case 'en.2': shard = ((await import('../data/master-articles.en.2.json')).default as unknown) as ArticleData[]; break;
    case 'en.3': shard = ((await import('../data/master-articles.en.3.json')).default as unknown) as ArticleData[]; break;
    case 'en.4':
    default:
      shard = ((await import('../data/master-articles.en.4.json')).default as unknown) as ArticleData[];
      break;
  }

  SHARD_CACHE[cacheKey] = shard;
  return shard;
}

/**
 * Load lightweight article card metadata (no body blocks) for listings, search, and related cards.
 */
export async function loadArticleCards(langCode: string): Promise<ArticleData[]> {
  if (CARDS_CACHE[langCode]) {
    return CARDS_CACHE[langCode];
  }

  let cards: ArticleData[];
  switch (langCode) {
    case 'es': cards = ((await import('../data/cards-index.es.json')).default as unknown) as ArticleData[]; break;
    case 'fr': cards = ((await import('../data/cards-index.fr.json')).default as unknown) as ArticleData[]; break;
    case 'de': cards = ((await import('../data/cards-index.de.json')).default as unknown) as ArticleData[]; break;
    case 'ar': cards = ((await import('../data/cards-index.ar.json')).default as unknown) as ArticleData[]; break;
    case 'ur': cards = ((await import('../data/cards-index.ur.json')).default as unknown) as ArticleData[]; break;
    case 'en':
    default:
      cards = ((await import('../data/cards-index.en.json')).default as unknown) as ArticleData[];
      break;
  }

  CARDS_CACHE[langCode] = cards;
  return cards;
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

export function getAllArticleSlugs(): string[] {
  return Object.keys(AVAILABLE_LANGS).sort();
}

export async function loadArticle(
  slug: string,
  langCode: string
): Promise<ArticleData | null> {
  const shardIdx = SLUG_SHARD_MAP[slug];
  if (shardIdx !== undefined) {
    const shard = await fetchShard(langCode, shardIdx);
    const article = shard.find((a) => a.slug === slug);
    if (article) return article;

    if (langCode !== defaultLanguage) {
      const defShard = await fetchShard(defaultLanguage, shardIdx);
      const fallback = defShard.find((a) => a.slug === slug);
      if (fallback) return { ...fallback, isFallback: true };
    }
    return null;
  }

  // Fallback scan if slug wasn't in map
  for (let s = 0; s < SHARD_COUNT; s++) {
    const shard = await fetchShard(langCode, s);
    const found = shard.find((a) => a.slug === slug);
    if (found) return found;
  }
  return null;
}

export async function loadAllArticles(langCode: string): Promise<ArticleData[]> {
  const shards = await Promise.all(
    Array.from({ length: SHARD_COUNT }, (_, s) => fetchShard(langCode, s))
  );
  return shards.flat().sort((a, b) => b.date.localeCompare(a.date));
}

export async function loadAllTags(): Promise<string[]> {
  const cards = await loadArticleCards(defaultLanguage);
  const tagSet = new Set<string>();
  for (const article of cards) {
    if (Array.isArray(article.tags)) {
      for (const tag of article.tags) {
        tagSet.add(tag);
      }
    }
  }
  return Array.from(tagSet).sort();
}

export function getAvailableRealLanguages(slug: string): string[] {
  return AVAILABLE_LANGS[slug] || [defaultLanguage];
}

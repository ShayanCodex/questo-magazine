import type { ArticleData } from './types';
import { defaultLanguage } from './site';

const SHARD_COUNT = 40;

// Dynamic chunk caches to prevent multi-megabyte bundle bloat on initial page load
const SHARD_CACHE: Record<string, ArticleData[]> = {};
const CARDS_CACHE: Record<string, ArticleData[]> = {};
const TRANS_CACHE: Record<string, Record<string, ArticleData>> = {};
const CARDS_TRANS_CACHE: Record<string, Record<string, ArticleData>> = {};
let SLUG_SHARD_MAP_CACHE: Record<string, number> | null = null;
let AVAILABLE_LANGS_CACHE: Record<string, string[]> | null = null;

async function getSlugShardMap(): Promise<Record<string, number>> {
  if (!SLUG_SHARD_MAP_CACHE) {
    SLUG_SHARD_MAP_CACHE = await loadJsonAsset<Record<string, number>>('slug-shard-map.json');
  }
  return SLUG_SHARD_MAP_CACHE;
}

export async function loadJsonAsset<T>(filename: string): Promise<T> {
  if (import.meta.env.SSR) {
    const fs = await import(/* @vite-ignore */ 'node:fs');
    const path = await import(/* @vite-ignore */ 'node:path');
    const filePath = path.join(process.cwd(), 'src', 'data', filename);
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as T;
  }

  const res = await fetch(`/data/${filename}.gz`);
  if (!res.ok) {
    throw new Error(`Failed to fetch /data/${filename}.gz (${res.status})`);
  }

  const bytes = new Uint8Array(await res.arrayBuffer());
  const isGzip = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
  if (isGzip && typeof DecompressionStream !== 'undefined') {
    const decompressed = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return (await new Response(decompressed).json()) as T;
  }

  return JSON.parse(new TextDecoder().decode(bytes)) as T;
}

async function fetchShard(langCode: string, shardIdx: number): Promise<ArticleData[]> {
  const cacheKey = `${langCode}:${shardIdx}`;
  if (SHARD_CACHE[cacheKey]) {
    return SHARD_CACHE[cacheKey];
  }

  const baseShard = await loadJsonAsset<ArticleData[]>(`master-articles.${defaultLanguage}.${shardIdx}.json`);
  if (langCode === defaultLanguage) {
    SHARD_CACHE[cacheKey] = baseShard;
    return baseShard;
  }

  if (!TRANS_CACHE[langCode]) {
    try {
      TRANS_CACHE[langCode] = await loadJsonAsset<Record<string, ArticleData>>(`translations.${langCode}.json`);
    } catch {
      TRANS_CACHE[langCode] = {};
    }
  }
  const transMap = TRANS_CACHE[langCode];
  const merged = baseShard.map((art) =>
    transMap[art.slug] ? { ...transMap[art.slug], isFallback: false } : { ...art, isFallback: true }
  );
  SHARD_CACHE[cacheKey] = merged;
  return merged;
}

/**
 * Load lightweight article card metadata (no body blocks) for listings, search, and related cards.
 */
export async function loadArticleCards(langCode: string): Promise<ArticleData[]> {
  if (CARDS_CACHE[langCode]) {
    return CARDS_CACHE[langCode];
  }

  const baseCards = await loadJsonAsset<ArticleData[]>(`cards-index.${defaultLanguage}.json`);
  if (langCode === defaultLanguage) {
    CARDS_CACHE[langCode] = baseCards;
    return baseCards;
  }

  if (!CARDS_TRANS_CACHE[langCode]) {
    try {
      CARDS_TRANS_CACHE[langCode] = await loadJsonAsset<Record<string, ArticleData>>(`cards-translations.${langCode}.json`);
    } catch {
      CARDS_TRANS_CACHE[langCode] = {};
    }
  }
  const transMap = CARDS_TRANS_CACHE[langCode];
  const merged = baseCards.map((card) =>
    transMap[card.slug] ? { ...transMap[card.slug], isFallback: false } : { ...card, isFallback: true }
  );
  CARDS_CACHE[langCode] = merged;
  return merged;
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

export async function getAllArticleSlugs(): Promise<string[]> {
  if (!AVAILABLE_LANGS_CACHE) {
    AVAILABLE_LANGS_CACHE = await loadJsonAsset<Record<string, string[]>>('available-languages.json');
  }
  return Object.keys(AVAILABLE_LANGS_CACHE).sort();
}

export async function loadArticle(
  slug: string,
  langCode: string
): Promise<ArticleData | null> {
  const shardMap = await getSlugShardMap();
  const shardIdx = shardMap[slug];
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
  return AVAILABLE_LANGS_CACHE?.[slug] || [defaultLanguage];
}

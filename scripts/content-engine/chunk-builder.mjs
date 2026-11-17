import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateSitemapShards } from '../generate-sitemap-shards.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

const atomicArticlesDir = path.join(rootDir, 'public', 'data', 'articles');
const chunksDir = path.join(rootDir, 'public', 'data', 'chunks');
const contentArticlesDir = path.join(rootDir, 'content', 'articles');

const ALLOWED_BLOCK_TYPES = new Set(['p', 'h2', 'h3', 'ul', 'ol', 'quote', 'code', 'image', 'video']);

function sanitizeBodyBlocks(body) {
  if (!Array.isArray(body)) return [];
  return body.map(block => {
    if (!block || typeof block !== 'object') return { type: 'p', text: String(block || '') };
    let type = block.type;
    if (type === 'h1') type = 'h2';
    if (!ALLOWED_BLOCK_TYPES.has(type)) {
      if (Array.isArray(block.rows)) {
        return {
          type: 'ul',
          items: block.rows.flat().map(c => String(c))
        };
      }
      return { type: 'p', text: block.text || JSON.stringify(block) };
    }
    return { ...block, type };
  });
}

/**
 * Save article into atomic storage & update category chunks
 */
export function persistArticlePayload(payload) {
  if (!fs.existsSync(atomicArticlesDir)) fs.mkdirSync(atomicArticlesDir, { recursive: true });
  if (!fs.existsSync(chunksDir)) fs.mkdirSync(chunksDir, { recursive: true });
  if (!fs.existsSync(contentArticlesDir)) fs.mkdirSync(contentArticlesDir, { recursive: true });

  const slug = payload.slug;
  const sanitizedBody = sanitizeBodyBlocks(payload.body);

  // 1. Save atomic JSON payload
  const atomicPath = path.join(atomicArticlesDir, `${slug}.json`);
  fs.writeFileSync(atomicPath, JSON.stringify({ ...payload, body: sanitizedBody }, null, 2), 'utf8');

  // 2. Save compatibility format in content/articles/
  const contentPath = path.join(contentArticlesDir, `${slug}.json`);
  const contentFormat = {
    slug: payload.slug,
    title: payload.title,
    excerpt: payload.metaDescription,
    date: payload.date,
    updated: payload.updated,
    author: payload.author?.name || "Editorial Staff",
    image: payload.featuredImage?.url,
    imageAlt: payload.featuredImage?.alt,
    tags: payload.tags,
    category: payload.categorySlug,
    subcategory: payload.categorySlug,
    body: sanitizedBody,
    faqs: payload.faq,
    contentHtml: payload.contentHtml
  };
  fs.writeFileSync(contentPath, JSON.stringify(contentFormat, null, 2), 'utf8');

  // 3. Update Category Index Chunks
  updateCategoryChunks(payload);

  console.log(`[Chunk Builder] Persisted: ${slug} in atomic JSON & content registry.`);
}

/**
 * Update paginated category chunks for fast client hydration
 */
function updateCategoryChunks(newPayload) {
  const catSlug = newPayload.categorySlug;
  const chunkFile = path.join(chunksDir, `${catSlug}-page-1.json`);

  let items = [];
  if (fs.existsSync(chunkFile)) {
    try {
      items = JSON.parse(fs.readFileSync(chunkFile, 'utf8'));
    } catch {
      items = [];
    }
  }

  // Prepend new article card
  const card = {
    id: newPayload.id,
    slug: newPayload.slug,
    title: newPayload.title,
    metaDescription: newPayload.metaDescription,
    category: newPayload.category,
    categorySlug: newPayload.categorySlug,
    publishedAt: newPayload.publishedAt,
    readingTimeMinutes: newPayload.readingTimeMinutes,
    author: newPayload.author,
    featuredImage: newPayload.featuredImage,
    featuredVideo: newPayload.featuredVideo
  };

  items = [card, ...items.filter(i => i.slug !== card.slug)].slice(0, 50);
  fs.writeFileSync(chunkFile, JSON.stringify(items, null, 2), 'utf8');
}

/**
 * Rebuild complete manifest, sitemaps, and master indexes
 */
export function rebuildAllIndexes() {
  console.log('[Chunk Builder] Rebuilding sitemap shards and master indexes...');
  try {
    generateSitemapShards();
  } catch (e) {
    console.warn('Sitemap rebuild notice:', e.message);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  rebuildAllIndexes();
}

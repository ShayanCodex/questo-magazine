import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeSourceHash } from './lib/content.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const articlesDir = path.join(rootDir, 'content', 'articles');
const translationsDir = path.join(rootDir, 'content', 'translations');

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_BLOCK_TYPES = new Set(['p', 'h2', 'h3', 'ul', 'ol', 'quote', 'code']);

let hasError = false;

function reportError(filePath, field, message) {
  hasError = true;
  console.error(`[ERROR] File: ${path.relative(rootDir, filePath)}`);
  console.error(`        Field: ${field}`);
  console.error(`        Message: ${message}\n`);
}

function reportWarning(filePath, field, message) {
  console.warn(`[WARN]  File: ${path.relative(rootDir, filePath)}`);
  console.warn(`        Field: ${field}`);
  console.warn(`        Message: ${message}\n`);
}

function validateBlock(block, index, filePath) {
  if (!block || typeof block !== 'object') {
    reportError(filePath, `body[${index}]`, 'Block must be a valid JSON object');
    return;
  }
  if (!ALLOWED_BLOCK_TYPES.has(block.type)) {
    reportError(filePath, `body[${index}].type`, `Unknown block type "${block.type}". Allowed: ${Array.from(ALLOWED_BLOCK_TYPES).join(', ')}`);
    return;
  }

  switch (block.type) {
    case 'p':
    case 'h2':
    case 'h3':
      if (typeof block.text !== 'string' || block.text.trim() === '') {
        reportError(filePath, `body[${index}].text`, `Block "${block.type}" must have a non-empty string "text"`);
      }
      break;
    case 'ul':
    case 'ol':
      if (!Array.isArray(block.items) || block.items.length === 0 || !block.items.every(item => typeof item === 'string')) {
        reportError(filePath, `body[${index}].items`, `Block "${block.type}" must have a non-empty array of strings in "items"`);
      }
      break;
    case 'quote':
      if (typeof block.text !== 'string' || block.text.trim() === '') {
        reportError(filePath, `body[${index}].text`, 'Block "quote" must have a non-empty string "text"');
      }
      if (block.cite !== undefined && typeof block.cite !== 'string') {
        reportError(filePath, `body[${index}].cite`, 'Block "quote" cite must be a string if provided');
      }
      break;
    case 'code':
      if (typeof block.code !== 'string') {
        reportError(filePath, `body[${index}].code`, 'Block "code" must have a string "code"');
      }
      if (block.lang !== undefined && typeof block.lang !== 'string') {
        reportError(filePath, `body[${index}].lang`, 'Block "code" lang must be a string if provided');
      }
      break;
  }
}

function validateArticleObject(article, filePath, expectedSlug) {
  // Required fields check
  const requiredFields = ['slug', 'title', 'excerpt', 'date', 'author', 'tags', 'body'];
  for (const field of requiredFields) {
    if (article[field] === undefined) {
      reportError(filePath, field, `Missing required field "${field}"`);
    }
  }

  // Slug check
  if (typeof article.slug !== 'string' || !SLUG_REGEX.test(article.slug)) {
    reportError(filePath, 'slug', `Invalid slug format "${article.slug}". Must match ^[a-z0-9]+(?:-[a-z0-9]+)*$`);
  } else if (expectedSlug && article.slug !== expectedSlug) {
    reportError(filePath, 'slug', `File name "${expectedSlug}.json" does not match slug "${article.slug}"`);
  }

  // Title
  if (typeof article.title !== 'string' || article.title.trim() === '') {
    reportError(filePath, 'title', 'Title must be a non-empty string');
  }

  // Excerpt
  if (typeof article.excerpt !== 'string' || article.excerpt.trim() === '') {
    reportError(filePath, 'excerpt', 'Excerpt must be a non-empty string');
  }

  // Date
  if (typeof article.date !== 'string' || !DATE_REGEX.test(article.date)) {
    reportError(filePath, 'date', `Date "${article.date}" must be in YYYY-MM-DD format`);
  }

  // Updated (optional)
  if (article.updated !== undefined) {
    if (typeof article.updated !== 'string' || !DATE_REGEX.test(article.updated)) {
      reportError(filePath, 'updated', `Updated date "${article.updated}" must be in YYYY-MM-DD format`);
    }
  }

  // Author
  if (typeof article.author !== 'string' || article.author.trim() === '') {
    reportError(filePath, 'author', 'Author must be a non-empty string');
  }

  // Tags
  if (!Array.isArray(article.tags) || article.tags.length === 0) {
    reportError(filePath, 'tags', 'Tags must be a non-empty array of strings');
  } else {
    for (let i = 0; i < article.tags.length; i++) {
      const tag = article.tags[i];
      if (typeof tag !== 'string' || !SLUG_REGEX.test(tag)) {
        reportError(filePath, `tags[${i}]`, `Tag "${tag}" must match lowercase-with-dashes pattern ^[a-z0-9]+(?:-[a-z0-9]+)*$`);
      }
    }
  }

  // Body
  if (!Array.isArray(article.body) || article.body.length === 0) {
    reportError(filePath, 'body', 'Body must be a non-empty array of content blocks');
  } else {
    article.body.forEach((block, idx) => validateBlock(block, idx, filePath));
  }
}

// 1. Validate Base Articles
if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir, { recursive: true });
}

const articleFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'));
const sourceArticlesBySlug = new Map();
const seenSlugs = new Set();

for (const file of articleFiles) {
  const filePath = path.join(articlesDir, file);
  const expectedSlug = path.basename(file, '.json');

  let content;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    content = JSON.parse(raw);
  } catch (err) {
    reportError(filePath, 'JSON', `Malformed JSON: ${err.message}`);
    continue;
  }

  if (seenSlugs.has(content.slug)) {
    reportError(filePath, 'slug', `Duplicate slug detected: "${content.slug}"`);
  } else if (content.slug) {
    seenSlugs.add(content.slug);
  }

  validateArticleObject(content, filePath, expectedSlug);
  sourceArticlesBySlug.set(expectedSlug, content);
}

// 2. Validate Translations
if (fs.existsSync(translationsDir)) {
  const langDirs = fs.readdirSync(translationsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const lang of langDirs) {
    const langPath = path.join(translationsDir, lang);
    const transFiles = fs.readdirSync(langPath).filter(f => f.endsWith('.json'));

    for (const file of transFiles) {
      const filePath = path.join(langPath, file);
      const slug = path.basename(file, '.json');
      const sourceArticle = sourceArticlesBySlug.get(slug);

      if (!sourceArticle) {
        reportError(filePath, 'slug', `Translation file "${file}" has no corresponding source article in content/articles/`);
        continue;
      }

      let transContent;
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        transContent = JSON.parse(raw);
      } catch (err) {
        reportError(filePath, 'JSON', `Malformed translation JSON: ${err.message}`);
        continue;
      }

      validateArticleObject(transContent, filePath, slug);

      // Verify block count matches source exactly
      if (Array.isArray(transContent.body) && Array.isArray(sourceArticle.body)) {
        if (transContent.body.length !== sourceArticle.body.length) {
          reportError(filePath, 'body', `Translation body has ${transContent.body.length} blocks, but source article has ${sourceArticle.body.length} blocks`);
        } else {
          for (let i = 0; i < sourceArticle.body.length; i++) {
            if (transContent.body[i].type !== sourceArticle.body[i].type) {
              reportError(filePath, `body[${i}].type`, `Block ${i} type "${transContent.body[i].type}" does not match source block type "${sourceArticle.body[i].type}"`);
            }
          }
        }
      }

      // Check sourceHash for freshness (warning only)
      const expectedHash = computeSourceHash(sourceArticle);
      if (!transContent.sourceHash || transContent.sourceHash !== expectedHash) {
        reportWarning(filePath, 'sourceHash', `Stale translation detected. Source hash is ${expectedHash}, translation has ${transContent.sourceHash || 'none'}. Run 'npm run translate' to refresh.`);
      }
    }
  }
}

if (hasError) {
  console.error('\n❌ Content validation failed with errors. Aborting build.\n');
  process.exit(1);
} else {
  console.log(`\n✅ Content validation passed: ${articleFiles.length} source article(s) validated successfully.\n`);
}


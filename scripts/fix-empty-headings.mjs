import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');
const transDir = path.join(rootDir, 'content', 'translations');

const CONTENT_TYPES = new Set(['p', 'ul', 'ol', 'quote', 'chart', 'image']);

function pruneEmptyHeadings(body) {
  if (!Array.isArray(body) || body.length === 0) return body;

  // Pass 1: remove h3 blocks with no content block before the next h3/h2/end
  const pass1 = [];
  for (let i = 0; i < body.length; i++) {
    const b = body[i];
    if (b.type === 'h3') {
      let hasContent = false;
      for (let j = i + 1; j < body.length; j++) {
        if (body[j].type === 'h2' || body[j].type === 'h3') break;
        if (CONTENT_TYPES.has(body[j].type)) {
          hasContent = true;
          break;
        }
      }
      if (!hasContent) continue;
    }
    pass1.push(b);
  }

  // Pass 2: remove h2 blocks with no content block (or kept h3) before the next h2/end
  const pass2 = [];
  for (let i = 0; i < pass1.length; i++) {
    const b = pass1[i];
    if (b.type === 'h2') {
      let hasContent = false;
      for (let j = i + 1; j < pass1.length; j++) {
        if (pass1[j].type === 'h2') break;
        if (CONTENT_TYPES.has(pass1[j].type) || pass1[j].type === 'h3') {
          hasContent = true;
          break;
        }
      }
      if (!hasContent) continue;
    }
    pass2.push(b);
  }

  return pass2;
}

let fixedArticles = 0;
let removedHeadings = 0;

for (const file of fs.readdirSync(articlesDir)) {
  if (!file.endsWith('.json')) continue;
  const fullPath = path.join(articlesDir, file);
  const article = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const beforeLen = (article.body || []).length;
  const pruned = pruneEmptyHeadings(article.body || []);
  const diff = beforeLen - pruned.length;

  if (diff > 0) {
    article.body = pruned;
    fs.writeFileSync(fullPath, JSON.stringify(article), 'utf8');
    fixedArticles++;
    removedHeadings += diff;
  }
}

let removedTrans = 0;
if (fs.existsSync(transDir)) {
  for (const lang of fs.readdirSync(transDir)) {
    const langDir = path.join(transDir, lang);
    if (!fs.statSync(langDir).isDirectory()) continue;
    for (const f of fs.readdirSync(langDir).filter((x) => x.endsWith('.json'))) {
      const srcPath = path.join(articlesDir, f);
      const tPath = path.join(langDir, f);
      if (!fs.existsSync(srcPath)) continue;
      const src = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
      const tr = JSON.parse(fs.readFileSync(tPath, 'utf8'));
      if ((src.body || []).length !== (tr.body || []).length) {
        fs.unlinkSync(tPath);
        removedTrans++;
      }
    }
  }
}

console.log(`✅ Removed ${removedHeadings} orphan headings across ${fixedArticles} articles (removed ${removedTrans} stale mismatched translations).`);

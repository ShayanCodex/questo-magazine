import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');

const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json')).sort();
const baseMap = new Map();

for (const file of files) {
  const filePath = path.join(articlesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const rawImg = data.image || 'NO_IMAGE';
  const cleanImg = rawImg.split('?')[0];

  if (!baseMap.has(cleanImg)) {
    baseMap.set(cleanImg, []);
  }
  baseMap.get(cleanImg).push({
    slug: data.slug,
    title: data.title,
    category: data.category,
    image: rawImg,
  });
}

console.log(`Total Articles Analyzed: ${files.length}`);
console.log(`Unique Clean Image URLs: ${baseMap.size}`);

let collisionCount = 0;
for (const [img, list] of baseMap.entries()) {
  if (list.length > 1) {
    collisionCount++;
    console.log(`\n❌ COLLISION #${collisionCount} [Used in ${list.length} articles]: ${img}`);
    for (const item of list) {
      console.log(`   - [${item.category}] ${item.slug}`);
      console.log(`     Title: "${item.title}"`);
    }
  }
}

if (collisionCount === 0) {
  console.log('\n✅ ALL 91 ARTICLES HAVE 100% UNIQUE IMAGES!');
} else {
  console.log(`\n⚠️ Total Collisions: ${collisionCount}`);
}

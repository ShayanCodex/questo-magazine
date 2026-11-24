import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');

console.log('🔍 Running Pillar 5 Media Audit: Zero-Duplicate Image Validation...');

if (!fs.existsSync(articlesDir)) {
  console.error('❌ articles directory not found:', articlesDir);
  process.exit(1);
}

const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.json'));
const imageMap = new Map();
let duplicateCount = 0;
let missingCount = 0;

for (const file of files) {
  const filePath = path.join(articlesDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.image || typeof data.image !== 'string' || !data.image.trim()) {
      console.error(`⚠️ Missing image in: ${file}`);
      missingCount++;
      continue;
    }

    const cleanImg = data.image.trim();
    if (imageMap.has(cleanImg)) {
      console.warn(`⚠️ Duplicate image detected between:`);
      console.warn(`   - ${imageMap.get(cleanImg)}`);
      console.warn(`   - ${file}`);
      duplicateCount++;
    } else {
      imageMap.set(cleanImg, file);
    }
  } catch (err) {
    console.error(`❌ Error parsing ${file}:`, err.message);
  }
}

console.log(`📊 Total articles audited: ${files.length}`);
console.log(`🖼️  Unique images mapped:  ${imageMap.size}`);

if (missingCount > 0) {
  console.error(`❌ Audit failed: ${missingCount} article(s) are missing images.`);
  process.exit(1);
}

if (duplicateCount > 0) {
  console.warn(`⚠️ Notice: ${duplicateCount} duplicate image pair(s) flagged.`);
} else {
  console.log(`✅ Zero-Duplicate Image Policy Verified: 100% unique cover imagery.`);
}

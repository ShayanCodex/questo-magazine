import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');

const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json')).sort();
const imageUsages = new Map(); // cleanId -> [{ file, location, fullUrl }]

function extractId(url) {
  if (!url) return '';
  const match = url.match(/photo-([0-9a-zA-Z-]+)/);
  if (match) return `unsplash:${match[1]}`;
  const localMatch = url.match(/\/images\/articles\/([^?#]+)/);
  if (localMatch) return `local:${localMatch[1]}`;
  return url.split('?')[0];
}

for (const file of files) {
  const filePath = path.join(articlesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (data.image) {
    const id = extractId(data.image);
    if (!imageUsages.has(id)) imageUsages.set(id, []);
    imageUsages.get(id).push({ file, location: 'hero', url: data.image });
  }

  if (Array.isArray(data.body)) {
    data.body.forEach((block, idx) => {
      if (block.type === 'image' && block.src) {
        const id = extractId(block.src);
        if (!imageUsages.has(id)) imageUsages.set(id, []);
        imageUsages.get(id).push({ file, location: `body[${idx}]`, url: block.src });
      }
    });
  }
}

console.log(`====================================================`);
console.log(`🔍 A-TO-Z IMAGE AUDIT REPORT ACROSS ${files.length} ARTICLES`);
console.log(`====================================================\n`);

let duplicatesCount = 0;
for (const [id, occurrences] of imageUsages.entries()) {
  if (occurrences.length > 1) {
    duplicatesCount++;
    console.log(`🔴 DUPLICATE IMAGE [Used ${occurrences.length} times]: ${id}`);
    occurrences.forEach(o => {
      console.log(`   - ${o.file} (${o.location}) -> ${o.url.slice(0, 80)}`);
    });
    console.log('');
  }
}

if (duplicatesCount === 0) {
  console.log(`✅ PERFECT! ZERO DUPLICATES FOUND IN HERO OR BODY IMAGES!`);
} else {
  console.log(`⚠️ Total Duplicate Images Found: ${duplicatesCount}`);
}

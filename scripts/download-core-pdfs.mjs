import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const booksDir = path.join(rootDir, 'public', 'books');

if (!fs.existsSync(booksDir)) {
  fs.mkdirSync(booksDir, { recursive: true });
}

const downloads = [
  { file: 'the-art-of-war.pdf', url: 'https://archive.org/download/TheArtOfWarBySunTzu/ArtOfWar.pdf' },
  { file: 'frankenstein.pdf', url: 'https://archive.org/download/book_frankenstein_-_mary_wollstonecraft_shelley_2464/Frankenstein_-_Mary_Wollstonecraft_Shelley.pdf' },
  { file: 'meditations.pdf', url: 'https://archive.org/download/meditations-marcus-aurelius-2020-edit-pdf/MEDITATIONS%2C%20Marcus%20Aurelius%206x9pdf.pdf' },
  { file: 'the-prince.pdf', url: 'https://archive.org/download/theprinceox00machuoft/theprinceox00machuoft.pdf' },
  { file: 'the-communist-manifesto.pdf', url: 'https://archive.org/download/manifestoofcommu00marx_1/manifestoofcommu00marx_1.pdf' }
];

async function run() {
  for (const item of downloads) {
    const dest = path.join(booksDir, item.file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100000) {
      console.log('Already exists:', item.file);
      continue;
    }
    console.log(`Downloading ${item.file} from ${item.url}...`);
    try {
      const res = await fetch(item.url);
      if (!res.ok) {
        console.error(`Failed to download ${item.file}: HTTP ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log(`✓ Successfully saved ${item.file} (${Math.round(buffer.length / 1024)} KB)`);
    } catch (err) {
      console.error(`Error downloading ${item.file}:`, err.message);
    }
  }
}

run();

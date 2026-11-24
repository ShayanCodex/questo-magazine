#!/usr/bin/env node
/* global window, document */
/**
 * fetch-fresh-ebook-covers.mjs
 * ═══════════════════════════════════════════════════════════════════
 * Final pass: Scrapes the final 147 unique covers across museums,
 * antique libraries, and classical art archives to achieve 100% coverage.
 * ═══════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const EBOOKS_PATH = path.join(rootDir, 'src', 'data', 'ebooks.json');
const CARDS_PATH = path.join(rootDir, 'src', 'data', 'ebooks-cards.json');
const ARTICLES_PATH = path.join(rootDir, 'src', 'data', 'master-articles.en.json');

const ebooks = JSON.parse(fs.readFileSync(EBOOKS_PATH, 'utf8'));
const cards = JSON.parse(fs.readFileSync(CARDS_PATH, 'utf8'));
const articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8'));

// Track all existing images to guarantee 0 duplicates
const usedImages = new Set();
for (const a of articles) {
  if (a.image) usedImages.add(a.image.split('?')[0]);
}
for (const b of ebooks) {
  if (b.coverUrl && b.coverUrl.trim().length > 0) {
    usedImages.add(b.coverUrl.split('?')[0]);
  }
}

console.log(`Current used images in system: ${usedImages.size}`);

const emptyEbooks = ebooks.filter((b) => !b.coverUrl || b.coverUrl.trim().length === 0);
console.log(`Books needing authentic covers: ${emptyEbooks.length}`);

if (emptyEbooks.length === 0) {
  console.log('All books already have covers!');
  process.exit(0);
}

const FINAL_QUERIES = [
  'https://unsplash.com/s/photos/oil-painting-museum',
  'https://unsplash.com/s/photos/vintage-encyclopedia',
  'https://unsplash.com/s/photos/antique-typewriter-paper',
  'https://unsplash.com/s/photos/medieval-illuminated-manuscript',
  'https://unsplash.com/s/photos/ancient-parchment-scroll',
  'https://unsplash.com/s/photos/classical-marble-relief',
  'https://unsplash.com/s/photos/vintage-astronomy-diagram',
  'https://unsplash.com/s/photos/historic-bookstore',
  'https://unsplash.com/s/photos/vintage-poetry-book',
  'https://unsplash.com/s/photos/renaissance-portrait-classical',
  'https://unsplash.com/s/photos/classical-greek-columns',
  'https://unsplash.com/s/photos/ancient-library-alexandria',
  'https://unsplash.com/s/photos/vintage-leather-journal',
  'https://unsplash.com/s/photos/antique-compass-vintage',
  'https://unsplash.com/s/photos/classical-statue-museum',
  'https://unsplash.com/s/photos/ancient-philosophy-bust',
  'https://unsplash.com/s/photos/old-historical-documents',
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  await page.setViewport({ width: 1440, height: 900 });

  const freshPhotoPool = [];

  for (const url of FINAL_QUERIES) {
    try {
      const term = url.split('/photos/')[1];
      console.log(`Scraping "${term}"...`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });

      for (let s = 0; s < 5; s++) {
        await page.evaluate(() => window.scrollBy(0, 1800));
        await new Promise((r) => setTimeout(r, 700));
      }

      const scrapedUrls = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img[src*="images.unsplash.com/photo-"]'));
        return imgs.map((img) => img.src.split('?')[0]);
      });

      let added = 0;
      for (const base of scrapedUrls) {
        if (!usedImages.has(base) && !freshPhotoPool.includes(base)) {
          freshPhotoPool.push(base);
          usedImages.add(base);
          added++;
        }
      }

      console.log(`  -> Added ${added} unique photos. Fresh pool size: ${freshPhotoPool.length}`);
      if (freshPhotoPool.length >= emptyEbooks.length) {
        console.log(`Target reached: ${freshPhotoPool.length}/${emptyEbooks.length}!`);
        break;
      }
    } catch (err) {
      console.warn(`Error on ${url}:`, err.message);
    }
  }

  await browser.close();

  console.log(`Total fresh pool collected: ${freshPhotoPool.length} for ${emptyEbooks.length} remaining books.`);

  let assignedCount = 0;
  for (let i = 0; i < emptyEbooks.length; i++) {
    if (i < freshPhotoPool.length) {
      const photoBase = freshPhotoPool[i];
      emptyEbooks[i].coverUrl = `${photoBase}?auto=format&fit=crop&w=800&q=85`;
      assignedCount++;
    }
  }

  console.log(`Assigned ${assignedCount} fresh authentic covers.`);

  // Sync cards with master ebooks
  const ebookMap = new Map(ebooks.map((b) => [b.slug, b]));
  for (const card of cards) {
    const master = ebookMap.get(card.slug);
    if (master) {
      card.coverUrl = master.coverUrl;
    }
  }

  fs.writeFileSync(EBOOKS_PATH, JSON.stringify(ebooks, null, 2), 'utf8');
  fs.writeFileSync(CARDS_PATH, JSON.stringify(cards, null, 2), 'utf8');

  // Verify uniqueness
  const coverCounts = new Map();
  for (const b of ebooks) {
    if (b.coverUrl) {
      coverCounts.set(b.coverUrl, (coverCounts.get(b.coverUrl) || 0) + 1);
    }
  }

  const dups = [...coverCounts.entries()].filter(([_, count]) => count > 1);
  const stillEmpty = ebooks.filter((b) => !b.coverUrl || b.coverUrl.trim().length === 0);

  console.log('════════════════════════════════════════════════════════');
  console.log('📊 FINAL E-BOOK COVERS AUDIT:');
  console.log(`📚 Total Books:                 ${ebooks.length}`);
  console.log(`🖼️  Unique Real Image Covers:    ${coverCounts.size}`);
  console.log(`📖 Still Empty Covers:          ${stillEmpty.length}`);
  console.log(`🚨 Duplicate Covers:            ${dups.length}`);
  console.log('════════════════════════════════════════════════════════');

  if (dups.length > 0) {
    console.error('Error: Duplicate covers detected!');
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});

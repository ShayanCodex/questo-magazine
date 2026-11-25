/* global window, document */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');
const outPath = path.join(rootDir, 'scripts', 'scratch-photo-pool-2.json');

const usedImages = new Set();
for (const file of fs.readdirSync(articlesDir).filter((f) => f.endsWith('.json'))) {
  const data = JSON.parse(fs.readFileSync(path.join(articlesDir, file), 'utf8'));
  if (data.image) usedImages.add(data.image.split('?')[0].trim());
}
console.log(`Existing unique article images to exclude: ${usedImages.size}`);

const NICHE_QUERIES = {
  technology: ['data-center-racks', 'neural-network-hardware', 'autonomous-drone'],
  science: ['dna-sequencing-lab', 'solar-observatory', 'molecular-chemistry'],
  finance: ['currency-trading-desk', 'treasury-building', 'real-estate-skyline'],
  health: ['sleep-clinic', 'blood-biomarker-lab', 'meditation-breathwork'],
  'architecture-and-space': ['timber-pavilion', 'concrete-gallery', 'urban-courtyard'],
  'design-and-typography': ['editorial-layout', 'industrial-prototype', 'letterpress-type'],
  'engineering-and-technology': ['solar-thermal-plant', 'bullet-train-rail', 'aerospace-turbine'],
  food: ['wood-fired-bakery', 'coffee-roastery', 'olive-grove-harvest'],
  news: ['container-port', 'european-parliament', 'hydroelectric-grid'],
  sports: ['velodrome-cycling', 'track-and-field-sprint', 'alpine-ski-racing'],
  'art-and-culture': ['renaissance-gallery', 'vinyl-pressing', 'classical-cello'],
  software: ['linux-terminal', 'distributed-cluster', 'code-architecture'],
  travel: ['swiss-railway', 'amalfi-coast-trail', 'nordic-cabin'],
  entertainment: ['analog-mixing-console', 'imax-theater', 'film-set-lighting'],
  crypto: ['hardware-security-key', 'server-cluster-led', 'fintech-analytics'],
  business: ['modern-manufacturing', 'logistics-freight', 'executive-workspace'],
  fitness: ['olympic-weightlifting', 'swimming-laps', 'trail-running'],
  lifestyle: ['minimalist-home-office', 'pour-over-coffee', 'hardcover-books'],
};

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

  const pool = {};
  let totalCollected = 0;

  for (const [category, queries] of Object.entries(NICHE_QUERIES)) {
    pool[category] = [];
    for (const q of queries) {
      try {
        await page.goto(`https://unsplash.com/s/photos/${q}`, {
          waitUntil: 'domcontentloaded',
          timeout: 20000,
        });
        await page.evaluate(() => window.scrollBy(0, 1500));
        await new Promise((r) => setTimeout(r, 800));

        const imgs = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('img[src*="images.unsplash.com/photo-"]'))
            .map((img) => ({
              src: img.src.split('?')[0],
              alt: (img.alt || '').trim(),
            }))
            .filter((item) => !item.src.includes('profile-') && item.src.length > 35);
        });

        for (const item of imgs) {
          if (!usedImages.has(item.src)) {
            usedImages.add(item.src);
            pool[category].push({
              url: `${item.src}?auto=format&fit=crop&w=1600&q=80`,
              alt: item.alt || `${category.replace(/-/g, ' ')} editorial photography`,
            });
            totalCollected++;
          }
        }
      } catch (err) {
        console.warn(`Warn scraping ${q}: ${err.message}`);
      }
    }
    console.log(`[${category}] collected ${pool[category].length} new images (total: ${totalCollected})`);
  }

  await browser.close();
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2), 'utf8');
  console.log(`\nDone! Saved ${totalCollected} new unique Unsplash images to ${outPath}`);
}

run();

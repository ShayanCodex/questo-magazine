/* global window, document */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');
const outPath = path.join(rootDir, 'scripts', 'scratch-photo-pool.json');

// Collect all currently used article images so we never duplicate any
const usedImages = new Set();
for (const file of fs.readdirSync(articlesDir).filter((f) => f.endsWith('.json'))) {
  const data = JSON.parse(fs.readFileSync(path.join(articlesDir, file), 'utf8'));
  if (data.image) usedImages.add(data.image.split('?')[0].trim());
}
console.log(`Existing unique article images to exclude: ${usedImages.size}`);

const NICHE_QUERIES = {
  technology: ['artificial-intelligence', 'server-room', 'robotics', 'quantum-computer', 'cybersecurity', 'microchip'],
  science: ['chemistry-lab', 'astronomy-nebula', 'microscope-biology', 'physics-experiment', 'geology-crystals', 'ocean-research'],
  finance: ['wall-street', 'stock-exchange', 'banking-architecture', 'gold-bullion', 'financial-district', 'economics-data'],
  health: ['medical-research', 'neuroscience', 'healthy-nutrition', 'sleep-wellness', 'hospital-laboratory', 'yoga-meditation'],
  'architecture-and-space': ['brutalist-architecture', 'modern-skyscraper', 'minimalist-museum', 'concrete-interior', 'japanese-architecture', 'urban-planning'],
  'design-and-typography': ['typography-poster', 'graphic-design-studio', 'industrial-design', 'minimalist-furniture', 'color-palette', 'printmaking'],
  'engineering-and-technology': ['suspension-bridge', 'aerospace-jet', 'wind-turbine', 'electric-vehicle', 'factory-automation', 'hydroelectric-dam'],
  food: ['michelin-gastronomy', 'artisan-sourdough', 'specialty-coffee', 'fermentation-kitchen', 'organic-farm', 'culinary-plating'],
  news: ['journalism-newsroom', 'united-nations', 'cargo-shipping', 'parliament-building', 'global-summit', 'newspaper-press'],
  sports: ['marathon-runner', 'olympic-swimming', 'cycling-peloton', 'mountain-climbing', 'tennis-court', 'rowing-crew'],
  'art-and-culture': ['classical-sculpture', 'modern-art-gallery', 'symphony-orchestra', 'film-cinema', 'ancient-library', 'oil-painting'],
  software: ['software-developer', 'coding-terminal', 'cloud-datacenter', 'network-cables', 'laptop-workspace', 'circuit-logic'],
  travel: ['alpine-mountains', 'kyoto-temple', 'nordic-fjord', 'sahara-desert', 'venice-canal', 'patagonia-glacier'],
  entertainment: ['cinema-projector', 'vinyl-record', 'concert-stage', 'recording-studio', 'theater-auditorium', 'camera-lens'],
  crypto: ['blockchain-network', 'cryptocurrency-hardware', 'digital-ledger', 'data-encryption', 'fiber-optic', 'fintech-terminal'],
  business: ['startup-office', 'boardroom-meeting', 'logistics-warehouse', 'supply-chain', 'coworking-space', 'entrepreneurship'],
  fitness: ['strength-training', 'kettlebell-workout', 'track-sprint', 'gymnastics-rings', 'triathlon-swim', 'crossfit-barbell'],
  lifestyle: ['minimalist-desk', 'morning-reading', 'botanical-garden', 'ceramic-pottery', 'analog-watch', 'quiet-cafe'],
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
        await page.evaluate(() => window.scrollBy(0, 1600));
        await new Promise((r) => setTimeout(r, 900));
        await page.evaluate(() => window.scrollBy(0, 1600));
        await new Promise((r) => setTimeout(r, 900));

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
    console.log(`[${category}] collected ${pool[category].length} unique images (total: ${totalCollected})`);
  }

  await browser.close();
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2), 'utf8');
  console.log(`\nDone! Saved ${totalCollected} unique Unsplash images to ${outPath}`);
}

run();

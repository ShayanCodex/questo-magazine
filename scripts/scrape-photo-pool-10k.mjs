/* global window, document */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');
const outPath = path.join(rootDir, 'scripts', 'scratch-photo-pool-10k.json');

const usedImages = new Set();
for (const file of fs.readdirSync(articlesDir).filter((f) => f.endsWith('.json'))) {
  const data = JSON.parse(fs.readFileSync(path.join(articlesDir, file), 'utf8'));
  if (data.image) usedImages.add(data.image.split('?')[0].trim());
}
console.log(`Existing unique article images to exclude: ${usedImages.size}`);

// 20+ broad high-yield queries per niche across all 18 niches (~360 queries)
const NICHE_QUERIES = {
  technology: [
    'technology', 'computer', 'laptop', 'smartphone', 'server', 'circuit', 'robot', 'ai', 'drone', 'vr',
    'cyber', 'chip', 'hardware', 'gadget', 'network', 'keyboard', 'screen', 'radar', 'sensor', 'automation'
  ],
  science: [
    'science', 'laboratory', 'microscope', 'chemistry', 'physics', 'astronomy', 'galaxy', 'space', 'planet', 'biology',
    'dna', 'molecule', 'crystal', 'telescope', 'experiment', 'research', 'atom', 'eclipse', 'nebula', 'geology'
  ],
  finance: [
    'finance', 'money', 'bank', 'stock-market', 'chart', 'economy', 'gold', 'currency', 'wall-street', 'investment',
    'accounting', 'skyscraper', 'coins', 'credit-card', 'trading', 'vault', 'real-estate', 'tax', 'audit', 'wealth'
  ],
  health: [
    'health', 'medicine', 'doctor', 'hospital', 'nutrition', 'salad', 'sleep', 'yoga', 'meditation', 'pharmacy',
    'stethoscope', 'vitamins', 'therapy', 'brain', 'heart', 'dental', 'clinic', 'wellness', 'fruit', 'water'
  ],
  'architecture-and-space': [
    'architecture', 'building', 'skyscraper', 'interior', 'museum', 'bridge', 'concrete', 'minimalist-house', 'stairs', 'facade',
    'monument', 'cathedral', 'modern-building', 'glass-tower', 'courtyard', 'pavilion', 'loft', 'ceiling', 'arch', 'urban'
  ],
  'design-and-typography': [
    'design', 'typography', 'poster', 'graphic-design', 'furniture', 'chair', 'lamp', 'ceramic', 'studio', 'sketch',
    'notebook', 'pen', 'color', 'texture', 'pattern', 'packaging', 'brand', 'print', 'book-design', 'minimalism'
  ],
  'engineering-and-technology': [
    'engineering', 'factory', 'bridge-construction', 'wind-turbine', 'solar-panel', 'train', 'airplane', 'ship', 'crane', 'dam',
    'highway', 'tunnel', 'machinery', 'gears', 'welding', 'steel', 'power-plant', 'rocket', 'turbine', 'motor'
  ],
  food: [
    'food', 'restaurant', 'coffee', 'bread', 'pasta', 'pizza', 'sushi', 'steak', 'dessert', 'vegetables',
    'spices', 'kitchen', 'chef', 'wine', 'tea', 'bakery', 'cheese', 'chocolate', 'breakfast', 'dinner'
  ],
  news: [
    'newspaper', 'city', 'protest', 'election', 'government', 'flag', 'cargo-ship', 'airport', 'border', 'parliament',
    'court', 'press', 'microphone', 'traffic', 'industry', 'oil-rig', 'port', 'diplomacy', 'summit', 'metro'
  ],
  sports: [
    'sports', 'running', 'soccer', 'basketball', 'tennis', 'swimming', 'cycling', 'boxing', 'golf', 'baseball',
    'football', 'skiing', 'surfing', 'climbing', 'rowing', 'stadium', 'marathon', 'track', 'volleyball', 'hockey'
  ],
  'art-and-culture': [
    'art', 'painting', 'sculpture', 'gallery', 'library', 'books', 'theater', 'orchestra', 'dance', 'statue',
    'pottery', 'street-art', 'sketchbook', 'calligraphy', 'mosaic', 'violin', 'piano', 'opera', 'history', 'archive'
  ],
  software: [
    'coding', 'programming', 'developer', 'code', 'terminal', 'database', 'cloud-computing', 'desk-setup', 'monitor', 'tech-office',
    'software', 'web-design', 'cybersecurity', 'linux', 'algorithm', 'server-rack', 'workstation', 'workspace', 'data', 'analytics'
  ],
  travel: [
    'travel', 'mountains', 'ocean', 'beach', 'forest', 'desert', 'cityscape', 'island', 'lake', 'waterfall',
    'camping', 'hiking', 'road-trip', 'train-travel', 'europe', 'japan', 'italy', 'iceland', 'canyon', 'glacier'
  ],
  entertainment: [
    'cinema', 'movie', 'concert', 'music', 'guitar', 'headphones', 'vinyl', 'camera', 'gaming', 'festival',
    'stage', 'radio', 'podcast', 'drums', 'singer', 'dj', 'spotlight', 'film', 'arcade', 'television'
  ],
  crypto: [
    'bitcoin', 'blockchain', 'cryptocurrency', 'cyber-network', 'digital-art', 'neon-grid', 'fiber-optic', 'data-stream', 'matrix', 'hologram',
    'encryption', 'fintech', 'server-light', 'abstract-tech', 'digital-security', 'hardware-key', 'quantum', 'led-lights', 'circuit-board', 'future-tech'
  ],
  business: [
    'business', 'office', 'meeting', 'startup', 'teamwork', 'warehouse', 'logistics', 'coworking', 'presentation', 'handshake',
    'marketing', 'strategy', 'retail', 'shop', 'factory-floor', 'delivery', 'commerce', 'entrepreneur', 'laptop-work', 'conference'
  ],
  fitness: [
    'fitness', 'gym', 'workout', 'weights', 'barbell', 'dumbbells', 'crossfit', 'cardio', 'sprint', 'stretching',
    'kettlebell', 'pilates', 'calisthenics', 'athlete', 'muscle', 'jump-rope', 'training', 'pullup', 'squat', 'deadlift'
  ],
  lifestyle: [
    'lifestyle', 'morning-coffee', 'reading', 'home', 'garden', 'plants', 'watch', 'fashion', 'candle', 'journal',
    'living-room', 'bedroom', 'minimalist-desk', 'tea-cup', 'bicycle', 'picnic', 'sunset', 'autumn', 'rain', 'cozy'
  ],
};

const TARGET_TOTAL = 8400;

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const pool = {};
  const tasks = [];
  for (const [cat, queries] of Object.entries(NICHE_QUERIES)) {
    pool[cat] = [];
    for (const q of queries) tasks.push({ cat, q });
  }

  let totalCollected = 0;
  let taskIdx = 0;
  const CONCURRENCY = 4;

  async function worker(workerId) {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width: 1440, height: 900 });

    while (taskIdx < tasks.length && totalCollected < TARGET_TOTAL) {
      const { cat, q } = tasks[taskIdx++];
      try {
        await page.goto(`https://unsplash.com/s/photos/${q}`, {
          waitUntil: 'domcontentloaded',
          timeout: 18000,
        });
        for (let s = 0; s < 3; s++) {
          await page.evaluate(() => window.scrollBy(0, 1800));
          await new Promise((r) => setTimeout(r, 550));
        }

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
            pool[cat].push({
              url: `${item.src}?auto=format&fit=crop&w=1600&q=80`,
              alt: item.alt || `${cat.replace(/-/g, ' ')} editorial photography`,
            });
            totalCollected++;
          }
        }
        if (taskIdx % 20 === 0) {
          console.log(`[worker ${workerId}] progress ${taskIdx}/${tasks.length} queries | unique images: ${totalCollected}`);
        }
      } catch {
        // skip slow query cleanly
      }
    }
    await page.close();
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)));
  await browser.close();

  fs.writeFileSync(outPath, JSON.stringify(pool), 'utf8');
  console.log(`\nDone! Collected ${totalCollected} unique Unsplash images across 18 niches.`);
}

run();

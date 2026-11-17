/* global window, document, AbortSignal */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');

// 1. Identify all currently used images and find duplicates
const articleFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'));

const imageUsage = new Map(); // base -> [ { file, field, category, title, full } ]

for (const file of articleFiles) {
  const c = JSON.parse(fs.readFileSync(path.join(articlesDir, file), 'utf8'));
  if (c.image) {
    const base = c.image.split('?')[0];
    if (!imageUsage.has(base)) imageUsage.set(base, []);
    imageUsage.get(base).push({ file, field: 'hero', category: c.category || 'general', title: c.title, full: c.image });
  }
  if (Array.isArray(c.body)) {
    c.body.forEach((b, i) => {
      if (b.type === 'image' && b.src) {
        const base = b.src.split('?')[0];
        if (!imageUsage.has(base)) imageUsage.set(base, []);
        imageUsage.get(base).push({ file, field: `body[${i}]`, category: c.category || 'general', title: c.title, full: b.src });
      }
    });
  }
}

// Find slots that must be replaced (keep occurrence 0, replace 1..N)
const slotsToReplace = [];
for (const [, occs] of imageUsage.entries()) {
  if (occs.length > 1) {
    for (let i = 1; i < occs.length; i++) {
      slotsToReplace.push(occs[i]);
    }
  }
}

console.log(`Found ${slotsToReplace.length} duplicate image slots across ${articleFiles.length} articles that need unique replacement.`);

// 2. Launch Edge to scrape pools of fresh photos for various queries
const queries = [
  'modern-architecture',
  'minimalist-architecture',
  'finance-trading-charts',
  'stock-market-wealth',
  'science-laboratory-research',
  'quantum-physics-laser',
  'space-galaxy-telescope',
  'deep-ocean-marine',
  'fitness-athletic-training',
  'gourmet-culinary-food',
  'audio-sound-studio',
  'electronics-semiconductor-chip',
  'minimalist-design-interior',
  'geology-nature-landscape'
];

async function collectFreshPhotos() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  const freshPhotos = new Set();

  for (const q of queries) {
    try {
      console.log(`Scraping Unsplash for "${q}"...`);
      await page.goto(`https://unsplash.com/s/photos/${q}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
      // Scroll down twice to trigger lazy loading
      await page.evaluate(() => window.scrollBy(0, 1500));
      await new Promise(r => setTimeout(r, 1200));
      await page.evaluate(() => window.scrollBy(0, 1500));
      await new Promise(r => setTimeout(r, 1200));

      const imgs = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('img[src*="images.unsplash.com/photo-"]'));
        return elements.map(e => e.src.split('?')[0]);
      });

      for (const img of imgs) {
        if (!imageUsage.has(img)) {
          freshPhotos.add(img);
        }
      }
      console.log(`  -> Current fresh unique photo pool size: ${freshPhotos.size}`);
    } catch (e) {
      console.log(`  -> Error scraping ${q}: ${e.message}`);
    }
  }

  await browser.close();
  return [...freshPhotos];
}

async function run() {
  const freshPool = await collectFreshPhotos();
  console.log(`\nTotal candidate fresh photos collected: ${freshPool.length}`);

  if (freshPool.length < slotsToReplace.length) {
    console.warn(`Warning: Need ${slotsToReplace.length} photos, but have ${freshPool.length}. Will scrape more if needed.`);
  }

  // Fast parallel verification
  console.log('Verifying fresh candidate photos in parallel...');
  const checkOne = async (photo) => {
    try {
      const res = await fetch(`${photo}?auto=format&fit=crop&w=400&q=80`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(2500)
      });
      return res.ok ? photo : null;
    } catch {
      return null;
    }
  };

  const results = await Promise.all(freshPool.map(checkOne));
  const verifiedPool = results.filter(Boolean);


  console.log(`Verified active photo pool: ${verifiedPool.length} (Need: ${slotsToReplace.length})`);

  // Assign unique photo to each duplicate slot
  const usedNow = new Set([...imageUsage.keys()]);
  let assignedCount = 0;

  // Group replacements by file so we can update each file cleanly
  const fileUpdates = new Map(); // file -> [ { field, newBaseUrl } ]

  for (const slot of slotsToReplace) {
    // Pick the next verified photo not yet in usedNow
    let chosen = null;
    while (verifiedPool.length > 0) {
      const candidate = verifiedPool.shift();
      if (!usedNow.has(candidate)) {
        chosen = candidate;
        usedNow.add(candidate);
        break;
      }
    }

    if (!chosen) {
      console.error(`Ran out of verified photos for ${slot.file} (${slot.field})!`);
      continue;
    }

    if (!fileUpdates.has(slot.file)) fileUpdates.set(slot.file, []);
    fileUpdates.get(slot.file).push({ field: slot.field, newBase: chosen });
    assignedCount++;
  }

  console.log(`Applying replacements across ${fileUpdates.size} article files...`);

  for (const [file, updates] of fileUpdates.entries()) {
    const filePath = path.join(articlesDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    for (const u of updates) {
      const isHero = u.field === 'hero';
      const width = isHero ? 1600 : 1200;
      const fullUrl = `${u.newBase}?auto=format&fit=crop&w=${width}&q=80`;

      if (isHero) {
        data.image = fullUrl;
      } else {
        const match = u.field.match(/body\[(\d+)\]/);
        if (match) {
          const index = parseInt(match[1], 10);
          if (data.body && data.body[index]) {
            data.body[index].src = fullUrl;
          }
        }
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  console.log(`\nSuccessfully applied ${assignedCount} unique image replacements!`);

  // 3. Post-verification
  const postUsage = new Map();
  for (const f of articleFiles) {
    const c = JSON.parse(fs.readFileSync(path.join(articlesDir, f), 'utf8'));
    if (c.image) {
      const base = c.image.split('?')[0];
      if (!postUsage.has(base)) postUsage.set(base, []);
      postUsage.get(base).push({ f, field: 'hero' });
    }
    if (Array.isArray(c.body)) {
      c.body.forEach((b, i) => {
        if (b.type === 'image' && b.src) {
          const base = b.src.split('?')[0];
          if (!postUsage.has(base)) postUsage.set(base, []);
          postUsage.get(base).push({ f, field: `body[${i}]` });
        }
      });
    }
  }

  let remainingDups = 0;
  for (const [base, occs] of postUsage.entries()) {
    if (occs.length > 1) {
      remainingDups++;
      console.log(`[REMAINING DUP] ${base} used ${occs.length}x:`, occs);
    }
  }

  console.log(`\nFinal Post-Verification Result:`);
  console.log(`Total unique images now in use: ${postUsage.size}`);
  console.log(`Total duplicated images remaining: ${remainingDups}`);
}

run().catch(console.error);

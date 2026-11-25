/* global window, document */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');
const poolPath = path.join(rootDir, 'scripts', 'scratch-photo-pool-10k.json');

const pool = JSON.parse(fs.readFileSync(poolPath, 'utf8'));
const usedImages = new Set();

for (const file of fs.readdirSync(articlesDir).filter((f) => f.endsWith('.json'))) {
  const data = JSON.parse(fs.readFileSync(path.join(articlesDir, file), 'utf8'));
  if (data.image) usedImages.add(data.image.split('?')[0].trim());
}

let currentNew = 0;
for (const arr of Object.values(pool)) {
  for (const item of arr) {
    usedImages.add(item.url.split('?')[0].trim());
    currentNew++;
  }
}
console.log(`Starting with ${currentNew} new images (${usedImages.size} total excluded).`);

const EXTRA_QUERIES = {
  technology: [
    'motherboard', 'fiber-optics', 'smartwatch', 'tablet', '3d-printer', 'headset', 'vr-glasses', 'datacenter',
    'processor', 'microchip-macro', 'wireless-router', 'electric-scooter', 'smartphone-screen', 'cyber-security',
    'server-lights', 'tech-startup', 'robotic-arm', 'autonomous-car', 'smart-home', 'camera-sensor',
    'digital-display', 'electronic-components', 'usb-cable', 'gaming-pc', 'studio-monitor'
  ],
  science: [
    'beaker', 'test-tube', 'petri-dish', 'magnet', 'prism', 'fossil', 'volcano', 'coral-reef',
    'glacier-ice', 'aurora-borealis', 'milky-way', 'moon-surface', 'solar-flare', 'saturn',
    'chemical-reaction', 'biotech', 'botany', 'butterfly-wing', 'quartz-crystal', 'mineral',
    'observatory-dome', 'space-shuttle', 'rocket-launch', 'dna-helix', 'cell-biology'
  ],
  finance: [
    'stock-ticker', 'banking-hall', 'financial-newspaper', 'calculator-desk', 'business-chart', 'dollar-bills',
    'euro-notes', 'gold-coins', 'silver-bar', 'manhattan-skyline', 'london-city', 'tokyo-finance',
    'hong-kong-skyline', 'frankfurt-towers', 'zurich-bank', 'singapore-cbd', 'credit-terminal', 'invoice-paper',
    'contract-signing', 'briefcase', 'corporate-lobby', 'board-meeting', 'trading-floor', 'safe-vault', 'mortgage-house'
  ],
  health: [
    'green-smoothie', 'avocado-toast', 'herbal-tea', 'pill-bottle', 'blood-test', 'eye-exam',
    'physical-therapy', 'massage-spa', 'sauna-wood', 'ice-bath', 'running-shoes', 'bicycle-commute',
    'fresh-vegetables', 'berries-bowl', 'salmon-meal', 'olive-oil', 'sleep-mask', 'sunrise-stretch',
    'breathwork', 'mindfulness', 'dental-care', 'sunlight-window', 'forest-walk', 'hydration-bottle', 'medical-scan'
  ],
  'architecture-and-space': [
    'spiral-staircase', 'concrete-wall', 'glass-atrium', 'wooden-cabin', 'modern-villa', 'penthouse',
    'art-museum', 'concert-hall', 'train-station', 'suspension-bridge', 'arched-hallway', 'marble-columns',
    'rooftop-terrace', 'japanese-house', 'scandinavian-interior', 'industrial-loft', 'library-hall', 'city-plaza',
    'skybridge', 'geodesic-dome', 'brick-warehouse', 'stone-courtyard', 'curved-facade', 'timber-roof', 'subway-station'
  ],
  'design-and-typography': [
    'typewriter', 'fountain-pen', 'color-swatches', 'magazine-layout', 'vinyl-cover', 'minimal-chair',
    'ceramic-vase', 'wooden-desk', 'architecture-model', 'drafting-tools', 'pantone', 'screen-printing',
    'letterpress', 'calligraphy-brush', 'industrial-lamp', 'minimalist-clock', 'leather-notebook', 'origami',
    'glassware', 'modern-table', 'abstract-geometry', 'paper-craft', 'ink-bottle', 'camera-design', 'watch-dial'
  ],
  'engineering-and-technology': [
    'suspension-cable', 'steel-beam', 'wind-farm', 'solar-array', 'hydro-dam', 'nuclear-cooling-tower',
    'freight-train', 'high-speed-train', 'cargo-plane', 'jet-engine', 'container-crane', 'oil-refinery',
    'copper-pipes', 'cnc-machine', 'laser-cutting', 'robot-welding', 'shipyard', 'tunnel-construction',
    'geothermal-plant', 'electric-bus', 'subway-tunnel', 'crane-skyline', 'gearbox', 'turbines', 'foundry'
  ],
  food: [
    'croissant', 'sourdough-loaf', 'espresso-shot', 'latte-art', 'ramen-bowl', 'tacos',
    'sushi-platter', 'grilled-steak', 'seafood-pasta', 'fresh-herbs', 'farmers-market', 'cheese-board',
    'red-wine', 'olive-grove', 'vineyard', 'chocolate-bar', 'pastry-chef', 'street-food',
    'matcha-tea', 'roasting-coffee', 'brick-oven', 'artisan-jam', 'honeycomb', 'citrus-fruit', 'dumplings'
  ],
  news: [
    'capitol-building', 'white-house', 'united-nations-flag', 'press-conference', 'microphone-stand', 'city-protest',
    'border-crossing', 'customs-port', 'oil-tanker', 'international-airport', 'highway-traffic', 'power-lines',
    'suburban-houses', 'voting-ballot', 'courthouse', 'breaking-news-desk', 'radio-tower', 'weather-storm',
    'wildfire-smoke', 'flood-water', 'drought-land', 'solar-grid', 'urban-skyline', 'diplomatic-flags', 'train-freight'
  ],
  sports: [
    'soccer-ball', 'basketball-hoop', 'tennis-racket', 'golf-course', 'swimming-pool', 'cycling-race',
    'mountain-bike', 'surfboard', 'kayak', 'snowboarding', 'ice-hockey', 'baseball-field',
    'boxing-gloves', 'martial-arts', 'archery', 'fencing', 'sailing-boat', 'rock-climbing',
    'track-stadium', 'finish-line', 'relay-baton', 'rowing-oars', 'marathon-crowd', 'rugby', 'cricket'
  ],
  'art-and-culture': [
    'paint-brushes', 'canvas-easel', 'clay-pottery', 'marble-statue', 'classical-painting', 'modern-sculpture',
    'street-mural', 'cello', 'grand-piano', 'ballet-stage', 'opera-house', 'ancient-ruins',
    'greek-temple', 'roman-colosseum', 'cathedral-stained-glass', 'manuscript', 'antique-books', 'bookstore-aisle',
    'film-reel', 'darkroom-photography', 'watercolor', 'ink-drawing', 'weaving-loom', 'tapestry-art', 'wood-carving'
  ],
  software: [
    'dual-monitors', 'mechanical-keyboard', 'laptop-code', 'server-cables', 'rack-servers', 'command-line',
    'dark-workspace', 'developer-desk', 'network-switch', 'ethernet-cables', 'cloud-server', 'web-analytics',
    'dashboard-screen', 'tablet-wireframe', 'mobile-app-ui', 'office-monitors', 'hacker-terminal', 'usb-drive',
    'ssd-drive', 'macbook-desk', 'linux-laptop', 'whiteboard-diagram', 'pair-programming', 'tech-meetup', 'work-desk'
  ],
  travel: [
    'swiss-alps', 'kyoto-street', 'paris-street', 'rome-architecture', 'venice-gondola', 'amalfi-coast',
    'santorini', 'norway-fjord', 'iceland-waterfall', 'scottish-highlands', 'sahara-dunes', 'grand-canyon',
    'banff-lake', 'patagonia-peaks', 'tokyo-night', 'seoul-skyline', 'istanbul-mosque', 'marrakech-market',
    'lisbon-tram', 'prague-bridge', 'vienna-palace', 'barcelona-streets', 'new-zealand-lake', 'dolomites', 'machu-picchu'
  ],
  entertainment: [
    'movie-theater', 'popcorn-cinema', 'film-camera', 'clapperboard', 'recording-mic', 'mixing-console',
    'electric-guitar', 'acoustic-guitar', 'drum-kit', 'turntable', 'cassette-tape', 'neon-arcade',
    'gaming-controller', 'concert-crowd', 'stage-lights', 'dj-booth', 'jazz-club', 'saxophone',
    'podcast-mic', 'speaker-studio', 'spotlight-beam', 'broadway-theater', 'music-festival', 'vinyl-shop', 'cinema-seats'
  ],
  crypto: [
    'neon-tunnel', 'purple-circuit', 'blue-data', 'digital-matrix', 'fiber-light', 'abstract-waves',
    'cyber-city', 'futuristic-grid', 'server-glow', 'laser-grid', 'binary-screen', 'quantum-light',
    'security-lock', 'padlock-keyboard', 'digital-globe', 'network-nodes', 'holographic', 'glowing-cube',
    'dark-tech', 'neon-lines', 'led-matrix', 'prism-light', 'gold-coin-macro', 'hardware-wallet', 'futuristic-ui'
  ],
  business: [
    'modern-office', 'conference-room', 'glass-office', 'warehouse-shelves', 'shipping-boxes', 'forklift',
    'delivery-van', 'coffee-shop-work', 'startup-team', 'whiteboard-session', 'sticky-notes', 'business-plan',
    'retail-store', 'boutique-shop', 'manufacturing-line', 'quality-control', 'export-crates', 'port-containers',
    'coworking-lounge', 'executive-desk', 'laptop-presentation', 'client-meeting', 'product-launch', 'trade-show', 'inventory'
  ],
  fitness: [
    'dumbbell-rack', 'barbell-plates', 'squat-rack', 'kettlebell-floor', 'battle-ropes', 'pullup-bar',
    'gym-rings', 'treadmill', 'rowing-machine', 'stationary-bike', 'yoga-mat', 'foam-roller',
    'boxing-bag', 'medicine-ball', 'agility-ladder', 'track-blocks', 'athlete-stretch', 'gym-chalk',
    'weight-bench', 'cable-machine', 'jump-box', 'pushup-floor', 'plank-core', 'trail-runner', 'home-gym'
  ],
  lifestyle: [
    'pour-over-coffee', 'open-book', 'wooden-table-lamp', 'indoor-plants', 'monstera-leaf', 'succulent-pot',
    'linen-bedding', 'scented-candle', 'wrist-watch', 'eyeglasses-book', 'ceramic-mug', 'rainy-window',
    'autumn-leaves', 'morning-sunlight', 'wooden-shelf', 'vinyl-player', 'bicycle-basket', 'park-bench',
    'picnic-blanket', 'tea-ceremony', 'fountain-journal', 'minimal-bedroom', 'clean-kitchen', 'hammock', 'cozy-sweater'
  ],
};

const TARGET_TOTAL_NEW = 8500;

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const tasks = [];
  for (const [cat, queries] of Object.entries(EXTRA_QUERIES)) {
    if (!pool[cat]) pool[cat] = [];
    for (const q of queries) tasks.push({ cat, q });
  }

  let taskIdx = 0;
  const CONCURRENCY = 6;

  async function worker(workerId) {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width: 1440, height: 900 });

    while (taskIdx < tasks.length && currentNew < TARGET_TOTAL_NEW) {
      const { cat, q } = tasks[taskIdx++];
      try {
        await page.goto(`https://unsplash.com/s/photos/${q}`, {
          waitUntil: 'domcontentloaded',
          timeout: 18000,
        });
        for (let s = 0; s < 3; s++) {
          await page.evaluate(() => window.scrollBy(0, 1800));
          await new Promise((r) => setTimeout(r, 500));
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
            currentNew++;
          }
        }
        if (taskIdx % 25 === 0) {
          console.log(`[worker ${workerId}] ${taskIdx}/${tasks.length} | total new unique images: ${currentNew}`);
        }
      } catch {
        // skip timeout
      }
    }
    await page.close();
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)));
  await browser.close();

  fs.writeFileSync(poolPath, JSON.stringify(pool), 'utf8');
  console.log(`\nDone! Pool now has ${currentNew} unique Unsplash images across 18 niches.`);
}

run();

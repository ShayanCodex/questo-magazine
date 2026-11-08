import puppeteer from 'puppeteer';
import path from 'node:path';

const artifactsDir = 'C:\\Users\\ABDUL RAFAY HUSSAIN\\.gemini\\antigravity\\brain\\ddc31c1b-7da6-4c40-9778-803bac830e75';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 2 });

  // 1. Articles archive with advanced search & filter bar
  console.log('Capturing Articles archive with advanced search...');
  await page.goto('http://localhost:4173/articles', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-articles-search-bar.png'),
    fullPage: false,
  });

  // 2. Open Search Modal
  console.log('Opening and capturing search modal...');
  // Click the search button in the header
  const searchBtn = await page.$('button[aria-label="Search"]');
  if (searchBtn) {
    await searchBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    // Type a query
    await page.keyboard.type('art');
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(artifactsDir, 'screenshot-search-modal-active.png'),
    });
  }

  // 3. Urdu RTL Home
  console.log('Capturing Urdu RTL Home...');
  await page.goto('http://localhost:4173/ur', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-urdu-home-rtl.png'),
    fullPage: false,
  });

  // 4. Arabic RTL Article
  console.log('Capturing Arabic RTL Article...');
  await page.goto('http://localhost:4173/ar/articles/the-death-of-the-card-grid', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-arabic-media-rtl.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

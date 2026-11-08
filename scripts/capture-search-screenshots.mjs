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

  // 1. Articles archive with themed search bar
  console.log('Capturing Articles archive with themed search bar...');
  await page.goto('http://localhost:4173/articles', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-articles-themed-search.png'),
    fullPage: false,
  });

  // 2. Open Search Modal to verify landscape scrollbar is completely removed
  console.log('Opening and capturing search modal...');
  const searchBtn = await page.$('button[aria-label="Search"]');
  if (searchBtn) {
    await searchBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(artifactsDir, 'screenshot-search-modal-fixed.png'),
    });
  }

  // 3. Home page with new sections (FAQ, Disciplines, Manifesto, Dispatch)
  console.log('Capturing Home page with new editorial components...');
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-home-new-components.png'),
    fullPage: true,
  });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

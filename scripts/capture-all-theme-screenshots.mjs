/* global document, window, localStorage */
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

  // 1. Start in Light Mode
  console.log('Loading page in Light Mode...');
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });

  // Ensure Light Mode first
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if (isDark) {
    const toggle = await page.$('header button[title*="theme"], header button[aria-label*="theme"]');
    if (toggle) {
      await toggle.click();
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  // 1. Capture Light Mode Home (Top with Masthead and News Ticker)
  console.log('Capturing Light Mode Home (News Ticker)...');
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-theme-light-home.png'),
  });

  // 2. Scroll to Manifesto specifically in Light Mode
  console.log('Capturing Light Mode Manifesto...');
  await page.evaluate(() => {
    const manifesto = document.querySelector('blockquote');
    if (manifesto) {
      manifesto.scrollIntoView({ block: 'center' });
    }
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-theme-light-manifesto.png'),
  });

  // 3. Scroll to Dispatch in Light Mode
  console.log('Capturing Light Mode Dispatch...');
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-theme-light-bottom.png'),
  });

  // 4. Capture Articles in Light Mode
  console.log('Capturing Articles archive in Light Mode...');
  await page.goto('http://localhost:4173/articles', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-theme-light-articles.png'),
  });

  // 5. Capture Article detail in Light Mode
  console.log('Capturing Article detail in Light Mode...');
  await page.goto('http://localhost:4173/articles/the-death-of-the-card-grid', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-theme-light-article-detail.png'),
  });

  await browser.close();
  console.log('All additional light theme screenshots captured successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

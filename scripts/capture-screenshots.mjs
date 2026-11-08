import puppeteer from 'puppeteer-core';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\ABDUL RAFAY HUSSAIN\\.gemini\\antigravity\\brain\\ddc31c1b-7da6-4c40-9778-803bac830e75';

async function run() {
  console.log('Launching browser via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // 1. Home desktop light
  console.log('Capturing: Home desktop light...');
  await page.setViewport({ width: 1280, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(artifactDir, 'screenshot-home-desktop-light.png') });

  // 2. Home mobile dark
  console.log('Capturing: Home mobile dark...');
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(artifactDir, 'screenshot-home-mobile-dark.png') });

  // 3. Articles list desktop light
  console.log('Capturing: Articles list desktop light...');
  await page.setViewport({ width: 1280, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await page.goto('http://localhost:4173/articles', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(artifactDir, 'screenshot-articles-desktop-light.png') });

  // 4. Article desktop light
  console.log('Capturing: Article desktop light...');
  await page.goto('http://localhost:4173/articles/the-death-of-the-card-grid', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(artifactDir, 'screenshot-article-desktop-light.png') });

  // 5. Arabic article desktop (RTL)
  console.log('Capturing: Arabic article RTL desktop...');
  await page.goto('http://localhost:4173/ar/articles/the-death-of-the-card-grid', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(artifactDir, 'screenshot-arabic-article-desktop.png') });

  // 6. Arabic Drawer open (RTL)
  console.log('Capturing: Arabic Drawer open...');
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle0' });
  const arMenuBtn = await page.$('header button');
  if (arMenuBtn) {
    await arMenuBtn.click();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(artifactDir, 'screenshot-arabic-drawer.png') });
  }

  await browser.close();
  console.log('✅ All clean URL screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});

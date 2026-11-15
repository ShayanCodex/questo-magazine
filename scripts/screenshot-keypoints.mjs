/* global document */
import puppeteer from 'puppeteer';
import path from 'path';

const artifactsDir = 'C:\\Users\\ABDUL RAFAY HUSSAIN\\.gemini\\antigravity\\brain\\ddc31c1b-7da6-4c40-9778-803bac830e75';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173/articles/architecture-of-transformer-attention-mathematics-and-kv-cache', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const el = document.querySelector('section[aria-label="Key Points"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(artifactsDir, 'verify-key-points-bullet-section.png'),
    fullPage: false
  });
  console.log('✓ Captured verify-key-points-bullet-section.png');

  // Mobile viewport
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  await page.evaluate(() => {
    const el = document.querySelector('section[aria-label="Key Points"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(artifactsDir, 'verify-key-points-mobile.png'),
    fullPage: false
  });
  console.log('✓ Captured verify-key-points-mobile.png');
  await browser.close();
})();

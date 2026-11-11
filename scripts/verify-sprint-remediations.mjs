/* global document, window, localStorage */
import puppeteer from 'puppeteer-core';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\ABDUL RAFAY HUSSAIN\\.gemini\\antigravity\\brain\\ddc31c1b-7da6-4c40-9778-803bac830e75';

async function run() {
  console.log('Launching browser to verify Sprint remediations...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  // 1. Article Page with Giscus Comments Section
  console.log('Capturing: Article page with Giscus comments section...');
  await page.goto('http://localhost:4173/articles/the-geometry-of-silence', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('questo-theme', 'dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'verify-giscus-comments-dark.png') });

  // 2. Privacy Policy Page
  console.log('Capturing: Privacy Policy page...');
  await page.goto('http://localhost:4173/privacy', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'verify-privacy-policy-dark.png') });

  // 3. Footer with Legal and RSS Links
  console.log('Capturing: Footer with Privacy & RSS links...');
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'verify-footer-legal-rss-links.png') });

  await browser.close();
  console.log('✅ Sprint verification screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Error capturing sprint screenshots:', err);
  process.exit(1);
});

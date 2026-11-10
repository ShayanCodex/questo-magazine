/* global document, window, localStorage */
import puppeteer from 'puppeteer-core';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\ABDUL RAFAY HUSSAIN\\.gemini\\antigravity\\brain\\ddc31c1b-7da6-4c40-9778-803bac830e75';

async function run() {
  console.log('Launching browser to verify UI improvements...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // 1. Article Page - Desktop Dark Theme
  console.log('Capturing: Article page desktop dark theme...');
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto('http://localhost:5173/articles/the-geometry-of-silence', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('questo-theme', 'dark');
  });
  // Scroll down a bit to see the takeaways and sticky heading bar clearly
  await page.evaluate(() => window.scrollBy(0, 500));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'verify-article-takeaways-headingbar-dark.png') });

  // 2. Article Page - Light Theme
  console.log('Capturing: Article page desktop light theme...');
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('questo-theme', 'light');
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'verify-article-takeaways-headingbar-light.png') });

  // 3. Article Page - Mobile Dark Theme
  console.log('Capturing: Article page mobile dark theme...');
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('questo-theme', 'dark');
    window.scrollTo(0, 480);
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, 'verify-article-mobile-headingbar-dark.png') });

  // 4. Test clicking a heading pill to verify smooth scroll jump
  console.log('Testing click on heading pill...');
  const secondPill = await page.$('nav[aria-label="Article section jump bar"] button:nth-child(2)');
  if (secondPill) {
    await secondPill.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(artifactDir, 'verify-article-after-jump-click.png') });
  }

  // 5. Home Page - Desktop Dark Theme
  console.log('Capturing: Home page with Heroicon arrows and Poppins...');
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('questo-theme', 'dark');
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(artifactDir, 'verify-home-desktop-hero-dark.png') });

  // 6. Home Page Disciplines section
  console.log('Capturing: Home page disciplines section...');
  await page.evaluate(() => {
    window.scrollTo(0, 1000);
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'verify-home-disciplines-arrows.png') });

  // 7. Categories Page
  console.log('Capturing: Categories page with Heroicon arrow...');
  await page.goto('http://localhost:5173/categories', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'verify-categories-page.png') });

  await browser.close();
  console.log('✅ UI verification screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});


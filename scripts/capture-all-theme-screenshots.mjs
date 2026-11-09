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
  console.log('Loading page...');
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

  // 1. Capture Light Mode Home
  console.log('Capturing Light Mode Home...');
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-theme-light-home.png'),
  });

  // 2. Open Search Modal in Light Mode and hover card
  console.log('Opening Search Modal in Light Mode...');
  const searchBtnLight = await page.$('button[aria-label="Search"]');
  if (searchBtnLight) {
    await searchBtnLight.click();
    await new Promise((r) => setTimeout(r, 400));

    const cards = await page.$$('[role="button"][tabindex="0"]');
    if (cards.length > 1) {
      await cards[1].hover();
      await new Promise((r) => setTimeout(r, 300));
    }
    await page.screenshot({
      path: path.join(artifactsDir, 'screenshot-theme-light-search-modal-hovered.png'),
    });

    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));
  }

  // 3. Click Theme Toggle to switch to Dark Mode!
  console.log('Clicking Theme Toggle to switch to Dark Mode...');
  const toggleToDark = await page.$('header button[title*="theme"], header button[aria-label*="theme"]');
  if (toggleToDark) {
    await toggleToDark.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  // 4. Capture Dark Mode Home
  console.log('Capturing Dark Mode Home...');
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-theme-dark-home.png'),
  });

  // 5. Open Search Modal in Dark Mode and hover card
  console.log('Opening Search Modal in Dark Mode...');
  const searchBtnDark = await page.$('button[aria-label="Search"]');
  if (searchBtnDark) {
    await searchBtnDark.click();
    await new Promise((r) => setTimeout(r, 400));

    const cardsDark = await page.$$('[role="button"][tabindex="0"]');
    if (cardsDark.length > 1) {
      await cardsDark[1].hover();
      await new Promise((r) => setTimeout(r, 300));
    }
    await page.screenshot({
      path: path.join(artifactsDir, 'screenshot-theme-dark-search-modal-hovered.png'),
    });

    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));
  }

  // 6. Navigate to Articles in Dark Mode
  console.log('Capturing Articles archive in Dark Mode...');
  await page.goto('http://localhost:4173/articles', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-theme-dark-articles.png'),
  });

  await browser.close();
  console.log('All light and dark screenshots captured successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

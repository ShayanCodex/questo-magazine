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

  // Emulate OS dark mode to prove the site stays in pure white theme regardless of OS setting
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);

  // 1. Capture Home page in White Theme
  console.log('Capturing Home Page in White Theme (under OS dark mode emulation)...');
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-white-theme-home.png'),
    fullPage: false,
  });

  // 2. Open Search Modal in White Theme
  console.log('Opening Search Modal...');
  const searchBtn = await page.$('button[aria-label="Search"]');
  if (searchBtn) {
    await searchBtn.click();
    await new Promise((r) => setTimeout(r, 400));

    // Capture modal default state
    await page.screenshot({
      path: path.join(artifactsDir, 'screenshot-white-theme-search-modal.png'),
    });

    // 3. Hover over the second result card ("The geometry of silence")
    console.log('Hovering over second card to verify NO hover border...');
    const cards = await page.$$('[role="button"][tabindex="0"]');
    if (cards.length > 1) {
      await cards[1].hover();
      await new Promise((r) => setTimeout(r, 300));
      await page.screenshot({
        path: path.join(artifactsDir, 'screenshot-white-theme-search-modal-hovered.png'),
      });
    }
  }

  // 4. Capture Articles page
  console.log('Capturing Articles archive in White Theme...');
  await page.goto('http://localhost:4173/articles', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-white-theme-articles.png'),
  });

  await browser.close();
  console.log('Verification screenshots captured successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

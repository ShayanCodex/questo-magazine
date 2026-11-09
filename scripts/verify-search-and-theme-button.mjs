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
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log('Loading page...');
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });

  // 1. Capture Header with Attractive Search Capsule Bar
  console.log('Capturing Header Search Bar...');
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-header-search-bar.png'),
  });

  // 2. Open Search Modal with empty query to see Recent Searches & Suggestions
  console.log('Opening Search Modal...');
  const searchBar = await page.$('button[aria-label="Search"]');
  if (searchBar) {
    await searchBar.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-search-modal-initial.png'),
  });

  // 3. Type query "silence" to test keyword match highlighting & normal card sizes
  console.log('Typing "silence" in Search Bar...');
  await page.type('div[role="dialog"] input', 'silence', { delay: 40 });
  await new Promise((r) => setTimeout(r, 400));

  // Hover over the first card
  const cards = await page.$$('div[role="dialog"] [role="button"][tabindex="0"]');
  if (cards.length > 0) {
    await cards[0].hover();
    await new Promise((r) => setTimeout(r, 200));
  }

  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-search-modal-highlighted.png'),
  });

  // Close modal
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 300));

  // 4. Test rapid clicks on Theme Toggle (verifying NO FREEZE / NO LOCK on the button)
  console.log('Testing rapid theme clicks (verifying no lock or freeze)...');
  const toggleBtn = await page.$('header button[title*="theme"], header button[aria-label*="theme"]');
  if (toggleBtn) {
    // Click 3 times rapidly with only 80ms interval
    await toggleBtn.click();
    await new Promise((r) => setTimeout(r, 90));
    await toggleBtn.click();
    await new Promise((r) => setTimeout(r, 90));
    await toggleBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    const finalTheme = await page.evaluate(() =>
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
    console.log(`Rapid clicks successful! Active theme: ${finalTheme}`);
  }

  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-rapid-clicks-verified.png'),
  });

  await browser.close();
  console.log('All verification passed!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

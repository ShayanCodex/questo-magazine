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

  console.log('Loading site in Light Mode...');
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });

  // Ensure Light Mode first
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  if (isDark) {
    const toggle = await page.$('header button[title*="theme"], header button[aria-label*="theme"]');
    if (toggle) {
      await toggle.click();
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  // 1. Snapshot Before Transition (Light Mode)
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-transition-1-before-light.png'),
  });

  // 2. Trigger Theme Toggle to Dark and capture MID-ANIMATION expanding from top-left corner
  console.log('Triggering Theme Toggle to Dark...');
  const toggleBtn = await page.$('header button[title*="theme"], header button[aria-label*="theme"]');
  if (toggleBtn) {
    // Click toggle
    await toggleBtn.click();
    // Wait ~280ms into the 700ms animation so the circle is actively expanding across the screen from (0, 0)
    await new Promise((r) => setTimeout(r, 280));
    await page.screenshot({
      path: path.join(artifactsDir, 'screenshot-transition-2-midway-dark-growing.png'),
    });

    // Wait until transition completes (remaining 500ms + buffer)
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(artifactsDir, 'screenshot-transition-3-complete-dark.png'),
    });
  }

  // 3. Trigger Theme Toggle back to Light and capture MID-ANIMATION expanding from top-left corner
  console.log('Triggering Theme Toggle back to Light...');
  const toggleBtnBack = await page.$('header button[title*="theme"], header button[aria-label*="theme"]');
  if (toggleBtnBack) {
    await toggleBtnBack.click();
    await new Promise((r) => setTimeout(r, 280));
    await page.screenshot({
      path: path.join(artifactsDir, 'screenshot-transition-4-midway-light-growing.png'),
    });

    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(artifactsDir, 'screenshot-transition-5-complete-light.png'),
    });
  }

  await browser.close();
  console.log('Circular transition verification screenshots captured successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

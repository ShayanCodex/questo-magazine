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

  // 1. Open Search Modal
  console.log('Opening Search Modal...');
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
  const searchBtn = await page.$('button[aria-label="Search"]');
  if (searchBtn) {
    await searchBtn.click();
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(artifactsDir, 'screenshot-search-modal-slider-initial.png'),
    });

    // 2. Click the right arrow slider button to slide topics
    console.log('Clicking the right arrow slider button...');
    const slideRightBtn = await page.$('button[aria-label="Slide topics right"]');
    if (slideRightBtn) {
      await slideRightBtn.click();
      await new Promise((r) => setTimeout(r, 500));
      await page.screenshot({
        path: path.join(artifactsDir, 'screenshot-search-modal-slider-slid.png'),
      });
    }
  }

  // 3. Articles archive page with topic arrow slider
  console.log('Capturing Articles archive page topic arrow slider...');
  await page.goto('http://localhost:4173/articles', { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(artifactsDir, 'screenshot-articles-arrow-slider.png'),
  });

  await browser.close();
  console.log('All slider screenshots captured successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

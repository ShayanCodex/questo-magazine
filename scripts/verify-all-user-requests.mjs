/* global document, window */
import puppeteer from 'puppeteer';
import path from 'path';

const artifactsDir = 'C:\\Users\\ABDUL RAFAY HUSSAIN\\.gemini\\antigravity\\brain\\ddc31c1b-7da6-4c40-9778-803bac830e75';
const baseUrl = 'http://localhost:4173';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Articles Page: Horizontal Category Slider with Left/Right Arrows
  console.log('1. Navigating to /articles to capture Category Filter Slider...');
  await page.goto(`${baseUrl}/articles`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const el = document.querySelector('.group\\/cat-bar');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(artifactsDir, 'verify-articles-filter-slider.png'),
    clip: { x: 100, y: 250, width: 1240, height: 260 }
  });
  console.log('✓ Captured verify-articles-filter-slider.png');

  // 2. Universal Search Modal: NO tags, shows universal multi-type results
  console.log('2. Opening Universal Search Modal...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));
  await page.keyboard.down('Control');
  await page.keyboard.press('k');
  await page.keyboard.up('Control');
  await new Promise(r => setTimeout(r, 1500));

  // Type a query that yields mixed universal results: "market", "AI", or empty recommended state
  await page.screenshot({
    path: path.join(artifactsDir, 'verify-universal-search-no-tags.png'),
    clip: { x: 300, y: 150, width: 840, height: 600 }
  });
  console.log('✓ Captured verify-universal-search-no-tags.png');

  // Also capture with query "bitcoin" or "AI"
  await page.keyboard.type('intelligence', { delay: 50 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(artifactsDir, 'verify-universal-search-query-results.png'),
    clip: { x: 300, y: 150, width: 840, height: 600 }
  });
  console.log('✓ Captured verify-universal-search-query-results.png');

  // Close search modal
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // 3. Spanish Article: NO [es] prefix, Full Native Spanish Translation
  console.log('3. Navigating to Spanish article to verify translation...');
  await page.goto(`${baseUrl}/es/articles/architecture-of-transformer-attention-mathematics-and-kv-cache`, {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to section 5 takeaways (the one from user screenshot)
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const target = headings.find(h => h.textContent && (h.textContent.includes('5.') || h.textContent.includes('Síntesis') || h.textContent.includes('Synthesis')));
    if (target) {
      target.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(artifactsDir, 'verify-spanish-article-no-es-prefix.png'),
    fullPage: false
  });
  console.log('✓ Captured verify-spanish-article-no-es-prefix.png');

  // 4. Articles Catalog 50 Articles
  console.log('4. Navigating to /articles catalog to verify 50 articles...');
  await page.goto(`${baseUrl}/articles`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(artifactsDir, 'verify-50-articles-pagination.png'),
    fullPage: false
  });
  console.log('✓ Captured verify-50-articles-pagination.png');

  await browser.close();
  console.log('All verification captures completed successfully!');
})();

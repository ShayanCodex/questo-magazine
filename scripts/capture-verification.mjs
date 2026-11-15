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

  // 1. Transformer Attention Hero (AI Image)
  console.log('Navigating to Transformer Attention article...');
  await page.goto(`${baseUrl}/articles/architecture-of-transformer-attention-mathematics-and-kv-cache`, {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: path.join(artifactsDir, 'verify-transformer-ai-image.png'),
    clip: { x: 0, y: 0, width: 1440, height: 850 }
  });
  console.log('✓ Captured verify-transformer-ai-image.png');

  // 2. Key Points bullet section (Clean, no card background)
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

  // 3. Articles catalog with 45 articles and pagination
  console.log('Navigating to Articles catalog...');
  await page.goto(`${baseUrl}/articles`, {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(artifactsDir, 'verify-articles-catalog-45.png'),
    fullPage: false
  });
  console.log('✓ Captured verify-articles-catalog-45.png');

  // 4. Batch 5 New LLM Training Article
  console.log('Navigating to new LLM training article...');
  await page.goto(`${baseUrl}/articles/training-large-language-models-tokenization-pretraining-alignment`, {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: path.join(artifactsDir, 'verify-new-llm-article.png'),
    clip: { x: 0, y: 0, width: 1440, height: 850 }
  });
  console.log('✓ Captured verify-new-llm-article.png');

  await browser.close();
  console.log('All verification screenshots captured successfully!');
})();

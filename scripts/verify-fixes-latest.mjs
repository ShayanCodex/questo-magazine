import puppeteer from 'puppeteer';
import path from 'path';

const artifactsDir = 'C:\\Users\\ABDUL RAFAY HUSSAIN\\.gemini\\antigravity\\brain\\ddc31c1b-7da6-4c40-9778-803bac830e75';
const baseUrl = 'http://localhost:5173';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Category Detail Page with In-Page Search Bar (like user's screenshot)
  console.log('Navigating to Category Detail (/categories/sports)...');
  await page.goto(`${baseUrl}/categories/sports`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(artifactsDir, 'verify-category-detail-searchbar.png'),
    clip: { x: 0, y: 0, width: 1440, height: 850 }
  });
  console.log('✓ Captured verify-category-detail-searchbar.png');

  // 2. Categories Index Page with Search Bar & Direct Card Links
  console.log('Navigating to Categories Index (/categories)...');
  await page.goto(`${baseUrl}/categories`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(artifactsDir, 'verify-categories-index-searchbar.png'),
    clip: { x: 0, y: 0, width: 1440, height: 850 }
  });
  console.log('✓ Captured verify-categories-index-searchbar.png');

  // 3. E-books page with Progressive Lazy Loaded Cards
  console.log('Navigating to E-books (/ebooks)...');
  await page.goto(`${baseUrl}/ebooks`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(artifactsDir, 'verify-ebooks-lazy-loaded-cards.png'),
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });
  console.log('✓ Captured verify-ebooks-lazy-loaded-cards.png');

  // 4. Microsoft Outlook Server Crash Report Article
  console.log('Navigating to Microsoft Outlook Crash Article...');
  await page.goto(`${baseUrl}/articles/microsoft-outlook-global-outage-exchange-infrastructure-crash`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(artifactsDir, 'verify-ms-outlook-crash-report.png'),
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });
  console.log('✓ Captured verify-ms-outlook-crash-report.png');

  await browser.close();
  console.log('All verification captures completed successfully.');
})();

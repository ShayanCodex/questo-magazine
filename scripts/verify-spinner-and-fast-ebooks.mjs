import puppeteer from 'puppeteer';
import path from 'path';

const artifactsDir = 'C:\\Users\\ABDUL RAFAY HUSSAIN\\.gemini\\antigravity\\brain\\ddc31c1b-7da6-4c40-9778-803bac830e75';
const baseUrl = 'http://localhost:5173';

(async () => {
  console.log('Launching headless browser for verification...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Verify E-books catalog page
  console.log('1. Navigating to /ebooks...');
  const t0 = Date.now();
  await page.goto(`${baseUrl}/ebooks`, { waitUntil: 'networkidle2', timeout: 30000 });
  const loadTime = Date.now() - t0;
  console.log(`✓ /ebooks loaded in ${loadTime}ms`);

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(artifactsDir, 'verify-fast-ebooks-catalog.png'),
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });
  console.log('✓ Captured verify-fast-ebooks-catalog.png');

  // 2. Verify E-Book Detail Page with Local PDF
  console.log('2. Navigating to /ebooks/meditations...');
  await page.goto(`${baseUrl}/ebooks/meditations`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(artifactsDir, 'verify-ebook-detail-local-pdf.png'),
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });
  console.log('✓ Captured verify-ebook-detail-local-pdf.png');

  // 3. Verify Article Detail Page (Microsoft Outlook crash article with spinning loader & hero)
  console.log('3. Navigating to article detail page...');
  await page.goto(`${baseUrl}/articles/microsoft-outlook-global-outage-exchange-infrastructure-crash`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(artifactsDir, 'verify-article-hero-and-body.png'),
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });
  console.log('✓ Captured verify-article-hero-and-body.png');

  // 4. Test direct PDF server response
  console.log('4. Testing local PDF endpoint /books/meditations.pdf...');
  const pdfResponse = await page.goto(`${baseUrl}/books/meditations.pdf`);
  console.log(`✓ /books/meditations.pdf returned HTTP status: ${pdfResponse.status()}`);

  await browser.close();
  console.log('All visual verification captures complete!');
})();

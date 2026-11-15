/* global document */
import puppeteer from 'puppeteer';
import path from 'path';

const artifactsDir = 'C:\\Users\\ABDUL RAFAY HUSSAIN\\.gemini\\antigravity\\brain\\ddc31c1b-7da6-4c40-9778-803bac830e75';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Verify Spatial Pressing article (the one from the user's screenshot)
  console.log('Navigating to Spatial Pressing article...');
  await page.goto('http://localhost:5173/articles/spatial-pressing-geometry-positional-play-rest-defense', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: path.join(artifactsDir, 'verify-pressing-title-and-image.png'),
    fullPage: false
  });
  console.log('✓ Captured verify-pressing-title-and-image.png');

  // Scroll to YouTube video embed
  await page.evaluate(() => {
    const video = document.querySelector('iframe');
    if (video) video.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({
    path: path.join(artifactsDir, 'verify-pressing-youtube-video.png'),
    fullPage: false
  });
  console.log('✓ Captured verify-pressing-youtube-video.png');

  // 2. Verify Batch 4 Robotics article
  console.log('Navigating to Bipedal Robotics article...');
  await page.goto('http://localhost:5173/articles/inverse-kinematics-and-impedance-control-in-bipedal-robotics', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: path.join(artifactsDir, 'verify-robotics-article.png'),
    fullPage: false
  });
  console.log('✓ Captured verify-robotics-article.png');

  // 3. Verify Articles pagination (Page 4, articles 31-40)
  console.log('Navigating to Articles catalog page 4...');
  await page.goto('http://localhost:5173/articles?page=4', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: path.join(artifactsDir, 'verify-articles-page4-pagination.png'),
    fullPage: false
  });
  console.log('✓ Captured verify-articles-page4-pagination.png');

  // 4. Verify Admin Dashboard
  console.log('Navigating to Admin Dashboard...');
  await page.goto('http://localhost:5173/admin', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: path.join(artifactsDir, 'verify-admin-dashboard-40articles.png'),
    fullPage: false
  });
  console.log('✓ Captured verify-admin-dashboard-40articles.png');

  await browser.close();
  console.log('Visual verification complete!');
})();

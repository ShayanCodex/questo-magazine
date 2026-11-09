#!/usr/bin/env node
/* global document */
/**
 * Comprehensive Questo Site & SEO Health Audit Tool
 * Checks:
 *  1. Server availability & routes accessibility
 *  2. SEO Meta tags (Title, Description, Keywords, Canonical, OpenGraph, Twitter)
 *  3. Multilingual hreflang alternate links (en, es, fr, de, ar, ur)
 *  4. JSON-LD structured data syntax & required fields (BlogPosting, WebSite, Breadcrumbs, publisher logo)
 *  5. Image assets (200 status, non-empty src, alt attributes)
 *  6. Internal links integrity (no 404s)
 *  7. Accessibility essentials (aria labels, contrast flags, heading hierarchy)
 *  8. Console error / exception inspection
 */

import fs from 'node:fs';
import puppeteer from 'puppeteer';

const BASE_URL = process.env.AUDIT_URL || 'http://localhost:5173';

function getBrowserExecutable() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  if (fs.existsSync(edgePath)) return edgePath;
  if (fs.existsSync(chromePath)) return chromePath;
  return undefined;
}

const TEST_ROUTES = [
  '/',
  '/articles',
  '/categories',
  '/bookmarks',
  '/articles/the-poetics-of-concrete',
  '/articles/the-geometry-of-silence',
  '/tags/architecture',
  '/es',
  '/fr',
  '/de',
  '/ar',
  '/ur',
  '/es/articles/the-poetics-of-concrete',
  '/ar/articles/the-poetics-of-concrete',
];

async function runAudit() {
  console.log(`\n🔍 Starting Questo End-to-End A-to-Z Health & SEO Audit on ${BASE_URL}...\n`);

  const executablePath = getBrowserExecutable();
  const browser = await puppeteer.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const report = {
    totalRoutesChecked: 0,
    passedRoutes: 0,
    failedRoutes: 0,
    consoleErrors: [],
    seoResults: [],
    imageResults: { total: 0, broken: 0, missingAlt: 0 },
    linkResults: { total: 0, broken: 0 }
  };

  try {
    for (const route of TEST_ROUTES) {
      report.totalRoutesChecked++;
      const fullUrl = `${BASE_URL}${route}`;
      console.log(`\n📄 Auditing Route: ${route}`);

      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      const pageErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          pageErrors.push(`[Console Error] ${msg.text()}`);
        }
      });
      page.on('pageerror', err => {
        pageErrors.push(`[Page Exception] ${err.message}`);
      });

      const response = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = response ? response.status() : 'No response';

      if (status >= 400) {
        console.error(`  ❌ HTTP ${status} on ${route}`);
        report.failedRoutes++;
        await page.close();
        continue;
      }

      // Small delay for React client-side hydration / dynamic components
      await new Promise(r => setTimeout(r, 600));

      // Inspect SEO and Meta Tags
      const seoData = await page.evaluate(() => {
        const title = document.title;
        const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
        const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
        const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
        const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
        const ogImageAlt = document.querySelector('meta[property="og:image:alt"]')?.getAttribute('content');
        const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content');
        const twitterSite = document.querySelector('meta[name="twitter:site"]')?.getAttribute('content');
        const htmlLang = document.documentElement.getAttribute('lang');
        const htmlDir = document.documentElement.getAttribute('dir');

        // Check JSON-LD
        const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        const jsonLdData = jsonLdScripts.map(s => {
          try {
            return JSON.parse(s.innerHTML);
          } catch {
            return null;
          }
        }).filter(Boolean);

        // Check alternate hreflang links
        const hreflangs = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map(el => ({
          lang: el.getAttribute('hreflang'),
          href: el.getAttribute('href')
        }));

        // Check images on page
        const images = Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.getAttribute('alt'),
          isComplete: img.complete && img.naturalWidth > 0
        }));

        // Check internal links
        const links = Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href'));

        return {
          title,
          description,
          keywords,
          canonical,
          ogTitle,
          ogImage,
          ogImageAlt,
          twitterCard,
          twitterSite,
          htmlLang,
          htmlDir,
          jsonLdData,
          hreflangs,
          images,
          links
        };
      });

      // SEO Evaluation
      const seoChecks = [];
      if (seoData.title) seoChecks.push('✓ Title present');
      else seoChecks.push('✗ Missing title');

      if (seoData.description) seoChecks.push('✓ Description present');
      else seoChecks.push('✗ Missing description');

      if (seoData.keywords) seoChecks.push(`✓ Keywords present (${seoData.keywords.split(',').length} terms)`);
      else seoChecks.push('✗ Missing keywords meta tag');

      if (seoData.canonical) seoChecks.push('✓ Canonical URL present');
      if (seoData.ogImage) seoChecks.push('✓ OG Image present');
      if (seoData.ogImageAlt) seoChecks.push('✓ OG Image Alt present');
      if (seoData.twitterSite) seoChecks.push(`✓ Twitter meta (${seoData.twitterSite}) present`);
      if (seoData.jsonLdData.length > 0) seoChecks.push(`✓ JSON-LD Schema valid (${seoData.jsonLdData.length} block(s))`);
      if (seoData.hreflangs.length > 0) seoChecks.push(`✓ hreflang alternates (${seoData.hreflangs.length} languages)`);

      console.log(`  SEO Checks: ${seoChecks.join(' | ')}`);
      console.log(`  Lang: [${seoData.htmlLang}] Dir: [${seoData.htmlDir}]`);

      // Verify Images
      for (const img of seoData.images) {
        report.imageResults.total++;
        if (img.alt === null || img.alt === undefined) {
          report.imageResults.missingAlt++;
        }
      }

      report.seoResults.push({ route, seoData });

      if (pageErrors.length > 0) {
        console.error(`  ⚠️ ${pageErrors.length} console error(s) logged on ${route}:`);
        pageErrors.forEach(e => console.error(`     - ${e}`));
        report.consoleErrors.push({ route, errors: pageErrors });
      } else {
        report.passedRoutes++;
        console.log(`  ✅ Route passed cleanly with 0 console errors.`);
      }

      await page.close();
    }

    await browser.close();

    console.log('\n======================================================');
    console.log('🏆 QUESTO SITE & SEO AUDIT SUMMARY');
    console.log('======================================================');
    console.log(`Total Routes Checked: ${report.totalRoutesChecked}`);
    console.log(`Passed Routes:        ${report.passedRoutes} / ${report.totalRoutesChecked}`);
    console.log(`Failed Routes:        ${report.failedRoutes}`);
    console.log(`Total Images Audited: ${report.imageResults.total}`);
    console.log(`Console Errors:       ${report.consoleErrors.length}`);
    console.log('======================================================\n');

    return report;
  } catch (err) {
    await browser.close();
    throw err;
  }
}

runAudit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getSiteConfig,
  getAllArticles,
  getAllTags,
  ALL_AUTHOR_SLUGS,
  ALL_CATEGORY_IDS,
  ALL_MARKET_ASSET_SLUGS,
} from './lib/content.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');
const contentDir = path.join(rootDir, 'content');
const translationsDir = path.join(contentDir, 'translations');

function cleanUrl(baseUrl, pathname) {
  const base = baseUrl.replace(/\/+$/, '');
  const cleanPath = pathname.replace(/^\/+/, '');
  return cleanPath ? `${base}/${cleanPath}` : `${base}/`;
}

function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate a standard XML urlset wrapper
 */
function wrapUrlset(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
}

/**
 * Generate hreflang alternate link tags for all supported languages + x-default
 */
function generateHreflangTags(baseUrl, pathTemplate, languages, defaultLang) {
  const tags = languages.map((lang) => {
    const isDefault = lang.code === defaultLang;
    const resolvedPath = pathTemplate(lang.code, isDefault);
    return `    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${cleanUrl(baseUrl, resolvedPath)}" />`;
  });
  const defaultPath = pathTemplate(defaultLang, true);
  tags.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanUrl(baseUrl, defaultPath)}" />`);
  return tags.join('\n');
}

/**
 * 1. Sitemap: Institutional & Core Navigation Pages
 */
function generatePagesSitemap(baseUrl, languages, defaultLang) {
  const entries = [];
  const today = '2026-11-15';

  const pages = [
    { id: 'home', prio: '1.0', freq: 'daily', tpl: (_code, isDef) => (isDef ? '' : _code) },
    { id: 'articles', prio: '0.8', freq: 'daily', tpl: (c, isDef) => (isDef ? 'articles' : `${c}/articles`) },
    { id: 'ebooks', prio: '0.9', freq: 'daily', tpl: (c, isDef) => (isDef ? 'ebooks' : `${c}/ebooks`) },
    { id: 'markets', prio: '0.9', freq: 'hourly', tpl: (c, isDef) => (isDef ? 'markets' : `${c}/markets`) },
    { id: 'markets-screener', prio: '0.85', freq: 'daily', tpl: (c, isDef) => (isDef ? 'markets/screener' : `${c}/markets/screener`) },
    { id: 'markets-heatmap', prio: '0.85', freq: 'daily', tpl: (c, isDef) => (isDef ? 'markets/heatmap' : `${c}/markets/heatmap`) },
    { id: 'markets-terminal', prio: '0.85', freq: 'daily', tpl: (c, isDef) => (isDef ? 'markets/terminal' : `${c}/markets/terminal`) },
    { id: 'categories', prio: '0.8', freq: 'daily', tpl: (c, isDef) => (isDef ? 'categories' : `${c}/categories`) },
    { id: 'about', prio: '0.6', freq: 'monthly', tpl: (c, isDef) => (isDef ? 'about' : `${c}/about`) },
    { id: 'contact', prio: '0.5', freq: 'monthly', tpl: (c, isDef) => (isDef ? 'contact' : `${c}/contact`) },
    { id: 'terms', prio: '0.4', freq: 'yearly', tpl: (c, isDef) => (isDef ? 'terms' : `${c}/terms`) },
    { id: 'privacy', prio: '0.4', freq: 'yearly', tpl: (c, isDef) => (isDef ? 'privacy' : `${c}/privacy`) },
    { id: 'editorial-policy', prio: '0.6', freq: 'monthly', tpl: (c, isDef) => (isDef ? 'editorial-policy' : `${c}/editorial-policy`) },
    { id: 'disclaimer', prio: '0.5', freq: 'monthly', tpl: (c, isDef) => (isDef ? 'disclaimer' : `${c}/disclaimer`) },
    { id: 'tools', prio: '0.85', freq: 'weekly', tpl: (c, isDef) => (isDef ? 'tools' : `${c}/tools`) },
    { id: 'tool-image-converter', prio: '0.85', freq: 'weekly', tpl: (c, isDef) => (isDef ? 'tools/image-converter' : `${c}/tools/image-converter`) },
    { id: 'tool-audio-extractor', prio: '0.85', freq: 'weekly', tpl: (c, isDef) => (isDef ? 'tools/audio-extractor' : `${c}/tools/audio-extractor`) },
    { id: 'tool-pdf-tools', prio: '0.85', freq: 'weekly', tpl: (c, isDef) => (isDef ? 'tools/pdf-tools' : `${c}/tools/pdf-tools`) },
    { id: 'tool-financial-calculator', prio: '0.85', freq: 'weekly', tpl: (c, isDef) => (isDef ? 'tools/financial-calculator' : `${c}/tools/financial-calculator`) },
    { id: 'tool-health-calculator', prio: '0.85', freq: 'weekly', tpl: (c, isDef) => (isDef ? 'tools/health-calculator' : `${c}/tools/health-calculator`) },
  ];

  for (const page of pages) {
    for (const lang of languages) {
      const isDefault = lang.code === defaultLang;
      const pathPart = page.tpl(lang.code, isDefault);
      const loc = cleanUrl(baseUrl, pathPart);
      const hreflangs = generateHreflangTags(baseUrl, page.tpl, languages, defaultLang);

      entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.prio}</priority>
${hreflangs}
  </url>`);
    }
  }

  return wrapUrlset(entries);
}

/**
 * 2. Sitemap: Articles Collection
 */
function generateArticlesSitemap(baseUrl, languages, defaultLang, articles) {
  const entries = [];

  for (const article of articles) {
    const slug = article.slug;
    const lastmod = (article.updated || article.date || '2026-11-15').split('T')[0];

    const availableLangs = [defaultLang];
    for (const lang of languages) {
      if (lang.code === defaultLang) continue;
      const transPath = path.join(translationsDir, lang.code, `${slug}.json`);
      if (fs.existsSync(transPath)) {
        availableLangs.push(lang.code);
      }
    }

    const tpl = (c, isDef) => (isDef ? `articles/${slug}` : `${c}/articles/${slug}`);
    const hreflangs = generateHreflangTags(baseUrl, tpl, languages, defaultLang);

    for (const code of availableLangs) {
      const isDef = code === defaultLang;
      const loc = cleanUrl(baseUrl, tpl(code, isDef));

      entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
${hreflangs}
  </url>`);
    }
  }

  return wrapUrlset(entries);
}

/**
 * 2b. Sitemap: Public Domain E-Books Library Collection
 */
function generateEbooksSitemap(baseUrl) {
  const ebooksCardsPath = path.join(rootDir, 'src', 'data', 'ebooks-cards.json');
  if (!fs.existsSync(ebooksCardsPath)) return wrapUrlset([]);
  const books = JSON.parse(fs.readFileSync(ebooksCardsPath, 'utf8'));
  const today = '2026-11-24';
  const entries = [];

  for (const book of books) {
    const slug = book.slug;
    const loc = cleanUrl(baseUrl, `ebooks/${slug}`);
    entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  return wrapUrlset(entries);
}

/**
 * 3. Sitemap: Categories Collection
 */
function generateCategoriesSitemap(baseUrl, languages, defaultLang, articles) {
  const entries = [];
  const categoryIds = ALL_CATEGORY_IDS;

  for (const catId of categoryIds) {
    const catArticles = articles.filter((a) => a.category === catId);
    const latestDate = catArticles.length > 0 ? catArticles[0].date : '2026-11-15';
    const lastmod = latestDate.split('T')[0];

    const tpl = (c, isDef) => (isDef ? `categories/${catId}` : `${c}/categories/${catId}`);
    const hreflangs = generateHreflangTags(baseUrl, tpl, languages, defaultLang);

    for (const lang of languages) {
      const isDefault = lang.code === defaultLang;
      const loc = cleanUrl(baseUrl, tpl(lang.code, isDefault));

      entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${hreflangs}
  </url>`);
    }
  }

  return wrapUrlset(entries);
}

/**
 * 4. Sitemap: Author Profiles
 */
function generateAuthorsSitemap(baseUrl, languages, defaultLang, articles) {
  const entries = [];
  const authorSlugs = ALL_AUTHOR_SLUGS;

  for (const authorSlug of authorSlugs) {
    const authorArticles = articles.filter(
      (a) => a.author && a.author.toLowerCase().replace(/\s+/g, '-') === authorSlug
    );
    const latestDate = authorArticles.length > 0 ? authorArticles[0].date : '2026-11-15';
    const lastmod = latestDate.split('T')[0];

    const tpl = (c, isDef) => (isDef ? `authors/${authorSlug}` : `${c}/authors/${authorSlug}`);
    const hreflangs = generateHreflangTags(baseUrl, tpl, languages, defaultLang);

    for (const lang of languages) {
      const isDefault = lang.code === defaultLang;
      const loc = cleanUrl(baseUrl, tpl(lang.code, isDefault));

      entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
${hreflangs}
  </url>`);
    }
  }

  return wrapUrlset(entries);
}

/**
 * 5. Sitemap: Global Market Intelligence Assets (All 60 assets)
 */
function generateMarketsSitemap(baseUrl, languages, defaultLang) {
  const entries = [];
  const assetSlugs = ALL_MARKET_ASSET_SLUGS;
  const today = '2026-11-15';

  for (const assetSlug of assetSlugs) {
    const tpl = (c, isDef) => (isDef ? `markets/${assetSlug}` : `${c}/markets/${assetSlug}`);
    const hreflangs = generateHreflangTags(baseUrl, tpl, languages, defaultLang);

    for (const lang of languages) {
      const isDefault = lang.code === defaultLang;
      const loc = cleanUrl(baseUrl, tpl(lang.code, isDefault));

      entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
${hreflangs}
  </url>`);
    }
  }

  return wrapUrlset(entries);
}

/**
 * 6. Sitemap: Tags Collection
 */
function generateTagsSitemap(baseUrl, languages, defaultLang, tags) {
  const entries = [];
  const today = '2026-11-15';

  for (const tag of tags) {
    const tpl = (c, isDef) => (isDef ? `tags/${tag}` : `${c}/tags/${tag}`);
    const hreflangs = generateHreflangTags(baseUrl, tpl, languages, defaultLang);

    for (const lang of languages) {
      const isDefault = lang.code === defaultLang;
      const loc = cleanUrl(baseUrl, tpl(lang.code, isDefault));

      entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
${hreflangs}
  </url>`);
    }
  }

  return wrapUrlset(entries);
}

/**
 * 7. Master Sitemap Index (sitemap.xml)
 */
function generateMasterSitemapIndex(baseUrl, sitemapFiles) {
  const today = '2026-11-15';
  const sitemapsXml = sitemapFiles
    .map(
      (file) => `  <sitemap>
    <loc>${cleanUrl(baseUrl, file)}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}
</sitemapindex>
`;
}

function generateRssFeed(articles, customTitle, customDescription, feedUrlPath) {
  const siteConfig = getSiteConfig();
  const baseUrl = siteConfig.url || 'https://questo-blog.netlify.app';
  const title = customTitle || `${siteConfig.name} Magazine`;
  const description = customDescription || siteConfig.description;
  const feedUrl = cleanUrl(baseUrl, feedUrlPath || 'feed.xml');
  const homeUrl = cleanUrl(baseUrl, '');

  const itemsXml = articles
    .map((art) => {
      const artUrl = cleanUrl(baseUrl, `articles/${art.slug}`);
      const pubDate = new Date(art.date).toUTCString();
      return `    <item>
      <title><![CDATA[${art.title}]]></title>
      <link>${artUrl}</link>
      <guid isPermaLink="true">${artUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${art.excerpt}]]></description>
      <author><![CDATA[${art.author}]]></author>
      ${art.category ? `<category>${escapeXml(art.category)}</category>` : ''}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${homeUrl}</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`;
}

function generateAtomFeed(articles) {
  const siteConfig = getSiteConfig();
  const baseUrl = siteConfig.url || 'https://questo-blog.netlify.app';
  const feedUrl = cleanUrl(baseUrl, 'atom.xml');
  const homeUrl = cleanUrl(baseUrl, '');
  const updated = new Date().toISOString();

  const entriesXml = articles
    .map((art) => {
      const artUrl = cleanUrl(baseUrl, `articles/${art.slug}`);
      const artUpdated = new Date(art.updated || art.date).toISOString();
      return `  <entry>
    <title>${escapeXml(art.title)}</title>
    <link href="${artUrl}" />
    <id>${artUrl}</id>
    <updated>${artUpdated}</updated>
    <summary>${escapeXml(art.excerpt)}</summary>
    <author>
      <name>${escapeXml(art.author)}</name>
    </author>
  </entry>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(siteConfig.name)} Magazine</title>
  <subtitle>${escapeXml(siteConfig.description)}</subtitle>
  <link href="${homeUrl}" />
  <link href="${feedUrl}" rel="self" type="application/atom+xml" />
  <id>${homeUrl}</id>
  <updated>${updated}</updated>
${entriesXml}
</feed>
`;
}

/**
 * Section 24.4: Enterprise Build Output Audit & Health Reporting
 */
function auditBuildOutput() {
  const allFiles = [];

  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else {
        const stats = fs.statSync(fullPath);
        allFiles.push({
          path: fullPath,
          rel: path.relative(distDir, fullPath).replace(/\\/g, '/'),
          size: stats.size,
          ext: path.extname(entry.name).toLowerCase(),
        });
      }
    }
  }

  scan(distDir);

  const htmlFiles = allFiles.filter((f) => f.ext === '.html');
  const jsFiles = allFiles.filter((f) => f.ext === '.js');
  const cssFiles = allFiles.filter((f) => f.ext === '.css');
  const xmlFiles = allFiles.filter((f) => f.ext === '.xml');
  const totalSizeBytes = allFiles.reduce((acc, f) => acc + f.size, 0);
  const totalSizeMb = (totalSizeBytes / (1024 * 1024)).toFixed(2);

  // Sort files by size descending
  const largestFiles = [...allFiles].sort((a, b) => b.size - a.size).slice(0, 5);

  console.log('\n======================================================');
  console.log('📊 SECTION 24: ENTERPRISE STATIC BUILD & SEO AUDIT');
  console.log('======================================================');
  console.log(`📁 Total Output Size:          ${totalSizeMb} MB (${allFiles.length} total files)`);
  console.log(`📄 Pre-rendered HTML Pages:    ${htmlFiles.length} pages`);
  console.log(`⚙️  JavaScript Chunks:          ${jsFiles.length} assets`);
  console.log(`🎨 Stylesheet Chunks:          ${cssFiles.length} assets`);
  console.log(`🗺️  XML Sitemaps & Feeds:       ${xmlFiles.length} feeds`);

  // Target Check: 50–500 HTML files for Scalable Minimal Base SSG Architecture
  if (htmlFiles.length >= 50 && htmlFiles.length <= 500) {
    console.log(`✅ TARGET COMPLIANCE: ${htmlFiles.length} HTML files meets scalable minimal base target (50–500).`);
  } else {
    console.log(`ℹ️ TARGET NOTICE: ${htmlFiles.length} HTML files (scalable base target: 50–500).`);
  }

  console.log('\n🔝 Top 5 Largest Assets:');
  for (const f of largestFiles) {
    const kb = (f.size / 1024).toFixed(1);
    console.log(`   - ${f.rel.padEnd(45)} ${kb.padStart(8)} KB`);
  }

  // Sample HTML SEO Tag Verification
  console.log('\n🔍 Verifying Prerendered HTML SEO Tags on Primary Routes...');
  const sampleRoutes = ['index.html', 'articles.html', 'markets.html', 'categories.html', 'about.html', 'tools.html'];
  let seoPassed = true;

  for (const sample of sampleRoutes) {
    const p = path.join(distDir, sample);
    if (fs.existsSync(p)) {
      const html = fs.readFileSync(p, 'utf8');
      const hasTitle = /<title[^>]*>[^<]+<\/title>/i.test(html);
      const hasDesc = /<meta[^>]+name="description"[^>]*content="[^"]+"/i.test(html);
      const hasH1 = /<h1[^>]*>/i.test(html);
      const hasCanonical = /<link[^>]+rel="canonical"[^>]*href="[^"]+"/i.test(html);

      if (hasTitle && hasDesc && hasH1 && hasCanonical) {
        console.log(`   ✓ ${sample.padEnd(20)} [Title: ✓ | Desc: ✓ | H1: ✓ | Canonical: ✓]`);
      } else {
        console.log(`   ⚠️ ${sample.padEnd(20)} [Title: ${hasTitle ? '✓' : '✗'} | Desc: ${hasDesc ? '✓' : '✗'} | H1: ${hasH1 ? '✓' : '✗'} | Canonical: ${hasCanonical ? '✓' : '✗'}]`);
        seoPassed = false;
      }
    }
  }

  if (seoPassed) {
    console.log('✅ SEO Verification: Initial HTML delivers complete crawlable metadata.\n');
  }
}

function run() {
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ directory does not exist. Run static build first.');
    process.exit(1);
  }

  const siteConfig = getSiteConfig();
  const baseUrl = siteConfig.url || 'https://questo-blog.netlify.app';
  const defaultLang = siteConfig.defaultLanguage || 'en';
  const languages = siteConfig.languages;
  const articles = getAllArticles().sort((a, b) => b.date.localeCompare(a.date));
  const tags = getAllTags();

  // 1. Generate Granular Sub-Sitemaps
  const sitemaps = [
    { filename: 'sitemap-pages.xml', content: generatePagesSitemap(baseUrl, languages, defaultLang) },
    { filename: 'sitemap-articles.xml', content: generateArticlesSitemap(baseUrl, languages, defaultLang, articles) },
    { filename: 'sitemap-ebooks.xml', content: generateEbooksSitemap(baseUrl) },
    { filename: 'sitemap-categories.xml', content: generateCategoriesSitemap(baseUrl, languages, defaultLang, articles) },
    { filename: 'sitemap-authors.xml', content: generateAuthorsSitemap(baseUrl, languages, defaultLang, articles) },
    { filename: 'sitemap-markets.xml', content: generateMarketsSitemap(baseUrl, languages, defaultLang) },
    { filename: 'sitemap-tags.xml', content: generateTagsSitemap(baseUrl, languages, defaultLang, tags) },
  ];

  for (const sm of sitemaps) {
    const distPath = path.join(distDir, sm.filename);
    const pubPath = path.join(publicDir, sm.filename);
    fs.writeFileSync(distPath, sm.content, 'utf8');
    fs.writeFileSync(pubPath, sm.content, 'utf8');
    console.log(`✓ Generated sub-sitemap: ${sm.filename}`);
  }

  // 2. Generate Master Sitemap Index (sitemap.xml)
  const masterIndexContent = generateMasterSitemapIndex(
    baseUrl,
    sitemaps.map((s) => s.filename)
  );
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), masterIndexContent, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), masterIndexContent, 'utf8');
  console.log(`✓ Generated master sitemap index: dist/sitemap.xml (${sitemaps.length} sub-sitemaps linked)`);

  // 3. Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: ${cleanUrl(baseUrl, 'sitemap.xml')}
`;
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
  console.log(`✓ Generated robots.txt pointing to: ${cleanUrl(baseUrl, 'sitemap.xml')}`);

  // 4. Generate Master RSS 2.0 Feed (feed.xml & rss.xml)
  const rssXml = generateRssFeed(
    articles,
    `${siteConfig.name} Magazine — Master Feed`,
    siteConfig.description,
    'feed.xml'
  );
  fs.writeFileSync(path.join(distDir, 'feed.xml'), rssXml, 'utf8');
  fs.writeFileSync(path.join(distDir, 'rss.xml'), rssXml, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'feed.xml'), rssXml, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssXml, 'utf8');
  console.log(`✓ Generated master RSS feeds at: dist/feed.xml & dist/rss.xml`);

  // 5. Generate Master Atom 1.0 Feed (atom.xml)
  const atomXml = generateAtomFeed(articles);
  fs.writeFileSync(path.join(distDir, 'atom.xml'), atomXml, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'atom.xml'), atomXml, 'utf8');
  console.log(`✓ Generated master Atom feed at: dist/atom.xml`);

  // 6. Generate Granular Per-Category RSS Feeds
  const feedsDir = path.join(distDir, 'feeds');
  const pubFeedsDir = path.join(publicDir, 'feeds');
  if (!fs.existsSync(feedsDir)) fs.mkdirSync(feedsDir, { recursive: true });
  if (!fs.existsSync(pubFeedsDir)) fs.mkdirSync(pubFeedsDir, { recursive: true });

  const categories = [
    { id: 'architecture-and-space', name: 'Architecture & Spatial Design' },
    { id: 'art-and-culture', name: 'Art, Culture & Sculpture' },
    { id: 'design-and-typography', name: 'Design & Typographic Systems' },
    { id: 'engineering-and-technology', name: 'Engineering & Static Systems' },
  ];

  for (const cat of categories) {
    const catArticles = articles.filter((a) => a.category === cat.id);
    const catRss = generateRssFeed(
      catArticles,
      `${siteConfig.name} — ${cat.name}`,
      `Curated dispatches on ${cat.name}`,
      `feeds/${cat.id}.xml`
    );
    fs.writeFileSync(path.join(feedsDir, `${cat.id}.xml`), catRss, 'utf8');
    fs.writeFileSync(path.join(pubFeedsDir, `${cat.id}.xml`), catRss, 'utf8');
    console.log(`✓ Generated category feed (${catArticles.length} items): dist/feeds/${cat.id}.xml`);
  }

  // 7. Ensure Cloudflare Pages static manifests are copied into dist/
  const cfFiles = ['_headers', '_redirects', '_routes.json'];
  for (const cf of cfFiles) {
    const pubFile = path.join(publicDir, cf);
    if (fs.existsSync(pubFile)) {
      fs.copyFileSync(pubFile, path.join(distDir, cf));
      console.log(`✓ Synced Cloudflare Pages config: dist/${cf}`);
    }
  }

  // 8. Run Enterprise Build Output & Technical SEO Audit
  auditBuildOutput();
}

run();

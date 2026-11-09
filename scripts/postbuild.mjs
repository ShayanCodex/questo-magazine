import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getSiteConfig,
  getAllArticles,
  getAllTags
} from './lib/content.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const contentDir = path.join(rootDir, 'content');
const translationsDir = path.join(contentDir, 'translations');

function cleanUrl(baseUrl, pathname) {
  const base = baseUrl.replace(/\/+$/, '');
  const cleanPath = pathname.replace(/^\/+/, '');
  return cleanPath ? `${base}/${cleanPath}` : `${base}/`;
}

function generateSitemap() {
  const siteConfig = getSiteConfig();
  const baseUrl = siteConfig.url || 'https://questo-blog.netlify.app';
  const articles = getAllArticles();
  const tags = getAllTags();
  const languages = siteConfig.languages;
  const defaultLang = siteConfig.defaultLanguage || 'en';

  const today = new Date().toISOString().split('T')[0];

  const entries = [];

  // 1. Home page entries (available in all languages)
  for (const lang of languages) {
    const isDefault = lang.code === defaultLang;
    const pathPart = isDefault ? '' : `${lang.code}`;
    const loc = cleanUrl(baseUrl, pathPart);

    const alternates = languages.map(l => {
      const p = l.code === defaultLang ? '' : `${l.code}`;
      return `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${cleanUrl(baseUrl, p)}" />`;
    });
    alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanUrl(baseUrl, '')}" />`);

    entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
${alternates.join('\n')}
  </url>`);
  }

  // 2. Articles index page entries (available in all languages)
  for (const lang of languages) {
    const isDefault = lang.code === defaultLang;
    const pathPart = isDefault ? 'articles' : `${lang.code}/articles`;
    const loc = cleanUrl(baseUrl, pathPart);

    const alternates = languages.map(l => {
      const p = l.code === defaultLang ? 'articles' : `${l.code}/articles`;
      return `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${cleanUrl(baseUrl, p)}" />`;
    });
    alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanUrl(baseUrl, 'articles')}" />`);

    entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
${alternates.join('\n')}
  </url>`);
  }

  // 2b. Categories page entries (available in all languages)
  for (const lang of languages) {
    const isDefault = lang.code === defaultLang;
    const pathPart = isDefault ? 'categories' : `${lang.code}/categories`;
    const loc = cleanUrl(baseUrl, pathPart);

    const alternates = languages.map(l => {
      const p = l.code === defaultLang ? 'categories' : `${l.code}/categories`;
      return `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${cleanUrl(baseUrl, p)}" />`;
    });
    alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanUrl(baseUrl, 'categories')}" />`);

    entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
${alternates.join('\n')}
  </url>`);
  }

  // 3. Tags pages entries (available in all languages)
  for (const tag of tags) {
    for (const lang of languages) {
      const isDefault = lang.code === defaultLang;
      const pathPart = isDefault ? `tags/${tag}` : `${lang.code}/tags/${tag}`;
      const loc = cleanUrl(baseUrl, pathPart);

      const alternates = languages.map(l => {
        const p = l.code === defaultLang ? `tags/${tag}` : `${l.code}/tags/${tag}`;
        return `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${cleanUrl(baseUrl, p)}" />`;
      });
      alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanUrl(baseUrl, `tags/${tag}`)}" />`);

      entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
${alternates.join('\n')}
  </url>`);
    }
  }

  // 4. Articles entries (ONLY real versions included; untranslated fallbacks are omitted from sitemap)
  for (const article of articles) {
    const slug = article.slug;
    const lastmod = article.updated || article.date || today;

    // Determine available real languages for this article
    const availableLangs = [defaultLang];
    for (const lang of languages) {
      if (lang.code === defaultLang) continue;
      const transPath = path.join(translationsDir, lang.code, `${slug}.json`);
      if (fs.existsSync(transPath)) {
        availableLangs.push(lang.code);
      }
    }

    const alternates = availableLangs.map(code => {
      const p = code === defaultLang ? `articles/${slug}` : `${code}/articles/${slug}`;
      return `    <xhtml:link rel="alternate" hreflang="${code}" href="${cleanUrl(baseUrl, p)}" />`;
    });
    alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanUrl(baseUrl, `articles/${slug}`)}" />`);

    for (const code of availableLangs) {
      const p = code === defaultLang ? `articles/${slug}` : `${code}/articles/${slug}`;
      const loc = cleanUrl(baseUrl, p);

      entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
${alternates.join('\n')}
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

  return xml;
}

function run() {
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ directory does not exist. Run static build first.');
    process.exit(1);
  }

  const siteConfig = getSiteConfig();
  const baseUrl = siteConfig.url || 'https://questo-blog.netlify.app';

  // 1. Generate sitemap.xml
  const sitemapXml = generateSitemap();
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
  console.log(`✓ Generated sitemap at: ${path.relative(rootDir, sitemapPath)}`);

  // 2. Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${cleanUrl(baseUrl, 'sitemap.xml')}
`;
  const robotsPath = path.join(distDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
  console.log(`✓ Generated robots.txt at: ${path.relative(rootDir, robotsPath)}`);
  console.log('✅ Postbuild complete.\n');
}

run();


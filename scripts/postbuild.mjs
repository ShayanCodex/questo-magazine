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

function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
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

  // 2c. Privacy policy page entries (available in all languages)
  for (const lang of languages) {
    const isDefault = lang.code === defaultLang;
    const pathPart = isDefault ? 'privacy' : `${lang.code}/privacy`;
    const loc = cleanUrl(baseUrl, pathPart);

    const alternates = languages.map(l => {
      const p = l.code === defaultLang ? 'privacy' : `${l.code}/privacy`;
      return `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${cleanUrl(baseUrl, p)}" />`;
    });
    alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanUrl(baseUrl, 'privacy')}" />`);

    entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
${alternates.join('\n')}
  </url>`);
  }

  // 2d. About, Contact, Terms institutional pages
  const institutionalPages = ['about', 'contact', 'terms'];
  for (const pageName of institutionalPages) {
    for (const lang of languages) {
      const isDefault = lang.code === defaultLang;
      const pathPart = isDefault ? pageName : `${lang.code}/${pageName}`;
      const loc = cleanUrl(baseUrl, pathPart);

      const alternates = languages.map(l => {
        const p = l.code === defaultLang ? pageName : `${l.code}/${pageName}`;
        return `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${cleanUrl(baseUrl, p)}" />`;
      });
      alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanUrl(baseUrl, pageName)}" />`);

      entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
${alternates.join('\n')}
  </url>`);
    }
  }

  // 2e. Dedicated Category routes
  const categoryIds = [
    'architecture-and-space',
    'art-and-culture',
    'design-and-typography',
    'engineering-and-technology',
  ];
  for (const catId of categoryIds) {
    for (const lang of languages) {
      const isDefault = lang.code === defaultLang;
      const pathPart = isDefault ? `categories/${catId}` : `${lang.code}/categories/${catId}`;
      const loc = cleanUrl(baseUrl, pathPart);

      const alternates = languages.map(l => {
        const p = l.code === defaultLang ? `categories/${catId}` : `${l.code}/categories/${catId}`;
        return `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${cleanUrl(baseUrl, p)}" />`;
      });
      alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanUrl(baseUrl, `categories/${catId}`)}" />`);

      entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
${alternates.join('\n')}
  </url>`);
    }
  }

  // 2f. Dedicated Author profiles
  const authorSlugs = [
    'mateo-silva',
    'saskia-lindqvist',
    'julian-mercer',
    'tariq-mahmood',
    'elena-vance',
    'anne-hardy',
  ];
  for (const authorSlug of authorSlugs) {
    for (const lang of languages) {
      const isDefault = lang.code === defaultLang;
      const pathPart = isDefault ? `authors/${authorSlug}` : `${lang.code}/authors/${authorSlug}`;
      const loc = cleanUrl(baseUrl, pathPart);

      const alternates = languages.map(l => {
        const p = l.code === defaultLang ? `authors/${authorSlug}` : `${l.code}/authors/${authorSlug}`;
        return `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${cleanUrl(baseUrl, p)}" />`;
      });
      alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanUrl(baseUrl, `authors/${authorSlug}`)}" />`);

      entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
${alternates.join('\n')}
  </url>`);
    }
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

  // 4. Articles entries
  for (const article of articles) {
    const slug = article.slug;
    const lastmod = article.updated || article.date || today;

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

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
}

function generateRssFeed(articles, customTitle, customDescription, feedUrlPath) {
  const siteConfig = getSiteConfig();
  const baseUrl = siteConfig.url || 'https://questo-blog.netlify.app';
  const title = customTitle || `${siteConfig.name} Magazine`;
  const description = customDescription || siteConfig.description;
  const feedUrl = cleanUrl(baseUrl, feedUrlPath || 'feed.xml');
  const homeUrl = cleanUrl(baseUrl, '');

  const itemsXml = articles.map(art => {
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
  }).join('\n');

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

  const entriesXml = articles.map(art => {
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
  }).join('\n');

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

function run() {
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ directory does not exist. Run static build first.');
    process.exit(1);
  }

  const siteConfig = getSiteConfig();
  const baseUrl = siteConfig.url || 'https://questo-blog.netlify.app';
  const articles = getAllArticles().sort((a, b) => b.date.localeCompare(a.date));

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

  // 3. Generate Master RSS 2.0 Feed (feed.xml & rss.xml)
  const rssXml = generateRssFeed(articles, `${siteConfig.name} Magazine — Master Feed`, siteConfig.description, 'feed.xml');
  fs.writeFileSync(path.join(distDir, 'feed.xml'), rssXml, 'utf8');
  fs.writeFileSync(path.join(distDir, 'rss.xml'), rssXml, 'utf8');
  console.log(`✓ Generated master RSS feeds at: dist/feed.xml & dist/rss.xml`);

  // 4. Generate Master Atom 1.0 Feed (atom.xml)
  const atomXml = generateAtomFeed(articles);
  fs.writeFileSync(path.join(distDir, 'atom.xml'), atomXml, 'utf8');
  console.log(`✓ Generated master Atom feed at: dist/atom.xml`);

  // 5. Generate Granular Per-Category RSS Feeds
  const feedsDir = path.join(distDir, 'feeds');
  if (!fs.existsSync(feedsDir)) {
    fs.mkdirSync(feedsDir, { recursive: true });
  }

  const categories = [
    { id: 'architecture-and-space', name: 'Architecture & Spatial Design' },
    { id: 'art-and-culture', name: 'Art, Culture & Sculpture' },
    { id: 'design-and-typography', name: 'Design & Typographic Systems' },
    { id: 'engineering-and-technology', name: 'Engineering & Static Systems' },
  ];

  for (const cat of categories) {
    const catArticles = articles.filter(a => a.category === cat.id);
    const catRss = generateRssFeed(
      catArticles,
      `${siteConfig.name} — ${cat.name}`,
      `Curated dispatches on ${cat.name}`,
      `feeds/${cat.id}.xml`
    );
    const catPath = path.join(feedsDir, `${cat.id}.xml`);
    fs.writeFileSync(catPath, catRss, 'utf8');
    console.log(`✓ Generated category feed (${catArticles.length} items): dist/feeds/${cat.id}.xml`);
  }

  console.log('✅ Postbuild complete with RSS, Atom, and Category feeds.\n');
}

run();

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content', 'articles');
const publicDir = path.join(rootDir, 'public');
const sitemapsDir = path.join(publicDir, 'sitemaps');

const BASE_URL = 'https://questo-magazine.com';
const CHUNK_SIZE = 10000; // Strict adherence to Google guidelines (max 50,000)

export function generateSitemapShards() {
  console.log('--- Generating Dynamic Sitemap Shards ---');

  if (!fs.existsSync(contentDir)) {
    console.error('Content directory not found:', contentDir);
    return;
  }

  // Read all article JSON files
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} article(s) in repository.`);

  const slugs = files.map(f => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(contentDir, f), 'utf8'));
      return data.slug || f.replace('.json', '');
    } catch {
      return f.replace('.json', '');
    }
  });

  if (!fs.existsSync(sitemapsDir)) {
    fs.mkdirSync(sitemapsDir, { recursive: true });
  }

  const today = new Date().toISOString().split('T')[0];
  const totalChunks = Math.max(1, Math.ceil(slugs.length / CHUNK_SIZE));
  const shardNames = [];

  for (let i = 0; i < totalChunks; i++) {
    const chunkSlugs = slugs.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    const fileName = `sitemap-articles-${i + 1}.xml`;
    const filePath = path.join(sitemapsDir, fileName);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const slug of chunkSlugs) {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/article/${slug}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }
    xml += `</urlset>\n`;

    fs.writeFileSync(filePath, xml, 'utf8');
    shardNames.push(fileName);
  }

  console.log(`Generated ${shardNames.length} sharded sitemap(s) in public/sitemaps/`);

  // Build Master Root sitemap-index.xml
  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Include core static sitemaps if they exist in public/
  const staticSitemaps = ['sitemap-pages.xml', 'sitemap-categories.xml', 'sitemap-markets.xml', 'sitemap-authors.xml', 'sitemap-tags.xml'];
  for (const s of staticSitemaps) {
    if (fs.existsSync(path.join(publicDir, s))) {
      indexXml += `  <sitemap>\n`;
      indexXml += `    <loc>${BASE_URL}/${s}</loc>\n`;
      indexXml += `    <lastmod>${today}</lastmod>\n`;
      indexXml += `  </sitemap>\n`;
    }
  }

  // Include article shards
  for (const shard of shardNames) {
    indexXml += `  <sitemap>\n`;
    indexXml += `    <loc>${BASE_URL}/sitemaps/${shard}</loc>\n`;
    indexXml += `    <lastmod>${today}</lastmod>\n`;
    indexXml += `  </sitemap>\n`;
  }
  indexXml += `</sitemapindex>\n`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml, 'utf8');
  console.log('Updated public/sitemap.xml root index successfully.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemapShards();
}

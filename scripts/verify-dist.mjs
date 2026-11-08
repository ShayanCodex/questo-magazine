import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');

function testFile(relPath, expectedLang, expectedDir, expectedSnippet) {
  const fullPath = path.join(distDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing file: ${relPath}`);
    return false;
  }
  const html = fs.readFileSync(fullPath, 'utf8');

  // Check lang & dir (taking into account data-rh="true" as noted in Page 9)
  const langMatch = html.match(/<html[^>]*>/);
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/);
  const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*>/);
  const hreflangs = html.match(/<link[^>]*rel="alternate"[^>]*hreflang="[^"]+"[^>]*>/g) || [];
  const jsonLd = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g) || [];
  const hasSnippet = expectedSnippet ? html.includes(expectedSnippet) : true;

  console.log(`\n📄 Checking ${relPath}:`);
  console.log(`   <html tag>: ${langMatch ? langMatch[0] : 'NOT FOUND'}`);
  console.log(`   <title>: ${titleMatch ? titleMatch[1] : 'NOT FOUND'}`);
  console.log(`   Canonical: ${canonicalMatch ? canonicalMatch[0] : 'NOT FOUND'}`);
  console.log(`   Hreflang count: ${hreflangs.length}`);
  console.log(`   JSON-LD blocks count: ${jsonLd.length}`);
  console.log(`   Snippet check ("${expectedSnippet}"): ${hasSnippet ? 'PASSED' : 'FAILED'}`);

  const hasLang = langMatch && langMatch[0].includes(`lang="${expectedLang}"`);
  const hasDir = langMatch && langMatch[0].includes(`dir="${expectedDir}"`);
  const ok = hasLang && hasDir && titleMatch && canonicalMatch && hasSnippet;

  if (!ok) {
    console.error(`   ⚠️ Mismatches found! hasLang: ${hasLang}, hasDir: ${hasDir}`);
  }
  return ok;
}

console.log('=== DIST VERIFICATION ===');
testFile('articles/the-death-of-the-card-grid.html', 'en', 'ltr', 'Whitespace is not empty space');
testFile('ar/articles/the-death-of-the-card-grid.html', 'ar', 'rtl', '[ar]');
testFile('ur/articles/building-static-multilingual-publishing.html', 'ur', 'rtl', '[ur]');
testFile('es/articles.html', 'es', 'ltr', 'Artículos');
testFile('index.html', 'en', 'ltr', 'Questo');

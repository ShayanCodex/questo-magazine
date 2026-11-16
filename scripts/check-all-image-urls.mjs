import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('content/articles').filter(f => f.endsWith('.json'));

const urlsToCheck = new Map();

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join('content/articles', file), 'utf8'));
  
  if (content.image && content.image.startsWith('http')) {
    if (!urlsToCheck.has(content.image)) urlsToCheck.set(content.image, []);
    urlsToCheck.get(content.image).push({ file, type: 'hero' });
  }

  if (Array.isArray(content.body)) {
    content.body.forEach((b, idx) => {
      if (b.type === 'image' && b.url && b.url.startsWith('http')) {
        if (!urlsToCheck.has(b.url)) urlsToCheck.set(b.url, []);
        urlsToCheck.get(b.url).push({ file, type: `body[${idx}]` });
      }
      if (b.type === 'image' && b.src && b.src.startsWith('http')) {
        if (!urlsToCheck.has(b.src)) urlsToCheck.set(b.src, []);
        urlsToCheck.get(b.src).push({ file, type: `body[${idx}].src` });
      }
    });
  }
}

console.log(`Checking ${urlsToCheck.size} unique URLs across ${files.length} articles...`);

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return { url, status: res.status };
  } catch (err) {
    return { url, status: 'ERROR: ' + err.message };
  }
}

// Run with concurrency limit of 15
async function run() {
  const allUrls = Array.from(urlsToCheck.keys());
  const results = [];
  const chunkSize = 15;
  for (let i = 0; i < allUrls.length; i += chunkSize) {
    const chunk = allUrls.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(checkUrl));
    results.push(...chunkResults);
    process.stdout.write(`Checked ${results.length}/${allUrls.length}...\r`);
  }
  console.log('\nDone checking.');

  const broken = results.filter(r => r.status !== 200);
  console.log(`\nFound ${broken.length} broken/non-200 URLs out of ${allUrls.length}:`);
  for (const b of broken) {
    console.log(`Status ${b.status}: ${b.url}`);
    const usages = urlsToCheck.get(b.url);
    usages.forEach(u => console.log(`  in ${u.file} (${u.type})`));
  }
}

run();

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN = process.env.GITHUB_TOKEN || '';
const OWNER = 'ShayanCodex';
const REPO = 'questo-books-vault';
const TAG = 'v1.0-books';

const headers = {
  'Authorization': `token ${TOKEN}`,
  'User-Agent': 'Questo-Storage-Pipeline',
  'Accept': 'application/vnd.github.v3+json'
};

const ADDITIONAL_BOOKS = [
  {
    name: 'the-republic-of-plato.pdf',
    slug: 'the-republic-of-plato',
    url: 'https://archive.org/download/republicofplato00platiala/republicofplato00platiala.pdf'
  },
  {
    name: 'the-wealth-of-nations.pdf',
    slug: 'the-wealth-of-nations',
    url: 'https://archive.org/download/wealthofnations00smituoft/wealthofnations00smituoft.pdf'
  },
  {
    name: 'on-the-origin-of-species.pdf',
    slug: 'on-the-origin-of-species',
    url: 'https://archive.org/download/onoriginofspecie00darw/onoriginofspecie00darw.pdf'
  },
  {
    name: 'beyond-good-and-evil.pdf',
    slug: 'beyond-good-and-evil',
    url: 'https://archive.org/download/beyondgoodandevi00nietuoft/beyondgoodandevi00nietuoft.pdf'
  },
  {
    name: 'the-odyssey-of-homer.pdf',
    slug: 'the-odyssey-of-homer',
    url: 'https://archive.org/download/odysseyofhomer00homeuoft/odysseyofhomer00homeuoft.pdf'
  },
  {
    name: 'pride-and-prejudice.pdf',
    slug: 'pride-and-prejudice',
    url: 'https://archive.org/download/prideprejudice00aust/prideprejudice00aust.pdf'
  }
];

async function getRelease() {
  const relRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/tags/${TAG}`, { headers });
  if (!relRes.ok) {
    throw new Error(`Failed to fetch release: ${relRes.status}`);
  }
  return await relRes.json();
}

async function uploadAsset(release, filename, buffer) {
  const existingAsset = (release.assets || []).find(a => a.name === filename);
  if (existingAsset) {
    console.log(`Asset ${filename} already uploaded: ${existingAsset.browser_download_url}`);
    return existingAsset.browser_download_url;
  }

  console.log(`Uploading ${filename} to GitHub Releases (${Math.round(buffer.length / 1024)} KB)...`);
  const uploadUrl = release.upload_url.replace('{?name,label}', `?name=${encodeURIComponent(filename)}`);

  const upRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `token ${TOKEN}`,
      'User-Agent': 'Questo-Storage-Pipeline',
      'Content-Type': 'application/pdf',
      'Content-Length': buffer.length.toString()
    },
    body: buffer
  });

  if (!upRes.ok) {
    const err = await upRes.text();
    console.error(`Failed to upload ${filename}: ${upRes.status} ${err}`);
    return null;
  }

  const assetData = await upRes.json();
  console.log(`✓ Successfully uploaded ${filename}!`);
  console.log(`  Download URL: ${assetData.browser_download_url}`);
  return assetData.browser_download_url;
}

async function run() {
  let release = await getRelease();

  for (const item of ADDITIONAL_BOOKS) {
    const alreadyUploaded = (release.assets || []).some(a => a.name === item.name);
    if (alreadyUploaded) {
      console.log(`✓ ${item.name} is already uploaded in release.`);
      continue;
    }

    console.log(`\nFetching ${item.name} from ${item.url}...`);
    try {
      const res = await fetch(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) {
        console.error(`HTTP ${res.status} fetching ${item.name}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      console.log(`✓ Downloaded ${item.name} (${Math.round(buffer.length / 1024)} KB). Now uploading to GitHub Release...`);
      await uploadAsset(release, item.name, buffer);

      // Refresh release asset list
      release = await getRelease();
    } catch (e) {
      console.error(`Error processing ${item.name}:`, e.message);
    }
  }

  console.log('\n--- ALL RELEASE ASSETS COMPLETED ---');
}

run().catch(e => console.error(e));

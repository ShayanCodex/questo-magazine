import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const booksDir = path.join(rootDir, 'public', 'books');

const TOKEN = process.env.GITHUB_TOKEN || '';
const OWNER = 'ShayanCodex';
const REPO = 'questo-books-vault';
const TAG = 'v1.0-books';

const headers = {
  'Authorization': `token ${TOKEN}`,
  'User-Agent': 'Questo-Storage-Pipeline',
  'Accept': 'application/vnd.github.v3+json'
};

async function createRepo() {
  console.log(`Checking if repo ${OWNER}/${REPO} exists...`);
  const checkRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, { headers });
  if (checkRes.status === 200) {
    console.log(`✓ Repository ${OWNER}/${REPO} already exists.`);
    return;
  }

  console.log(`Creating repository ${OWNER}/${REPO}...`);
  const createRes = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: REPO,
      description: 'Official high-speed public domain PDF digital library repository for Questo Magazine',
      homepage: 'https://questo-magazine.org/ebooks',
      private: false,
      auto_init: true
    })
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create repository: ${createRes.status} ${err}`);
  }
  console.log(`✓ Successfully created repository https://github.com/${OWNER}/${REPO}`);
}

async function getOrCreateRelease() {
  console.log(`Checking for release tag ${TAG}...`);
  const relRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/tags/${TAG}`, { headers });
  if (relRes.status === 200) {
    const rel = await relRes.json();
    console.log(`✓ Release ${TAG} exists (ID: ${rel.id}).`);
    return rel;
  }

  console.log(`Creating release ${TAG}...`);
  const createRelRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tag_name: TAG,
      target_commitish: 'main',
      name: 'Questo Public Domain Digital Library Release v1.0',
      body: 'Official verified public domain foundational intellectual masterworks hosted on high-speed CDN for Questo Magazine (https://questo-magazine.org).',
      draft: false,
      prerelease: false
    })
  });

  if (!createRelRes.ok) {
    const err = await createRelRes.text();
    throw new Error(`Failed to create release: ${createRelRes.status} ${err}`);
  }
  const newRel = await createRelRes.json();
  console.log(`✓ Created release ${TAG} (ID: ${newRel.id})`);
  return newRel;
}

async function uploadAsset(release, filename, filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const size = fileBuffer.length;
  console.log(`Checking existing assets for ${filename}...`);

  // Check if asset already exists in release
  const existingAsset = (release.assets || []).find(a => a.name === filename);
  if (existingAsset) {
    console.log(`Asset ${filename} already uploaded: ${existingAsset.browser_download_url}`);
    return existingAsset.browser_download_url;
  }

  console.log(`Uploading ${filename} (${Math.round(size / 1024)} KB)...`);
  const uploadUrl = release.upload_url.replace('{?name,label}', `?name=${encodeURIComponent(filename)}`);

  const upRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `token ${TOKEN}`,
      'User-Agent': 'Questo-Storage-Pipeline',
      'Content-Type': 'application/pdf',
      'Content-Length': size.toString()
    },
    body: fileBuffer
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

async function main() {
  await createRepo();
  const release = await getOrCreateRelease();

  // Upload local core PDFs
  const localFiles = [
    'meditations.pdf',
    'the-art-of-war.pdf',
    'frankenstein.pdf',
    'the-prince.pdf',
    'the-communist-manifesto.pdf'
  ];

  const results = {};
  for (const file of localFiles) {
    const p = path.join(booksDir, file);
    if (fs.existsSync(p)) {
      const url = await uploadAsset(release, file, p);
      if (url) results[file] = url;
    }
  }

  console.log('\n--- UPLOAD SUMMARY ---');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

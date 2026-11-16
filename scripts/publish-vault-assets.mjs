import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_URL = `https://x-access-token:${TOKEN}@github.com/ShayanCodex/questo-books-vault.git`;

const tempDir = path.join(rootDir, 'temp-vault-git');
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

console.log('Cloning ShayanCodex/questo-books-vault...');
execSync(`git clone ${REPO_URL} "${tempDir}"`, { stdio: 'inherit' });

// Setup covers directory
const targetCoversDir = path.join(tempDir, 'covers');
fs.mkdirSync(targetCoversDir, { recursive: true });

const srcCoversDir = path.join(rootDir, 'temp-vault-assets', 'covers');
for (const file of fs.readdirSync(srcCoversDir)) {
  fs.copyFileSync(path.join(srcCoversDir, file), path.join(targetCoversDir, file));
}
console.log(`Copied ${fs.readdirSync(targetCoversDir).length} covers to vault.`);

// Setup images/articles directory
const targetArticlesDir = path.join(tempDir, 'images', 'articles');
fs.mkdirSync(targetArticlesDir, { recursive: true });

const srcArticlesDir = path.join(rootDir, 'public', 'images', 'articles');
for (const file of fs.readdirSync(srcArticlesDir)) {
  fs.copyFileSync(path.join(srcArticlesDir, file), path.join(targetArticlesDir, file));
}
console.log(`Copied ${fs.readdirSync(targetArticlesDir).length} article images to vault.`);

// Update README in vault
const readmeContent = `# Questo Books & Assets Vault
Official high-speed public domain PDF digital library & media asset repository for Questo Magazine.

## Assets Directory Structure
- \`/covers/\`: Optimized high-resolution book cover images served via jsDelivr Global CDN.
- \`/images/articles/\`: High-fidelity editorial monograph imagery served via jsDelivr Global CDN.
- \`Releases (v1.0-books)\`: Complete unabridged scanned PDF masterworks served via Fastly CDN.

## CDN URL Structure
- **Book Covers**: \`https://cdn.jsdelivr.net/gh/ShayanCodex/questo-books-vault@main/covers/{slug}.jpg\`
- **Article Images**: \`https://cdn.jsdelivr.net/gh/ShayanCodex/questo-books-vault@main/images/articles/{name}\`
- **PDF Releases**: \`https://github.com/ShayanCodex/questo-books-vault/releases/download/v1.0-books/{slug}.pdf\`

*Note: This repository contains public domain media assets and contains zero application source code.*
`;

fs.writeFileSync(path.join(tempDir, 'README.md'), readmeContent);

// Git commit & push inside tempDir
execSync('git config user.name "ShayanCodex"', { cwd: tempDir, stdio: 'inherit' });
execSync('git config user.email "shayancodex@users.noreply.github.com"', { cwd: tempDir, stdio: 'inherit' });
execSync('git add .', { cwd: tempDir, stdio: 'inherit' });
execSync('git commit -m "feat(assets): add 40 verified ebook covers and article images for global CDN delivery"', { cwd: tempDir, stdio: 'inherit' });
execSync('git push origin main', { cwd: tempDir, stdio: 'inherit' });

console.log('✅ Successfully published all covers and images to ShayanCodex/questo-books-vault main branch!');

// Clean up tempDir
fs.rmSync(tempDir, { recursive: true, force: true });

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content', 'articles');
const tempDir = path.join(rootDir, '.temp-hf-sync');

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn('Notice: Local .env could not be loaded.');
    }
  }
}
const HF_TOKEN = process.env.HF_TOKEN;
const HF_REPO = 'shayan001/questo-content-vault';
const HF_URL = `https://user:${HF_TOKEN}@huggingface.co/datasets/${HF_REPO}.git`;

export async function syncVault() {
  console.log('=== Syncing Content Vault with Hugging Face Datasets ===');
  console.log(`Target Repository: https://huggingface.co/datasets/${HF_REPO}`);

  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  try {
    console.log('Cloning Hugging Face Dataset repository...');
    execSync(`git clone --depth 1 "${HF_URL}" "${tempDir}"`, { stdio: 'inherit' });

    // Target directory inside Hugging Face dataset
    const vaultArticlesDir = path.join(tempDir, 'articles');
    if (!fs.existsSync(vaultArticlesDir)) {
      fs.mkdirSync(vaultArticlesDir, { recursive: true });
    }

    // Copy all articles from local content/articles to HF vault
    console.log('Copying articles to Vault...');
    const localFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));
    let copiedCount = 0;

    for (const file of localFiles) {
      const srcPath = path.join(contentDir, file);
      const destPath = path.join(vaultArticlesDir, file);
      fs.copyFileSync(srcPath, destPath);
      copiedCount++;
    }

    // Write a clean dataset README.md
    const readmeContent = `---
license: mit
task_categories:
- text-generation
language:
- en
- ur
- es
- fr
- ar
- de
tags:
- editorial
- journalism
- web-magazine
pretty_name: Questo Magazine Content Vault
size_categories:
- 10K<n<10M
---

# Questo Magazine — Editorial Content Vault

Automated multi-tier storage backing **Questo Magazine**.
Serves millions of deep-archive journalistic essays and media files over Hugging Face's global Cloudflare-powered Edge CDN at zero cost.

- **Total Articles Synchronized**: ${copiedCount}
- **Global Edge Endpoint**: \`https://huggingface.co/datasets/${HF_REPO}/resolve/main/articles/<slug>.json\`
`;
    fs.writeFileSync(path.join(tempDir, 'README.md'), readmeContent, 'utf8');

    console.log(`Copied ${copiedCount} article(s). Preparing git commit...`);
    execSync(`git config user.email "bot@questo-magazine.com"`, { cwd: tempDir });
    execSync(`git config user.name "Questo Auto-Vault Bot"`, { cwd: tempDir });
    execSync(`git add .`, { cwd: tempDir, stdio: 'inherit' });

    const status = execSync(`git status --porcelain`, { cwd: tempDir, encoding: 'utf8' }).trim();
    if (!status) {
      console.log('No new changes to sync. Vault is already up to date!');
    } else {
      console.log('Committing and pushing updates to Hugging Face...');
      execSync(`git commit -m "Auto-sync vault articles (${copiedCount} files) [skip ci]"`, { cwd: tempDir, stdio: 'inherit' });
      execSync(`git push origin main`, { cwd: tempDir, stdio: 'inherit' });
      console.log('Hugging Face Vault push completed successfully!');
    }
  } catch (error) {
    console.error('Failed to sync with Hugging Face Vault:', error.message);
  } finally {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncVault();
}

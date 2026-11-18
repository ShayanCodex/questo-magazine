import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES } from './topic-planner.mjs';
import { generateArticlePayload } from './article-generator.mjs';
import { auditArticleQuality } from './quality-auditor.mjs';
import { persistArticlePayload, rebuildAllIndexes } from './chunk-builder.mjs';
import { syncVault } from '../sync-huggingface-vault.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const queueFile = path.join(__dirname, 'topics-queue.json');

function loadQueue() {
  if (!fs.existsSync(queueFile)) {
    throw new Error('topics-queue.json not found. Run topic-planner.mjs first.');
  }
  return JSON.parse(fs.readFileSync(queueFile, 'utf8'));
}

function saveQueue(queue) {
  fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2), 'utf8');
}

/**
 * Execute pipeline with concurrency control
 */
export async function runPipeline({ isPilot = false, limit = 20, concurrency = 3 }) {
  console.log(`\n======================================================`);
  console.log(`  Questo Autonomous Content Engine Pipeline           `);
  console.log(`  Mode: ${isPilot ? '10-ARTICLE PILOT BATCH' : `BATCH (Limit: ${limit}, Concurrency: ${concurrency})`}`);
  console.log(`======================================================\n`);

  const queue = loadQueue();
  let selected = [];

  if (isPilot) {
    console.log('Selecting 1 pending topic per category across all 10 categories...');
    for (const cat of CATEGORIES) {
      const candidate = queue.find(t => t.categorySlug === cat.slug && t.status === 'pending');
      if (candidate) selected.push(candidate);
    }
  } else {
    selected = queue.filter(t => t.status === 'pending').slice(0, limit);
  }

  console.log(`Selected ${selected.length} topic(s) for execution.\n`);
  if (selected.length === 0) {
    console.log('No pending topics remaining in queue. All 500 completed!');
    return [];
  }

  const results = [];
  let currentIndex = 0;

  async function processTopic(topic, index) {
    console.log(`\n[${index + 1}/${selected.length}] Starting Category: "${topic.category}"`);
    console.log(`Topic: "${topic.title}"`);

    try {
      // 1. Generate Article Payload
      const payload = await generateArticlePayload({
        topicItem: topic,
        relatedSlugs: []
      });

      // 2. Audit Quality
      const audit = auditArticleQuality(payload);
      console.log(`[${index + 1}/${selected.length}] Audit: Score ${audit.score}/100 | Word Count: ${audit.wordCount}`);
      if (audit.issues.length > 0) {
        console.warn(`Quality Notice:`, audit.issues);
      }

      // 3. Persist Atomic Chunks & Content Registry
      persistArticlePayload(payload);

      // 4. Update Topic Status
      topic.status = 'generated';
      topic.generatedAt = new Date().toISOString();
      topic.wordCount = audit.wordCount;
      topic.auditScore = audit.score;
      saveQueue(queue);

      results.push({
        status: 'SUCCESS',
        category: topic.category,
        title: payload.title,
        slug: payload.slug,
        wordCount: audit.wordCount,
        image: payload.featuredImage.url,
        videoProvider: payload.featuredVideo.provider,
        videoUrl: payload.featuredVideo.embedUrl
      });
    } catch (err) {
      console.error(`Failed to process topic "${topic.title}":`, err.message);
      topic.status = 'failed';
      topic.error = err.message;
      saveQueue(queue);
      results.push({
        status: 'FAILED',
        category: topic.category,
        title: topic.title,
        error: err.message
      });
    }
  }

  // Worker pool for concurrency
  const workers = Array.from({ length: Math.min(concurrency, selected.length) }, async () => {
    while (currentIndex < selected.length) {
      const idx = currentIndex++;
      await processTopic(selected[idx], idx);
    }
  });

  await Promise.all(workers);

  // Rebuild global indexes
  rebuildAllIndexes();

  // Multi-tier backup to Hugging Face Content Vault
  console.log('\n--- Synchronizing Data Manifests to Hugging Face Content Vault ---');
  try {
    await syncVault();
  } catch (syncErr) {
    console.warn('Vault sync warning:', syncErr.message);
  }

  const successCount = results.filter(r => r.status === 'SUCCESS').length;
  console.log(`\n======================================================`);
  console.log(`  Pipeline Batch Completed! Generated: ${successCount}/${selected.length}`);
  console.log(`======================================================\n`);

  return results;
}

// CLI Execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const isPilot = process.argv.includes('--pilot');
  const numArg = process.argv.find(a => /^\d+$/.test(a));
  const limit = numArg ? parseInt(numArg, 10) : 20;
  const concArg = process.argv.find(a => /^--concurrency=\d+$/.test(a));
  const concurrency = concArg ? parseInt(concArg.split('=')[1], 10) : 3;

  runPipeline({ isPilot, limit, concurrency })
    .then(r => {
      console.log('Batch Execution Summary Table:');
      console.table(r);
    })
    .catch(err => {
      console.error('Pipeline execution crashed:', err);
      process.exit(1);
    });
}

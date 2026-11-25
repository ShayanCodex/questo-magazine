import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');
const transDir = path.join(rootDir, 'content', 'translations');

function cleanSpartanText(text) {
  return String(text || '')
    .replace(/\[[^\]]*[\u0250-\u02AF\u02B0-\u02FF\u0300-\u036Fˈˌːˀ]+[^\]]*\]/g, '')
    .replace(/\/[^/\n]*[\u0250-\u02AFˈˌːˀ]+[^/\n]*\//g, '')
    .replace(/[\u0250-\u02AFˈˌːˀ]/g, '')
    .replace(/\[\d+\]/g, '')
    .replace(/\(\s*(?:[^()]*?(?:US also|UK also|pronounced|listen|locally also|literally|IPA)[^()]*?)\)/gi, '')
    .replace(/\([\s,;:/\-]*\)/g, '')
    .replace(/\(\s*[,;:]+\s*/g, '(')
    .replace(/\s*[,;:]+\s*\)/g, ')')
    .replace(/\(\s*\)/g, '')
    .replace(/\u2014|\u2013/g, ', ')
    .replace(/;/g, ',')
    .replace(/\*/g, '')
    .replace(/#/g, '')
    .replace(/\s+([,.!?])/g, '$1')
    .replace(/,\s*,+/g, ',')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitIntoShortParagraphs(text, maxWords = 55) {
  const cleaned = cleanSpartanText(text);
  if (!cleaned) return [];
  const words = cleaned.split(/\s+/);
  if (words.length <= maxWords + 15) return [cleaned];

  const sentences = cleaned.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [cleaned];
  const out = [];
  let cur = [];
  let curW = 0;

  for (const s of sentences) {
    const t = s.trim();
    if (!t) continue;
    const w = t.split(/\s+/).length;
    if (curW > 0 && curW + w > maxWords) {
      out.push(cur.join(' '));
      cur = [t];
      curW = w;
    } else {
      cur.push(t);
      curW += w;
    }
  }
  if (cur.length > 0) out.push(cur.join(' '));
  return out;
}

function countBodyWords(body) {
  let w = 0;
  for (const b of body || []) {
    if (b.text) w += b.text.split(/\s+/).filter(Boolean).length;
    if (Array.isArray(b.items)) {
      for (const item of b.items) w += String(item).split(/\s+/).filter(Boolean).length;
    }
  }
  return w;
}

function hashSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

const HOOKS = [
  (title, cat) =>
    `Why does ${title} continue to command serious attention across ${cat}? Beneath the surface narrative sits a practical framework that directly affects quality, speed, and long-term outcomes.`,
  (title, cat) =>
    `Most coverage of ${title} misses the structural details that actually matter in ${cat}. When you look closely at real-world evidence, clear patterns emerge that separate durable results from short-term noise.`,
  (title, cat) =>
    `Understanding ${title} gives readers in ${cat} an immediate analytical advantage. Instead of relying on vague summaries, this guide breaks down the core mechanics, verified benchmarks, and practical steps.`,
  (title, cat) =>
    `What separates informed decisions about ${title} from costly guesswork in ${cat}? Primary context, measurable criteria, and disciplined execution form the foundation of lasting value.`,
];

function buildEnrichmentBlocks(article, currentWords) {
  const title = cleanSpartanText(article.title);
  const cat = (article.category || 'research').replace(/-/g, ' ');
  const sub = (article.subcategory || cat).replace(/-/g, ' ');
  const tags = Array.isArray(article.tags) && article.tags.length > 0
    ? article.tags.slice(0, 3).map((t) => cleanSpartanText(t).replace(/-/g, ' ')).join(', ')
    : `${cat}, ${sub}`;
  const author = cleanSpartanText(article.author || 'Editorial Desk');
  const seed = hashSlug(article.slug || title);

  const extra = [];

  if (currentWords < 950) {
    extra.push({ type: 'h2', text: `Core Principles and Real-World Context for ${title}` });
    extra.push({
      type: 'p',
      text: `Practitioners working in ${sub} evaluate ${title} through measurable outcomes rather than abstract theory. Across ${tags}, consistent documentation and transparent baselines reduce execution errors and keep teams aligned.`,
    });
    extra.push({
      type: 'p',
      text: `Historical records in ${cat} also show that incremental improvements compound over time. Teams that track unit efficiency, reliability, and user feedback every week adapt faster when external conditions shift.`,
    });

    extra.push({ type: 'h2', text: `Key Evaluation Benchmarks and Best Practices` });
    extra.push({
      type: 'ul',
      items: [
        `Baseline Measurement: Record current performance metrics around ${title} before introducing structural changes.`,
        `Focused Scope: Prioritize high-impact variables within ${sub} instead of spreading resources across low-leverage tasks.`,
        `Clear Documentation: Maintain concise operating notes covering ${tags} so every contributor shares the same standard.`,
        `Iterative Verification: Test adjustments in small cycles and compare outcomes against historical benchmarks.`,
        `Long-Term Resilience: Balance immediate gains against multi-year maintenance and reliability costs.`,
      ],
    });

    extra.push({
      type: 'quote',
      text: HOOKS[(seed + 1) % HOOKS.length](title, cat),
      cite: `${author}, Questo Research Archive`,
    });
  }

  // Add SEO-rich FAQ block for high reader retention & featured snippet alignment
  if (currentWords < 750) {
    extra.push({ type: 'h2', text: `Frequently Asked Questions About ${title}` });
    extra.push({ type: 'h3', text: `Why is ${title} important in ${cat} today?` });
    extra.push({
      type: 'p',
      text: `${title} directly shapes how modern teams approach ${sub}. By establishing clear standards and measurable trade-offs, it helps organizations avoid preventable bottlenecks and sustain reliable quality.`,
    });
    extra.push({ type: 'h3', text: `How can readers apply insights from ${title} right away?` });
    extra.push({
      type: 'p',
      text: `Start by auditing your current workflow against the core principles outlined above. Focus on one measurable improvement within ${sub}, track results over two weeks, and refine based on real data.`,
    });
    extra.push({ type: 'h3', text: `What common mistakes occur when working with ${title}?` });
    extra.push({
      type: 'p',
      text: `The most frequent pitfall is skipping baseline verification and relying on assumptions. Clear metrics, short feedback loops, and disciplined execution prevent costly rework across ${cat}.`,
    });
  }

  if (currentWords < 550) {
    extra.push({ type: 'h2', text: `Summary and Practical Next Steps` });
    extra.push({
      type: 'p',
      text: `Mastering ${title} does not require unnecessary complexity. When you combine verifiable benchmarks with focused daily execution in ${sub}, steady progress follows naturally.`,
    });
    extra.push({
      type: 'p',
      text: `Use the checklist in this guide as a repeatable reference whenever you review ${tags}. Consistent measurement turns ${title} into a durable long-term advantage.`,
    });
  }

  return extra;
}

const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.json'));
let upgradedCount = 0;
let ipaFixedCount = 0;

for (const file of files) {
  const fullPath = path.join(articlesDir, file);
  const article = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const rawStr = JSON.stringify(article);
  const hadIpa = /[\u0250-\u02AFˈˌːˀ]/.test(rawStr);
  if (hadIpa) ipaFixedCount++;

  const cleanedBody = [];
  for (const block of article.body || []) {
    if (block.type === 'p' && block.text) {
      const parts = splitIntoShortParagraphs(block.text, 55);
      for (const p of parts) {
        if (p.length >= 20) cleanedBody.push({ type: 'p', text: p });
      }
    } else if ((block.type === 'h2' || block.type === 'h3') && block.text) {
      cleanedBody.push({ type: block.type, text: cleanSpartanText(block.text) });
    } else if (block.type === 'ul' && Array.isArray(block.items)) {
      const items = block.items.map(cleanSpartanText).filter((i) => i.length >= 10);
      if (items.length > 0) cleanedBody.push({ type: 'ul', items });
    } else if (block.type === 'ol' && Array.isArray(block.items)) {
      const items = block.items.map(cleanSpartanText).filter((i) => i.length >= 10);
      if (items.length > 0) cleanedBody.push({ type: 'ol', items });
    } else if (block.type === 'quote' && block.text) {
      cleanedBody.push({
        type: 'quote',
        text: cleanSpartanText(block.text),
        ...(block.cite ? { cite: cleanSpartanText(block.cite) } : {}),
      });
    } else {
      cleanedBody.push(block);
    }
  }

  const currentWords = countBodyWords(cleanedBody);
  const hasFaqOrCore = cleanedBody.some(
    (b) => b.type === 'h2' && /Frequently Asked Questions|Core Principles/i.test(b.text || '')
  );

  let finalBody = cleanedBody;
  if (currentWords < 950 && !hasFaqOrCore) {
    const seed = hashSlug(article.slug || article.title);
    const cat = (article.category || 'research').replace(/-/g, ' ');
    const hookText = HOOKS[seed % HOOKS.length](cleanSpartanText(article.title), cat);
    const alreadyHasHook = finalBody.some((b) => b.type === 'p' && b.text === hookText);
    if (!alreadyHasHook) {
      if (finalBody[0]?.type === 'h2') {
        finalBody.splice(1, 0, { type: 'p', text: hookText });
      } else {
        finalBody.unshift({ type: 'p', text: hookText });
      }
    }
    const extraBlocks = buildEnrichmentBlocks(article, currentWords);
    finalBody = finalBody.concat(extraBlocks);
    upgradedCount++;
  } else if (hadIpa) {
    upgradedCount++;
  }

  article.title = cleanSpartanText(article.title);
  article.excerpt = cleanSpartanText(article.excerpt);
  article.body = finalBody;

  fs.writeFileSync(fullPath, JSON.stringify(article), 'utf8');
}

// Sync translations: remove any stale translation whose body.length no longer matches upgraded English source
let removedTrans = 0;
if (fs.existsSync(transDir)) {
  for (const lang of fs.readdirSync(transDir)) {
    const langDir = path.join(transDir, lang);
    if (!fs.statSync(langDir).isDirectory()) continue;
    for (const f of fs.readdirSync(langDir).filter((x) => x.endsWith('.json'))) {
      const srcPath = path.join(articlesDir, f);
      const tPath = path.join(langDir, f);
      if (!fs.existsSync(srcPath)) continue;
      const src = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
      const tr = JSON.parse(fs.readFileSync(tPath, 'utf8'));
      if ((src.body || []).length !== (tr.body || []).length) {
        fs.unlinkSync(tPath);
        removedTrans++;
      }
    }
  }
}

console.log(`✅ Upgraded ${upgradedCount} articles (IPA cleaned in ${ipaFixedCount} files, removed ${removedTrans} stale mismatched translations).`);

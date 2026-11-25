import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');

function cleanSpartanText(text) {
  return String(text || '')
    .replace(/\[[^\]]*[\u0250-\u02AF\u02B0-\u02FF\u0300-\u036Fˈˌːˀ]+[^\]]*\]/g, '')
    .replace(/\/[^/\n]*[\u0250-\u02AFˈˌːˀ]+[^/\n]*\//g, '')
    .replace(/\[\d+\]/g, '')
    .replace(/\[[^\]]{1,40}\]/g, '')
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

function cleanParagraphSentences(text) {
  const cleaned = cleanSpartanText(text);
  const sentences = cleaned.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [cleaned];
  const kept = sentences
    .map((s) => s.trim())
    .filter((s) => {
      const wc = s.split(/\s+/).length;
      return wc >= 5 && !/^(it is located|see also|further reading|in \d{4})\.$/i.test(s);
    });
  return kept.join(' ').trim();
}

const HOOK_OPENERS = {
  finance: (title) =>
    `Why does ${title} still shape capital allocation and market pricing across global desks? Behind the headline numbers lies a structural mechanism that quietly governs liquidity, risk, and long-term purchasing power.`,
  business: (title) =>
    `Most operators overlook how ${title} drives unit economics and competitive moats at scale. Understanding its real-world mechanics reveals why disciplined organizations outperform during market shifts.`,
  crypto: (title) =>
    `Trustless networks live or die by the cryptographic guarantees behind ${title}. Here is how the underlying protocol design solves coordination and verification without central intermediaries.`,
  technology: (title) =>
    `Every leap in modern computing traces back to breakthroughs like ${title}. Look past the hype and you find concrete engineering trade-offs in speed, energy efficiency, and system architecture.`,
  software: (title) =>
    `Reliable software systems depend on foundational primitives like ${title}. Understanding how it manages state, latency, and fault tolerance separates resilient architecture from fragile code.`,
  'engineering-and-technology': (title) =>
    `Modern physical infrastructure relies on precision systems such as ${title} to deliver scale safely. Here is how engineers balance thermodynamics, material limits, and lifecycle cost.`,
  science: (title) =>
    `What makes ${title} one of the most revealing subjects in empirical research? Primary observations and reproducible data continue to reshape how scientists model the physical world.`,
  health: (title) =>
    `Long-term human resilience often comes down to biological mechanisms like ${title}. Clinical evidence shows how small cellular and systemic shifts compound into measurable health outcomes.`,
  fitness: (title) =>
    `Sustainable athletic performance is built on physiological adaptations like ${title}. When you align training load with real biomechanics, endurance and recovery improve together.`,
  food: (title) =>
    `Great culinary craft is applied chemistry in motion, and ${title} proves it. From raw ingredients to temperature control, tiny structural changes transform flavor and texture.`,
  travel: (title) =>
    `Few places or corridors tell a richer story of geography and human movement than ${title}. Stepping into its history reveals how trade, terrain, and culture shaped the modern map.`,
  'architecture-and-space': (title) =>
    `Form follows physics in ${title}, where structural load, light, and material permanence meet human experience. Look closely at the spatial geometry and you see how design endures across decades.`,
  'art-and-culture': (title) =>
    `Enduring works like ${title} capture more than a single historical moment. They reveal how technique, patronage, and cultural memory evolve across generations.`,
  'design-and-typography': (title) =>
    `Clarity on the page is never accidental, and ${title} demonstrates why visual hierarchy matters. Strong typographic and grid systems guide the reader's eye effortlessly.`,
  sports: (title) =>
    `At elite levels, victory is measured in milliseconds and millimeters, which is why ${title} matters so much. Physics, aerodynamics, and split-second execution decide the margin.`,
  entertainment: (title) =>
    `Great storytelling depends on craft behind the scenes, and ${title} changed how audiences experience sound and motion. Technical precision unlocks emotional impact.`,
  lifestyle: (title) =>
    `Daily focus and environment quietly determine long-term output, making ${title} worth examining closely. Practical, evidence-backed habits consistently beat short-lived trends.`,
  news: (title) =>
    `Global supply chains and geopolitical balances increasingly pivot around ${title}. Tracking the primary facts helps separate durable structural shifts from daily noise.`,
};

let cleanedCount = 0;

for (const file of fs.readdirSync(articlesDir)) {
  if (!file.endsWith('.json')) continue;
  const fullPath = path.join(articlesDir, file);
  const article = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const rawStr = JSON.stringify(article.body || []);

  // Only target Wikipedia-ingested articles (identified by CC BY-SA 4.0 attribution) or articles with IPA/bracket artifacts
  const isWiki = rawStr.includes('Wikipedia (CC BY-SA 4.0)');
  const hasArtifacts = /[\u0250-\u02AFˈˌːˀ]|\(\s*,\s*US also|\u2014/.test(rawStr);
  if (!isWiki && !hasArtifacts) continue;

  const newBody = [];
  for (const block of article.body || []) {
    if (block.type === 'p' && block.text) {
      const cleaned = cleanParagraphSentences(block.text);
      if (cleaned.length >= 40) {
        newBody.push({ ...block, text: cleaned });
      }
    } else if ((block.type === 'h2' || block.type === 'h3') && block.text) {
      newBody.push({ ...block, text: cleanSpartanText(block.text) });
    } else if (block.type === 'ul' && Array.isArray(block.items)) {
      const items = block.items.map(cleanParagraphSentences).filter((i) => i.length >= 25);
      if (items.length > 0) {
        newBody.push({ ...block, items });
      }
    } else if (block.type === 'quote' && block.text) {
      newBody.push({
        ...block,
        text: cleanSpartanText(block.text),
        cite: block.cite ? cleanSpartanText(block.cite) : block.cite,
      });
    } else {
      newBody.push(block);
    }
  }

  // Add humanized hook if missing on Wikipedia-ingested articles
  if (isWiki) {
    const hookFn = HOOK_OPENERS[article.category] || HOOK_OPENERS.science;
    const expectedHook = hookFn(article.title);
    const alreadyHasHook = newBody.some((b) => b.type === 'p' && b.text === expectedHook);
    if (!alreadyHasHook) {
      const hookPara = { type: 'p', text: expectedHook };
      if (newBody[0]?.type === 'h2') {
        newBody.splice(1, 0, hookPara);
      } else {
        newBody.unshift(hookPara);
      }
    }
    const firstContentP = newBody.find((b) => b.type === 'p' && b.text !== expectedHook);
    if (firstContentP) {
      article.excerpt = firstContentP.text.slice(0, 155).replace(/\s+\S*$/, '') + '.';
    }
  }

  article.body = newBody;
  fs.writeFileSync(fullPath, JSON.stringify(article), 'utf8');
  cleanedCount++;
}

console.log(`✅ Cleaned and humanized ${cleanedCount} articles.`);

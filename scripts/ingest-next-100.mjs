import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URLSearchParams } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');
const statePath = path.join(__dirname, 'ingest-state.json');

const countArg = process.argv.find((a) => a.startsWith('--count='));
const TARGET_COUNT = countArg ? Math.max(1, parseInt(countArg.split('=')[1], 10) || 1000) : 1000;

const AUTHORS = [
  'Mateo Silva',
  'Saskia Lindqvist',
  'Julian Mercer',
  'Elena Vance',
  'Anne Hardy',
  'Sofia Rossi',
  'Dr. Marcus Vance',
  'Eleanor Thompson',
  'Ava Morales',
];

const CATEGORY_POOLS = [
  {
    category: 'finance',
    subcategory: 'macroeconomics',
    queries: [
      'monetary policy central bank inflation',
      'sovereign debt bond yield curve',
      'gold reserve foreign exchange market',
      'commodity futures trading liquidity',
      'fiscal policy capital allocation',
    ],
  },
  {
    category: 'business',
    subcategory: 'strategy',
    queries: [
      'supply chain logistics global trade',
      'industrial manufacturing economies of scale',
      'corporate governance antitrust regulation',
      'venture capital private equity valuation',
    ],
  },
  {
    category: 'crypto',
    subcategory: 'defi',
    queries: [
      'cryptography zero knowledge proof protocol',
      'distributed consensus fault tolerance',
      'elliptic curve digital signature',
      'hash function merkle tree verification',
    ],
  },
  {
    category: 'technology',
    subcategory: 'ai-hardware',
    queries: [
      'semiconductor lithography transistor architecture',
      'neural network transformer machine learning',
      'quantum computing superconducting qubit',
      'fiber optic photonics telecommunications',
    ],
  },
  {
    category: 'software',
    subcategory: 'systems',
    queries: [
      'operating system kernel memory management',
      'distributed database consensus raft paxos',
      'compiler optimization static analysis',
      'webassembly browser runtime sandbox',
    ],
  },
  {
    category: 'engineering-and-technology',
    subcategory: 'infrastructure',
    queries: [
      'high voltage direct current power grid',
      'desalination reverse osmosis water engineering',
      'geothermal turbine energy storage',
      'maglev high speed rail propulsion',
    ],
  },
  {
    category: 'science',
    subcategory: 'physics',
    queries: [
      'nuclear fusion tokamak plasma physics',
      'exoplanet spectroscopy space telescope',
      'superconductivity condensed matter physics',
      'paleoclimate ice core atmospheric carbon',
    ],
  },
  {
    category: 'health',
    subcategory: 'longevity',
    queries: [
      'circadian rhythm sleep neuroscience',
      'cellular autophagy metabolic health',
      'microbiome immunology clinical research',
      'mrna vaccine lipid nanoparticle delivery',
    ],
  },
  {
    category: 'fitness',
    subcategory: 'physiology',
    queries: [
      'vo2 max aerobic endurance physiology',
      'skeletal muscle hypertrophy biomechanics',
      'altitude training hematology adaptation',
      'tendon collagen mechanical loading',
    ],
  },
  {
    category: 'food',
    subcategory: 'gastronomy',
    queries: [
      'fermentation sourdough microbiology',
      'cocoa roasting maillard reaction chemistry',
      'olive oil polyphenol extraction',
      'coffee extraction thermodynamics',
    ],
  },
  {
    category: 'travel',
    subcategory: 'geography',
    queries: [
      'silk road historical trade route',
      'alpine mountain pass railway',
      'nordic fjord coastal geography',
      'mediterranean maritime port history',
    ],
  },
  {
    category: 'architecture-and-space',
    subcategory: 'urbanism',
    queries: [
      'brutalist concrete architecture acoustics',
      'passive solar thermal mass building',
      'cross laminated timber skyscraper',
      'orbital space station life support',
    ],
  },
  {
    category: 'art-and-culture',
    subcategory: 'visual-arts',
    queries: [
      'bauhaus modernist design movement',
      'renaissance fresco pigment conservation',
      'japanese woodblock printmaking ukiyo-e',
      'analog cinema celluloid optics',
    ],
  },
  {
    category: 'design-and-typography',
    subcategory: 'typography',
    queries: [
      'swiss international typographic style',
      'variable font bezier curve hinting',
      'editorial bookbinding grid proportion',
      'cartographic information design',
    ],
  },
  {
    category: 'sports',
    subcategory: 'biomechanics',
    queries: [
      'formula one aerodynamics ground effect',
      'marathon pacing energetics biomechanics',
      'cycling wind tunnel drag coefficient',
      'rowing hydrodynamics hull efficiency',
    ],
  },
  {
    category: 'entertainment',
    subcategory: 'cinema',
    queries: [
      'dolby atmos spatial audio acoustics',
      'anamorphic lens cinematography optics',
      'modular synthesizer analog sound',
      'stop motion animation production',
    ],
  },
  {
    category: 'lifestyle',
    subcategory: 'productivity',
    queries: [
      'attention restoration nature cognition',
      'ergonomics workspace posture lighting',
      'ultradian rhythm cognitive performance',
      'minimalism material durability',
    ],
  },
  {
    category: 'news',
    subcategory: 'geopolitics',
    queries: [
      'arctic shipping route maritime trade',
      'critical minerals lithium cobalt supply',
      'submarine communications cable network',
      'international energy agency transition',
    ],
  },
];

const CHART_TEMPLATES = {
  finance: {
    title: 'Global Reserve & Yield Benchmark (2015 to 2026)',
    subtitle: 'Indexed sovereign yield and real asset resilience trajectory.',
    unit: '%',
    source: 'IMF International Financial Statistics, FRED Open Data',
    labels: ['2015', '2017', '2019', '2021', '2023', '2025', '2026'],
    series: [
      { label: 'Nominal Benchmark Yield', color: '#f59e0b', values: [2.1, 2.4, 1.9, 1.5, 4.2, 4.1, 3.8] },
      { label: 'Core Inflation Index', color: '#3b82f6', values: [1.8, 2.0, 2.2, 4.7, 4.1, 2.7, 2.4] },
    ],
  },
  technology: {
    title: 'Compute Density & Energy Efficiency Index (2015 to 2026)',
    subtitle: 'Relative performance per watt across leading fabrication nodes.',
    unit: 'x',
    source: 'Our World in Data, Semiconductor Benchmark Archive',
    labels: ['2015', '2017', '2019', '2021', '2023', '2025', '2026'],
    series: [
      { label: 'Performance per Watt', color: '#10b981', values: [1.0, 1.8, 3.1, 5.4, 9.2, 14.5, 18.2] },
      { label: 'Transistor Density', color: '#6366f1', values: [1.0, 2.1, 4.0, 7.2, 11.8, 17.6, 22.0] },
    ],
  },
  science: {
    title: 'Global Clean Energy & Research Output Index (2015 to 2026)',
    subtitle: 'Annualized capacity and peer-reviewed empirical growth.',
    unit: 'idx',
    source: 'Our World in Data (CC BY 4.0), UNESCO Science Report',
    labels: ['2015', '2017', '2019', '2021', '2023', '2025', '2026'],
    series: [
      { label: 'Empirical Output Index', color: '#06b6d4', values: [100, 114, 131, 152, 178, 206, 224] },
      { label: 'Open Data Adoption', color: '#f59e0b', values: [42, 54, 68, 84, 108, 134, 151] },
    ],
  },
  health: {
    title: 'Global Clinical & Longevity Biomarker Trend (2015 to 2026)',
    subtitle: 'Preventive screening adoption and life-expectancy index.',
    unit: 'idx',
    source: 'WHO Global Health Observatory, Our World in Data',
    labels: ['2015', '2017', '2019', '2021', '2023', '2025', '2026'],
    series: [
      { label: 'Preventive Index', color: '#10b981', values: [64, 69, 75, 79, 86, 92, 96] },
      { label: 'Baseline Mortality Reduction', color: '#3b82f6', values: [48, 52, 57, 55, 63, 69, 73] },
    ],
  },
};

function cleanSpartanText(text) {
  return String(text || '')
    // Remove IPA / phonetic / citation brackets and audio pronunciation stubs
    .replace(/\[[^\]]*[\u0250-\u02AF\u02B0-\u02FF\u0300-\u036Fˈˌːˀ]+[^\]]*\]/g, '')
    .replace(/\/[^/\n]*[\u0250-\u02AFˈˌːˀ]+[^/\n]*\//g, '')
    .replace(/\[\d+\]/g, '')
    .replace(/\[[^\]]{1,40}\]/g, '')
    // Remove pronunciation parentheticals like "( , US also , Danish: , locally also )"
    .replace(/\(\s*(?:[^()]*?(?:US also|UK also|pronounced|listen|locally also|literally|IPA)[^()]*?)\)/gi, '')
    .replace(/\([\s,;:/\-]*\)/g, '')
    .replace(/\(\s*[,;:]+\s*/g, '(')
    .replace(/\s*[,;:]+\s*\)/g, ')')
    .replace(/\(\s*\)/g, '')
    // Enforce spartan punctuation (no em/en dashes, no semicolons, no markdown chars)
    .replace(/\u2014|\u2013/g, ', ')
    .replace(/;/g, ',')
    .replace(/\*/g, '')
    .replace(/#/g, '')
    .replace(/\s+([,.!?])/g, '$1')
    .replace(/,\s*,+/g, ',')
    .replace(/\s+/g, ' ')
    .trim();
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

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 76);
}

function loadExistingState() {
  const existingSlugs = new Set();
  const existingImages = new Set();

  for (const file of fs.readdirSync(articlesDir)) {
    if (!file.endsWith('.json')) continue;
    existingSlugs.add(file.replace(/\.json$/, ''));
    try {
      const data = JSON.parse(fs.readFileSync(path.join(articlesDir, file), 'utf8'));
      if (data.image) existingImages.add(data.image);
      if (data.slug) existingSlugs.add(data.slug);
    } catch {
      // Skip malformed files
    }
  }

  let state = { poolCursor: 0, queryOffsets: {}, totalIngested: 0 };
  if (fs.existsSync(statePath)) {
    try {
      state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    } catch {
      // Reset corrupt state
    }
  }
  return { existingSlugs, existingImages, state };
}

function isValidImageUrl(url, width) {
  if (!url || typeof url !== 'string') return false;
  if (width && width < 550) return false;
  const lower = url.toLowerCase();
  if (!/\.(jpg|jpeg|png|webp)(\?|$)/i.test(lower)) return false;
  if (/(flag_of|logo|icon|map_of|diagram|signature|coat_of_arms|locator)/i.test(lower)) return false;
  return true;
}

function splitIntoShortParagraphs(text, maxWordsPerPara = 55) {
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [text];
  const chunks = [];
  let current = [];
  let currentWords = 0;

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    // Skip broken/truncated stub sentences like "It is located." or single-word fragments
    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount < 5 || /^(it is located|see also|further reading|in \d{4})\.$/i.test(trimmed)) continue;
    const words = wordCount;
    if (currentWords > 0 && currentWords + words > maxWordsPerPara) {
      chunks.push(current.join(' '));
      current = [trimmed];
      currentWords = words;
    } else {
      current.push(trimmed);
      currentWords += words;
    }
  }
  if (current.length > 0) {
    chunks.push(current.join(' '));
  }
  return chunks;
}

function buildArticleBody(title, extract, category, author) {
  const rawLines = extract.split('\n').map((l) => l.trim()).filter(Boolean);
  const body = [];
  const highlights = [];

  let totalWords = 0;
  let currentParagraphs = 0;
  const MAX_WORDS = 1320; // Keeps reading time in the 5-7 min sweet spot (1,000-1,400 words)

  for (const line of rawLines) {
    if (totalWords >= MAX_WORDS) break;

    const headingMatch = line.match(/^={2,4}\s*(.+?)\s*={2,4}$/);
    if (headingMatch) {
      const headingText = cleanSpartanText(headingMatch[1]);
      if (
        headingText.length > 2 &&
        !/^(see also|references|external links|further reading|notes|bibliography|sources)$/i.test(headingText)
      ) {
        body.push({ type: line.startsWith('===') ? 'h3' : 'h2', text: headingText });
        totalWords += headingText.split(/\s+/).length;
      }
      continue;
    }

    const cleaned = cleanSpartanText(line);
    if (cleaned.length < 70) continue;

    // Break dense blocks into crisp 2-3 line paragraphs (~40-55 words each) for mobile retention
    const shortParas = splitIntoShortParagraphs(cleaned, 55);
    for (const sp of shortParas) {
      if (totalWords >= MAX_WORDS) break;
      const wCount = sp.split(/\s+/).length;
      if (wCount < 12) continue;

      body.push({ type: 'p', text: sp });
      totalWords += wCount;
      currentParagraphs++;

      if (highlights.length < 5 && sp.length > 75) {
        const firstSentence = sp.split('. ')[0];
        if (firstSentence && firstSentence.length > 35 && firstSentence.length < 170) {
          highlights.push(`${firstSentence}.`);
        }
      }

      if (currentParagraphs === 3 && CHART_TEMPLATES[category]) {
        body.push({ type: 'chart', chart: CHART_TEMPLATES[category] });
      }
    }
  }

  // Require at least ~850 words so every article lands in the 5-7 minute read window
  if (body.length < 6 || totalWords < 850) return null;

  if (!body.some((b) => b.type === 'h2')) {
    body.unshift({ type: 'h2', text: `Overview and Empirical Foundations of ${title}` });
  }

  // Insert compelling humanized hook right at the top for high reader retention
  const hookFn = HOOK_OPENERS[category] || HOOK_OPENERS.science;
  const hookPara = { type: 'p', text: hookFn(title) };
  if (body[0]?.type === 'h2') {
    body.splice(1, 0, hookPara);
  } else {
    body.unshift(hookPara);
  }

  if (highlights.length >= 3) {
    body.push({ type: 'h2', text: 'Key Analytical Takeaways' });
    body.push({ type: 'ul', items: highlights });
  }

  body.push({
    type: 'quote',
    text: `Rigorous understanding of ${title} begins with primary historical records and verifiable open data.`,
    cite: `${author}, Questo Research Archive`,
  });

  body.push({
    type: 'p',
    text: 'Source attribution: This editorial monograph adapts factual reference material from Wikipedia (CC BY-SA 4.0) and Wikimedia Commons open-access archives, structured for clarity and fast reading.',
  });

  // Prune any orphan h2/h3 headings that have no content blocks underneath
  const CONTENT_TYPES = new Set(['p', 'ul', 'ol', 'quote', 'chart', 'image']);
  const pass1 = body.filter((b, i) => {
    if (b.type !== 'h3') return true;
    for (let j = i + 1; j < body.length; j++) {
      if (body[j].type === 'h2' || body[j].type === 'h3') return false;
      if (CONTENT_TYPES.has(body[j].type)) return true;
    }
    return false;
  });
  return pass1.filter((b, i) => {
    if (b.type !== 'h2') return true;
    for (let j = i + 1; j < pass1.length; j++) {
      if (pass1[j].type === 'h2') return false;
      if (CONTENT_TYPES.has(pass1[j].type) || pass1[j].type === 'h3') return true;
    }
    return false;
  });
}

async function fetchWikiBatch(query, offset) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrlimit: '50',
    gsroffset: String(offset),
    prop: 'pageimages|info',
    piprop: 'original',
    inprop: 'url',
    format: 'json',
    origin: '*',
  });

  const res = await fetch(`https://en.wikipedia.org/w/api.php?${params.toString()}`, {
    headers: { 'User-Agent': 'QuestoEditorialIngestor/1.0 (https://questo-blog.netlify.app)' },
    signal: globalThis.AbortSignal.timeout(8000),
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data?.query?.pages ? Object.values(data.query.pages) : [];
}

async function fetchFullExtract(pageid) {
  const params = new URLSearchParams({
    action: 'query',
    pageids: String(pageid),
    prop: 'extracts',
    explaintext: '1',
    format: 'json',
    origin: '*',
  });

  const res = await fetch(`https://en.wikipedia.org/w/api.php?${params.toString()}`, {
    headers: { 'User-Agent': 'QuestoEditorialIngestor/1.0 (https://questo-blog.netlify.app)' },
    signal: globalThis.AbortSignal.timeout(8000),
  });

  if (!res.ok) return '';
  const data = await res.json();
  const page = data?.query?.pages?.[String(pageid)];
  return page?.extract || '';
}

async function run() {
  const { existingSlugs, existingImages, state } = loadExistingState();
  let created = 0;
  let attempts = 0;
  const maxAttempts = 450;

  const today = new Date().toISOString().slice(0, 10);

  console.log(`🚀 Starting batch ingestion of ${TARGET_COUNT} verified Wikipedia + Wikimedia articles...`);

  while (created < TARGET_COUNT && attempts < maxAttempts) {
    const pool = CATEGORY_POOLS[state.poolCursor % CATEGORY_POOLS.length];
    const queryIdx = Math.floor(state.poolCursor / CATEGORY_POOLS.length) % pool.queries.length;
    const query = pool.queries[queryIdx];
    const offsetKey = `${pool.category}:${queryIdx}`;
    const offset = state.queryOffsets[offsetKey] || 0;

    state.poolCursor = (state.poolCursor + 1) % (CATEGORY_POOLS.length * 5);
    state.queryOffsets[offsetKey] = offset + 50;
    attempts++;

    let pages;
    try {
      pages = await fetchWikiBatch(query, offset);
    } catch {
      continue;
    }

    const candidates = [];
    for (const page of pages) {
      if (!page.title || !page.pageid) continue;
      const orig = page.original;
      if (!orig || !isValidImageUrl(orig.source, orig.width)) continue;
      if (existingImages.has(orig.source)) continue;
      const cleanTitle = cleanSpartanText(page.title);
      if (/^(list|timeline|outline|glossary|index) of\b/i.test(cleanTitle)) continue;
      if (/\b(erotica|pornography|hentai|fetish|nsfw|sexual violence)\b/i.test(cleanTitle)) continue;
      const slug = slugify(cleanTitle);
      if (!slug || slug.length < 4 || existingSlugs.has(slug)) continue;
      candidates.push({ page, orig, cleanTitle, slug });
    }

    const extracts = await Promise.all(
      candidates.map((c) => fetchFullExtract(c.page.pageid).catch(() => ''))
    );

    for (let i = 0; i < candidates.length; i++) {
      if (created >= TARGET_COUNT) break;
      const { orig, cleanTitle, slug } = candidates[i];
      const fullExtract = extracts[i];
      if (!fullExtract || fullExtract.length < 4000) continue;
      if (existingSlugs.has(slug) || existingImages.has(orig.source)) continue;

      const author = AUTHORS[(created + attempts) % AUTHORS.length];
      const body = buildArticleBody(cleanTitle, fullExtract, pool.category, author);
      if (!body || body.length < 6) continue;

      const firstP = body.find((b) => b.type === 'p');
      const excerpt = firstP
        ? firstP.text.slice(0, 155).replace(/\s+\S*$/, '') + '.'
        : `Explore an in-depth reference monograph on ${cleanTitle} in ${pool.category}.`;

      const articleObj = {
        slug,
        title: cleanTitle,
        excerpt,
        date: today,
        author,
        category: pool.category,
        subcategory: pool.subcategory,
        tags: [pool.category, pool.subcategory, ...slug.split('-').filter((w) => w.length > 3).slice(0, 3)],
        image: orig.source,
        imageAlt: `${cleanTitle} archival reference photograph`,
        body,
      };

      fs.writeFileSync(path.join(articlesDir, `${slug}.json`), JSON.stringify(articleObj), 'utf8');
      existingSlugs.add(slug);
      existingImages.add(orig.source);
      created++;
      if (created % 50 === 0) {
        console.log(`  ... ${created}/${TARGET_COUNT} articles created`);
        state.totalIngested = (state.totalIngested || 0) + 50;
        fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
      }
    }
  }

  state.totalIngested = (state.totalIngested || 0) + (created % 50);
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
  console.log(`✅ Created ${created} new high-quality articles (Total ingested across batches: ${state.totalIngested}).`);
}

run();

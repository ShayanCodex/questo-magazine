import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { fetchMediaForArticle } from './media-fetcher.mjs';

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn('Notice: Local .env could not be loaded.');
    }
  }
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Ban list enforced strictly
const BANNED_WORDS = [
  'delve',
  'tapestry',
  'testament',
  'realm',
  'unlock',
  'in conclusion',
  'moreover',
  'beacon',
  'game-changer',
  'vital role',
  'ever-evolving'
];

/**
 * Generate human-grade article using OpenRouter API
 */
export async function generateArticlePayload({ topicItem, relatedSlugs = [] }) {
  console.log(`\n[Article Generator] Generating: "${topicItem.title}" (${topicItem.category})`);

  const media = await fetchMediaForArticle({
    categorySlug: topicItem.categorySlug,
    keyword: topicItem.primaryKeyword,
    title: topicItem.title
  });

  const systemPrompt = `
You are a Principal Editorial Architect, Senior Investigative Journalist, and Technical SEO Strategist for Questo Magazine.
Write a comprehensive, deeply researched, humanized long-form article on: "${topicItem.title}".
Category: ${topicItem.category}
Primary Keyword: ${topicItem.primaryKeyword}
Secondary Keywords: ${topicItem.lsiKeywords.join(', ')}

Strict Quality Rubrics:
1. Humanization & Voice: Use varied sentence lengths (burstiness), active voice, and intellectual clarity.
2. STRICTLY FORBIDDEN WORDS: You must NEVER use the following words or phrases under any circumstances:
   ${BANNED_WORDS.map(w => `"${w}"`).join(', ')}.
3. Depth & E-E-A-T: Provide empirical mechanisms, historical provenance, technical specifics, and verifiable principles. Not generic fluff.
4. Structure:
   - Compelling Title (under 60 characters)
   - Meta description (under 155 characters)
   - 4 to 6 detailed H2 sections and sub-H3 sections
   - At least one historical or philosophical quotation
   - HTML body must be between 900 and 1,300 words
   - FAQ: Exactly 3 high-intent search questions answered with precision.

Return STRICT JSON format:
{
  "title": "Short Title (<60 chars)",
  "metaDescription": "Concise CTR-focused description under 155 chars...",
  "readingTimeMinutes": 6,
  "authorName": "Distinguished Contributor Name",
  "authorRole": "Senior Subject Specialist",
  "contentHtml": "<p>...</p><h2>...</h2><p>...</p><blockquote>...</blockquote><h2>...</h2><p>...</p>",
  "body": [
    { "type": "p", "text": "..." },
    { "type": "h2", "text": "..." },
    { "type": "p", "text": "..." },
    { "type": "quote", "text": "...", "cite": "..." },
    { "type": "h2", "text": "..." },
    { "type": "p", "text": "..." }
  ],
  "faq": [
    { "question": "Search question 1?", "answer": "Factual answer 1." },
    { "question": "Search question 2?", "answer": "Factual answer 2." },
    { "question": "Search question 3?", "answer": "Factual answer 3." }
  ]
}
`;

  const models = [
    "meta-llama/llama-3.3-70b-instruct",
    "google/gemini-2.0-flash-001",
    "deepseek/deepseek-chat",
    "qwen/qwen-2.5-72b-instruct"
  ];

  let parsed = null;

  for (const model of models) {
    try {
      console.log(`Calling OpenRouter with model: ${model}...`);
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://questo-magazine.com",
          "X-Title": "Questo Content Engine"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Write the definitive, human-grade monograph for: "${topicItem.title}".` }
          ],
          response_format: { type: "json_object" },
          temperature: 0.72,
          max_tokens: 2800
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`Model ${model} returned ${res.status}: ${errText.slice(0, 100)}`);
        continue;
      }

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content;
      if (content) {
        parsed = JSON.parse(content);
        console.log(`Successfully received content from ${model}!`);
        break;
      }
    } catch (e) {
      console.warn(`Attempt failed with ${model}:`, e.message);
    }
  }

  if (!parsed) {
    throw new Error(`Failed to generate content for "${topicItem.title}" across all fallback models.`);
  }

  // Construct complete standardized payload
  const now = new Date().toISOString();
  const dateShort = now.split('T')[0];

  const payload = {
    id: crypto.randomUUID(),
    slug: topicItem.slug,
    category: topicItem.category,
    categorySlug: topicItem.categorySlug,
    title: parsed.title || topicItem.title,
    metaDescription: (parsed.metaDescription || parsed.title).slice(0, 155),
    publishedAt: now,
    readingTimeMinutes: parsed.readingTimeMinutes || 6,
    author: {
      name: parsed.authorName || "Editorial Desk",
      role: parsed.authorRole || "Senior Staff Analyst"
    },
    featuredImage: media.featuredImage,
    featuredVideo: media.featuredVideo,
    keywords: [topicItem.primaryKeyword, ...topicItem.lsiKeywords],
    contentHtml: parsed.contentHtml,
    faq: parsed.faq || [],
    relatedSlugs: relatedSlugs,
    
    // Compatibility fields for Questo core SSG
    excerpt: parsed.metaDescription,
    date: dateShort,
    updated: dateShort,
    image: media.featuredImage.url,
    imageAlt: media.featuredImage.alt,
    tags: [topicItem.categorySlug, topicItem.baseCategory, ...topicItem.lsiKeywords.map(k => k.replace(/\s+/g, '-'))].slice(0, 5),
    body: parsed.body || [
      { type: 'p', text: parsed.metaDescription },
      { type: 'h2', text: 'Operational Telemetry and Core Dynamics' },
      { type: 'p', text: 'Detailed editorial monograph content dynamically rendered from atomic content manifest.' }
    ]
  };

  return payload;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateArticlePayload({
    topicItem: {
      title: 'The Geopolitics of Critical Minerals and Rare Earth Chokepoints',
      slug: 'geopolitics-critical-minerals-chokepoints',
      category: 'Breaking News & Global Affairs',
      categorySlug: 'breaking-news-global-affairs',
      baseCategory: 'news',
      primaryKeyword: 'geopolitics',
      lsiKeywords: ['critical minerals', 'rare earth', 'supply chain']
    }
  }).then(p => {
    console.log('Generated payload sample:', p.title);
    console.log('Word count est:', p.contentHtml.split(/\s+/).length);
    console.log('Video provider:', p.featuredVideo.provider);
  });
}

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content', 'articles');

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

// Available categories matching Questo taxonomy
const VALID_CATEGORIES = [
  'engineering-and-technology',
  'science-and-nature',
  'markets-and-finance',
  'art-and-culture',
  'architecture-and-space',
  'design-and-typography'
];

// Curated high-resolution Unsplash photography library for fresh generation
const CURATED_IMAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80"
];

function getRandomImage() {
  return CURATED_IMAGES[Math.floor(Math.random() * CURATED_IMAGES.length)];
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Generate an enterprise-grade editorial article via OpenRouter API
 */
export async function generateArticle({ topic, niche, competitorData }) {
  console.log(`\n--- Generating AI Master Article: "${topic}" ---`);
  console.log(`Niche: ${niche}`);

  const systemPrompt = `
You are an award-winning investigative journalist and senior SEO editor for Questo Magazine (an intellectual publication covering deep tech, science, global markets, classical arts, and architecture).

Write a comprehensive, 100% human-grade, deeply researched, original monograph.
NO AI cliches (do not use "in a world where", "tapestry", "beacon", "dive deep", "game-changer", "delve").
Tone: Authoritative, eloquent, precise, and intellectually rigorous.

Article Requirements:
- Title: Catchy, concise, strictly under 55 characters.
- Excerpt: 1-2 sentence intellectual summary.
- Body: Structure with rich paragraphs ('p'), authoritative subheadings ('h2'), and at least one historical or philosophical quote ('quote').
- FAQs: Exactly 3 high-impact questions answering common Google search queries for this topic.

Return STRICT JSON format adhering to:
{
  "title": "Short Title (<55 chars)",
  "excerpt": "Compelling summary...",
  "category": "${niche}",
  "subcategory": "specific-field",
  "author": "Distinguished Author Name",
  "tags": ["tag1", "tag2", "tag3"],
  "body": [
    { "type": "p", "text": "..." },
    { "type": "h2", "text": "..." },
    { "type": "p", "text": "..." },
    { "type": "quote", "text": "...", "cite": "..." },
    { "type": "h2", "text": "..." },
    { "type": "p", "text": "..." }
  ],
  "faqs": [
    { "q": "Question 1?", "a": "Direct, informative answer." },
    { "q": "Question 2?", "a": "Direct, informative answer." },
    { "q": "Question 3?", "a": "Direct, informative answer." }
  ]
}
`;

  const models = [
    "meta-llama/llama-3.3-70b-instruct",
    "deepseek/deepseek-chat",
    "qwen/qwen-2.5-72b-instruct",
    "google/gemini-2.0-flash-001",
    "anthropic/claude-3.5-sonnet"
  ];

  let rawJson = null;

  for (const model of models) {
    try {
      console.log(`Attempting generation with model: ${model}...`);
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
            { role: "user", content: `Produce the definitive editorial monograph on: "${topic}". Include relevant context: ${JSON.stringify(competitorData || {})}` }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`Model ${model} returned status ${response.status}: ${errText.slice(0, 150)}`);
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        rawJson = JSON.parse(content);
        console.log(`Successfully generated article with ${model}!`);
        break;
      }
    } catch (err) {
      console.warn(`Error with ${model}:`, err.message);
    }
  }

  if (!rawJson) {
    throw new Error("All OpenRouter models failed to generate valid JSON content.");
  }

  const slug = slugify(rawJson.title);
  const today = new Date().toISOString().split('T')[0];

  const finalArticle = {
    slug: slug,
    title: rawJson.title,
    excerpt: rawJson.excerpt,
    date: today,
    updated: today,
    author: rawJson.author || "Editorial Staff",
    image: getRandomImage(),
    imageAlt: `${rawJson.title} - Operational Architecture and Editorial Telemetry`,
    tags: (rawJson.tags || [niche]).map(t => slugify(t)),
    category: VALID_CATEGORIES.includes(rawJson.category) ? rawJson.category : niche,
    subcategory: rawJson.subcategory || "monograph",
    body: rawJson.body,
    faqs: rawJson.faqs || []
  };

  const filePath = path.join(contentDir, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(finalArticle, null, 2), 'utf8');
  console.log(`Saved article to: content/articles/${slug}.json`);

  return finalArticle;
}

// CLI Execution support
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const sampleTopic = process.argv[2] || "Topological Quantum Codes and Surface Error Suppression";
  const sampleNiche = process.argv[3] || "engineering-and-technology";
  generateArticle({ topic: sampleTopic, niche: sampleNiche })
    .then(art => console.log(`Finished: ${art.title} (${art.slug})`))
    .catch(err => {
      console.error('Fatal generation error:', err);
      process.exit(1);
    });
}

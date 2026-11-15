export interface Subcategory {
  id: string;
  name: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  subcategories: Subcategory[];
}

export const CATEGORIES: Category[] = [
  // Core Classical Foundations
  {
    id: 'art-and-culture',
    name: 'Art & Culture',
    description: 'Classical aesthetics, monumental sculpture, and visual expressions.',
    subcategories: [
      { id: 'visual-arts', name: 'Visual Arts', description: 'Visual rhythm, compositions, and masterworks.' },
      { id: 'sculpture', name: 'Sculpture', description: 'Carved stone, physical endurance, and classical form.' },
      { id: 'street-art', name: 'Street Art', description: 'Urban murals, raw public expressions, and public art.' },
    ],
  },
  {
    id: 'architecture-and-space',
    name: 'Architecture & Space',
    description: 'Monolithic structures, raw concrete, and contemplative void space.',
    subcategories: [
      { id: 'minimalist-design', name: 'Minimalist Design', description: 'Unadorned stone, silent geometries, and void.' },
      { id: 'monuments-and-stone', name: 'Monuments & Stone', description: 'Enduring architectural forms and raw masonry.' },
      { id: 'spatial-theory', name: 'Spatial Theory', description: 'Sanctuaries of contemplation and structural pauses.' },
    ],
  },
  {
    id: 'design-and-typography',
    name: 'Design & Typography',
    description: 'Swiss grid theory, mathematical rigor, and monumental editorial type.',
    subcategories: [
      { id: 'editorial-systems', name: 'Editorial Systems', description: 'Mid-century editorial design and page layouts.' },
      { id: 'grid-theory', name: 'Grid Theory', description: 'Mathematical discipline, margins, and typographic rules.' },
      { id: 'typography', name: 'Typography', description: 'Display letterforms, legibility, and font pairing.' },
    ],
  },
  {
    id: 'engineering-and-technology',
    name: 'Engineering & Technology',
    description: 'Lean systems architecture, static publishing, and pure functional code.',
    subcategories: [
      { id: 'system-architecture', name: 'System Architecture', description: 'Rejecting bloated runtime layers and unnecessary abstractions.' },
      { id: 'static-performance', name: 'Static Performance', description: 'High-speed SSG pipelines and zero runtime client fetching.' },
      { id: 'functional-craft', name: 'Functional Craft', description: 'Disciplined code design and robust static delivery.' },
    ],
  },

  // Global Niches Expansion (1,000+ Master Library)
  {
    id: 'technology',
    name: 'Technology & Innovation',
    description: 'Artificial intelligence, machine learning, robotics, and emerging digital frontiers.',
    subcategories: [
      { id: 'artificial-intelligence', name: 'Artificial Intelligence', description: 'Neural networks, generative models, and LLM foundations.' },
      { id: 'machine-learning', name: 'Machine Learning', description: 'Statistical learning, inference pipelines, and model architecture.' },
      { id: 'cybersecurity', name: 'Cybersecurity', description: 'Zero-trust networks, cryptographic verification, and threat mitigation.' },
      { id: 'robotics-and-iot', name: 'Robotics & Hardware', description: 'Autonomous agents, physical sensors, and embedded systems.' },
    ],
  },
  {
    id: 'software',
    name: 'Software & Developer Resources',
    description: 'Modern web frameworks, system programming, clean code, and developer productivity.',
    subcategories: [
      { id: 'web-frameworks', name: 'Web Frameworks', description: 'React, Next.js, Vite, and component architecture.' },
      { id: 'backend-and-apis', name: 'Backend & APIs', description: 'REST, GraphQL, microservices, and high-concurrency runtimes.' },
      { id: 'devops-and-cloud', name: 'DevOps & Edge', description: 'CI/CD, container orchestration, and serverless compute.' },
      { id: 'languages-and-compilers', name: 'Languages & Compilers', description: 'TypeScript, Rust, Go, and low-level memory efficiency.' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance, Trading & Markets',
    description: 'Global equity indices, macroeconomic liquidity, foreign exchange, and commodities.',
    subcategories: [
      { id: 'global-markets', name: 'Global Markets', description: 'S&P 500, NASDAQ, FTSE, and international stock exchanges.' },
      { id: 'forex-and-liquidity', name: 'Forex & Central Banking', description: 'Currency corridors, swap lines, and monetary policy.' },
      { id: 'commodities', name: 'Commodities & Energy', description: 'Gold, silver, crude oil, and agricultural trade.' },
      { id: 'risk-management', name: 'Risk & Portfolio Theory', description: 'Position sizing, volatility modeling, and hedging strategies.' },
    ],
  },
  {
    id: 'business',
    name: 'Business & Industry',
    description: 'Entrepreneurial strategy, global supply chains, leadership, and industrial dynamics.',
    subcategories: [
      { id: 'startups-and-venture', name: 'Startups & Venture', description: 'Seed-stage capital, product-market fit, and scaling.' },
      { id: 'corporate-strategy', name: 'Corporate Strategy', description: 'Competitive moats, capital allocation, and M&A.' },
      { id: 'supply-chain', name: 'Logistics & Supply Chain', description: 'Global freight, manufacturing, and inventory systems.' },
      { id: 'leadership', name: 'Executive Leadership', description: 'Organizational psychology, talent retention, and governance.' },
    ],
  },
  {
    id: 'crypto',
    name: 'Blockchain & Cryptocurrency',
    description: 'Decentralized protocols, cryptographic consensus, smart contracts, and Web3 infrastructure.',
    subcategories: [
      { id: 'layer-1-and-layer-2', name: 'Layer 1 & Layer 2', description: 'Bitcoin, Ethereum, rollup scaling, and state channels.' },
      { id: 'defi', name: 'Decentralized Finance', description: 'Automated market makers, lending pools, and synthetic assets.' },
      { id: 'smart-contracts', name: 'Smart Contract Security', description: 'Solidity auditing, EVM opcodes, and formal verification.' },
      { id: 'tokenomics', name: 'Tokenomics & Governance', description: 'Incentive design, DAO mechanics, and treasury management.' },
    ],
  },
  {
    id: 'sports',
    name: 'Sports & Athletics',
    description: 'Tactical analysis, sports science, elite tournament breakdowns, and biomechanics.',
    subcategories: [
      { id: 'football', name: 'Football (Soccer)', description: 'Tactical formations, pressing systems, and European leagues.' },
      { id: 'motorsport', name: 'Motorsport & Formula 1', description: 'Aerodynamics, telemetry analysis, and race engineering.' },
      { id: 'basketball', name: 'Basketball & NBA', description: 'Pace-and-space analytics, shot charts, and roster construction.' },
      { id: 'sports-science', name: 'Sports Science & Biomechanics', description: 'Physiological conditioning, neuromuscular power, and injury prevention.' },
    ],
  },
  {
    id: 'health',
    name: 'Medical & Healthcare',
    description: 'Evidence-based medical research, public health, nutrition science, and human physiology.',
    subcategories: [
      { id: 'preventive-medicine', name: 'Preventive Medicine', description: 'Cardiometabolic health, longevity biomarkers, and early detection.' },
      { id: 'medical-research', name: 'Clinical Research', description: 'Peer-reviewed trials, pharmaceutical developments, and immunology.' },
      { id: 'nutrition-science', name: 'Nutrition Science', description: 'Macronutrient metabolism, glycemic response, and micronutrients.' },
      { id: 'mental-wellness', name: 'Neuroscience & Mental Health', description: 'Cognitive behavioral science, sleep architecture, and stress biology.' },
    ],
  },
  {
    id: 'science',
    name: 'Science & Education',
    description: 'Theoretical physics, astronomy, environmental biology, and pedagogy.',
    subcategories: [
      { id: 'astronomy-and-space', name: 'Astronomy & Space', description: 'Astrophysics, exoplanets, gravitational waves, and space exploration.' },
      { id: 'physics-and-materials', name: 'Physics & Materials', description: 'Quantum mechanics, condensed matter, and thermodynamics.' },
      { id: 'environmental-science', name: 'Earth & Climate Science', description: 'Carbon cycles, planetary ecology, and geological epochs.' },
      { id: 'educational-methods', name: 'Pedagogy & Cognition', description: 'Spaced repetition, cognitive load theory, and deep learning.' },
    ],
  },
  {
    id: 'entertainment',
    name: 'Entertainment & Media',
    description: 'Cinema, music industry economics, streaming platforms, and narrative theory.',
    subcategories: [
      { id: 'cinema-and-film', name: 'Cinema & Directing', description: 'Cinematography, auteur theory, and feature film analysis.' },
      { id: 'music-industry', name: 'Music & Audio Craft', description: 'Sonic composition, vinyl culture, and publishing rights.' },
      { id: 'gaming-and-interactive', name: 'Interactive Media & Gaming', description: 'Game engine design, narrative branching, and esports.' },
    ],
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle & Personal Growth',
    description: 'Productivity systems, minimalist living, intentional career design, and habits.',
    subcategories: [
      { id: 'productivity-systems', name: 'Productivity & Focus', description: 'Deep work, asynchronous communication, and time blocking.' },
      { id: 'sustainable-living', name: 'Sustainable Living', description: 'Zero-waste habits, conscious consumption, and spatial order.' },
      { id: 'career-growth', name: 'Career & Craft', description: 'Deliberate practice, mentorship, and high-impact work.' },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness & Physical Performance',
    description: 'Resistance training, cardiovascular programming, mobility, and recovery protocols.',
    subcategories: [
      { id: 'strength-training', name: 'Strength & Hypertrophy', description: 'Periodization, progressive overload, and mechanical tension.' },
      { id: 'aerobic-endurance', name: 'Cardiovascular Conditioning', description: 'Zone 2 base training, VO2 max intervals, and mitochondrial health.' },
      { id: 'mobility-and-recovery', name: 'Mobility & Recovery', description: 'Joint hygiene, fascial release, and parasympathetic recovery.' },
    ],
  },
  {
    id: 'food',
    name: 'Food & Gastronomy',
    description: 'Culinary chemistry, classical cooking techniques, food history, and fermentation.',
    subcategories: [
      { id: 'culinary-techniques', name: 'Culinary Craft', description: 'Maillard reaction, knife skills, emulsion science, and roasting.' },
      { id: 'fermentation-and-bread', name: 'Fermentation & Baking', description: 'Sourdough microbiology, lactic fermentation, and aging.' },
      { id: 'sustainable-gastronomy', name: 'Food Systems & Sourcing', description: 'Farm-to-table supply, heirloom varietals, and terroir.' },
    ],
  },
  {
    id: 'travel',
    name: 'Travel & Global Exploration',
    description: 'Expedition journalism, architectural pilgrimage, cultural itineraries, and slow travel.',
    subcategories: [
      { id: 'expeditions-and-routes', name: 'Overland Expeditions', description: 'Alpine passes, trans-continental rail, and remote treks.' },
      { id: 'cultural-destinations', name: 'Historic & Cultural Capitals', description: 'Museum archives, ancient heritage, and local communities.' },
      { id: 'sustainable-travel', name: 'Responsible Exploration', description: 'Low-impact transit, wilderness conservation, and ethics.' },
    ],
  },
  {
    id: 'news',
    name: 'Breaking News & World Affairs',
    description: 'Investigative reporting, geopolitical treaties, international summits, and policy.',
    subcategories: [
      { id: 'geopolitics', name: 'Geopolitics & Treaties', description: 'Diplomatic relations, international alliances, and border pacts.' },
      { id: 'world-economy', name: 'Global Economic Policy', description: 'Trade accords, sovereign debt, and multilateral organizations.' },
      { id: 'climate-policy', name: 'Climate & Environment Policy', description: 'Global energy transition, biodiversity summits, and accords.' },
    ],
  },
];

/**
 * Reliable fallback mapping for baseline articles by slug
 */
const ARTICLE_SLUG_CATEGORY_MAP: Record<string, { categoryId: string; subcategoryId: string }> = {
  'the-death-of-the-card-grid': { categoryId: 'art-and-culture', subcategoryId: 'street-art' },
  'craft-over-convenience': { categoryId: 'art-and-culture', subcategoryId: 'sculpture' },
  'the-geometry-of-silence': { categoryId: 'architecture-and-space', subcategoryId: 'minimalist-design' },
  'the-grid-as-an-instrument': { categoryId: 'design-and-typography', subcategoryId: 'editorial-systems' },
  'pure-functional-simplicity': { categoryId: 'engineering-and-technology', subcategoryId: 'system-architecture' },
  'building-static-multilingual-publishing': { categoryId: 'engineering-and-technology', subcategoryId: 'static-performance' },
  'the-poetics-of-concrete': { categoryId: 'architecture-and-space', subcategoryId: 'monuments-and-stone' },
  'the-architecture-of-sub-second-web-performance': { categoryId: 'engineering-and-technology', subcategoryId: 'static-performance' },
  'algorithmic-market-intelligence-and-open-financial-data': { categoryId: 'finance', subcategoryId: 'global-markets' },
  'monolithic-brutalism-in-the-twenty-first-century': { categoryId: 'architecture-and-space', subcategoryId: 'monuments-and-stone' },
  'spatial-minimalism-and-the-psychology-of-the-void': { categoryId: 'architecture-and-space', subcategoryId: 'minimalist-design' },
  'the-mathematical-elegance-of-the-swiss-grid': { categoryId: 'design-and-typography', subcategoryId: 'grid-theory' },
  'variable-fonts-and-the-future-of-editorial-legibility': { categoryId: 'design-and-typography', subcategoryId: 'typography' },
  'the-tactile-resurgence-of-material-culture': { categoryId: 'art-and-culture', subcategoryId: 'sculpture' },
  'digital-autonomy-and-the-minimalist-screen': { categoryId: 'technology', subcategoryId: 'artificial-intelligence' },
  'the-renaissance-of-brutalist-web-design': { categoryId: 'design-and-typography', subcategoryId: 'editorial-systems' },
  'decentralized-edge-architectures-and-micro-caches': { categoryId: 'software', subcategoryId: 'devops-and-cloud' },
  'acoustic-geometry-and-sound-in-sacred-spaces': { categoryId: 'architecture-and-space', subcategoryId: 'spatial-theory' },
  'the-art-of-the-monograph-and-tactile-publishing': { categoryId: 'art-and-culture', subcategoryId: 'visual-arts' },
  'forex-liquidity-corridors-and-sovereign-reserves': { categoryId: 'finance', subcategoryId: 'forex-and-liquidity' },
  'architecture-of-transformer-attention-mathematics-and-kv-cache': { categoryId: 'technology', subcategoryId: 'artificial-intelligence' },
  'cardiometabolic-biomarkers-apob-endothelial-nitric-oxide': { categoryId: 'health', subcategoryId: 'preventive-medicine' },
  'sovereign-debt-cycles-yield-curve-inversions-repo-settlement': { categoryId: 'finance', subcategoryId: 'forex-and-liquidity' },
  'spatial-pressing-geometry-positional-play-rest-defense': { categoryId: 'sports', subcategoryId: 'football' },
  'microbial-ecology-wild-sourdough-lactic-acid-bacteria-proteolysis': { categoryId: 'food', subcategoryId: 'fermentation-and-bread' },
  'compiler-driven-react-server-components-hydration-elimination': { categoryId: 'software', subcategoryId: 'web-frameworks' },
  'zero-knowledge-rollups-zk-snarks-and-layer-2-scaling-mechanics': { categoryId: 'crypto', subcategoryId: 'layer-1-and-layer-2' },
  'gravitational-wave-interferometry-ligo-and-neutron-star-mergers': { categoryId: 'science', subcategoryId: 'astronomy-and-space' },
  'the-mechanics-of-enterprise-saas-retention-cohort-dynamics-and-ndr': { categoryId: 'business', subcategoryId: 'startups-and-venture' },
  'trans-alpine-rail-engineering-and-high-altitude-topography': { categoryId: 'travel', subcategoryId: 'expeditions-and-routes' },
  'ground-effect-aerodynamics-venturi-tunnels-and-porpoising-mechanics': { categoryId: 'engineering-and-technology', subcategoryId: 'mechanical-systems' },
  'postprandial-glycemic-variability-continuous-glucose-monitoring-and-metabolic-flexibility': { categoryId: 'health', subcategoryId: 'preventive-medicine' },
  'high-voltage-direct-current-transmission-and-intercontinental-supergrids': { categoryId: 'technology', subcategoryId: 'energy-and-infrastructure' },
  'constant-function-market-makers-impermanent-loss-and-concentrated-liquidity': { categoryId: 'crypto', subcategoryId: 'defi-and-protocols' },
  'reverberation-time-schroeder-frequency-and-spatial-diffusor-arrays': { categoryId: 'architecture-and-space', subcategoryId: 'structural-design' },
  'inverse-kinematics-and-impedance-control-in-bipedal-robotics': { categoryId: 'technology', subcategoryId: 'robotics-and-iot' },
  'chemistry-of-espresso-extraction-and-particle-distribution': { categoryId: 'food', subcategoryId: 'culinary-techniques' },
  'multilink-suspension-geometry-and-camber-recovery': { categoryId: 'sports', subcategoryId: 'motorsport' },
  'glymphatic-clearance-and-slow-wave-sleep-architecture': { categoryId: 'health', subcategoryId: 'mental-wellness' },
  'lng-liquefaction-mechanics-and-maritime-energy-corridors': { categoryId: 'finance', subcategoryId: 'commodities' },
};

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}

export function getCategoryShortName(categoryId: string): string {
  switch (categoryId) {
    case 'art-and-culture':
      return 'Art & Life';
    case 'architecture-and-space':
      return 'Architecture';
    case 'design-and-typography':
      return 'Design';
    case 'engineering-and-technology':
      return 'Tech';
    case 'technology':
      return 'Innovation';
    case 'software':
      return 'Software';
    case 'finance':
      return 'Finance';
    case 'business':
      return 'Business';
    case 'crypto':
      return 'Crypto';
    case 'sports':
      return 'Sports';
    case 'health':
      return 'Health';
    case 'science':
      return 'Science';
    case 'entertainment':
      return 'Media';
    case 'lifestyle':
      return 'Lifestyle';
    case 'fitness':
      return 'Fitness';
    case 'food':
      return 'Gastronomy';
    case 'travel':
      return 'Travel';
    case 'news':
      return 'World News';
    default:
      return 'Editorial';
  }
}

/**
 * Formats a raw tag or topic slug into a human-readable editorial label (e.g. "design-systems" -> "Design Systems", "ssg" -> "SSG")
 * Removes leading '#' hashtags to avoid AI-generated website aesthetics.
 */
export function formatTopicName(topic: string): string {
  if (!topic) return '';
  const clean = topic.replace(/^#+/, '').trim();
  if (clean.toLowerCase() === 'ssg') return 'SSG';
  if (clean.toLowerCase() === 'ai') return 'AI';
  if (clean.toLowerCase() === 'api' || clean.toLowerCase() === 'apis') return 'APIs';
  return clean
    .split(/[-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function getSubcategoryById(categoryId: string, subcategoryId: string): Subcategory | undefined {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find((sub) => sub.id === subcategoryId);
}

export function getArticleCategory(article: { slug?: string; category?: string; subcategory?: string }): {
  category: Category;
  subcategory?: Subcategory;
} {
  const fallback = article.slug ? ARTICLE_SLUG_CATEGORY_MAP[article.slug] : undefined;
  const categoryId = article.category || fallback?.categoryId || 'art-and-culture';
  const subcategoryId = article.subcategory || fallback?.subcategoryId;

  const category = getCategoryById(categoryId) || CATEGORIES[0];
  const subcategory = subcategoryId ? getSubcategoryById(category.id, subcategoryId) : undefined;

  return { category, subcategory };
}

export interface SearchSuggestion {
  type: 'category' | 'subcategory' | 'topic' | 'query';
  label: string;
  value: string;
  categoryId?: string;
  subcategoryId?: string;
  count?: number;
}

/**
 * Generates smart suggestions for search inputs based on current query and articles
 */
export interface StructuredSearchSuggestions {
  categories: SearchSuggestion[];
  subcategories: SearchSuggestion[];
  topics: SearchSuggestion[];
  queries: SearchSuggestion[];
  total: number;
}

export function getStructuredSearchSuggestions(
  rawQuery: string,
  articles: Array<{ title: string; tags: string[]; slug: string; category?: string; subcategory?: string }> = []
): StructuredSearchSuggestions {
  const q = rawQuery.trim().toLowerCase();
  const categories: SearchSuggestion[] = [];
  const subcategories: SearchSuggestion[] = [];
  const topics: SearchSuggestion[] = [];
  const queries: SearchSuggestion[] = [];

  // When query is empty, surface all categories, top subcategories, and popular tags
  if (!q) {
    CATEGORIES.forEach((cat) => {
      categories.push({
        type: 'category',
        label: cat.name,
        value: cat.name,
        categoryId: cat.id,
      });
      cat.subcategories.slice(0, 2).forEach((sub) => {
        subcategories.push({
          type: 'subcategory',
          label: sub.name,
          value: sub.name,
          categoryId: cat.id,
          subcategoryId: sub.id,
        });
      });
    });

    const popularTags = ['architecture', 'art', 'craft', 'design-systems', 'engineering', 'sculpture', 'minimalism', 'ai', 'finance', 'sports', 'health'];
    popularTags.forEach((tg) => {
      topics.push({
        type: 'topic',
        label: formatTopicName(tg),
        value: tg,
      });
    });

    return {
      categories,
      subcategories,
      topics,
      queries,
      total: categories.length + subcategories.length + topics.length,
    };
  }

  // Filter Categories
  for (const cat of CATEGORIES) {
    if (cat.name.toLowerCase().includes(q) || cat.id.includes(q)) {
      categories.push({
        type: 'category',
        label: cat.name,
        value: cat.name,
        categoryId: cat.id,
      });
    }

    // Filter Subcategories
    for (const sub of cat.subcategories) {
      if (sub.name.toLowerCase().includes(q) || sub.id.includes(q)) {
        subcategories.push({
          type: 'subcategory',
          label: `${cat.name} › ${sub.name}`,
          value: sub.name,
          categoryId: cat.id,
          subcategoryId: sub.id,
        });
      }
    }
  }

  // Filter Tags / Topics across articles
  const tagCounts = new Map<string, number>();
  articles.forEach((art) => {
    (art.tags || []).forEach((t) => {
      const lower = t.toLowerCase();
      tagCounts.set(lower, (tagCounts.get(lower) || 0) + 1);
    });
  });

  for (const [tag, count] of tagCounts.entries()) {
    if (tag.includes(q)) {
      topics.push({
        type: 'topic',
        label: formatTopicName(tag),
        value: tag,
        count,
      });
    }
  }

  // Matching Article Titles
  for (const art of articles) {
    if (art.title.toLowerCase().includes(q)) {
      queries.push({
        type: 'query',
        label: art.title,
        value: art.title,
      });
    }
  }

  return {
    categories: categories.slice(0, 6),
    subcategories: subcategories.slice(0, 6),
    topics: topics.slice(0, 8),
    queries: queries.slice(0, 5),
    total: categories.length + subcategories.length + topics.length + queries.length,
  };
}

export function getSearchSuggestions(
  rawQuery: string,
  articles: Array<{ title: string; tags: string[]; slug: string; category?: string; subcategory?: string }> = []
): SearchSuggestion[] {
  const structured = getStructuredSearchSuggestions(rawQuery, articles);
  return [
    ...structured.categories,
    ...structured.subcategories,
    ...structured.topics,
    ...structured.queries,
  ];
}

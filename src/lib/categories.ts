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
  'training-large-language-models-tokenization-pretraining-alignment': { categoryId: 'technology', subcategoryId: 'artificial-intelligence' },
  'solid-state-battery-chemistry-sulfide-electrolytes-silicon-anodes': { categoryId: 'engineering-and-technology', subcategoryId: 'mechanical-systems' },
  'superconducting-qubits-josephson-junctions-quantum-coherence': { categoryId: 'science', subcategoryId: 'physics-and-materials' },
  'cellular-senescence-autophagy-signaling-and-mtor-pathways': { categoryId: 'health', subcategoryId: 'preventive-medicine' },
  'central-bank-digital-currencies-wholesale-settlement-programmable-money': { categoryId: 'finance', subcategoryId: 'forex-and-liquidity' },
  'global-semiconductor-supply-chains-euv-lithography-geopolitics': { categoryId: 'engineering-and-technology', subcategoryId: 'system-architecture' },
  'small-modular-reactors-molten-salt-high-temperature-gas-nuclear': { categoryId: 'engineering-and-technology', subcategoryId: 'mechanical-systems' },
  'neuromorphic-computing-spiking-neural-networks-event-driven-silicon': { categoryId: 'technology', subcategoryId: 'artificial-intelligence' },
  'de-dollarization-sovereign-reserve-diversification-and-bilateral-trade': { categoryId: 'finance', subcategoryId: 'forex-and-liquidity' },
  'crispr-cas12-base-editing-and-in-vivo-epigenetic-therapeutics': { categoryId: 'health', subcategoryId: 'preventive-medicine' },
  'geopolitics-of-critical-minerals-lithium-rare-earths-supply-chains': { categoryId: 'news', subcategoryId: 'geopolitics' },
  'anatomy-of-venture-capital-liquidity-secondary-markets-dpi-dynamics': { categoryId: 'business', subcategoryId: 'startups-and-venture' },
  'biomechanical-force-vectors-in-tennis-serves-kinetic-chain-sequencing': { categoryId: 'sports', subcategoryId: 'sports-science' },
  'acoustic-diffusors-and-schroeder-number-sequences-in-architecture': { categoryId: 'architecture-and-space', subcategoryId: 'spatial-theory' },
  'maillard-reaction-kinetics-and-non-enzymatic-browning-thermodynamics': { categoryId: 'food', subcategoryId: 'culinary-techniques' },
  'hypertrophy-mechanotransduction-and-myofibrillar-protein-synthesis': { categoryId: 'fitness', subcategoryId: 'strength-training' },
  'deep-sea-hydrothermal-vents-chemosynthesis-and-extremophile-biology': { categoryId: 'science', subcategoryId: 'environmental-science' },
  'trans-himalayan-high-altitude-mountaineering-and-hypoxia-adaptation': { categoryId: 'travel', subcategoryId: 'expeditions-and-routes' },
  'circadian-entrainment-and-melanopic-lux-in-workspace-ergonomics': { categoryId: 'lifestyle', subcategoryId: 'productivity-systems' },
  'distributed-consensus-raft-paxos-and-byzantine-fault-tolerant-state-machines': { categoryId: 'software', subcategoryId: 'backend-and-apis' },
  'autonomous-agent-loops-and-context-compaction': { categoryId: 'technology', subcategoryId: 'artificial-intelligence' },
  'sovereign-wealth-funds-and-global-infrastructure-assets': { categoryId: 'finance', subcategoryId: 'forex-and-liquidity' },
  'ebpf-programmable-kernels-and-sub-millisecond-observability': { categoryId: 'software', subcategoryId: 'backend-and-apis' },
  'parametric-timber-structures-and-low-carbon-acoustics': { categoryId: 'architecture-and-space', subcategoryId: 'spatial-theory' },
  'topological-quantum-codes-and-surface-code-error-suppression': { categoryId: 'science', subcategoryId: 'physics-and-materials' },
  'mitochondrial-biogenesis-and-nad-metabolism-in-aging': { categoryId: 'health', subcategoryId: 'preventive-medicine' },
  'aerospike-engines-and-single-stage-to-orbit-propulsion': { categoryId: 'science', subcategoryId: 'astronomy-and-space' },
  'post-quantum-cryptography-and-lattice-based-signatures': { categoryId: 'crypto', subcategoryId: 'layer-1-and-layer-2' },
  'enzymatic-koji-fermentation-and-umami-peptides': { categoryId: 'food', subcategoryId: 'fermentation-and-bread' },
  'lactate-shuttle-dynamics-and-mitochondrial-clearance': { categoryId: 'sports', subcategoryId: 'sports-science' },
  'algorithmic-typographic-rhythm-and-fluid-reading-scales': { categoryId: 'design-and-typography', subcategoryId: 'typography' },
  'autonomous-container-vessels-and-panama-canal-draft-economics': { categoryId: 'news', subcategoryId: 'world-economy' },
};

export const CATEGORY_ALIAS_MAP: Record<string, string> = {
  'breaking-news-global-affairs': 'news',
  'news-and-world-affairs': 'news',
  'global-affairs': 'news',
  'world-news': 'news',
  'automotive-mobility': 'engineering-and-technology',
  'sports-athletics': 'sports',
  'finance-trading': 'finance',
  'modern-lifestyle': 'lifestyle',
  'gastronomy-culinary-arts': 'food',
  'culinary': 'food',
  'global-travel-destinations': 'travel',
  'art-design-culture': 'art-and-culture',
  'fitness-performance': 'fitness',
  'design': 'design-and-typography',
  'sound': 'entertainment',
  'medical-science': 'health',
};

export function normalizeCategoryId(id?: string): string {
  if (!id) return 'art-and-culture';
  const clean = id.trim().toLowerCase();
  return CATEGORY_ALIAS_MAP[clean] || clean;
}

export function getCategoryById(id: string): Category | undefined {
  const normalizedId = normalizeCategoryId(id);
  return CATEGORIES.find((cat) => cat.id === normalizedId || cat.id === id);
}

export const CATEGORY_LOCALIZATIONS: Record<string, Record<string, { name: string; short: string }>> = {
  'art-and-culture': {
    en: { name: 'Art & Culture', short: 'Art & Life' },
    es: { name: 'Arte y Cultura', short: 'Arte y Vida' },
    fr: { name: 'Art et Culture', short: 'Art & Vie' },
    de: { name: 'Kunst und Kultur', short: 'Kunst & Leben' },
    ar: { name: 'الفن والثقافة', short: 'فن وثقافة' },
    ur: { name: 'فن اور ثقافت', short: 'فن و ثقافت' },
  },
  'architecture-and-space': {
    en: { name: 'Architecture & Space', short: 'Architecture' },
    es: { name: 'Arquitectura y Espacio', short: 'Arquitectura' },
    fr: { name: 'Architecture et Espace', short: 'Architecture' },
    de: { name: 'Architektur und Raum', short: 'Architektur' },
    ar: { name: 'العمارة والتصميم المكاني', short: 'عمارة' },
    ur: { name: 'فن تعمیر اور کشادہ ڈیزائن', short: 'طرزِ تعمیر' },
  },
  'design-and-typography': {
    en: { name: 'Design & Typography', short: 'Design' },
    es: { name: 'Diseño y Tipografía', short: 'Diseño' },
    fr: { name: 'Design et Typographie', short: 'Design' },
    de: { name: 'Design und Typografie', short: 'Design' },
    ar: { name: 'التصميم والأنظمة الطباعية', short: 'تصميم' },
    ur: { name: 'ڈیزائن اور خطاطی', short: 'ڈیزائن' },
  },
  'engineering-and-technology': {
    en: { name: 'Engineering & Technology', short: 'Tech' },
    es: { name: 'Ingeniería y Tecnología', short: 'Tecnología' },
    fr: { name: 'Ingénierie et Technologie', short: 'Technologie' },
    de: { name: 'Ingenieurwesen & Technologie', short: 'Technik' },
    ar: { name: 'الهندسة والأنظمة الثابتة', short: 'هندسة' },
    ur: { name: 'انجینئرنگ اور ٹیکنالوجی', short: 'انجینئرنگ' },
  },
  'technology': {
    en: { name: 'Technology & AI', short: 'Innovation' },
    es: { name: 'Tecnología e IA', short: 'Innovación' },
    fr: { name: 'Technologie et IA', short: 'Innovation' },
    de: { name: 'Technologie & KI', short: 'Innovation' },
    ar: { name: 'التكنولوجيا والذكاء الاصطناعي', short: 'ابتكار' },
    ur: { name: 'ٹیکنالوجی اور مصنوعی ذہانت', short: 'جدت' },
  },
  'software': {
    en: { name: 'Software & Code', short: 'Software' },
    es: { name: 'Software y Código', short: 'Software' },
    fr: { name: 'Logiciel et Code', short: 'Logiciel' },
    de: { name: 'Software und Code', short: 'Software' },
    ar: { name: 'البرمجيات وتطوير الأنظمة', short: 'برمجيات' },
    ur: { name: 'سافٹ ویئر اور کوڈنگ', short: 'سافٹ ویئر' },
  },
  'finance': {
    en: { name: 'Finance & Markets', short: 'Finance' },
    es: { name: 'Finanzas y Mercados', short: 'Finanzas' },
    fr: { name: 'Finance et Marchés', short: 'Finance' },
    de: { name: 'Finanzen und Märkte', short: 'Finanzen' },
    ar: { name: 'المالية والأسواق العالمية', short: 'مالية' },
    ur: { name: 'فنانس اور عالمی مارکیٹیں', short: 'فنانس' },
  },
  'business': {
    en: { name: 'Business & Industry', short: 'Business' },
    es: { name: 'Negocios e Industria', short: 'Negocios' },
    fr: { name: 'Affaires et Industrie', short: 'Affaires' },
    de: { name: 'Wirtschaft und Industrie', short: 'Wirtschaft' },
    ar: { name: 'الأعمال والصناعة', short: 'أعمال' },
    ur: { name: 'کاروبار اور صنعت', short: 'کاروبار' },
  },
  'crypto': {
    en: { name: 'Crypto & Web3', short: 'Crypto' },
    es: { name: 'Cripto y Web3', short: 'Cripto' },
    fr: { name: 'Crypto et Web3', short: 'Crypto' },
    de: { name: 'Krypto und Web3', short: 'Krypto' },
    ar: { name: 'العملات الرقمية والبلوكشين', short: 'كريبتو' },
    ur: { name: 'کرپٹو اور بلاک چین', short: 'کرپٹو' },
  },
  'sports': {
    en: { name: 'Sports & Athletics', short: 'Sports' },
    es: { name: 'Deportes y Atletismo', short: 'Deportes' },
    fr: { name: 'Sports et Athlétisme', short: 'Sports' },
    de: { name: 'Sport und Leichtathletik', short: 'Sport' },
    ar: { name: 'الرياضة والعلوم الحركية', short: 'رياضة' },
    ur: { name: 'کھیل اور اسپورٹس سائنس', short: 'کھیل' },
  },
  'health': {
    en: { name: 'Health & Medicine', short: 'Health' },
    es: { name: 'Salud y Medicina', short: 'Salud' },
    fr: { name: 'Santé et Médecine', short: 'Santé' },
    de: { name: 'Gesundheit und Medizin', short: 'Gesundheit' },
    ar: { name: 'الصحة والطب الوقائي', short: 'صحة' },
    ur: { name: 'صحت اور احتیاطی طب', short: 'صحت' },
  },
  'science': {
    en: { name: 'Science & Discovery', short: 'Science' },
    es: { name: 'Ciencia y Descubrimiento', short: 'Ciencia' },
    fr: { name: 'Science et Découverte', short: 'Science' },
    de: { name: 'Wissenschaft & Forschung', short: 'Wissenschaft' },
    ar: { name: 'العلوم واستكشاف الفضاء', short: 'علوم' },
    ur: { name: 'سائنس اور تحقیق', short: 'سائنس' },
  },
  'entertainment': {
    en: { name: 'Entertainment & Arts', short: 'Media' },
    es: { name: 'Entretenimiento y Artes', short: 'Medios' },
    fr: { name: 'Divertissement et Arts', short: 'Médias' },
    de: { name: 'Unterhaltung und Kunst', short: 'Medien' },
    ar: { name: 'الترفيه والثقافة البصرية', short: 'إعلام' },
    ur: { name: 'تفریح اور فنون', short: 'میڈیا' },
  },
  'lifestyle': {
    en: { name: 'Lifestyle & Wellness', short: 'Lifestyle' },
    es: { name: 'Estilo de Vida y Bienestar', short: 'Estilo de Vida' },
    fr: { name: 'Mode de Vie et Bien-être', short: 'Mode de Vie' },
    de: { name: 'Lebensstil und Wellness', short: 'Lebensstil' },
    ar: { name: 'أسلوب الحياة والإنتاجية', short: 'نمط حياة' },
    ur: { name: 'طرز زندگی اور فلاح', short: 'طرزِ زندگی' },
  },
  'fitness': {
    en: { name: 'Fitness & Physiology', short: 'Fitness' },
    es: { name: 'Fitness y Fisiología', short: 'Fitness' },
    fr: { name: 'Fitness et Physiologie', short: 'Fitness' },
    de: { name: 'Fitness und Physiologie', short: 'Fitness' },
    ar: { name: 'اللياقة والتدريب البدني', short: 'لياقة' },
    ur: { name: 'فٹنس اور طاقت کی تربیت', short: 'فٹنس' },
  },
  'food': {
    en: { name: 'Food & Gastronomy', short: 'Gastronomy' },
    es: { name: 'Gastronomía y Cocina', short: 'Gastronomía' },
    fr: { name: 'Gastronomie et Cuisine', short: 'Gastronomie' },
    de: { name: 'Gastronomie & Kulinarik', short: 'Gastronomie' },
    ar: { name: 'فن الطهي وعلم الغذاء', short: 'فن الطهي' },
    ur: { name: 'کھانے اور غذائی سائنس', short: 'کھانے کے علوم' },
  },
  'travel': {
    en: { name: 'Travel & Global Exploration', short: 'Travel' },
    es: { name: 'Viajes y Exploración', short: 'Viajes' },
    fr: { name: 'Voyages et Exploration', short: 'Voyages' },
    de: { name: 'Reisen und Expeditionen', short: 'Reisen' },
    ar: { name: 'السفر والرحلات الاستكشافية', short: 'سفر' },
    ur: { name: 'سفر اور مہم جوئی', short: 'سفر' },
  },
  'news': {
    en: { name: 'Breaking News & World Affairs', short: 'World News' },
    es: { name: 'Noticias y Asuntos Mundiales', short: 'Noticias' },
    fr: { name: 'Actualités et Affaires Mondiales', short: 'Actualités' },
    de: { name: 'Nachrichten & Weltgeschehen', short: 'Nachrichten' },
    ar: { name: 'الأخبار والشؤون الدولية', short: 'أخبار العالم' },
    ur: { name: 'خبریں اور عالمی امور', short: 'عالمی خبریں' },
  },
};

export const SUBCATEGORY_LOCALIZATIONS: Record<string, Record<string, string>> = {
  'visual-arts': { en: 'Visual Arts', es: 'Artes Visuales', fr: 'Arts Visuels', de: 'Bildende Kunst', ar: 'الفنون البصرية', ur: 'بصری فنون' },
  'sculpture': { en: 'Sculpture', es: 'Escultura', fr: 'Sculpture', de: 'Skulptur', ar: 'النحت والمجسمات', ur: 'مجسمہ سازی' },
  'street-art': { en: 'Street Art', es: 'Arte Urbano', fr: 'Art Urbain', de: 'Street Art', ar: 'فن الشارع', ur: 'سٹریٹ آرٹ' },
  'minimalist-design': { en: 'Minimalist Design', es: 'Diseño Minimalista', fr: 'Design Minimaliste', de: 'Minimalistisches Design', ar: 'التصميم البسيط', ur: 'سادہ ڈیزائن' },
  'monuments-and-stone': { en: 'Monuments & Stone', es: 'Monumentos y Piedra', fr: 'Monuments et Pierre', de: 'Monumente & Stein', ar: 'المعالم والأحجار', ur: 'یادگاریں اور پتھر' },
  'spatial-theory': { en: 'Spatial Theory', es: 'Teoría Espacial', fr: 'Théorie Spatiale', de: 'Raumtheorie', ar: 'النظرية المكانية والصوتيات', ur: 'مکانی نظریہ' },
  'editorial-systems': { en: 'Editorial Systems', es: 'Sistemas Editoriales', fr: 'Systèmes Éditoriaux', de: 'Editorielle Systeme', ar: 'الأنظمة التحريرية', ur: 'ادارتی نظام' },
  'grid-theory': { en: 'Grid Theory', es: 'Teoría de la Cuadrícula', fr: 'Théorie de la Grille', de: 'Rastertheorie', ar: 'نظرية الشبكة المطبعية', ur: 'گرڈ تھیوری' },
  'typography': { en: 'Typography', es: 'Tipografía', fr: 'Typographie', de: 'Typografie', ar: 'فنون الخط والطباعة', ur: 'خطاطی' },
  'system-architecture': { en: 'System Architecture', es: 'Arquitectura de Sistemas', fr: 'Architecture de Systèmes', de: 'Systemarchitektur', ar: 'معمارية الأنظمة', ur: 'سسٹم آرکیٹیکچر' },
  'static-performance': { en: 'Static Performance', es: 'Rendimiento Estático', fr: 'Performance Statique', de: 'Statische Leistung', ar: 'الأداء الثابت الفائق', ur: 'ساکت کارکردگی' },
  'functional-craft': { en: 'Functional Craft', es: 'Artesanía Funcional', fr: 'Artisanat Fonctionnel', de: 'Funktionales Handwerk', ar: 'الحرفية الوظيفية', ur: 'عملی دستکاری' },
  'artificial-intelligence': { en: 'Artificial Intelligence', es: 'Inteligencia Artificial', fr: 'Intelligence Artificielle', de: 'Künstliche Intelligenz', ar: 'الذكاء الاصطناعي', ur: 'مصنوعی ذہانت' },
  'machine-learning': { en: 'Machine Learning', es: 'Aprendizaje Automático', fr: 'Apprentissage Automatique', de: 'Maschinelles Lernen', ar: 'تعلم الآلة', ur: 'مشین لرننگ' },
  'cybersecurity': { en: 'Cybersecurity', es: 'Ciberseguridad', fr: 'Cybersécurité', de: 'Cybersicherheit', ar: 'الأمن السيبراني', ur: 'سائبر سیکیورٹی' },
  'robotics-and-iot': { en: 'Robotics & IoT', es: 'Robótica e IoT', fr: 'Robotique et IdO', de: 'Robotik & IoT', ar: 'الروبوتات وإنترنت الأشياء', ur: 'روبوٹکس اور آئی او ٹی' },
  'web-frameworks': { en: 'Web Frameworks', es: 'Frameworks Web', fr: 'Frameworks Web', de: 'Web-Frameworks', ar: 'أطر عمل الويب', ur: 'ویب فریم ورکس' },
  'backend-and-apis': { en: 'Backend & APIs', es: 'Backend y APIs', fr: 'Backend et API', de: 'Backend & APIs', ar: 'الأنظمة الخلفية والواجهات البرمجية', ur: 'بیک اینڈ اور اے پی آئی' },
  'devops-and-cloud': { en: 'DevOps & Cloud', es: 'DevOps y Nube', fr: 'DevOps et Cloud', de: 'DevOps & Cloud', ar: 'عمليات التطوير والسحابة', ur: 'ڈیواپس اور کلاؤڈ' },
  'languages-and-compilers': { en: 'Languages & Compilers', es: 'Lenguajes y Compiladores', fr: 'Langages et Compilateurs', de: 'Sprachen & Compiler', ar: 'لغات البرمجة والمترجمات', ur: 'پروگرامنگ زبانیں اور کمپائلرز' },
  'global-markets': { en: 'Global Markets', es: 'Mercados Globales', fr: 'Marchés Mondiaux', de: 'Globale Märkte', ar: 'الأسواق العالمية', ur: 'عالمی مارکیٹیں' },
  'forex-and-liquidity': { en: 'Forex & Liquidity', es: 'Forex y Liquidez', fr: 'Forex et Liquidité', de: 'Forex & Liquidität', ar: 'الفوركس والسيولة السيادية', ur: 'فاریکس اور لیکویڈیٹی' },
  'commodities': { en: 'Commodities', es: 'Materias Primas', fr: 'Matières Premières', de: 'Rohstoffe', ar: 'السلع والمعادن', ur: 'اجناس اور خام مال' },
  'risk-management': { en: 'Risk Management', es: 'Gestión de Riesgos', fr: 'Gestion des Risques', de: 'Risikomanagement', ar: 'إدارة المخاطر المالية', ur: 'رسک مینجمنٹ' },
  'startups-and-venture': { en: 'Startups & Venture', es: 'Startups y Capital Riesgo', fr: 'Startups et Capital-Risque', de: 'Startups & Wagniskapital', ar: 'الشركات الناشئة والاستثمار الجريء', ur: 'سٹارٹ اپس اور وینچر کیپیٹل' },
  'corporate-strategy': { en: 'Corporate Strategy', es: 'Estrategia Corporativa', fr: 'Stratégie d\'Entreprise', de: 'Unternehmensstrategie', ar: 'استراتيجيات الشركات', ur: 'کارپوریٹ حکمت عملی' },
  'supply-chain': { en: 'Supply Chain', es: 'Cadena de Suministro', fr: 'Chaîne d\'Approvisionnement', de: 'Lieferkette', ar: 'سلاسل التوريد واللوجستيات', ur: 'سپلائی چین' },
  'leadership': { en: 'Leadership', es: 'Liderazgo', fr: 'Leadership', de: 'Führung', ar: 'القيادة التنفيذية', ur: 'قیادت' },
  'layer-1-and-layer-2': { en: 'Layer 1 & Layer 2', es: 'Capa 1 y Capa 2', fr: 'Couche 1 et Couche 2', de: 'Layer 1 & Layer 2', ar: 'شبكات الطبقة الأولى والثانية', ur: 'لیئر 1 اور لیئر 2' },
  'defi': { en: 'DeFi & Protocols', es: 'DeFi y Protocolos', fr: 'DeFi et Protocoles', de: 'DeFi & Protokolle', ar: 'التمويل اللامركزي والبروتوكولات', ur: 'ڈی فائی اور پروٹوکولز' },
  'smart-contracts': { en: 'Smart Contracts', es: 'Contratos Inteligentes', fr: 'Contrats Intelligents', de: 'Smart Contracts', ar: 'العقود الذكية', ur: 'اسمارٹ معاہدے' },
  'tokenomics': { en: 'Tokenomics', es: 'Tokenomía', fr: 'Tokenomique', de: 'Tokenomics', ar: 'اقتصاد الرموز الرقمية', ur: 'ٹوکنامکس' },
  'football': { en: 'Football (Soccer)', es: 'Fútbol', fr: 'Football', de: 'Fußball', ar: 'كرة القدم والتكتيك', ur: 'فٹ بال' },
  'motorsport': { en: 'Motorsport', es: 'Automovilismo', fr: 'Sport Automobile', de: 'Motorsport', ar: 'سباقات السيارات', ur: 'موٹر اسپورٹس' },
  'basketball': { en: 'Basketball', es: 'Baloncesto', fr: 'Basket-ball', de: 'Basketball', ar: 'كرة السلة', ur: 'باسکٹ بال' },
  'sports-science': { en: 'Sports Science & Biomechanics', es: 'Ciencia Deportiva y Biomecánica', fr: 'Science du Sport et Biomécanique', de: 'Sportwissenschaft & Biomechanik', ar: 'العلوم الرياضية والميكانيكا الحيوية', ur: 'اسپورٹس سائنس اور بایو میکینکس' },
  'preventive-medicine': { en: 'Preventive Medicine', es: 'Medicina Preventiva', fr: 'Médecine Préventive', de: 'Präventivmedizin', ar: 'الطب الوقائي والخلوي', ur: 'احتیاطی طب' },
  'medical-research': { en: 'Medical Research', es: 'Investigación Médica', fr: 'Recherche Médicale', de: 'Medizinische Forschung', ar: 'الأبحاث الطبية', ur: 'طبی تحقیق' },
  'nutrition-science': { en: 'Nutrition Science', es: 'Ciencia de la Nutrición', fr: 'Science de la Nutrition', de: 'Ernährungswissenschaft', ar: 'علوم التغذية والأيض', ur: 'غذائی سائنس' },
  'mental-wellness': { en: 'Mental Wellness & Sleep', es: 'Bienestar Mental y Sueño', fr: 'Bien-être Mental et Sommeil', de: 'Mentale Gesundheit & Schlaf', ar: 'الصحة النفسية ونوم الموجات البطيئة', ur: 'ذہنی صحت اور نیند' },
  'astronomy-and-space': { en: 'Astronomy & Space', es: 'Astronomía y Espacio', fr: 'Astronomie et Espace', de: 'Astronomie & Raumfahrt', ar: 'علم الفلك وأبحاث الفضاء', ur: 'فلکیات اور خلائی تحقیق' },
  'physics-and-materials': { en: 'Physics & Materials', es: 'Física y Materiales', fr: 'Physique et Matériaux', de: 'Physik & Materialien', ar: 'الفيزياء وعلم المواد', ur: 'طبیعیات اور مادے' },
  'environmental-science': { en: 'Environmental Science', es: 'Ciencias Ambientales', fr: 'Sciences de l\'Environnement', de: 'Umweltwissenschaft', ar: 'العلوم البيئية والمحيطات', ur: 'ماحولیاتی سائنس' },
  'educational-methods': { en: 'Educational Methods', es: 'Métodos Educativos', fr: 'Méthodes Éducatives', de: 'Pädagogische Methoden', ar: 'المناهج التعليمية', ur: 'تعلیمی طریقہ کار' },
  'cinema-and-film': { en: 'Cinema & Film', es: 'Cine y Películas', fr: 'Cinéma et Film', de: 'Kino & Film', ar: 'السينما وصناعة الأفلام', ur: 'سنیما اور فلم' },
  'music-industry': { en: 'Music Industry', es: 'Industria Musical', fr: 'Industrie Musicale', de: 'Musikindustrie', ar: 'صناعة الموسيقى والصوتيات', ur: 'میوزک انڈسٹری' },
  'gaming-and-interactive': { en: 'Gaming & Interactive Media', es: 'Videojuegos y Medios Interactivos', fr: 'Jeux Vidéo et Médias Interactifs', de: 'Gaming & Interaktive Medien', ar: 'ألعاب الفيديو والوسائط التفاعلية', ur: 'گیمنگ اور انٹرایکٹو میڈیا' },
  'productivity-systems': { en: 'Productivity Systems', es: 'Sistemas de Productividad', fr: 'Systèmes de Productivité', de: 'Produktivitätssysteme', ar: 'أنظمة الإنتاجية والإيقاع الحيوي', ur: 'پیداواری نظام' },
  'sustainable-living': { en: 'Sustainable Living', es: 'Vida Sostenible', fr: 'Vie Durable', de: 'Nachhaltiges Leben', ar: 'الحياة المستدامة', ur: 'پائیدار طرز زندگی' },
  'career-growth': { en: 'Career Growth', es: 'Crecimiento Profesional', fr: 'Évolution Professionnelle', de: 'Karriereentwicklung', ar: 'التطوير المهني والقيادي', ur: 'پیشہ ورانہ ترقی' },
  'strength-training': { en: 'Strength & Hypertrophy', es: 'Fuerza e Hipertrofia', fr: 'Force et Hypertrophie', de: 'Kraft & Hypertrophie', ar: 'تدريب القوة وتضخم العضلات', ur: 'طاقت اور مسل بلڈنگ' },
  'aerobic-endurance': { en: 'Aerobic Endurance', es: 'Resistencia Aeróbica', fr: 'Endurance Aérobie', de: 'Ausdauertraining', ar: 'التحمل القلبي والتنفسي', ur: 'ایروبک صلاحیت' },
  'mobility-and-recovery': { en: 'Mobility & Recovery', es: 'Movilidad y Recuperación', fr: 'Mobilité et Récupération', de: 'Mobilität & Regeneration', ar: 'المرونة والاستشفاء العضلي', ur: 'لچک اور بحالی' },
  'culinary-techniques': { en: 'Culinary Techniques', es: 'Técnicas Culinarias', fr: 'Techniques Culinaires', de: 'Kulinarische Techniken', ar: 'تقنيات فن الطهي والكيمياء الحرارية', ur: 'باورچی خانے کی مہارتیں' },
  'fermentation-and-bread': { en: 'Fermentation & Bread', es: 'Fermentación y Pan', fr: 'Fermentation et Pain', de: 'Fermentation & Brot', ar: 'التخمير والمخبوزات', ur: 'خمیر اور روٹی' },
  'sustainable-gastronomy': { en: 'Sustainable Gastronomy', es: 'Gastronomía Sostenible', fr: 'Gastronomie Durable', de: 'Nachhaltige Gastronomie', ar: 'الطهي المستدام والزراعة العضوية', ur: 'پائیدار خوراک' },
  'expeditions-and-routes': { en: 'Expeditions & Alpine Routes', es: 'Expediciones y Rutas Alpinas', fr: 'Expéditions et Voies Alpines', de: 'Expeditionen & Routen', ar: 'الرحلات الاستكشافية والقمم الجبلية', ur: 'پہاڑی مہمات اور راستے' },
  'cultural-destinations': { en: 'Cultural Destinations', es: 'Destinos Culturales', fr: 'Destinations Culturelles', de: 'Kulturelle Reiseziele', ar: 'الوجهات الثقافية والتراثية', ur: 'ثقافتی مقامات' },
  'sustainable-travel': { en: 'Sustainable Travel', es: 'Viajes Sostenibles', fr: 'Voyage Durable', de: 'Nachhaltiges Reisen', ar: 'السفر المستدام والسياحة البيئية', ur: 'پائیدار سفر' },
  'geopolitics': { en: 'Geopolitics & Treaties', es: 'Geopolítica y Tratados', fr: 'Géopolitique et Traités', de: 'Geopolitik & Verträge', ar: 'الجغرافيا السياسية والمعاهدات الدولية', ur: 'جیو پولیٹکس اور معاہدے' },
  'world-economy': { en: 'World Economy & Trade', es: 'Economía Mundial y Comercio', fr: 'Économie Mondiale et Commerce', de: 'Weltwirtschaft & Handel', ar: 'الاقتصاد العالمي والتجارة الدولية', ur: 'عالمی معیشت اور تجارت' },
  'climate-policy': { en: 'Climate & Environment Policy', es: 'Política Climática y Ambiental', fr: 'Politique Climatique et Environnementale', de: 'Klima- & Umweltpolitik', ar: 'سياسات المناخ والاستدامة البيئية', ur: 'ماحولیاتی پالیسی' },
};

export function getCategoryName(categoryId: string, langCode = 'en'): string {
  const norm = normalizeCategoryId(categoryId);
  const loc = CATEGORY_LOCALIZATIONS[norm] || CATEGORY_LOCALIZATIONS[categoryId];
  if (loc && loc[langCode]?.name) return loc[langCode].name;
  if (loc && loc.en?.name) return loc.en.name;
  const cat = getCategoryById(norm);
  return cat ? cat.name : formatTopicName(categoryId);
}

export function getCategoryShortName(categoryId: string, langCode = 'en'): string {
  const norm = normalizeCategoryId(categoryId);
  const loc = CATEGORY_LOCALIZATIONS[norm] || CATEGORY_LOCALIZATIONS[categoryId];
  if (loc && loc[langCode]?.short) return loc[langCode].short;
  if (loc && loc.en?.short) return loc.en.short;
  switch (norm) {
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
      return 'Global Affairs';
    default:
      return formatTopicName(categoryId) || 'Editorial';
  }
}

export function getSubcategoryName(subcategoryId: string, langCode = 'en'): string {
  const loc = SUBCATEGORY_LOCALIZATIONS[subcategoryId];
  if (loc && loc[langCode]) return loc[langCode];
  if (loc && loc.en) return loc.en;
  return formatTopicName(subcategoryId);
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
  const rawCat = article.category || fallback?.categoryId;
  const categoryId = normalizeCategoryId(rawCat);
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

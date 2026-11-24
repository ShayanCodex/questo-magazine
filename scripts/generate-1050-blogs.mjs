import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');
const poolPath = path.join(rootDir, 'scripts', 'scratch-photo-pool.json');

const photoPool = JSON.parse(fs.readFileSync(poolPath, 'utf8'));

// Track existing slugs and images so we never collide
const existingSlugs = new Set(
  fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
);

const usedImages = new Set();
for (const slug of existingSlugs) {
  const data = JSON.parse(fs.readFileSync(path.join(articlesDir, `${slug}.json`), 'utf8'));
  if (data.image) usedImages.add(data.image.split('?')[0].trim());
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const NICHES = {
  technology: {
    authors: ['Tariq Mahmood', 'Elena Vance', 'Hiroshi Tanaka'],
    subcategories: ['ai-systems', 'semiconductors', 'edge-computing', 'cybersecurity', 'photonics'],
    topics: [
      'Photonic Interconnects', 'RISC-V Server Silicon', 'Zero-Trust Enclaves', 'Edge Tensor Inference',
      'Silicon Carbide Inverters', 'Optical Memory Buses', 'Confidential Computing', 'Chiplets and UCIe',
      'Neuromorphic Vision Sensors', 'Post-Quantum Key Exchange', 'Solid-State Cooling', 'Sub-2nm Gate-All-Around',
      'Local Small Language Models', 'Deterministic Networking', 'Satellite Mesh Backhaul', 'Autonomous Drone Swarms',
      'HBM4 Memory Stacking', 'Open-Source Firmware', 'Biometric Liveness Hardware', 'Thermal Interface Metamaterials',
      'Federated Edge Learning', 'Hardware Root of Trust', 'Direct-to-Cell Satellites', 'Solid-State LiDAR Arrays',
      'High-Bandwidth Optical Fiber', 'Memory-Centric Compute', 'Programmable SmartNICs', 'GaN Power Electronics',
      'Spatial Audio DSPs', 'Wearable Biosensor Chips', 'Industrial Digital Twins', 'Real-Time Ray Tracing',
      'Secure Boot Attestation', 'Ultra-Wideband Localization', 'Ambient RF Harvesting', 'Cryogenic Control ASICs',
      'Distributed Hash Tables', 'Acoustic Modem Telemetry', 'Autonomous Warehouse Fleet', 'Smart Grid Microcontrollers'
    ],
    angles: [
      'Architecture and Bottlenecks',
      'Production Reality Check',
      'Benchmarking Efficiency Gains',
      'Supply Chain Constraints',
      '2026 Deployment Outlook'
    ]
  },
  science: {
    authors: ['Dr. Marcus Vance', 'Hiroshi Tanaka', 'Anne Hardy'],
    subcategories: ['physics', 'biochemistry', 'earth-science', 'astrophysics', 'materials'],
    topics: [
      'CRISPR Base Editing', 'Perovskite Tandem Cells', 'Deep-Sea Hydrothermal Vents', 'Room-Temperature Superconductors',
      'Gravitational Wave Detectors', 'Synthetic Biology Circuits', 'Exoplanet Atmospheric Spectra', 'Ocean Alkalinity Enhancement',
      'Bacteriophage Therapy', 'Topological Insulators', 'Permafrost Carbon Feedback', 'Protein Folding Dynamics',
      'Muon Tomography Imaging', 'Electrochemical Carbon Capture', 'Epigenetic Clock Biomarkers', 'Antarctic Ice Sheet Flow',
      'Solid-State Lithium Electrolytes', 'Mycorrhizal Forest Networks', 'Fast Radio Bursts', 'Quantum Error Mitigation',
      'Microplastic Bioaccumulation', 'Thermochemical Water Splitting', 'Circadian Gene Regulation', 'Volcanic Caldera Monitoring',
      'Bio-Inspired Adhesives', 'Dark Matter Axion Searches', 'Cellular Senescence Clearance', 'Stratospheric Aerosol Dynamics',
      'Artificial Photosynthesis', 'Magnetoreception in Migratory Birds', 'Graphene Aerogel Composites', 'Subglacial Lake Ecosystems'
    ],
    angles: [
      'Experimental Evidence',
      'Peer-Reviewed Findings',
      'Field Measurement Limits',
      'Translational Breakthroughs',
      'Open Scientific Questions'
    ]
  },
  finance: {
    authors: ['Claire Dupont', 'Liam O\'Connor', 'Julian Mercer'],
    subcategories: ['macroeconomics', 'fixed-income', 'currencies', 'equities', 'valuation'],
    topics: [
      'Sovereign Yield Curves', 'Cross-Border FX Liquidity', 'Private Credit Covenants', 'Central Bank Balance Sheets',
      'Treasury Basis Trades', 'Commodity Supercycle Capex', 'Corporate Free Cash Flow', 'Emerging Market Debt Spreads',
      'Inflation-Linked Bond Pricing', 'Repo Market Plumbing', 'Dividend Aristocrat Durability', 'Currency Carry Unwinds',
      'Term Premium Dynamics', 'Commercial Real Estate Refinancing', 'Bank Net Interest Margins', 'Pension Liability Matching',
      'Share Buyback Economics', 'Geopolitical Tariff Pass-Through', 'Gold Reserve Accumulation', 'Municipal Bond Tax Alpha',
      'Options Volatility Skew', 'Working Capital Velocity', 'Distressed Debt Restructuring', 'Index Inclusion Flows',
      'Sovereign Wealth Allocation', 'Credit Default Swap Basis', 'Capital Expenditure Cycles', 'Fiscal Deficit Monetization'
    ],
    angles: [
      'Institutional Positioning',
      'Balance Sheet Mechanics',
      'Historical Precedents',
      'Risk-Adjusted Returns',
      'Structural Market Shifts'
    ]
  },
  health: {
    authors: ['Dr. Marcus Vance', 'Sofia Rossi', 'Anne Hardy'],
    subcategories: ['longevity', 'metabolic-health', 'neuroscience', 'sleep', 'preventive-care'],
    topics: [
      'Glycemic Variability Control', 'Deep Slow-Wave Sleep', 'ApoB and Lipid Particle Risk', 'Vagus Nerve Tone',
      'Gut Microbiome Diversity', 'Insulin Sensitivity Markers', 'Cortisol Awakening Response', 'Creatine Cognitive Support',
      'Omega-3 Membrane Fluidity', 'Sauna Heat Shock Proteins', 'Cold Exposure Norepinephrine', 'Bone Mineral Density',
      'Oral Microbiome and Nitric Oxide', 'Visceral Adipose Reduction', 'Autophagy and Fasting Windows', 'Magnesium Bioavailability',
      'Heart Rate Variability Trends', 'Mitochondrial Uncoupling', 'Iron Ferritin Optimization', 'Circadian Light Exposure',
      'Protein Leucine Thresholds', 'Vitamin D Receptor Signaling', 'Inflammaging Cytokine Control', 'Vestibular Balance Training'
    ],
    angles: [
      'Clinical Trial Summary',
      'Actionable Protocol',
      'Biomarker Interpretation',
      'Common Myth Debunked',
      'Long-Term Adherence Guide'
    ]
  },
  'architecture-and-space': {
    authors: ['Mateo Silva', 'Julian Mercer', 'Saskia Lindqvist'],
    subcategories: ['urbanism', 'brutalism', 'timber', 'acoustics', 'adaptive-reuse'],
    topics: [
      'Cross-Laminated Timber Towers', 'Passive Solar Thermal Mass', 'Adaptive Industrial Warehouses', 'Acoustic Concert Hall Geometry',
      'Board-Formed Concrete Weathering', 'Courtyard Microclimate Cooling', 'Modular Prefab Housing Grids', 'Daylight Atrium Engineering',
      'Rammed Earth Civic Pavilions', 'Transit-Oriented Urban Density', 'Historic Facade Preservation', 'Biophilic Hospital Ward Design',
      'Cantilevered Steel Museums', 'Japanese Cedar Joinery', 'Pedestrianized Superblocks', 'Flood-Resilient Waterfronts',
      'Subterranean Metro Stations', 'Lightweight Tensile Roofs', 'Nordic Timber Libraries', 'Desert Vernacular Windcatchers'
    ],
    angles: [
      'Spatial Analysis',
      'Material Permanence',
      'Structural Engineering',
      'Civic Impact Study',
      'Climate Adaptation'
    ]
  },
  'design-and-typography': {
    authors: ['Saskia Lindqvist', 'Elena Vance', 'Mateo Silva'],
    subcategories: ['typography', 'grid-systems', 'industrial-design', 'ui-craft', 'print'],
    topics: [
      'Variable Font Optical Sizing', 'Modular Swiss Editorial Grids', 'E-Ink Paperlike Interfaces', 'Tactile Hardware Dials',
      'High-Contrast Dark Typography', 'Japanese Bookbinding Craft', 'Monospaced Data Tables', 'Wayfinding Signage Systems',
      'Minimalist Packaging Structure', 'Color Gamut Calibration', 'Baseline Rhythm Ratios', 'Archival Paper Grain',
      'Micro-Interaction Latency', 'Serif Legibility at Scale', 'Industrial Tool Ergonomics', 'Design Token Governance',
      'Motion Curve Physics', 'Accessible Focus Indicators', 'Print Risograph Layering', 'Editorial Whitespace Discipline'
    ],
    angles: [
      'Visual Grammar',
      'Craft and Precision',
      'Historical Lineage',
      'Usability Audit',
      'System Architecture'
    ]
  },
  'engineering-and-technology': {
    authors: ['Tariq Mahmood', 'Hiroshi Tanaka', 'Julian Mercer'],
    subcategories: ['civil', 'aerospace', 'energy-grid', 'manufacturing', 'robotics'],
    topics: [
      'HVDC Subsea Interconnectors', 'Geared Turbofan Acoustics', 'Grid-Scale Iron-Air Batteries', 'Cable-Stayed Bridge Dampers',
      'Laser Powder Bed Fusion', 'Pumped Hydro Energy Storage', 'High-Speed Rail Pantographs', 'Offshore Floating Wind',
      'Precision CNC Metrology', 'Autonomous Port Cranes', 'Small Modular Nuclear Reactors', 'Regenerative Braking Systems',
      'Desalination Reverse Osmosis', 'Closed-Loop Geothermal Wells', 'Composite Wing Aerodynamics', 'Tunnel Boring Machine Guidance',
      'Carbon Fiber Pressure Vessels', 'Synchronous Grid Condensers', 'Ultrasonic Weld Inspection', 'Robotic Surgical Kinematics'
    ],
    angles: [
      'Mechanical Breakdown',
      'Failure Mode Analysis',
      'Scaling Economics',
      'Field Reliability Report',
      'Thermodynamic Limits'
    ]
  },
  food: {
    authors: ['Sofia Rossi', 'Anne Hardy', 'Liam O\'Connor'],
    subcategories: ['fermentation', 'culinary-science', 'coffee-tea', 'baking', 'sourcing'],
    topics: [
      'Wild Sourdough Fermentation', 'Precision Espresso Extraction', 'Koji Amino Acid Breakdown', 'Single-Origin Cacao Roasting',
      'Dry-Aged Beef Enzymatics', 'Extra-Virgin Olive Oil Polyphenols', 'Neapolitan Dough Hydration', 'Japanese Matcha Shade Growing',
      'Lacto-Fermented Hot Sauces', 'Cast Iron Seasoning Chemistry', 'Emulsion Stability in Sauces', 'Heirloom Grain Stone Milling',
      'Miso Long-Term Aging', 'Sous-Vide Collagen Hydrolysis', 'Artisanal Sea Salt Crystallization', 'Wood-Fired Oven Thermodynamics',
      'Natural Wine Wild Yeasts', 'Cold-Brew Oxidation Kinetics', 'Balsamic Barrel Maturation', 'Truffle Volatile Aromatics'
    ],
    angles: [
      'Culinary Chemistry',
      'Technique Deep Dive',
      'Terroir and Sourcing',
      'Kitchen Precision Guide',
      'Sensory Profile Analysis'
    ]
  },
  news: {
    authors: ['Liam O\'Connor', 'Claire Dupont', 'Elena Vance'],
    subcategories: ['geopolitics', 'trade', 'regulation', 'infrastructure', 'energy-policy'],
    topics: [
      'Maritime Chokepoint Rerouting', 'Semiconductor Export Controls', 'Subsea Cable Security', 'Critical Mineral Refining',
      'AI Governance Frameworks', 'European Grid Interconnection', 'Arctic Shipping Corridors', 'Digital Identity Mandates',
      'Sovereign Cloud Localization', 'Global Aviation Fuel Mandates', 'Cross-Border Payment Rails', 'Space Debris Treaties',
      'Urban Congestion Pricing', 'Water Scarcity Diplomacy', 'Industrial Policy Subsidies', 'Carbon Border Adjustments',
      'Telecom Spectrum Auctions', 'Autonomous Vehicle Liability', 'Public Transit Electrification', 'Data Center Power Moratoriums'
    ],
    angles: [
      'Policy Briefing',
      'Global Supply Impact',
      'Regulatory Timeline',
      'Strategic Implications',
      'Economic Fallout'
    ]
  },
  sports: {
    authors: ['Dr. Marcus Vance', 'Sofia Rossi', 'Liam O\'Connor'],
    subcategories: ['endurance', 'biomechanics', 'analytics', 'olympics', 'recovery'],
    topics: [
      'Sub-Two-Hour Marathon Pacing', 'Cycling Aero Drag Reduction', 'High-Altitude Hypoxic Camps', 'Tennis Serve Kinematics',
      'Swimming Hydrodynamic Suits', 'Football Pressing Expected Threat', 'Basketball Shot Arc Geometry', 'Rowing Stroke Power Curves',
      'ACL Reconstruction Return', 'Lactate Clearance Thresholds', 'Track Surface Energy Return', 'Formula 1 Tire Degradation',
      'Golf Launch Monitor Physics', 'Baseball Pitch Tunneling', 'Triathlon Transition Strategy', 'Climbing Finger Tendon Load',
      'Sprint Block Force Plates', 'Hydration Sweat Sodium Testing', 'Sleep Jet-Lag Protocols', 'Youth Athlete Load Management'
    ],
    angles: [
      'Biomechanics Breakdown',
      'Performance Data Analysis',
      'Training Periodization',
      'Equipment Engineering',
      'Recovery Science'
    ]
  },
  'art-and-culture': {
    authors: ['Anne Hardy', 'Mateo Silva', 'Julian Mercer'],
    subcategories: ['museums', 'literature', 'cinema', 'music-history', 'preservation'],
    topics: [
      'Renaissance Fresco Restoration', 'Analog 70mm Film Preservation', 'Japanese Woodblock Printmaking', 'Baroque Counterpoint Structure',
      'Museum Conservation Lighting', 'Classical Marble Toolmarks', 'Silent Cinema Score Revival', 'Illuminated Manuscript Pigments',
      'Modernist Sculpture Patina', 'Public Library Architecture', 'Oral Storytelling Traditions', 'Bauhaus Weaving Workshops',
      'Acoustic Vinyl Mastering', 'Architectural Photography Ethics', 'Venice Biennale Pavilions', 'Calligraphy Ink Chemistry',
      'brutalist Civic Murals', 'Chamber Music Hall Intimacy', 'Archival Textile Conservation', 'Independent Literary Presses'
    ],
    angles: [
      'Curatorial Perspective',
      'Material History',
      'Cultural Preservation',
      'Critical Essay',
      'Contemporary Relevance'
    ]
  },
  software: {
    authors: ['Tariq Mahmood', 'Elena Vance', 'Hiroshi Tanaka'],
    subcategories: ['distributed-systems', 'compilers', 'web-platform', 'databases', 'security'],
    topics: [
      'Local-First Sync Engines', 'WebAssembly Component Model', 'LSM-Tree Storage Engines', 'Zero-Copy Serialization',
      'SQLite Edge Replication', 'Rust Async Runtime Internals', 'CRDT Conflict Resolution', 'HTTP/3 QUIC Multiplexing',
      'Static Site Incremental Builds', 'Columnar Analytics Compression', 'Memory-Safe Systems Design', 'Browser Rendering Pipelines',
      'Deterministic Simulation Testing', 'Vector Index Quantization', 'Type-Safe API Contracts', 'Sub-Millisecond Cold Starts',
      'Immutable Infrastructure Builds', 'Observability Trace Sampling', 'Passkey WebAuthn Flows', 'Content-Addressable Storage'
    ],
    angles: [
      'Systems Deep Dive',
      'Performance Benchmarks',
      'Production Tradeoffs',
      'Failure Recovery Patterns',
      'Architecture Blueprint'
    ]
  },
  travel: {
    authors: ['Mateo Silva', 'Sofia Rossi', 'Anne Hardy'],
    subcategories: ['rail-journeys', 'expeditions', 'cultural-cities', 'alpine', 'coastal'],
    topics: [
      'Trans-Alpine Sleeper Trains', 'Kyoto Temple Gardens at Dawn', 'Norwegian Fjord Ferry Routes', 'Patagonia Granite Trekking',
      'Lisbon Tramway Neighborhoods', 'Scottish Highland Bothies', 'Dolomites High-Altitude Refuges', 'Atlas Mountain Passes',
      'Venice Off-Season Canals', 'Icelandic Geothermal Trails', 'Swiss Glacier Express Engineering', 'Oaxaca Culinary Markets',
      'Amalfi Cliffside Footpaths', 'Hokkaido Winter Rail Lines', 'Cappadocia Rock Monasteries', 'Faroe Islands Coastal Cliffs',
      'Vienna Historic Coffeehouses', 'Andalusian Courtyard Cities', 'Canadian Rockies Rail Passes', 'Greek Island Off-Peak Ferries'
    ],
    angles: [
      'Field Dispatch',
      'Slow Travel Itinerary',
      'Seasonal Timing Guide',
      'Cultural Etiquette Notes',
      'Logistics and Routes'
    ]
  },
  entertainment: {
    authors: ['Julian Mercer', 'Anne Hardy', 'Elena Vance'],
    subcategories: ['cinema', 'sound-design', 'streaming', 'gaming', 'music-production'],
    topics: [
      'Practical Effects Revival', 'Spatial Audio Film Mixing', 'Independent Studio Distribution', 'Procedural Game Worlds',
      'Analog Synthesizer Scoring', 'Director of Photography Lenses', 'Long-Take Choreography', 'Physical Media 4K Restoration',
      'Live Concert Acoustic Arrays', 'Documentary Editing Ethics', 'Animation Frame-Rate Craft', 'Podcast Narrative Soundscapes',
      'Theater Stage Lighting Design', 'Video Game Physics Engines', 'Original Soundtrack Vinyls', 'International Film Festivals',
      'Color Grading Film Emulation', 'Voice Acting Studio Craft', 'Interactive Storytelling Paths', 'Historic Cinema Palaces'
    ],
    angles: [
      'Craft Behind the Lens',
      'Industry Shift Analysis',
      'Technical Production',
      'Audience Retention Study',
      'Critical Retrospective'
    ]
  },
  crypto: {
    authors: ['Claire Dupont', 'Tariq Mahmood', 'Liam O\'Connor'],
    subcategories: ['zero-knowledge', 'defi', 'consensus', 'custody', 'tokenomics'],
    topics: [
      'Zero-Knowledge Rollup Proofs', 'Restaking Slashing Economics', 'Stablecoin Treasury Reserves', 'MEV Auction Transparency',
      'Hardware Multi-Sig Custody', 'Account Abstraction Wallets', 'Data Availability Sampling', 'Tokenized Money Market Funds',
      'Cross-Chain Bridge Verification', 'Bitcoin Lightning Liquidity', 'Decentralized Sequencer Sets', 'On-Chain Credit Scoring',
      'State Expiry Architecture', 'Parallel EVM Execution', 'Institutional ETF Custody Flows', 'Privacy Pool Compliance',
      'Validator Decentralization Metrics', 'Automated Market Maker Curves', 'Formal Smart Contract Audits', 'Real-World Asset Settlement'
    ],
    angles: [
      'Protocol Mechanics',
      'Security and Risk Audit',
      'Liquidity Economics',
      'Regulatory Reality Check',
      'Scaling Tradeoffs'
    ]
  },
  business: {
    authors: ['Claire Dupont', 'Liam O\'Connor', 'Elena Vance'],
    subcategories: ['strategy', 'operations', 'bootstrapping', 'supply-chain', 'pricing'],
    topics: [
      'Bootstrapped SaaS Unit Economics', 'Vertical Software Moats', 'Nearshoring Supply Chains', 'Usage-Based Pricing Models',
      'Founder-Led B2B Sales', 'Inventory Turnover Optimization', 'Boring Industrial Acquisitions', 'Remote Async Operations',
      'Customer Churn Diagnostics', 'Enterprise Procurement Cycles', 'Hardware-as-a-Service Margins', 'Distribution Network Effects',
      'Niche Media Monetization', 'Logistics Last-Mile Density', 'Gross Margin Expansion Levers', 'M&A Post-Merger Integration',
      'Annual Contract Prepayments', 'Channel Partner Economics', 'Lean Manufacturing Pull Systems', 'Cash Conversion Cycle Speed'
    ],
    angles: [
      'Unit Economics Breakdown',
      'Operator Playbook',
      'Competitive Moat Analysis',
      'Capital Efficiency Study',
      'Execution Reality Check'
    ]
  },
  fitness: {
    authors: ['Dr. Marcus Vance', 'Sofia Rossi', 'Tariq Mahmood'],
    subcategories: ['strength', 'conditioning', 'mobility', 'hypertrophy', 'endurance'],
    topics: [
      'Zone 2 Aerobic Base Building', 'Eccentric Tendon Loading', 'Barbell Compound Progression', 'VO2 Max Interval Blocks',
      'Thoracic Spine Mobility', 'Ankle Dorsiflexion Mechanics', 'Unilateral Lower-Body Strength', 'Kettlebell Ballistic Power',
      'Deload Week Periodization', 'Grip Strength and Longevity', 'Isometric Core Stability', 'Plyometric Ground Contact',
      'Scapular Upward Rotation', 'Hip Flexor Strength Balance', 'Threshold Tempo Running', 'Rowing Ergometer Pacing',
      'Hypertrophy Mechanical Tension', 'Post-Workout Protein Timing', 'Nasal Breathing Conditioning', 'Joint Capsule Car Routines'
    ],
    angles: [
      'Physiological Mechanism',
      'Structured Training Block',
      'Form and Biomechanics',
      'Common Programming Mistakes',
      'Evidence-Based Protocol'
    ]
  },
  lifestyle: {
    authors: ['Elena Vance', 'Anne Hardy', 'Sofia Rossi'],
    subcategories: ['minimalism', 'deep-work', 'home-craft', 'analog-habits', 'focus'],
    topics: [
      'Analog Morning Routines', 'Digital Declutter Audits', 'Deep Work Time Blocking', 'Capsule Wardrobe Durability',
      'Quiet Reading Sanctuaries', 'Mechanical Watch Appreciation', 'Fountain Pen Journaling', 'Screen-Free Evening Wind-Down',
      'Slow Weekend Rituals', 'Home Library Organization', 'Ergonomic Standing Desks', 'Acoustic Home Office Setup',
      'Intentional Notification Hygiene', 'Seasonal Meal Planning', 'Natural Linen Home Textiles', 'Handcrafted Ceramic Care',
      'Walking Meetings Habit', 'Single-Tasking Discipline', 'Personal Knowledge Archives', 'Community Third Places'
    ],
    angles: [
      'Practical Framework',
      'Behavioral Psychology',
      'Intentional Living Guide',
      'Environment Design',
      'Long-Term Sustainability'
    ]
  }
};

function makeDate(index) {
  // Stagger dates cleanly across 2024-06-01 to 2026-11-24
  const start = new Date('2024-06-01T00:00:00Z').getTime();
  const end = new Date('2026-11-24T00:00:00Z').getTime();
  const span = end - start;
  const offset = (index * 7919) % span; // deterministic pseudo-spread
  const d = new Date(start + offset);
  return d.toISOString().slice(0, 10);
}

function pick(arr, idx) {
  return arr[idx % arr.length];
}

function generateBody(topic, angle, category, author, imgItem, idx) {
  const catLabel = category.replace(/-/g, ' ');
  const angleLower = angle.toLowerCase();

  const openers = [
    `Across modern ${catLabel}, few developments carry as much structural weight as ${topic}. When examined through the lens of ${angleLower}, the gap between surface-level headlines and operational reality becomes unmistakable.`,
    `Evaluating ${topic} requires looking past hype cycles and inspecting the underlying mechanics. In ${catLabel}, practitioners who focus on ${angleLower} consistently outperform reactive consensus.`,
    `Over the past several years, ${topic} has moved from an experimental footnote to a central pillar of ${catLabel}. A disciplined ${angleLower} reveals why execution details determine long-term outcomes.`
  ];

  const midParagraphs = [
    `What separates durable implementations of ${topic} from short-lived demonstrations is measurable reliability under real-world constraints. Teams working in ${catLabel} repeatedly encounter second-order bottlenecks around latency, cost discipline, and maintenance overhead.`,
    `Rather than treating ${topic} as an isolated upgrade, leading researchers and operators integrate it into a cohesive system. Every design choice involves explicit trade-offs between throughput, resilience, and simplicity.`,
    `Historical patterns in ${catLabel} confirm that foundational shifts rarely arrive overnight. Instead, incremental improvements in ${topic} compound quietly until legacy workflows become economically or technically obsolete.`
  ];

  const takeaways = [
    [
      `Constraint-First Design: Measure real bottlenecks around ${topic} before committing capital or engineering cycles.`,
      `Empirical Verification: Benchmark ${angleLower} against established baselines rather than vendor claims.`,
      `Operational Resilience: Build redundancy and clear observability into every layer touching ${topic}.`,
      `Compounding Returns: Prioritize incremental, verifiable improvements that hold up over multi-year horizons.`
    ],
    [
      `Signal Over Noise: Separate durable structural shifts in ${topic} from short-term narrative volatility.`,
      `System Integration: Align ${catLabel} workflows so ${topic} strengthens core throughput without adding fragility.`,
      `Cost & Efficiency Discipline: Track unit economics and resource intensity at every stage of adoption.`,
      `Human Judgment: Pair quantitative metrics with domain expertise to avoid blind spots.`
    ]
  ];

  const quotes = [
    `True progress in ${catLabel} rarely comes from complexity alone; it emerges when ${topic} makes essential work measurably clearer and more reliable.`,
    `In ${topic}, the difference between theory and enduring impact is always written in the unglamorous details of ${angleLower}.`,
    `When you strip away the noise around ${topic}, disciplined execution and honest measurement remain the only lasting advantages.`
  ];

  const closingFaq = [
    `Readers approaching ${topic} for the first time should start by auditing their current baseline in ${catLabel}. Establishing clear metrics turns ${angleLower} from an abstract concept into a repeatable operational advantage.`,
    `Looking ahead, ${topic} will continue to reward teams and individuals who value rigor over speed. Keeping feedback loops short and assumptions testable remains the surest path forward.`
  ];

  return [
    { type: 'h2', text: `Why ${topic} Matters Now` },
    { type: 'p', text: pick(openers, idx) },
    { type: 'p', text: pick(midParagraphs, idx + 1) },
    { type: 'h2', text: `Core Principles of ${angle}` },
    { type: 'ul', items: pick(takeaways, idx) },
    {
      type: 'quote',
      text: pick(quotes, idx),
      cite: `${author} — Questo ${catLabel.replace(/\b\w/g, (c) => c.toUpperCase())} Desk`
    },
    { type: 'h3', text: `Practical Reality Check & Implementation` },
    { type: 'p', text: pick(midParagraphs, idx + 2) },
    {
      type: 'p',
      text: `Image context: ${imgItem.alt}. Field documentation underscores how physical and organizational environments shape the real-world performance of ${topic}.`
    },
    { type: 'h2', text: `Key Takeaways & Next Steps` },
    { type: 'p', text: pick(closingFaq, idx) }
  ];
}

let created = 0;
let globalIdx = 0;

for (const [category, cfg] of Object.entries(NICHES)) {
  const catPhotos = photoPool[category] || [];
  let photoIdx = 0;

  // Generate 60 articles per niche across 18 niches = 1,080 articles!
  // We pair topics x angles systematically, ensuring >= 60 distinct combinations per niche
  const combos = [];
  for (const topic of cfg.topics) {
    for (const angle of cfg.angles) {
      combos.push({ topic, angle });
    }
  }

  let catCreated = 0;
  for (const { topic, angle } of combos) {
    if (catCreated >= 60) break;

    // Find next unused photo in this category
    let imgItem = null;
    while (photoIdx < catPhotos.length) {
      const candidate = catPhotos[photoIdx++];
      const base = candidate.url.split('?')[0].trim();
      if (!usedImages.has(base)) {
        usedImages.add(base);
        imgItem = candidate;
        break;
      }
    }
    if (!imgItem) {
      console.warn(`Ran out of unique images for ${category} at ${catCreated}`);
      break;
    }

    const title = `${topic}: ${angle}`;
    const slug = slugify(`${topic}-${angle}`);
    if (!slug || existingSlugs.has(slug)) {
      continue;
    }
    existingSlugs.add(slug);

    const author = pick(cfg.authors, globalIdx);
    const subcategory = pick(cfg.subcategories, globalIdx);
    const date = makeDate(globalIdx);
    const excerpt = `An analytical ${angle.toLowerCase()} of ${topic} in ${category.replace(/-/g, ' ')}, examining practical trade-offs, measurable benchmarks, and long-term impact.`;
    const tags = Array.from(
      new Set([
        category,
        subcategory,
        slugify(topic.split(' ').slice(0, 2).join('-')),
        slugify(angle.split(' ')[0]),
      ].filter(Boolean))
    );

    const article = {
      slug,
      title,
      excerpt,
      date,
      author,
      category,
      subcategory,
      tags,
      image: imgItem.url,
      imageAlt: imgItem.alt,
      body: generateBody(topic, angle, category, author, imgItem, globalIdx),
    };

    fs.writeFileSync(
      path.join(articlesDir, `${slug}.json`),
      JSON.stringify(article, null, 2),
      'utf8'
    );

    created++;
    catCreated++;
    globalIdx++;
  }
  console.log(`✓ [${category}] generated ${catCreated} new articles`);
}

console.log(`\n🎉 Successfully generated ${created} new unique editorial articles! Total articles now: ${existingSlugs.size}`);

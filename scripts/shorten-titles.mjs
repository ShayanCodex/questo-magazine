import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');

const titleUpdates = {
  'acoustic-diffusors-and-schroeder-number-sequences-in-architecture': 'Acoustic Diffusors & Schroeder Sequences',
  'aerobic-glycolysis-and-lactate-threshold-dynamics-in-endurance': 'The Physiology of Sub-2 Marathons',
  'aerodynamics-of-formula-1-sidepod-undercuts-and-vortex-generators': 'F1 Aerodynamics & Ground Effects',
  'aerodynamics-of-sub-two-hour-marathon-and-carbon-plate-kinetics': 'Biomechanics of the Sub-2 Marathon',
  'aerogel-nanostructures-and-superinsulative-silica-matrices': 'Aerogel Matrices in Aerospace Engineering',
  'algorithmic-market-intelligence-and-open-financial-data': 'Algorithmic Market Intelligence',
  'anamorphic-optics-and-the-geometry-of-widescreen-cinematography': 'The Geometry of Anamorphic Cinema',
  'anatomy-of-venture-capital-liquidity-secondary-markets-dpi-dynamics': 'Venture Capital & Secondary Markets',
  'ancient-einkorn-grain-and-sourdough-microbiome-acidification': 'Ancient Einkorn & Sourdough Ecology',
  'architectural-acoustics-of-concert-halls-reverberation-and-clarity': 'Architectural Acoustics of Concert Halls',
  'attentional-biorhythms-and-ultradian-performance-cycles': 'Attentional Biorhythms & Focus Cycles',
  'bathymetric-mapping-of-the-mariana-trench-and-hadal-geomorphology': 'Mapping the Mariana Trench',
  'bio-digital-kinetic-facades-and-parametric-carbon-architecture': 'Bio-Digital Kinetic Facades',
  'bio-regenerative-life-support-celss-and-closed-loop-mars-habitats': 'Closed-Loop Life Support for Mars',
  'chiaroscuro-woodcut-printing-and-intaglio-copperplate-etching': 'Renaissance Woodcut & Copperplate Etching',
  'cognitive-ergonomics-and-the-architecture-of-deep-work': 'Cognitive Ergonomics & Deep Work',
  'cosmic-microwave-background-polarization-and-b-mode-inflation': 'The Cosmic Microwave Background & Inflation',
  'crispr-base-editing-and-prime-editing-therapeutics': 'CRISPR Base & Prime Editing',
  'cross-border-cbdc-rails-mbridge-and-the-de-dollarization-matrix': 'Project mBridge & Global Settlements',
  'cyclopean-masonry-and-dry-stone-retaining-hydraulics': 'Cyclopean Masonry & Stone Hydraulics',
  'deep-sea-hydrothermal-serpentinization-and-prebiotic-chemistry': 'Hydrothermal Vents & The Spark of Life',
  'deepseek-v3-moe-fp8-distributed-training-efficiency': 'The Architecture of DeepSeek-V3',
  'distributed-consensus-and-formal-verification-in-blockchains': 'Distributed Consensus & Verification',
  'distributed-electric-propulsion-and-evtol-aerodynamics': 'The Aerodynamics of eVTOL Flight',
  'fascial-tensegrity-and-connective-tissue-viscoelasticity': 'Fascial Tensegrity in Athletics',
  'fault-tolerant-quantum-computing-and-neutral-atom-processors': 'Neutral Atoms & Quantum Processors',
  'formal-verification-of-distributed-consensus-tla-and-isabelle': 'Formal Verification of Distributed Systems',
  'global-semiconductor-supply-chains-euv-lithography-geopolitics': 'Semiconductors & EUV Lithography',
  'heirloom-grain-genomics-and-heritage-flour-rheology': 'Heirloom Grain Genomics & Soil Ecology',
  'humanoid-robotics-torque-density-and-visuomotor-policies': 'Humanoid Robotics & Actuator Dynamics',
  'james-webb-space-telescope-early-universe-black-hole-anomalies': 'The JWST Early Universe Crisis',
  'linear-types-and-affine-type-systems-in-compiler-design': 'Linear & Affine Types in Systems Code',
  'microeconomics-of-cloud-hyperscalers-and-datacenter-capex': 'The Microeconomics of Cloud Hyperscalers',
  'microsoft-outlook-global-outage-exchange-infrastructure-crash': 'Inside the Global Outlook Crash',
  'molecular-spherification-and-hydrocolloid-colloid-science': 'The Physics of Spherification',
  'monumental-direct-carving-and-the-textural-permanence-of-granite': 'Direct Carving & Granite Permanence',
  'neural-radiance-fields-and-real-time-gaussian-splatting-for-robotics': '3D Gaussian Splatting in Robotics',
  'neurochemical-oscillations-in-slow-wave-and-rem-sleep': 'The Neurochemistry of Sleep',
  'nuclear-thermal-propulsion-and-deep-space-trajectory-mechanics': 'Nuclear Thermal Propulsion in Deep Space',
  'oceanic-biological-carbon-pumps-and-mesopelagic-flux': 'Oceanic Biological Carbon Pumps',
  'oleocanthal-phenolics-and-polyphenol-chromatography-in-olive-oil': 'Oleocanthal & Olive Oil Polyphenols',
  'optically-pumped-magnetometers-and-quantum-brain-decoding': 'Quantum Sensors & Brain Decoding',
  'optogenetics-and-neural-circuit-dissection-mechanics': 'Optogenetics & Neural Circuits',
  'perovskite-silicon-tandem-solar-cells-and-photovoltaic-efficiency': 'Perovskite-Silicon Tandem Solar Cells',
  'post-quantum-cryptography-kyber-and-lattice-key-encapsulation': 'Post-Quantum Cryptography in Production',
  'precision-fermentation-and-recombinant-casein-micelles': 'Precision Fermentation & Animal-Free Dairy',
  'quantum-entanglement-and-the-black-hole-information-paradox': 'The Black Hole Information Paradox',
  'recursive-starks-and-verifiable-computation-at-scale': 'Recursive STARKs & Verifiable Computation',
  'rust-memory-safety-without-garbage-collection': 'Formal Memory Safety in Rust',
  'satellite-insar-geodesy-and-volcanic-magma-chamber-dynamics': 'Satellite Radar & Magma Dynamics',
  'semiconductor-packaging-and-advanced-chiplet-interconnects': 'Advanced Semiconductor Packaging',
  'skeletal-muscle-capillarization-and-angiogenic-signaling': 'Muscle Capillarization in Endurance',
  'small-modular-reactors-and-gigawatt-ai-datacenters': 'Small Modular Reactors for AI Clusters',
  'solid-oxide-electrolysis-and-industrial-green-hydrogen': 'Solid Oxide Electrolysis & Green Hydrogen',
  'sovereign-liquidity-swaps-and-the-global-dollar-funding-network': 'Sovereign Liquidity Swaps & Global FX',
  'sparse-autoencoders-and-mechanistic-interpretability-in-llms': 'Sparse Autoencoders in Foundation Models',
  'spatial-minimalism-and-the-psychology-of-the-void': 'Spatial Minimalism & The Void',
  'sub-microsecond-market-microstructure-and-fpga-trading-engines': 'Inside Sub-Microsecond Trading Engines',
  'submarine-fiber-optic-cables-and-geopolitical-chokepoints': 'Submarine Cables & Global Data Chokepoints',
  'tectonic-permanence-and-the-weathering-of-pozzolanic-concrete': 'The Durability of Pozzolanic Concrete',
  'telomere-biology-and-dna-methylation-clocks-in-human-aging': 'Epigenetic Clocks & Biological Age',
  'test-time-compute-and-mcts-in-autonomous-reasoning-models': 'Test-Time Compute & Autonomous Reasoning',
  'the-biochemistry-of-ancient-vinegars-and-acetification': 'Biochemistry of Traditional Aceto Balsamico',
  'the-engineering-of-the-qinghai-tibet-permafrost-railway': 'Permafrost Engineering on the Roof of the World',
  'the-evolution-of-editorial-layout-systems-and-variable-grids': 'The Evolution of Editorial Layout Systems',
  'the-evolution-of-webassembly-and-wasi-preview-2': 'WebAssembly Beyond the Browser',
  'the-mechanics-of-deep-tech-commercialization-and-capital-expenditure': 'Deep-Tech Commercialization & Capex',
  'the-mechanics-of-founder-equity-and-dilution-cascades': 'The Mechanics of Founder Equity',
  'trans-atlantic-critical-raw-materials-and-clean-energy-supply': 'The Geopolitics of Critical Raw Materials',
  'trans-oceanic-great-circle-navigation-and-polar-corridors': 'Great Circle Navigation & Polar Corridors',
  'treasury-basis-trade-and-shadow-banking-leverage': 'The Treasury Basis Trade & Repo Fragility',
  'vagus-nerve-stimulation-and-heart-rate-variability-autonomics': 'Vagus Nerve Stimulation & HRV Dynamics',
  'variable-fonts-and-the-future-of-editorial-legibility': 'Variable Fonts & Editorial Legibility',
  'vo2-max-kinetics-and-mitochondrial-density-in-elite-endurance': 'VO2 Max Kinetics & Mitochondrial Density',
  'wave-field-synthesis-and-spatial-binaural-audio-acoustics': 'The Physics of Spatial and 3D Audio'
};

let updatedCount = 0;
for (const [slug, newTitle] of Object.entries(titleUpdates)) {
  const filePath = path.join(articlesDir, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const oldTitle = data.title;
    data.title = newTitle;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ [${slug}]`);
    console.log(`   Old: "${oldTitle}"`);
    console.log(`   New: "${newTitle}" (${newTitle.length} chars)`);
    updatedCount++;
  }
}

// Clean up temporary dump if exists
const dumpPath = path.join(rootDir, 'scripts', 'long-titles-dump.json');
if (fs.existsSync(dumpPath)) fs.unlinkSync(dumpPath);

console.log(`\nSuccessfully optimized and shortened ${updatedCount} article titles!`);

import fs from 'fs';
import path from 'path';

const updates = {
  'spatial-pressing-geometry-positional-play-rest-defense': {
    title: 'The Geometry of Modern Pressing',
    videoId: 'dNtRo9LGiUU',
    videoTitle: 'Tactical Analysis of Modern Pressing and Positional Play'
  },
  'architecture-of-transformer-attention-mathematics-and-kv-cache': {
    title: 'The Architecture of Transformer Attention',
    videoId: 'kCc8FmEb1nY',
    videoTitle: 'Building Transformer Attention & Language Models from Scratch'
  },
  'compiler-driven-react-server-components-hydration-elimination': {
    title: 'Compiler-Driven React & Server Components',
    videoId: 'TQQPAU21ZUw',
    videoTitle: 'Data Fetching and Architecture with React Server Components'
  },
  'gravitational-wave-interferometry-ligo-and-neutron-star-mergers': {
    title: 'Gravitational Wave Interferometry',
    videoId: 'iphcyNWFD10',
    videoTitle: 'The Physics and Engineering of Detecting Gravitational Waves'
  },
  'microbial-ecology-wild-sourdough-lactic-acid-bacteria-proteolysis': {
    title: 'The Microbial Ecology of Sourdough',
    videoId: '2FVfJTGpXnU',
    videoTitle: 'Wild Sourdough Fermentation Science & Lactic Kinetics'
  },
  'zero-knowledge-rollups-zk-snarks-and-layer-2-scaling-mechanics': {
    title: 'Zero-Knowledge Rollups & zk-SNARKs',
    videoId: 'uchjTIlPzFo',
    videoTitle: 'Zero-Knowledge Proofs and Layer-2 Scaling Foundations'
  },
  'sovereign-debt-cycles-yield-curve-inversions-repo-settlement': {
    title: 'Sovereign Debt Cycles & Repo Markets',
    videoId: 'PHe0bXAIuk0',
    videoTitle: 'How Economic Machines Work and Sovereign Debt Cycles'
  },
  'cardiometabolic-biomarkers-apob-endothelial-nitric-oxide': {
    title: 'Cardiometabolic Biomarkers & ApoB',
    videoId: '7ahOOnOXs4c',
    videoTitle: 'ApoB Biomarkers, Lipid Metrics, and Cardiovascular Risk'
  },
  'the-mechanics-of-enterprise-saas-retention-cohort-dynamics-and-ndr': {
    title: 'The Mechanics of SaaS Retention',
    videoId: '1hHMwLxN6EM',
    videoTitle: 'Foundations of Product Iteration, Retention, and Cohort Metrics'
  },
  'trans-alpine-rail-engineering-and-high-altitude-topography': {
    title: 'Trans-Alpine Rail Engineering',
    videoId: 'r8c3_T9QfnY',
    videoTitle: 'Engineering High-Altitude Alpine Rail Corridors'
  },
  'forex-liquidity-corridors-and-sovereign-reserves': {
    title: 'Global Forex Liquidity Corridors'
  },
  'ground-effect-aerodynamics-venturi-tunnels-and-porpoising-mechanics': {
    title: 'Ground-Effect Aerodynamics in Formula 1',
    videoId: 'CeLT-DLt_HQ',
    videoTitle: 'Aerodynamic Flow Fields & Formula 1 Ground-Effect Engineering'
  },
  'postprandial-glycemic-variability-continuous-glucose-monitoring-and-metabolic-flexibility': {
    title: 'Postprandial Glycemic Variability',
    videoId: 'VAEzZeaV5zM',
    videoTitle: 'Glucose Telemetry, Insulin Kinetics & Metabolic Flexibility'
  },
  'high-voltage-direct-current-transmission-and-intercontinental-supergrids': {
    title: 'HVDC Transmission & Supergrids',
    videoId: 'v1BMWczn7JM',
    videoTitle: 'High-Voltage Power Grids & Long-Distance Electrical Transmission'
  },
  'constant-function-market-makers-impermanent-loss-and-concentrated-liquidity': {
    title: 'Concentrated Liquidity in Market Makers',
    videoId: 'cizLhxSKrAc',
    videoTitle: 'Automated Market Makers & Concentrated Liquidity Mechanics'
  },
  'reverberation-time-schroeder-frequency-and-spatial-diffusor-arrays': {
    title: 'Concert Hall Architectural Acoustics',
    videoId: 'dihQuwrf9yQ',
    videoTitle: 'Acoustic Wave Physics, Resonance & Architectural Spaces'
  },
  'the-art-of-the-monograph-and-tactile-publishing': {
    title: 'The Art of the Monograph'
  },
  'the-death-of-the-card-grid': {
    title: 'The Death of the Card Grid'
  },
  'the-renaissance-of-brutalist-web-design': {
    title: 'The Renaissance of Brutalist Web Design'
  },
  'the-tactile-resurgence-of-material-culture': {
    title: 'The Resurgence of Material Culture'
  },
  'craft-over-convenience': {
    title: 'Craft Over Convenience'
  },
  'the-geometry-of-silence': {
    title: 'The Geometry of Silence'
  },
  'the-grid-as-an-instrument': {
    title: 'The Grid as an Instrument'
  },
  'pure-functional-simplicity': {
    title: 'Pure Functional Simplicity'
  },
  'building-static-multilingual-publishing': {
    title: 'Static Multilingual Publishing'
  },
  'decentralized-edge-architectures-and-micro-caches': {
    title: 'Decentralized Edge Architectures'
  },
  'acoustic-geometry-and-sound-in-sacred-spaces': {
    title: 'Acoustic Geometry in Sacred Spaces'
  }
};

const articlesDir = path.resolve('content/articles');
const translationsDir = path.resolve('content/translations');

// 1. Update source articles
for (const file of fs.readdirSync(articlesDir)) {
  if (!file.endsWith('.json')) continue;
  const slug = file.replace('.json', '');
  const filePath = path.join(articlesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  let modified = false;
  if (updates[slug]) {
    if (updates[slug].title) {
      data.title = updates[slug].title;
      modified = true;
    }
    if (updates[slug].videoId) {
      // Find video block in body
      for (const block of data.body || []) {
        if (block.type === 'video') {
          block.src = `https://www.youtube-nocookie.com/embed/${updates[slug].videoId}`;
          if (updates[slug].videoTitle) block.title = updates[slug].videoTitle;
          modified = true;
        }
      }
    }
  }

  // Ensure all existing video blocks use youtube-nocookie.com
  for (const block of data.body || []) {
    if (block.type === 'video' && block.src.includes('youtube.com/embed/')) {
      block.src = block.src.replace('youtube.com/embed/', 'youtube-nocookie.com/embed/');
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`Updated source: ${slug} -> "${data.title}"`);
  }
}

// 2. Also update translations for video URLs and titles if applicable
if (fs.existsSync(translationsDir)) {
  for (const lang of fs.readdirSync(translationsDir)) {
    const langDir = path.join(translationsDir, lang);
    if (!fs.statSync(langDir).isDirectory()) continue;

    for (const file of fs.readdirSync(langDir)) {
      if (!file.endsWith('.json')) continue;
      const slug = file.replace('.json', '');
      const filePath = path.join(langDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      let modified = false;
      if (updates[slug] && updates[slug].videoId) {
        for (const block of data.body || []) {
          if (block.type === 'video') {
            block.src = `https://www.youtube-nocookie.com/embed/${updates[slug].videoId}`;
            if (updates[slug].videoTitle) block.title = updates[slug].videoTitle;
            modified = true;
          }
        }
      }

      for (const block of data.body || []) {
        if (block.type === 'video' && block.src.includes('youtube.com/embed/')) {
          block.src = block.src.replace('youtube.com/embed/', 'youtube-nocookie.com/embed/');
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      }
    }
  }
}

console.log('Finished updating titles and videos.');

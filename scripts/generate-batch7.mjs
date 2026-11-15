import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'content', 'articles');

const batch7Articles = [
  {
    slug: 'geopolitics-of-critical-minerals-lithium-rare-earths-supply-chains',
    title: 'Geopolitics of Critical Minerals: Lithium, Rare Earths & Clean Tech',
    excerpt: 'An investigative analysis of sovereign mining choke points, metallurgical refining concentration, and strategic reserves powering global energy transition.',
    date: '2026-11-15',
    author: 'Helena Vance',
    tags: ['geopolitics', 'critical-minerals', 'clean-energy', 'supply-chain', 'lithium'],
    image: '/images/articles/critical-minerals-mining.jpg',
    imageAlt: 'Open-pit mineral extraction terracing and heavy processing machinery in a strategic mining basin',
    body: [
      {
        type: 'h2',
        text: 'The Modern Geopolitical Choke Point'
      },
      {
        type: 'p',
        text: 'The global transition toward decarbonized transport and industrial electrification has fundamentally inverted traditional energy security paradigms. Where 20th-century diplomacy was tethered to crude oil straits and hydrocarbon pipelines, 21st-century sovereign resilience hinges upon the chemistry of critical minerals: lithium, neodymium, dysprosium, cobalt, and refined graphite.'
      },
      {
        type: 'h2',
        text: 'Key Points'
      },
      {
        type: 'ul',
        items: [
          'Processing Asymmetry: Upstream raw ore extraction is geographically dispersed, but over 70% of chemical refining capacity remains concentrated in single jurisdictions.',
          'Electrochemical Dependencies: Lithium-iron-phosphate (LFP) and nickel-manganese-cobalt (NMC) chemistries require high-purity battery-grade lithium carbonate and hydroxide.',
          'Rare Earth Magnetics: Neodymium-iron-boron (NdFeB) permanent magnets are irreplaceable components in electric traction motors and direct-drive wind turbines.',
          'Strategic Bilateral Pacts: Major economies are deploying bilateral critical raw material partnerships and friend-shoring compacts to mitigate supply shock vulnerabilities.'
        ]
      },
      {
        type: 'quote',
        text: 'Energy security in the post-carbon era is determined not by who pumps the fuel, but by who refines the specialized crystal lattices required to convert ambient flux into usable torque.',
        cite: 'Global Energy Transition & Strategic Resource Council'
      },
      {
        type: 'h2',
        text: 'Extraction Versus Metallurgical Refining'
      },
      {
        type: 'p',
        text: 'A common analytical mistake is equating mineral ore reserves with supply independence. Australia extracts substantial spodumene rock, and South America\'s Lithium Triangle (Chile, Argentina, Bolivia) holds massive brines. However, converting hard-rock spodumene concentrate into battery-grade lithium hydroxide demands specialized hydrometallurgical calcination and acid leaching infrastructure.'
      },
      {
        type: 'video',
        title: 'The Critical Minerals Race & Global Supply Chain Realities',
        caption: 'A comprehensive investigation into the mining, chemical refining, and sovereign supply security of rare earth elements and battery metals.',
        src: 'https://www.youtube-nocookie.com/embed/N0f4d3Kz6zU'
      },
      {
        type: 'h2',
        text: 'Strategic Stockpiling and Closed-Loop Recycling'
      },
      {
        type: 'p',
        text: 'To de-risk sovereign manufacturing pipelines, leading economic blocs are instituting multi-tier safeguards: minimum domestic processing quotas, strategic physical stockpiles, and mandated battery passport tracking to stimulate hydrometallurgical closed-loop recycling.'
      }
    ]
  },
  {
    slug: 'anatomy-of-venture-capital-liquidity-secondary-markets-dpi-dynamics',
    title: 'Anatomy of Venture Capital Liquidity & Secondary Markets',
    excerpt: 'A financial investigation into delayed public offerings, continuation funds, LP liquidity pressures, and the emergence of private secondary exchanges.',
    date: '2026-11-15',
    author: 'Julian Sterling',
    tags: ['venture-capital', 'liquidity', 'private-equity', 'secondary-markets', 'finance'],
    image: '/images/articles/venture-capital-finance.jpg',
    imageAlt: 'Modern financial district architectural atrium symbolizing private capital markets and investment banking',
    body: [
      {
        type: 'h2',
        text: 'The Structural Liquidity Deficit'
      },
      {
        type: 'p',
        text: 'For over a decade, venture capital operated on a predictable flywheel: raise fund, deploy capital into high-growth software enterprises, and return proceeds via initial public offerings (IPOs) or strategic acquisitions within a 7-to-10-year fund lifecycle. Today, that conventional liquidity pipeline has experienced systemic gridlock as private companies remain unlisted for 14 or more years.'
      },
      {
        type: 'h2',
        text: 'Key Points'
      },
      {
        type: 'ul',
        items: [
          'DPI vs. TVPI Divergence: Institutional limited partners (LPs) increasingly demand Distributed to Paid-In capital (DPI) rather than theoretical mark-ups (TVPI).',
          'Continuation Vehicles: General partners (GPs) are creating structured secondary continuation funds to roll prized assets while offering liquidity windows.',
          'Discount Pressures: Private secondary market transactions frequently clear at 20% to 40% discounts to previous sovereign venture funding valuations.',
          'Institutional Secondary Platforms: The rise of algorithmic matching engines and standardized transfer documentation has turned private shares into a distinct asset class.'
        ]
      },
      {
        type: 'quote',
        text: 'Unrealized internal rates of return cannot fund institutional pension payouts. In a mature venture ecosystem, DPI is the only metric that preserves capital allocator confidence.',
        cite: 'Institutional Private Markets Quarterly Review'
      },
      {
        type: 'h2',
        text: 'GP-Led Secondaries and Fund Architecture'
      },
      {
        type: 'p',
        text: 'To avoid fire-selling high-conviction portfolio companies into tepid IPO environments, investment managers are turning to GP-led single-asset secondary vehicles. These transactions allow external secondary investors to inject fresh growth capital, while existing limited partners can elect to cash out or roll their ownership interest.'
      },
      {
        type: 'video',
        title: 'Private Equity and Venture Capital Secondary Markets Explained',
        caption: 'Financial analysis breaking down how continuation funds, LP-led portfolio sales, and secondary transaction pricing operate in institutional finance.',
        src: 'https://www.youtube-nocookie.com/embed/5T8vV8dFmGQ'
      },
      {
        type: 'h2',
        text: 'The Future of Venture Capital Maturation'
      },
      {
        type: 'p',
        text: 'As secondary exchanges automate capitalization table reconciliations and compliance hurdles, private equity and venture capital will resemble a continuous secondary market rather than an episodic liquidity event, permanently restructuring Silicon Valley capitalization dynamics.'
      }
    ]
  },
  {
    slug: 'biomechanical-force-vectors-in-tennis-serves-kinetic-chain-sequencing',
    title: 'Biomechanical Force Vectors in Elite Tennis Serves',
    excerpt: 'A high-speed kinematic study of ground reaction forces, pelvic rotation, internal shoulder rotation, and kinetic energy summation in professional tennis.',
    date: '2026-11-15',
    author: 'Liam O\'Connor',
    tags: ['tennis', 'biomechanics', 'sports-science', 'kinematics', 'athletic-performance'],
    image: '/images/articles/tennis-biomechanics-serve.jpg',
    imageAlt: 'Professional tennis player in dynamic trophy pose preparing for an explosive first serve on court',
    body: [
      {
        type: 'h2',
        text: 'The Physics of Ballistic Racquet Velocity'
      },
      {
        type: 'p',
        text: 'The professional tennis serve is one of the most explosive, multi-joint closed-loop kinematic actions in competitive athletics. Achieving launch velocities exceeding 220 km/h requires far more than upper-extremity strength; it demands the sequential, uninhibited transfer of mechanical energy along an unbroken kinetic chain from the court surface to the racquet impact point.'
      },
      {
        type: 'h2',
        text: 'Key Points'
      },
      {
        type: 'ul',
        items: [
          'Ground Reaction Force (GRF): Explosive knee flexion and vertical ground push generate the initial linear momentum that drives the entire kinetic sequence.',
          'Pelvic and Thoracic Separation: Hip rotation leads shoulder rotation, creating an elastic stretch-shortening cycle across core oblique musculature.',
          'Internal Shoulder Rotation: Angular velocities exceeding 2,400 degrees per second in internal shoulder rotation contribute up to 50% of final racquet head velocity.',
          'Impact Elevation Window: Striking the ball at the apex of the vertical impulse vector optimizes parabolic clearance and downward court trajectory angles.'
        ]
      },
      {
        type: 'quote',
        text: 'Energy is not created in the arm. The racquet head simply acts as the terminal whip that discharges ground force channeled through the hips, spine, and shoulder girdle.',
        cite: 'International Society of Sports Biomechanics'
      },
      {
        type: 'h2',
        text: 'Segmental Kinematic Sequencing'
      },
      {
        type: 'p',
        text: 'High-speed 3D optical motion capture reveals that peak angular velocity follows a strict proximal-to-distal progression: pelvis deceleration initiates trunk acceleration, trunk deceleration initiates shoulder rotation, followed in microsecond intervals by elbow extension, forearm pronation, and wrist flexion.'
      },
      {
        type: 'video',
        title: 'Kinetic Chain Biomechanics in the Modern Tennis Serve',
        caption: 'High-speed camera and 3D motion tracking analysis detailing ground reaction forces, thoracic tilt, and internal shoulder rotation mechanics.',
        src: 'https://www.youtube-nocookie.com/embed/5D_1E4kGZ_A'
      },
      {
        type: 'h2',
        text: 'Injury Prevention and Scapular Deceleration'
      },
      {
        type: 'p',
        text: 'The eccentric deceleration phase following ball impact subjects the posterior rotator cuff and labrum to extreme distraction forces. Modern conditioning focuses heavily on posterior chain eccentric deceleration training to safeguard joint longevity during 200+ serve match loads.'
      }
    ]
  },
  {
    slug: 'acoustic-diffusors-and-schroeder-number-sequences-in-architecture',
    title: 'Acoustic Diffusors & Schroeder Sequences in Architecture',
    excerpt: 'Mathematical principles of quadratic residue and primitive root diffusors, phase grating scattering, and acoustic space optimization in concert halls.',
    date: '2026-11-15',
    author: 'Elena Rostova',
    tags: ['architecture', 'acoustics', 'structural-design', 'mathematics', 'concert-halls'],
    image: '/images/articles/acoustic-wood-architecture.jpg',
    imageAlt: 'Sculptural acoustic timber wall panels and architectural baffles in a modern philharmonic auditorium',
    body: [
      {
        type: 'h2',
        text: 'Beyond Specular Reflection and Absorption'
      },
      {
        type: 'p',
        text: 'Architectural acoustics has evolved beyond the binary tension of specular reflection and porous absorption. While hard planar surfaces reflect sound like mirrors and dense fabrics attenuate sound energy, diffusors scatter incident wave energy uniformly across time and spatial coordinates without draining ambient acoustic vitality.'
      },
      {
        type: 'h2',
        text: 'Key Points'
      },
      {
        type: 'ul',
        items: [
          'Quadratic Residue Diffusors (QRD): Designed using mathematical modular arithmetic $s_n = n^2 \\pmod{N}$, creating well depths that shift phase evenly.',
          'Primitive Root Diffusors (PRD): Utilize prime number theory to eliminate specular zero-order reflections across broad mid-frequency acoustic bands.',
          'Preservation of Reverberant Energy: Unlike fiberglass absorbers, diffusors maintain room energy while eliminating flutter echoes and comb filtering.',
          'Spatial Envelopment: Distributed phase grating arrays enhance the subjective impression of listener envelopment (LEV) in symphonic halls.'
        ]
      },
      {
        type: 'quote',
        text: 'A great concert hall does not silence sound; it scatters acoustic energy with mathematical precision so that every seat perceives an immersive, coherent soundstage.',
        cite: 'Acoustical Society of Architectural Engineers'
      },
      {
        type: 'h2',
        text: 'Phase Grating Mathematics'
      },
      {
        type: 'p',
        text: 'Pioneered by physicist Manfred Schroeder in the late 1970s, mathematical phase gratings utilize varying well depths separated by thin acoustic dividers. When an incident wave encounters these wells, the reflected wavelets exit with distinct phase delays, resulting in destructive interference along the specular axis and broad dispersion elsewhere.'
      },
      {
        type: 'video',
        title: 'Architectural Acoustics & Schroeder Diffusor Physics',
        caption: 'An engineering overview of quadratic residue diffusors, well-depth calculations, and sound diffusion patterns in auditoriums.',
        src: 'https://www.youtube-nocookie.com/embed/n3W-n_dF83U'
      },
      {
        type: 'h2',
        text: 'Computational Optimization in Contemporary Design'
      },
      {
        type: 'p',
        text: 'Contemporary architectural practices utilize parametric finite-element wave modeling to carve 3D undulating timber panels directly into the interior geometry of auditoriums, blending acoustic physics with sculptural aesthetics.'
      }
    ]
  },
  {
    slug: 'maillard-reaction-kinetics-and-non-enzymatic-browning-thermodynamics',
    title: 'Maillard Reaction Kinetics & Non-Enzymatic Browning',
    excerpt: 'A chemical examination of amino acid and reducing sugar condensation, Amadori rearrangements, Strecker degradation, and culinary flavor creation.',
    date: '2026-11-15',
    author: 'Chef Alexandre Dumas',
    tags: ['food-science', 'gastronomy', 'culinary-techniques', 'chemistry', 'thermodynamics'],
    image: '/images/articles/maillard-reaction-culinary.jpg',
    imageAlt: 'High-temperature searing of a culinary creation with rich golden-brown caramelization in a professional kitchen',
    body: [
      {
        type: 'h2',
        text: 'The Chemical Architecture of Roasted Flavor'
      },
      {
        type: 'p',
        text: 'Every golden crust on a sourdough loaf, roasted coffee bean, and seared steak owes its aromatic depth to one of the most intricate cascades in food chemistry: the Maillard reaction. Named after French chemist Louis-Camille Maillard, this non-enzymatic browning pathway transforms simple reducing sugars and amino acid nucleophiles into hundreds of volatile flavor molecules.'
      },
      {
        type: 'h2',
        text: 'Key Points'
      },
      {
        type: 'ul',
        items: [
          'Initial Condensation: Nucleophilic attack of an unprotonated amine on a reducing sugar carbonyl carbon yields an unstable glycosylamine.',
          'Amadori Rearrangement: Acid-catalyzed isomerization converts aldosylamines into stable 1-amino-1-deoxy-2-ketoses, the pivotal intermediate phase.',
          'Strecker Degradation: Dicarbonyl intermediates react with amino acids to generate aldehydes and aminoketones that condense into aromatic pyrazines.',
          'Water Activity Balance: Reaction velocity peaks at intermediate water activity ($a_w \\approx 0.65$ to $0.75$), while free surface water suppresses browning.'
        ]
      },
      {
        type: 'quote',
        text: 'Cooking is applied thermodynamics. The mastery of heat, surface hydration, and surface pH is nothing less than the conscious acceleration of Maillard kinetics.',
        cite: 'Modernist Culinary Science Journal'
      },
      {
        type: 'h2',
        text: 'Thermal Thresholds and Surface Hydration'
      },
      {
        type: 'p',
        text: 'The Maillard cascade accelerates exponentially above 140°C (284°F). Because liquid water evaporates at 100°C at atmospheric pressure, wet food surfaces cannot achieve the thermodynamic activation energy required for rapid browning until surface moisture has completely vaporized. This explains why surface desiccation is essential for high-heat roasting.'
      },
      {
        type: 'video',
        title: 'The Science of the Maillard Reaction & Browning Thermodynamics',
        caption: 'Detailed food chemistry analysis of amino acids, reducing sugars, Strecker aldehydes, and heterocyclic flavor compounds.',
        src: 'https://www.youtube-nocookie.com/embed/FwFvH_ZfBcw'
      },
      {
        type: 'h2',
        text: 'pH Manipulation and Modern Gastronomy'
      },
      {
        type: 'p',
        text: 'Elevating surface pH using alkaline buffers (such as sodium bicarbonate) deprotonates amino acid amine groups, increasing their nucleophilicity and dramatically accelerating reaction kinetics at lower temperatures without overcooking the interior.'
      }
    ]
  }
];

for (const article of batch7Articles) {
  const filePath = path.join(articlesDir, `${article.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf8');
  console.log(`Wrote article: ${article.slug}`);
}

console.log('Batch 7 generation complete. 5 articles written.');

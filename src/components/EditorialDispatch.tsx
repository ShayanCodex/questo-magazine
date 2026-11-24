import { useState } from 'react';
import { useLanguage } from '../lib/lang-context';
import { CheckCircleIcon, EnvelopeIcon, SparklesIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface NicheTile {
  niche: string;
  tag: string;
  index: string;
  description: string;
  imageUrl: string;
  fallbackUrl: string;
  alt: string;
}

// 12 Photographic pillars representing publication niches from A to Z in vivid high-definition
const NICHE_COLLAGE: NicheTile[] = [
  {
    niche: 'Architecture & Spatial Design',
    tag: 'ARCH',
    index: '01',
    description: 'Brutalist concrete, parametric forms & minimalist interiors',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Minimalist brutalist architecture and light geometry',
  },
  {
    niche: 'Artificial Intelligence & Deep Tech',
    tag: 'AI/TECH',
    index: '02',
    description: 'Silicon microchips, quantum hardware & neural architectures',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Silicon microchip wafer and quantum computing circuits',
  },
  {
    niche: 'Art, Typography & Criticism',
    tag: 'ART/DES',
    index: '03',
    description: 'Modernist sculpture, editorial typography & museum curation',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Sculptural museum composition and modernist form',
  },
  {
    niche: 'Economics, Markets & Finance',
    tag: 'FIN/MKT',
    index: '04',
    description: 'Macro rates, sovereign debt & algorithmic liquidity',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Global financial district lights and algorithmic trading data',
  },
  {
    niche: 'Astronomy, Physics & Cosmos',
    tag: 'SCI/SPACE',
    index: '05',
    description: 'Deep cosmic nebulae, gravitational waves & orbital mechanics',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Deep space cosmic nebula and stellar astrophotography',
  },
  {
    niche: 'Gastronomy & Culinary Science',
    tag: 'GASTRO',
    index: '06',
    description: 'Michelin plating, fermentation kinetics & viticulture',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Artisanal culinary gastronomy and plating',
  },
  {
    niche: 'Philosophy & Classical Thought',
    tag: 'PHIL/ETH',
    index: '07',
    description: 'Stoic dialectics, epistemological frameworks & archives',
    imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Classical historical library and philosophical monographs',
  },
  {
    niche: 'Automotive & Future Mobility',
    tag: 'AUTO/MOTO',
    index: '08',
    description: 'Aerodynamic coachbuilding, EV powertrains & telemetry',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Aerodynamic automotive design and engineering',
  },
  {
    niche: 'Athletics, Longevity & Biology',
    tag: 'FIT/PERF',
    index: '09',
    description: 'Mitochondrial efficiency, VO2 max & cellular resilience',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Human athletic conditioning and biomechanical performance',
  },
  {
    niche: 'Expeditions & Alpine Geography',
    tag: 'EXPED/GEO',
    index: '10',
    description: 'Himalayan topography, arctic traverse & remote cartography',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Alpine mountain peak and overland expedition topography',
  },
  {
    niche: 'Geopolitics & World Affairs',
    tag: 'GEOPOL',
    index: '11',
    description: 'Chokepoints, supply chain sovereignty & global pacts',
    imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/414860/pexels-photo-414860.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Global cartography, trade chokepoints and diplomacy',
  },
  {
    niche: 'Nature & Planetary Ecology',
    tag: 'ECOL/ENV',
    index: '12',
    description: 'Canopy biomes, oceanic currents & carbon reservoirs',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/1423600/pexels-photo-1423600.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Temperate rainforest canopy and ecological biosphere',
  },
];

const ATOZ_NICHES = [
  'Architecture & Space',
  'Art & Typography',
  'Automotive Engineering',
  'Computing & AI',
  'Decentralized Finance',
  'Economics & Markets',
  'Fitness & Longevity',
  'Gastronomy & Wine',
  'Geopolitics & Strategy',
  'Medicine & Health',
  'Philosophy & Ethics',
  'Physics & Cosmos',
  'Travel & Expeditions',
];

export function EditorialDispatch() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-y border-neutral-800 bg-neutral-950 text-white rounded-none mt-16 sm:mt-24 shadow-2xl">
      {/* 1. Masthead & Subscription Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Masthead */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-wider text-white rounded-none">
                <EnvelopeIcon className="h-3.5 w-3.5 text-accent" />
                <span>{t.weeklyJournal || 'Weekly Editorial Journal'}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/15 text-[11px] font-mono uppercase tracking-wider text-white/80 rounded-none">
                <SparklesIcon className="h-3 w-3 text-emerald-400" />
                <span>{t.zeroSpam || 'Zero Spam'}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/20 border border-accent/40 text-[11px] font-mono uppercase tracking-wider text-amber-200 rounded-none">
                <GlobeAltIcon className="h-3 w-3 text-amber-300" />
                <span>All Niches A–Z Compendium</span>
              </span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-tight">
              {t.newsletterTitle}
            </h2>

            <p className="font-serif text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
              {t.newsletterSubtitle}
            </p>

            {/* Subscription Form (Strictly rounded-none) */}
            {submitted ? (
              <div className="p-5 bg-emerald-950/90 border border-emerald-400 text-emerald-100 flex items-center gap-3 text-sm font-medium rounded-none shadow-xl">
                <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>{t.newsletterSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 pt-2 max-w-xl">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.newsletterPlaceholder}
                    required
                    className="w-full bg-neutral-900 border border-neutral-700 px-5 py-4 font-serif text-sm sm:text-base text-white placeholder:text-neutral-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors rounded-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-neutral-950 font-sans text-xs uppercase font-bold tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer shrink-0 rounded-none border border-white"
                >
                  {t.newsletterButton}
                </button>
              </form>
            )}

            {/* Trust Badges Footer (Strictly rounded-none) */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] font-mono uppercase tracking-widest text-neutral-400 pt-2">
              <span>{t.newsletterBullet1 || '• Delivered every Sunday'}</span>
              <span>{t.newsletterBullet2 || '• Unsubscribe anytime'}</span>
              <span>{t.newsletterBullet3 || '• 1,500+ Curated Readers'}</span>
              <span className="hidden sm:inline text-neutral-600">•</span>
              <span className="hidden sm:inline text-neutral-400">Human Curated</span>
            </div>
          </div>

          {/* Right Column: Visual Compendium Card */}
          <div className="lg:col-span-5 border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-5 rounded-none backdrop-blur-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-amber-300 font-semibold">
                Archival Disciplines
              </span>
              <span className="font-mono text-xs text-neutral-400">
                12 Categories
              </span>
            </div>

            <p className="font-serif text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Every Sunday monograph synthesizes deep research spanning architectural theory, computational physics, gastronomy, macroeconomics, and planetary ecology into one coherent journal.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-300 pt-1">
              {ATOZ_NICHES.slice(0, 10).map((niche) => (
                <div key={niche} className="flex items-center gap-1.5 truncate">
                  <span className="text-amber-400 text-xs">▪</span>
                  <span className="truncate">{niche}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-800 pt-3 flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>ISSN 2841-9032</span>
              <span className="text-white font-semibold">Volume 03 // 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full-Width Niche Photography Collage Showcase (Properly Shown Images, No Dark Scrim, Strictly Rounded-None) */}
      <div className="border-t border-neutral-800 bg-black">
        {/* Collage Banner Masthead */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-amber-400 inline-block"></span>
            <span className="uppercase tracking-widest text-white font-bold">
              Visual Compendium // All Publication Niches (A to Z)
            </span>
          </div>
          <span className="text-neutral-400 uppercase tracking-wider text-[11px]">
            High-Definition Field Photography • 12 Active Pillars
          </span>
        </div>

        {/* 12-Tile Edge-to-Edge Visual Collage Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-full">
          {NICHE_COLLAGE.map((item) => (
            <div
              key={item.tag}
              className="group relative aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/3] lg:aspect-[16/11] overflow-hidden border-b sm:border-b-0 border-r border-neutral-800/80 bg-neutral-900 rounded-none select-none cursor-pointer"
            >
              {/* Vibrant Full-Color High-Res Photography */}
              <img
                src={item.imageUrl}
                alt={item.alt}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== item.fallbackUrl) {
                    target.src = item.fallbackUrl;
                  }
                }}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 brightness-100 contrast-105"
              />

              {/* Gentle gradient at bottom only to guarantee text contrast without darkening the photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none" />

              {/* Top-Right Index Pill */}
              <div className="absolute top-2.5 end-2.5 z-10">
                <span className="font-mono text-[9px] uppercase tracking-wider text-white bg-black/80 px-1.5 py-0.5 border border-white/20 rounded-none backdrop-blur-xs">
                  {item.tag}
                </span>
              </div>

              {/* Bottom Card Typography */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-3.5 z-10 space-y-0.5">
                <span className="block font-mono text-[9px] uppercase tracking-widest text-amber-300 font-bold">
                  {item.index} // NICHE
                </span>
                <h3 className="font-display font-bold text-xs sm:text-sm text-white tracking-tight leading-tight group-hover:text-amber-200 transition-colors line-clamp-1">
                  {item.niche}
                </h3>
                <p className="font-serif text-[10px] text-neutral-300 leading-snug line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                  {item.description}
                </p>
              </div>

              {/* Hover Highlight Frame */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/50 pointer-events-none transition-colors duration-300 rounded-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EditorialDispatch;

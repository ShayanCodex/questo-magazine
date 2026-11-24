import { useState } from 'react';
import { useLanguage } from '../lib/lang-context';
import { CheckCircleIcon, EnvelopeIcon, SparklesIcon, GlobeAltIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

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
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-y border-neutral-800 bg-neutral-950 text-white mt-16 sm:mt-24 shadow-2xl">
      {/* 1. Masthead & Subscription Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Masthead */}
          <div className="lg:col-span-7 space-y-6">
            {/* Beautiful Rounded-Full Tags with Tight Tracking */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-xs font-sans font-medium tracking-tight text-white rounded-full backdrop-blur-md transition-all shadow-xs">
                <EnvelopeIcon className="h-3.5 w-3.5 text-accent" />
                <span>{t.weeklyJournal || 'Weekly Editorial Journal'}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/[0.05] hover:bg-white/[0.10] border border-white/15 text-xs font-sans font-medium tracking-tight text-white/90 rounded-full backdrop-blur-md transition-all shadow-xs">
                <SparklesIcon className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t.zeroSpam || 'Zero Spam'}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-xs font-sans font-medium tracking-tight text-amber-200 rounded-full backdrop-blur-md transition-all shadow-xs">
                <GlobeAltIcon className="h-3.5 w-3.5 text-amber-300" />
                <span>All Niches A–Z Compendium</span>
              </span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-tight">
              {t.newsletterTitle}
            </h2>

            <p className="font-serif text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
              {t.newsletterSubtitle}
            </p>

            {/* Awwwards-Style Floating Luxury Input Capsule */}
            {submitted ? (
              <div className="p-4 sm:p-5 bg-emerald-950/80 border border-emerald-400/60 text-emerald-100 flex items-center justify-between gap-3 text-sm font-sans font-medium tracking-tight rounded-full shadow-[0_0_30px_rgba(16,185,129,0.2)] max-w-xl">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-400" />
                  <span>{t.newsletterSuccess}</span>
                </div>
                <span className="text-xs font-sans text-emerald-300/80 font-normal">Active Reader</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative max-w-xl group">
                {/* Ambient Backlight Glow on Hover / Focus */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500/25 via-white/15 to-amber-400/20 blur-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Awwwards Unified Glassmorphic Capsule */}
                <div className="relative flex items-center bg-neutral-900/90 backdrop-blur-2xl border border-white/20 group-hover:border-white/35 focus-within:border-white/60 rounded-full p-1.5 sm:p-2 shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_15px_rgba(255,255,255,0.03)] focus-within:shadow-[0_0_35px_rgba(255,255,255,0.12)] transition-all duration-300">
                  <EnvelopeIcon className="h-5 w-5 text-neutral-400 group-focus-within:text-amber-300 ms-3 sm:ms-4 shrink-0 transition-colors duration-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.newsletterPlaceholder}
                    required
                    className="w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-white font-sans text-sm sm:text-base placeholder:text-neutral-500 tracking-tight px-3 py-2 sm:py-2.5 selection:bg-amber-400 selection:text-black"
                  />
                  <button
                    type="submit"
                    className="rounded-full px-5 sm:px-7 py-3 sm:py-3.5 bg-white text-neutral-950 font-sans font-bold text-xs uppercase tracking-tight hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 group/btn shadow-[0_4px_25px_rgba(255,255,255,0.18)] shrink-0 cursor-pointer"
                  >
                    <span>{t.newsletterButton}</span>
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1" />
                  </button>
                </div>
              </form>
            )}

            {/* Trust Badges Footer with Rounded-Full Tags & Tight Tracking */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/[0.04] border border-white/10 text-xs font-sans text-neutral-300 rounded-full tracking-tight">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                <span>{t.newsletterBullet1 || 'Delivered every Sunday'}</span>
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 bg-white/[0.04] border border-white/10 text-xs font-sans text-neutral-300 rounded-full tracking-tight">
                {t.newsletterBullet2 || 'Unsubscribe anytime'}
              </span>
              <span className="inline-flex items-center px-3.5 py-1.5 bg-white/[0.04] border border-white/10 text-xs font-sans text-neutral-300 rounded-full tracking-tight">
                {t.newsletterBullet3 || '1,500+ Curated Readers'}
              </span>
              <span className="hidden sm:inline-flex items-center px-3.5 py-1.5 bg-amber-400/10 border border-amber-400/20 text-xs font-sans text-amber-300 rounded-full tracking-tight">
                Human Curated • 100% Essays
              </span>
            </div>
          </div>

          {/* Right Column: Visual Compendium Card */}
          <div className="lg:col-span-5 border border-neutral-800/80 bg-neutral-900/60 p-6 sm:p-8 space-y-5 rounded-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="font-sans text-xs uppercase tracking-tight text-amber-300 font-bold">
                Archival Disciplines
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium tracking-tight bg-white/10 text-neutral-300 border border-white/15">
                12 Pillars A–Z
              </span>
            </div>

            <p className="font-serif text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Every Sunday monograph synthesizes deep research spanning architectural theory, computational physics, gastronomy, macroeconomics, and planetary ecology into one coherent journal.
            </p>

            {/* Beautiful Rounded-Full Tags with Tight Tracking */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {ATOZ_NICHES.map((niche) => (
                <span
                  key={niche}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-medium tracking-tight bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-amber-400/40 text-neutral-300 hover:text-white transition-all cursor-default"
                >
                  {niche}
                </span>
              ))}
            </div>

            <div className="border-t border-neutral-800 pt-3 flex items-center justify-between text-xs font-sans tracking-tight text-neutral-400">
              <span className="font-mono text-[11px]">ISSN 2841-9032</span>
              <span className="text-white font-semibold">Volume 03 // 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full-Width 12-Tile Visual Collage Grid (Section Bar Completely Removed) */}
      <div className="border-t border-neutral-800 bg-black">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-full">
          {NICHE_COLLAGE.map((item) => (
            <div
              key={item.tag}
              className="group relative aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/3] lg:aspect-[16/11] overflow-hidden border-b sm:border-b-0 border-r border-neutral-800/80 bg-neutral-900 select-none cursor-pointer"
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

              {/* Top-Right Beautiful Rounded-Full Index Pill */}
              <div className="absolute top-2.5 end-2.5 z-10">
                <span className="inline-flex items-center font-sans font-semibold text-[10px] uppercase tracking-tight text-white bg-black/75 px-2.5 py-0.5 border border-white/20 rounded-full backdrop-blur-md">
                  {item.tag}
                </span>
              </div>

              {/* Bottom Card Typography with Beautiful Rounded-Full Tag */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-3.5 z-10 space-y-1">
                <div>
                  <span className="inline-flex items-center font-sans font-bold text-[9px] uppercase tracking-tight text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
                    {item.index} // NICHE
                  </span>
                </div>
                <h3 className="font-display font-bold text-xs sm:text-sm text-white tracking-tight leading-tight group-hover:text-amber-200 transition-colors line-clamp-1">
                  {item.niche}
                </h3>
                <p className="font-serif text-[10px] text-neutral-300 leading-snug line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                  {item.description}
                </p>
              </div>

              {/* Hover Highlight Frame */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/50 pointer-events-none transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EditorialDispatch;

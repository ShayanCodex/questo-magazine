import { useState } from 'react';
import { useLanguage } from '../lib/lang-context';
import { CheckCircleIcon, EnvelopeIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface NicheTile {
  niche: string;
  tag: string;
  imageUrl: string;
  alt: string;
}

// 12 Curated photographic pillars representing all publication niches from A to Z
const NICHE_COLLAGE: NicheTile[] = [
  {
    niche: 'Architecture & Space',
    tag: 'ARCH',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    alt: 'Minimalist brutalist architecture and light geometry',
  },
  {
    niche: 'Artificial Intelligence & Deep Tech',
    tag: 'AI/TECH',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    alt: 'Silicon microchip wafer and quantum computing circuits',
  },
  {
    niche: 'Art, Design & Typography',
    tag: 'ART/DES',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    alt: 'Sculptural museum composition and modernist form',
  },
  {
    niche: 'Economics, Markets & Finance',
    tag: 'FIN/MKT',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    alt: 'Global financial district lights and algorithmic trading data',
  },
  {
    niche: 'Astronomy, Physics & Cosmos',
    tag: 'SCI/SPACE',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    alt: 'Deep space cosmic nebula and stellar astrophotography',
  },
  {
    niche: 'Gastronomy & Culinary Science',
    tag: 'GASTRO',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    alt: 'Artisanal culinary gastronomy and plating',
  },
  {
    niche: 'Philosophy & Classical Thought',
    tag: 'PHIL/ETH',
    imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80',
    alt: 'Classical historical library and philosophical monographs',
  },
  {
    niche: 'Automotive & Future Mobility',
    tag: 'AUTO/MOTO',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    alt: 'Aerodynamic automotive design and engineering',
  },
  {
    niche: 'Athletics, Fitness & Longevity',
    tag: 'FIT/PERF',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    alt: 'Human athletic conditioning and biomechanical performance',
  },
  {
    niche: 'Expeditions & Alpine Geography',
    tag: 'EXPED/GEO',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    alt: 'Alpine mountain peak and overland expedition topography',
  },
  {
    niche: 'Geopolitics & World Affairs',
    tag: 'GEOPOL',
    imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    alt: 'Global cartography, trade chokepoints and diplomacy',
  },
  {
    niche: 'Nature & Planetary Ecology',
    tag: 'ECOL/ENV',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
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
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-y border-editorial-border bg-neutral-950 rounded-none mt-16 sm:mt-24">
      {/* 1. Multi-Niche Editorial Photography Collage Backdrop */}
      <div className="absolute inset-0 z-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 grid-rows-2 sm:grid-rows-2 h-full w-full pointer-events-none opacity-45 select-none">
        {NICHE_COLLAGE.map((item, idx) => (
          <div
            key={item.tag}
            className={`relative overflow-hidden border border-white/5 ${
              idx >= 8 ? 'hidden lg:block' : idx >= 6 ? 'hidden sm:block' : 'block'
            }`}
          >
            <img
              src={item.imageUrl}
              alt={item.alt}
              loading="lazy"
              className="w-full h-full object-cover grayscale contrast-125 brightness-90 hover:grayscale-0 transition-all duration-700"
            />
            {/* Corner Niche Badge watermark */}
            <span className="absolute bottom-1 end-1 font-mono text-[9px] uppercase tracking-widest text-white/40 bg-black/60 px-1 py-0.5 border border-white/10 rounded-none">
              {item.tag}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Editorial Scrim & Ambient Gradient (Ensures 100% Crisp Readability) */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-neutral-950/95 via-neutral-950/85 to-neutral-950/95 pointer-events-none" />
      <div className="absolute inset-0 z-1 bg-radial-gradient from-transparent via-neutral-950/50 to-neutral-950/90 pointer-events-none" />

      {/* 3. Massive Brutalist Monograph Watermark */}
      <div className="absolute end-0 top-1/2 -translate-y-1/2 text-[12rem] sm:text-[18rem] lg:text-[22rem] font-display font-black text-white/[0.03] select-none pointer-events-none leading-none -me-12 z-1">
        QUESTO
      </div>

      {/* 4. Foreground Content Container (Sharp Architectural Layout, No Rounded Corners) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 text-white space-y-8">
        {/* Top Header & Badges (Strictly rounded-none) */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 text-xs font-mono uppercase tracking-wider text-white rounded-none backdrop-blur-xs">
              <EnvelopeIcon className="h-3.5 w-3.5 text-accent" />
              <span>{t.weeklyJournal || 'Weekly Editorial Journal'}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/15 text-[11px] font-mono uppercase tracking-wider text-white/80 rounded-none">
              <SparklesIcon className="h-3 w-3 text-emerald-400" />
              <span>{t.zeroSpam || 'Zero Spam'}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/20 border border-accent/40 text-[11px] font-mono uppercase tracking-wider text-amber-200 rounded-none">
              <span>All Niches A–Z</span>
            </span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-tight">
            {t.newsletterTitle}
          </h2>

          <p className="font-serif text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-2xl">
            {t.newsletterSubtitle}
          </p>
        </div>

        {/* Multi-Niche Editorial A-to-Z Strip (Strictly rounded-none) */}
        <div className="border-y border-white/10 py-3 overflow-hidden">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-mono text-white/70">
            <span className="text-white font-bold uppercase tracking-wider text-[10px] me-1">
              Covered Fields:
            </span>
            {ATOZ_NICHES.map((niche, i) => (
              <span key={niche} className="inline-flex items-center gap-2">
                <span className="hover:text-white transition-colors cursor-default">
                  {niche}
                </span>
                {i < ATOZ_NICHES.length - 1 && (
                  <span className="text-white/25 select-none">•</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Subscription Form (Strictly rounded-none) */}
        {submitted ? (
          <div className="p-5 bg-emerald-950/80 border border-emerald-400/60 text-emerald-100 flex items-center gap-3 text-sm font-medium rounded-none shadow-xl">
            <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-400" />
            <span>{t.newsletterSuccess}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 pt-1 max-w-2xl">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletterPlaceholder}
                required
                className="w-full bg-black/80 border border-white/30 px-5 py-4 font-serif text-sm sm:text-base text-white placeholder:text-neutral-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors rounded-none"
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
        <div className="flex flex-wrap items-center gap-6 text-[11px] font-mono uppercase tracking-widest text-white/70 pt-2 border-t border-white/10">
          <span>{t.newsletterBullet1 || '• Delivered every Sunday'}</span>
          <span>{t.newsletterBullet2 || '• Unsubscribe anytime'}</span>
          <span>{t.newsletterBullet3 || '• 1,500+ Curated Readers'}</span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="hidden sm:inline text-white/50">Human Curated • Zero AI Hallucination</span>
        </div>
      </div>
    </section>
  );
}

export default EditorialDispatch;

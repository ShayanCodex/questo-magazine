import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/lang-context';
import { CheckCircleIcon, EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface NicheTile {
  niche: string;
  description: string;
  href: string;
  imageUrl: string;
  fallbackUrl: string;
  alt: string;
}

// 20 Photographic pillars (divisible by 2, 4, and 5 so zero empty slots appear at any breakpoint)
const NICHE_COLLAGE: NicheTile[] = [
  {
    niche: 'Architecture & Spatial Design',
    description: 'Brutalist concrete, parametric forms & minimalist interiors',
    href: '/categories/architecture-and-space',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Minimalist brutalist architecture and light geometry',
  },
  {
    niche: 'Artificial Intelligence & Deep Tech',
    description: 'Silicon microchips, quantum hardware & neural architectures',
    href: '/categories/technology',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Silicon microchip wafer and quantum computing circuits',
  },
  {
    niche: 'Art, Typography & Criticism',
    description: 'Modernist sculpture, editorial typography & museum curation',
    href: '/categories/art-and-culture',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Sculptural museum composition and modernist form',
  },
  {
    niche: 'Economics, Markets & Finance',
    description: 'Macro rates, sovereign debt & algorithmic liquidity',
    href: '/categories/finance',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Global financial district lights and algorithmic trading data',
  },
  {
    niche: 'Astronomy, Physics & Cosmos',
    description: 'Deep cosmic nebulae, gravitational waves & orbital mechanics',
    href: '/categories/science',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Deep space cosmic nebula and stellar astrophotography',
  },
  {
    niche: 'Gastronomy & Culinary Science',
    description: 'Michelin plating, fermentation kinetics & viticulture',
    href: '/categories/food',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Artisanal culinary gastronomy and plating',
  },
  {
    niche: 'Philosophy & Classical Thought',
    description: 'Stoic dialectics, epistemological frameworks & archives',
    href: '/categories/art-and-culture',
    imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Classical historical library and philosophical monographs',
  },
  {
    niche: 'Automotive & Future Mobility',
    description: 'Aerodynamic coachbuilding, EV powertrains & telemetry',
    href: '/categories/engineering-and-technology',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Aerodynamic automotive design and engineering',
  },
  {
    niche: 'Athletics, Longevity & Biology',
    description: 'Mitochondrial efficiency, VO2 max & cellular resilience',
    href: '/categories/fitness',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Human athletic conditioning and biomechanical performance',
  },
  {
    niche: 'Expeditions & Alpine Geography',
    description: 'Himalayan topography, arctic traverse & remote cartography',
    href: '/categories/travel',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Alpine mountain peak and overland expedition topography',
  },
  {
    niche: 'Geopolitics & World Affairs',
    description: 'Chokepoints, supply chain sovereignty & global pacts',
    href: '/categories/news',
    imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/414860/pexels-photo-414860.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Global cartography, trade chokepoints and diplomacy',
  },
  {
    niche: 'Nature & Planetary Ecology',
    description: 'Canopy biomes, oceanic currents & carbon reservoirs',
    href: '/categories/science',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/1423600/pexels-photo-1423600.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Temperate rainforest canopy and ecological biosphere',
  },
  {
    niche: 'Industrial Design & Materiality',
    description: 'Brushed titanium, ergonomic tolerances & physical crafts',
    href: '/categories/design-and-typography',
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/276514/pexels-photo-276514.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Industrial design prototyping and modern material craft',
  },
  {
    niche: 'Neuroscience & Cognitive Health',
    description: 'Synaptic plasticity, neural interfaces & longevity',
    href: '/categories/health',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Neuroscience laboratory optics and cellular analysis',
  },
  {
    niche: 'Oceanography & Deep Sea',
    description: 'Abyssal hydrothermal vents, marine trenches & currents',
    href: '/categories/science',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/304664/pexels-photo-304664.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Deep ocean underwater topography and marine exploration',
  },
  {
    niche: 'Cinema & Visual Grammar',
    description: 'Anamorphic lenses, 35mm film grain & frame rhythm',
    href: '/categories/entertainment',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Cinematography camera vintage glass lens and film syntax',
  },
  {
    niche: 'Aerospace & Spaceflight',
    description: 'Atmospheric reentry, orbital telemetry & propulsion',
    href: '/categories/architecture-and-space',
    imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/586056/pexels-photo-586056.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Aerospace orbital rocket launch propulsion system',
  },
  {
    niche: 'Software & Distributed Systems',
    description: 'Kernel engineering, consensus protocols & compilers',
    href: '/categories/software',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Software engineering code and distributed system architecture',
  },
  {
    niche: 'Cryptography & Web3 Protocols',
    description: 'Zero-knowledge proofs, rollups & decentralized liquidity',
    href: '/categories/crypto',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Cryptographic network nodes and digital ledger architecture',
  },
  {
    niche: 'Global Strategy & Business',
    description: 'Capital allocation, supply chains & industrial scale',
    href: '/categories/business',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85',
    fallbackUrl: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Modern corporate architecture and global enterprise strategy',
  },
];

export function EditorialDispatch() {
  const { t, localePath } = useLanguage();
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
      {/* 1. Masthead & Subscription Section with Atmospheric Background Photography */}
      <div className="relative overflow-hidden">
        {/* Background Editorial Architectural Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85"
            alt="Atmospheric Editorial Architecture"
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-60 contrast-110 select-none scale-102"
          />
          {/* Subtle Frosted Scrim to guarantee supreme contrast and readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/70 to-neutral-950/95 backdrop-blur-[3px]" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-neutral-950/40 to-neutral-950/90" />
        </div>

        {/* Foreground Content Container (Centered Luxury Presentation) */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-14 sm:py-28 space-y-6 sm:space-y-8">
          {/* Masthead Heading */}
          <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-tight drop-shadow-sm">
            {t.newsletterTitle}
          </h2>

          <p className="font-serif text-base sm:text-lg text-neutral-200 leading-relaxed max-w-2xl mx-auto drop-shadow-xs">
            {t.newsletterSubtitle}
          </p>

          {/* Awwwards-Style Floating Luxury Input Capsule (Responsive Stack on Mobile, Unified Pill on Desktop) */}
          <div className="pt-2 max-w-xl mx-auto">
            {submitted ? (
              <div className="p-4 sm:p-5 bg-emerald-950/80 border border-emerald-400/60 text-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-sm font-sans font-medium tracking-tight rounded-2xl sm:rounded-full shadow-[0_0_30px_rgba(16,185,129,0.25)] backdrop-blur-xl text-center sm:text-left">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-400" />
                  <span>{t.newsletterSuccess}</span>
                </div>
                <span className="text-xs font-sans text-emerald-300/80 font-normal shrink-0">Active Reader</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative group">
                {/* Ambient Backlight Glow on Hover / Focus */}
                <div className="absolute -inset-1 rounded-3xl sm:rounded-full bg-gradient-to-r from-white/10 via-white/20 to-white/10 blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Awwwards Unified Glassmorphic Capsule */}
                <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 bg-neutral-950/85 backdrop-blur-2xl border border-white/25 group-hover:border-white/45 focus-within:border-white/70 rounded-2xl sm:rounded-full p-2 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(255,255,255,0.06)] focus-within:shadow-[0_0_35px_rgba(255,255,255,0.14)] transition-all duration-300">
                  <div className="flex items-center flex-1 min-w-0">
                    <EnvelopeIcon className="h-5 w-5 text-neutral-400 group-focus-within:text-white ms-2.5 sm:ms-4 shrink-0 transition-colors duration-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.newsletterPlaceholder}
                      required
                      className="w-full min-w-0 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-white font-sans text-sm sm:text-base placeholder:text-neutral-400 tracking-tight px-3 py-2.5 selection:bg-white selection:text-black"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto justify-center rounded-xl sm:rounded-full px-5 sm:px-7 py-3 sm:py-3.5 bg-white text-neutral-950 font-sans font-bold text-xs uppercase tracking-tight hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 group/btn shadow-[0_4px_25px_rgba(255,255,255,0.22)] shrink-0 cursor-pointer"
                  >
                    <span>{t.newsletterButton}</span>
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Trust Badges Footer with Rounded-Full Tags & Tight Tracking */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/[0.06] border border-white/15 text-xs font-sans text-neutral-200 rounded-full tracking-tight backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span>{t.newsletterBullet1 || 'Delivered every Sunday'}</span>
            </span>
            <span className="inline-flex items-center px-3.5 py-1.5 bg-white/[0.06] border border-white/15 text-xs font-sans text-neutral-200 rounded-full tracking-tight backdrop-blur-md">
              {t.newsletterBullet2 || 'Unsubscribe anytime'}
            </span>
            <span className="inline-flex items-center px-3.5 py-1.5 bg-white/[0.06] border border-white/15 text-xs font-sans text-neutral-200 rounded-full tracking-tight backdrop-blur-md">
              {t.newsletterBullet3 || '1,500+ Curated Readers'}
            </span>
            <span className="hidden sm:inline-flex items-center px-3.5 py-1.5 bg-white/[0.08] border border-white/20 text-xs font-sans text-white/90 rounded-full tracking-tight backdrop-blur-md">
              Human Curated • 100% Essays
            </span>
          </div>
        </div>
      </div>

      {/* 2. Full-Width 20-Tile Visual Collage Grid (Divisible by 2, 4, and 5 across all breakpoints, clickable to Blogs) */}
      <div className="border-t border-white/10 bg-black">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 w-full">
          {NICHE_COLLAGE.map((item) => (
            <Link
              key={item.niche}
              to={localePath(item.href)}
              className="group relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden border-b border-r border-neutral-800/80 bg-neutral-900 select-none cursor-pointer block"
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

              {/* Gentle gradient at bottom to guarantee text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

              {/* Clean Responsive Card Typography */}
              <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3.5 z-10 space-y-0.5">
                <h3 className="font-display font-bold text-xs sm:text-[13px] text-white tracking-tight leading-snug group-hover:text-white transition-colors line-clamp-2">
                  {item.niche}
                </h3>
                <p className="font-serif text-[11px] text-neutral-300 leading-snug line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                  {item.description}
                </p>
              </div>

              {/* Frosted Border Highlight Frame on Hover */}
              <div className="absolute inset-0 border border-transparent group-hover:border-white/40 shadow-none group-hover:shadow-[0_0_25px_rgba(255,255,255,0.08)] pointer-events-none transition-all duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EditorialDispatch;

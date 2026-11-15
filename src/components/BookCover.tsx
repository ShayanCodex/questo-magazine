import { useState, useMemo } from 'react';
import { cn } from '../lib/utils';

export interface BookCoverProps {
  coverUrl?: string;
  title: string;
  author: string;
  year?: string;
  category?: string;
  subdiscipline?: string;
  slug?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  priority?: boolean;
}

// Sophisticated clothbound library palettes inspired by Oxford & Penguin classical editions
const LUXURY_PALETTES = [
  {
    name: 'Midnight Sapphire',
    bg: 'from-[#0b1329] via-[#0f1b3d] to-[#060b17]',
    goldBorder: 'border-amber-400/35',
    goldInner: 'border-amber-400/20',
    goldText: 'text-amber-300/85',
    spineShadow: 'from-black/60 via-blue-950/20 to-transparent',
  },
  {
    name: 'Regal Burgundy',
    bg: 'from-[#240a12] via-[#330e1a] to-[#120509]',
    goldBorder: 'border-amber-400/35',
    goldInner: 'border-amber-400/20',
    goldText: 'text-amber-300/85',
    spineShadow: 'from-black/60 via-red-950/20 to-transparent',
  },
  {
    name: 'Forest Malachite',
    bg: 'from-[#081a14] via-[#0d2920] to-[#040e0b]',
    goldBorder: 'border-amber-400/35',
    goldInner: 'border-amber-400/20',
    goldText: 'text-amber-300/85',
    spineShadow: 'from-black/60 via-emerald-950/20 to-transparent',
  },
  {
    name: 'Imperial Amethyst',
    bg: 'from-[#190d26] via-[#241338] to-[#0d0714]',
    goldBorder: 'border-amber-400/35',
    goldInner: 'border-amber-400/20',
    goldText: 'text-amber-300/85',
    spineShadow: 'from-black/60 via-purple-950/20 to-transparent',
  },
  {
    name: 'Burnished Umber',
    bg: 'from-[#1c1209] via-[#2a1b0d] to-[#0d0804]',
    goldBorder: 'border-amber-400/35',
    goldInner: 'border-amber-400/20',
    goldText: 'text-amber-300/85',
    spineShadow: 'from-black/60 via-amber-950/20 to-transparent',
  },
  {
    name: 'Obsidian Slate',
    bg: 'from-[#13161c] via-[#1a1e27] to-[#0a0b0e]',
    goldBorder: 'border-amber-400/35',
    goldInner: 'border-amber-400/20',
    goldText: 'text-amber-300/85',
    spineShadow: 'from-black/60 via-neutral-900/30 to-transparent',
  },
];

export function BookCover({
  coverUrl,
  title,
  author,
  year,
  category,
  subdiscipline,
  slug = '',
  size = 'md',
  className,
  priority = false,
}: BookCoverProps) {
  const [hasError, setHasError] = useState(false);

  // Deterministic palette selection based on title/slug
  const palette = useMemo(() => {
    const key = (slug || title || '').toLowerCase();
    const hash = key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return LUXURY_PALETTES[Math.abs(hash) % LUXURY_PALETTES.length];
  }, [slug, title]);

  const hasValidCover = Boolean(coverUrl && coverUrl.trim().length > 0 && !hasError);
  const disciplineTag = subdiscipline || category;

  if (hasValidCover) {
    return (
      <div className={cn('relative w-full h-full overflow-hidden bg-neutral-950', className)}>
        <img
          src={coverUrl}
          alt={`${title} by ${author}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-500 ease-out"
        />
        {/* Subtle spine gradient overlay on the left */}
        <div className="absolute inset-y-0 start-0 w-2.5 bg-gradient-to-r from-black/50 via-white/5 to-transparent pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
      </div>
    );
  }

  // Bespoke Hardcover Typographic Binding
  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden select-none bg-gradient-to-b flex flex-col justify-between shadow-md border',
        palette.bg,
        palette.goldBorder,
        className
      )}
      role="img"
      aria-label={`Book cover for ${title} by ${author}`}
    >
      {/* 3D Realistic Spine Binding on Left Edge */}
      <div
        className={cn(
          'absolute inset-y-0 start-0 w-3 bg-gradient-to-r pointer-events-none z-10 border-e border-white/5',
          palette.spineShadow
        )}
      />

      {/* Gold Foil Inset Frame with Classical Filigree Corners */}
      <div
        className={cn(
          'absolute inset-1 sm:inset-1.5 border rounded-xs pointer-events-none z-0',
          palette.goldInner
        )}
      >
        {/* Top-left corner filigree */}
        <div className="absolute top-0.5 start-0.5 text-[8px] leading-none text-amber-400/50 font-serif">
          ⌜
        </div>
        {/* Top-right corner filigree */}
        <div className="absolute top-0.5 end-0.5 text-[8px] leading-none text-amber-400/50 font-serif">
          ⌝
        </div>
        {/* Bottom-left corner filigree */}
        <div className="absolute bottom-0.5 start-0.5 text-[8px] leading-none text-amber-400/50 font-serif">
          ⌞
        </div>
        {/* Bottom-right corner filigree */}
        <div className="absolute bottom-0.5 end-0.5 text-[8px] leading-none text-amber-400/50 font-serif">
          ⌟
        </div>
      </div>

      {/* Top Header Stamp */}
      <header className="relative z-1 pt-2 sm:pt-3 px-3 text-center">
        <span
          className={cn(
            'block uppercase tracking-widest font-serif font-bold',
            size === 'sm' ? 'text-[6px] tracking-wider' : 'text-[8px] sm:text-[9px] tracking-widest',
            palette.goldText
          )}
        >
          {size === 'sm' ? 'Questo Classics' : 'Questo Classical Heritage Editions'}
        </span>
        {size !== 'sm' && disciplineTag && (
          <span className="block text-[7px] uppercase tracking-wider text-neutral-400/80 font-sans mt-0.5 truncate">
            {disciplineTag}
          </span>
        )}
      </header>

      {/* Center Body: Title & Author */}
      <main className="relative z-1 my-auto px-2.5 sm:px-3 text-center space-y-1 sm:space-y-1.5">
        <h3
          className={cn(
            'font-display font-bold text-neutral-100 leading-tight mx-auto',
            size === 'sm' && 'text-[10.5px] line-clamp-2 px-0.5',
            size === 'md' && 'text-xs sm:text-sm line-clamp-3 px-1',
            size === 'lg' && 'text-base sm:text-xl md:text-2xl line-clamp-4 px-2'
          )}
        >
          {title}
        </h3>

        {/* Ornate Gold Filigree Separator */}
        <div className="flex items-center justify-center gap-1.5 py-0.5">
          <div className="w-3 sm:w-6 h-px bg-amber-400/40" />
          <span className="text-[7px] sm:text-[8px] text-amber-400/70 font-serif">❖</span>
          <div className="w-3 sm:w-6 h-px bg-amber-400/40" />
        </div>

        <p
          className={cn(
            'font-serif font-medium uppercase tracking-wider text-amber-200/90 truncate',
            size === 'sm' && 'text-[7.5px]',
            size === 'md' && 'text-[9px] sm:text-[10px]',
            size === 'lg' && 'text-xs sm:text-sm'
          )}
        >
          {author}
        </p>

        {year && size !== 'sm' && (
          <p className="text-[8px] font-mono text-neutral-400/90 tracking-wide">
            {year}
          </p>
        )}
      </main>

      {/* Bottom Footer Stamp */}
      <footer className="relative z-1 pb-1.5 sm:pb-2.5 px-3 text-center">
        <div className="flex items-center justify-center gap-1 text-[6.5px] sm:text-[7.5px] uppercase tracking-widest text-neutral-400/80 font-sans">
          <span>Public Domain</span>
          <span>•</span>
          <span>Unabridged</span>
        </div>
      </footer>
    </div>
  );
}

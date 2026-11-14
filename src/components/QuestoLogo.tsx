import { useId } from 'react';

export interface QuestoLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: 'horizontal' | 'icon' | 'stacked';
  showSubtitle?: boolean;
}

/**
 * Official Questo Brand Identity Logo
 * Features 'The Discovery Q' geometric brand mark as the initial 'Q',
 * seamlessly followed by 'UESTO' to form 'QUESTO' with zero duplication.
 * Supports theme-aware currentColor rendering across light and dark modes.
 */
export function QuestoLogo({
  className = '',
  iconClassName = '',
  textClassName = 'text-xl',
  variant = 'horizontal',
  showSubtitle = false,
}: QuestoLogoProps) {
  const maskId = useId();

  // The Discovery Q Mathematical Geometry (viewBox: 0 0 200 200 for square icon, or 28 20 144 160 for tight wordmark)
  // Center (99, 92), R=70, r=50, W=20, tail extension=32
  const isStandaloneIcon = variant === 'icon';
  const viewBox = isStandaloneIcon ? '0 0 200 200' : '28 20 144 160';
  const resolvedIconClass = iconClassName || (isStandaloneIcon ? 'h-7 w-7' : 'h-[1.14em] w-auto');

  const icon = (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${resolvedIconClass}`}
      aria-hidden="true"
    >
      <defs>
        <mask id={maskId}>
          {/* White fills everything (visible) */}
          <rect width="200" height="200" fill="#FFFFFF" />
          {/* Black polygon cuts through the ring at the diagonal bar intersection */}
          <polygon
            points="134.36,126.29 119.15,141.50 134.36,156.70 149.56,141.50"
            fill="#000000"
          />
        </mask>
      </defs>

      {/* 1. Main Circular Ring with negative-space Discovery Cut */}
      <path
        d="M 99 22 A 70 70 0 1 0 99 162 A 70 70 0 1 0 99 22 M 99 42 A 50 50 0 1 1 99 142 A 50 50 0 1 1 99 42 Z"
        fill="currentColor"
        fillRule="evenodd"
        mask={`url(#${maskId})`}
      />

      {/* 2. Inner Diagonal Bar (Starts at center, points 45° down-right) */}
      <polygon
        points="99.00,92.00 84.86,106.14 120.21,141.50 134.36,127.36"
        fill="currentColor"
      />

      {/* 3. Outer Diagonal Tail (Extends 45° beyond the outer ring) */}
      <polygon
        points="148.50,141.50 134.36,155.64 156.98,178.27 171.12,164.12"
        fill="currentColor"
      />
    </svg>
  );

  if (variant === 'icon') {
    return <span className={`inline-flex items-center ${className}`}>{icon}</span>;
  }

  if (variant === 'stacked') {
    return (
      <div
        role="img"
        aria-label="Questo"
        className={`inline-flex flex-col items-center gap-2 select-none ${textClassName} ${className}`}
      >
        <span className="sr-only">Questo</span>
        <span aria-hidden="true" className="shrink-0">{icon}</span>
        <span
          aria-hidden="true"
          className="font-logo font-bold uppercase tracking-[0.06em] text-editorial-text leading-none"
        >
          uesto
        </span>
        {showSubtitle && (
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-editorial-muted">
            Journal
          </span>
        )}
      </div>
    );
  }

  // Default: Horizontal Logo ('The Discovery Q' + 'UESTO' = 'QUESTO')
  return (
    <div
      role="img"
      aria-label="Questo"
      className={`inline-flex items-center gap-[0.08em] group select-none ${textClassName} ${className}`}
    >
      <span className="sr-only">Questo</span>
      <span aria-hidden="true" className="shrink-0 inline-flex items-center">
        {icon}
      </span>
      <div className="inline-flex items-baseline gap-1.5" aria-hidden="true">
        <span
          className="font-logo font-bold uppercase tracking-[0.06em] text-editorial-text group-hover:text-accent transition-colors leading-none"
        >
          uesto
        </span>
        {showSubtitle && (
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-editorial-muted leading-none hidden sm:inline border-s border-editorial-border ps-2 ms-2">
            Magazine
          </span>
        )}
      </div>
    </div>
  );
}

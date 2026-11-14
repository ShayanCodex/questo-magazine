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
 * Features 'The Discovery Q' geometric brand mark and bold editorial wordmark.
 * Supports theme-aware currentColor rendering across light and dark modes.
 */
export function QuestoLogo({
  className = '',
  iconClassName = 'h-7 w-7',
  textClassName = 'text-xl',
  variant = 'horizontal',
  showSubtitle = false,
}: QuestoLogoProps) {
  const maskId = useId();

  // The Discovery Q Mathematical Geometry (viewBox: 0 0 200 200)
  // Center (99, 92), R=70, r=50, W=20, tail extension=32
  const icon = (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${iconClassName}`}
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
      <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
        {icon}
        <span
          className={`font-display font-extrabold uppercase tracking-[0.16em] text-editorial-text select-none leading-none ${textClassName}`}
        >
          Questo
        </span>
        {showSubtitle && (
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-editorial-muted">
            Journal
          </span>
        )}
      </div>
    );
  }

  // Default: Horizontal Logo ('The Discovery Q' + 'QUESTO')
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {icon}
      <div className="flex flex-col">
        <span
          className={`font-display font-black uppercase tracking-[0.16em] text-editorial-text group-hover:text-accent transition-colors select-none leading-none ${textClassName}`}
        >
          Questo
        </span>
        {showSubtitle && (
          <span className="text-[9px] uppercase font-mono tracking-[0.22em] text-editorial-muted leading-tight mt-0.5">
            Magazine
          </span>
        )}
      </div>
    </div>
  );
}

import { useId } from 'react';
import { useLanguage } from '../lib/lang-context';

export interface QuestoLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: 'horizontal' | 'icon' | 'stacked';
  showSubtitle?: boolean;
}

/**
 * Official Questo Brand Identity Logo
 * 
 * Supports localized brand mark and typography:
 * - English/Latin: 'The Discovery Q' + 'UESTO' = 'QUESTO'
 * - Arabic (ar): Iconic geometric Discovery 'ك' + 'ـويستو' = 'كويستو'
 * - Urdu (ur): Iconic geometric Discovery 'ک' + 'وئسٹو' = 'کوئسٹو'
 * 
 * Ensures strict directional isolation (LTR for Latin, RTL for Arabic/Urdu)
 * so letters never reverse or misalign across locales.
 */
export function QuestoLogo({
  className = '',
  iconClassName = '',
  textClassName = 'text-xl',
  variant = 'horizontal',
  showSubtitle = false,
}: QuestoLogoProps) {
  const maskId = useId();
  const { language } = useLanguage();

  const isArabic = language.code === 'ar';
  const isUrdu = language.code === 'ur';
  const isRtl = isArabic || isUrdu;

  const isStandaloneIcon = variant === 'icon';
  const resolvedIconClass = iconClassName || (isStandaloneIcon ? 'h-7 w-7' : 'h-[1.18em] w-auto');

  // Subtitle translations
  const subtitleText = (() => {
    switch (language.code) {
      case 'ar':
        return 'مجلة';
      case 'ur':
        return 'میگزین';
      case 'es':
        return 'Revista';
      case 'fr':
        return 'Revue';
      case 'de':
        return 'Magazin';
      default:
        return 'Magazine';
    }
  })();

  // 1. Classical Latin 'Discovery Q' SVG mark
  const latinIcon = (
    <svg
      viewBox={isStandaloneIcon ? '0 0 200 200' : '28 20 144 160'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${resolvedIconClass}`}
      aria-hidden="true"
    >
      <defs>
        <mask id={maskId}>
          <rect width="200" height="200" fill="#FFFFFF" />
          <polygon
            points="134.36,126.29 119.15,141.50 134.36,156.70 149.56,141.50"
            fill="#000000"
          />
        </mask>
      </defs>

      {/* Main Circular Ring */}
      <path
        d="M 99 22 A 70 70 0 1 0 99 162 A 70 70 0 1 0 99 22 M 99 42 A 50 50 0 1 1 99 142 A 50 50 0 1 1 99 42 Z"
        fill="currentColor"
        fillRule="evenodd"
        mask={`url(#${maskId})`}
      />

      {/* Inner Diagonal Bar */}
      <polygon
        points="99.00,92.00 84.86,106.14 120.21,141.50 134.36,127.36"
        fill="currentColor"
      />

      {/* Outer Diagonal Tail */}
      <polygon
        points="148.50,141.50 134.36,155.64 156.98,178.27 171.12,164.12"
        fill="currentColor"
      />
    </svg>
  );

  // 2. Arabic/Urdu Iconic Discovery Initial Mark
  // Combines the iconic Discovery circle and diagonal tail with the first letter
  const initialChar = isArabic ? 'ك' : 'ک';
  const restChars = isArabic ? 'ـويستو' : 'وئسٹو';
  const brandLabel = isArabic ? 'كويستو' : isUrdu ? 'کوئسٹو' : 'Questo';

  const rtlIcon = (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${
        isStandaloneIcon ? 'h-7 w-7' : 'h-[1.22em] w-[1.22em]'
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full text-current shrink-0"
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="11"
          className="text-editorial-text"
        />
        <polygon
          points="70,70 86,86 94,78 78,62"
          fill="currentColor"
          className="text-editorial-text"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-[0.7em] leading-none text-editorial-text select-none"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          marginTop: isArabic ? '-0.06em' : '0',
          fontWeight: 800,
        }}
      >
        {initialChar}
      </span>
    </div>
  );

  // Standalone Icon Variant
  if (variant === 'icon') {
    return (
      <span className={`inline-flex items-center ${className}`}>
        {isRtl ? rtlIcon : latinIcon}
      </span>
    );
  }

  // RTL Variant (Arabic / Urdu)
  if (isRtl) {
    return (
      <div
        role="img"
        aria-label={brandLabel}
        dir="rtl"
        className={`inline-flex items-center gap-1 group select-none tracking-tight ${textClassName} ${className}`}
      >
        <span className="sr-only">{brandLabel}</span>
        {/* Iconic Initial Brand Mark */}
        {rtlIcon}
        <div className="inline-flex items-baseline gap-1" aria-hidden="true">
          <span className="font-bold tracking-tight text-editorial-text group-hover:text-accent transition-colors leading-none text-[1.08em]">
            {restChars}
          </span>
          {showSubtitle && (
            <span className="text-[10px] uppercase font-mono tracking-wider text-editorial-muted leading-none hidden sm:inline border-s border-editorial-border ps-2 ms-2">
              {subtitleText}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Stacked Variant (English/Latin)
  if (variant === 'stacked') {
    return (
      <div
        role="img"
        aria-label="Questo"
        dir="ltr"
        className={`inline-flex flex-col items-center gap-2 select-none tracking-tight ${textClassName} ${className}`}
      >
        <span className="sr-only">Questo</span>
        <span aria-hidden="true" className="shrink-0">{latinIcon}</span>
        <span
          aria-hidden="true"
          className="font-logo font-bold uppercase tracking-tight text-editorial-text leading-none"
        >
          uesto
        </span>
        {showSubtitle && (
          <span className="text-[10px] uppercase font-mono tracking-wider text-editorial-muted">
            {subtitleText}
          </span>
        )}
      </div>
    );
  }

  // Default: Horizontal Logo ('The Discovery Q' + 'UESTO' = 'QUESTO') with explicit LTR
  return (
    <div
      role="img"
      aria-label="Questo"
      dir="ltr"
      className={`inline-flex items-center gap-0 group select-none tracking-tight ${textClassName} ${className}`}
    >
      <span className="sr-only">Questo</span>
      <span aria-hidden="true" className="shrink-0 inline-flex items-center">
        {latinIcon}
      </span>
      <div className="inline-flex items-baseline" aria-hidden="true">
        <span
          className="font-logo font-bold uppercase tracking-tight text-editorial-text group-hover:text-accent transition-colors leading-none"
        >
          uesto
        </span>
        {showSubtitle && (
          <span className="text-[10px] uppercase font-mono tracking-wider text-editorial-muted leading-none hidden sm:inline border-s border-editorial-border ps-2 ms-2">
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
}

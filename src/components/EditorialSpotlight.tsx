import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/lang-context';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { SPOTLIGHT_LOCALIZED } from '../lib/page-translations';

export function EditorialSpotlight() {
  const { localePath, language } = useLanguage();
  const spotlight = SPOTLIGHT_LOCALIZED[language.code] || SPOTLIGHT_LOCALIZED.en;

  return (
    <section
      aria-label="Editorial Monograph Spotlight"
      className="relative w-full my-12 sm:my-16 overflow-hidden rounded-2xl border border-editorial-border bg-editorial-surface shadow-xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Visual Architectural Imagery */}
        <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[440px] overflow-hidden bg-neutral-900 group">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85"
            alt={spotlight.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/60 pointer-events-none" />

          <div className="absolute top-4 start-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold uppercase tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/20 shadow-md">
              <SparklesIcon className="h-3.5 w-3.5 text-amber-400" />
              <span>{spotlight.badge}</span>
            </span>
          </div>

          <div className="absolute bottom-4 start-4 end-4 text-white">
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-white/80 block">
              {spotlight.location}
            </span>
            <p className="font-display font-bold text-lg sm:text-xl drop-shadow-md">
              {spotlight.title}
            </p>
          </div>
        </div>

        {/* Editorial Text Content */}
        <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 bg-editorial-surface">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-accent">
              <span>{spotlight.critiqueTag}</span>
            </div>

            <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-editorial-text uppercase tracking-tight leading-[1.1]">
              {spotlight.essayTitle}
            </h3>

            <p className="font-serif text-sm sm:text-base text-editorial-muted leading-relaxed">
              {spotlight.essayDesc}
            </p>

            <blockquote className="ps-4 border-s-2 border-editorial-text font-serif italic text-xs sm:text-sm text-editorial-text/80">
              &ldquo;{spotlight.quote}&rdquo;
            </blockquote>
          </div>

          <div className="pt-4 border-t border-editorial-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-editorial-muted block">
                {spotlight.authorLabel}
              </span>
              <Link
                to={localePath(`/authors/${spotlight.authorSlug}`)}
                className="font-sans font-bold text-xs sm:text-sm text-editorial-text hover:underline"
              >
                {spotlight.authorName}
              </Link>
            </div>

            <Link
              to={localePath('/articles/the-geometry-of-silence')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-editorial-text text-editorial-bg font-sans text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-xs"
            >
              <span>{spotlight.readAction}</span>
              <ArrowRightIcon className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


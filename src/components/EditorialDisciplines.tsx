import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/lang-context';
import { ArrowUpRightIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import { DISCIPLINES_LOCALIZED } from '../lib/page-translations';
import { LazyImage } from './LazyImage';

export function EditorialDisciplines() {
  const { t, localePath, language } = useLanguage();

  const disciplines = DISCIPLINES_LOCALIZED[language.code] || DISCIPLINES_LOCALIZED.en;

  return (
    <section id="disciplines" className="pt-12 sm:pt-16 border-t border-editorial-border space-y-8">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-sans font-semibold uppercase tracking-widest text-accent block mb-2">
            {t.categories || 'Categories'} &amp; {t.subcategories || 'Subcategories'}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-editorial-text uppercase tracking-tight">
            {t.editorialDisciplines}
          </h2>
        </div>
        <p className="font-serif text-sm sm:text-base text-editorial-muted max-w-md">
          {t.disciplinesSubtitle}
        </p>
      </div>

      {/* Modern Responsive Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {disciplines.map((item) => (
          <div
            key={item.number}
            className="group relative bg-editorial-surface border border-editorial-border rounded-2xl overflow-hidden hover:border-editorial-text hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* 1. Visual Image Banner with Badges */}
            <Link
              to={localePath(`/articles?category=${item.categoryId}`)}
              className="block relative aspect-[16/10] overflow-hidden bg-editorial-surface-subtle"
              title={item.title}
            >
              <LazyImage
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Subtle directional gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

              {/* Number Badge (Top-Start) */}
              <div className="absolute top-3 start-3">
                <span className="font-sans text-xs font-bold px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white border border-white/20 shadow-xs">
                  {item.number}
                </span>
              </div>

              {/* Category Pill (Bottom-Start) */}
              <div className="absolute bottom-2.5 start-3">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/95 text-neutral-950 backdrop-blur-xs shadow-xs">
                  {item.categoryShort}
                </span>
              </div>

              {/* Interactive Arrow Icon (Top-End) */}
              <div className="absolute top-3 end-3">
                <span className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-neutral-950 transition-all shadow-xs">
                  <ArrowUpRightIcon className="h-3.5 w-3.5 rtl:rotate-90" />
                </span>
              </div>
            </Link>

            {/* 2. Card Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg sm:text-xl leading-snug text-editorial-text group-hover:text-accent transition-colors">
                  <Link to={localePath(`/articles?category=${item.categoryId}`)}>
                    {item.title}
                  </Link>
                </h3>

                <p className="font-serif text-xs sm:text-sm text-editorial-muted leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>

              {/* Subcategories & Action Row */}
              <div className="space-y-3 pt-1">
                {/* Subcategories Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {item.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      to={localePath(`/articles?category=${item.categoryId}&subcategory=${sub.id}`)}
                      className="text-[11px] font-sans font-medium px-2.5 py-1 rounded-full bg-editorial-surface-subtle border border-editorial-border/70 hover:border-editorial-text text-editorial-muted hover:text-editorial-text transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>

                {/* Bottom Action Row: Clean & Professional single line */}
                <div className="pt-3 border-t border-editorial-border/60 flex items-center justify-between gap-2 text-xs font-sans">
                  <Link
                    to={localePath(`/articles?category=${item.categoryId}`)}
                    className="font-medium text-editorial-text hover:text-accent transition-colors flex items-center gap-1 group/link"
                  >
                    <span>{t.browse || 'Browse'}</span>
                    <ArrowRightIcon className="h-3 w-3 rtl:rotate-180 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                  <Link
                    to={localePath(`/tags/${item.tag}`)}
                    className="font-sans font-medium text-[11px] text-editorial-muted hover:text-editorial-text transition-colors"
                  >
                    {item.tagLabel}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

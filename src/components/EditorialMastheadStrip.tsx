import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/lang-context';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { AUTHORS } from '../data/authors';

export function EditorialMastheadStrip() {
  const { localePath } = useLanguage();

  return (
    <section className="pt-12 sm:pt-16 border-t border-editorial-border space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-accent block mb-1">
            Global Perspectives
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-editorial-text uppercase tracking-tight">
            Contributing Critics &amp; Essayists
          </h2>
        </div>
        <Link
          to={localePath('/about#masthead')}
          className="text-xs font-semibold uppercase tracking-wider text-editorial-muted hover:text-editorial-text underline flex items-center gap-1.5"
        >
          <span>View Full Masthead</span>
          <ArrowRightIcon className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.values(AUTHORS).map((author) => (
          <Link
            key={author.slug}
            to={localePath(`/authors/${author.slug}`)}
            className="group p-4 rounded-xl border border-editorial-border bg-editorial-surface hover:border-editorial-text transition-all text-center space-y-2.5 shadow-2xs"
          >
            <img
              src={author.avatar}
              alt={author.name}
              className="w-16 h-16 rounded-full mx-auto object-cover border border-editorial-border group-hover:scale-105 transition-transform"
            />
            <div>
              <h3 className="font-display font-bold text-xs sm:text-sm text-editorial-text group-hover:text-accent transition-colors leading-snug">
                {author.name}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-editorial-muted line-clamp-1 mt-0.5">
                {author.location.split(',')[0]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

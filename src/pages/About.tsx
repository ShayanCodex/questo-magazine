import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import type { BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AUTHORS } from '../data/authors';
import { ABOUT_PAGE } from '../lib/page-translations';

export function About() {
  const { t, localePath, language } = useLanguage();
  const content = ABOUT_PAGE[language.code] || ABOUT_PAGE.en;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: content.breadcrumb },
  ];

  return (
    <div className="space-y-16 max-w-4xl mx-auto font-sans">
      <Seo
        title={`${content.title} — ${content.badge}`}
        description={content.subtitle}
        pathname="/about"
        type="website"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Header */}
      <header className="space-y-6 border-b border-editorial-border pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-editorial-surface-subtle border border-editorial-border text-accent">
          <SparklesIcon className="h-3.5 w-3.5" />
          <span>{content.badge}</span>
        </div>

        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-editorial-text uppercase tracking-tight leading-[1.08]">
          {content.title}
        </h1>

        <p className="font-serif text-lg sm:text-xl text-editorial-muted leading-relaxed max-w-3xl">
          {content.subtitle}
        </p>
      </header>

      {/* Editorial Pillars */}
      <section className="space-y-8">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-editorial-text uppercase tracking-tight">
          {content.pillarsTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.pillars.map((pillar) => (
            <div key={pillar.number} className="p-6 rounded-2xl border border-editorial-border bg-editorial-surface space-y-3">
              <span className="font-display font-bold text-2xl text-accent">{pillar.number}</span>
              <h3 className="font-display font-bold text-lg text-editorial-text">
                {pillar.title}
              </h3>
              <p className="font-serif text-sm text-editorial-muted leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Masthead & Authors */}
      <section id="masthead" className="space-y-8 pt-8 border-t border-editorial-border">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-editorial-muted block">
              {content.mastheadBadge}
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-editorial-text uppercase tracking-tight">
              {content.mastheadTitle}
            </h2>
          </div>
          <p className="font-serif text-sm text-editorial-muted max-w-sm">
            {content.mastheadSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(AUTHORS).map((author) => (
            <Link
              key={author.slug}
              to={localePath(`/authors/${author.slug}`)}
              className="group p-5 rounded-2xl border border-editorial-border bg-editorial-surface hover:border-editorial-text transition-all flex items-start gap-4 shadow-2xs"
            >
              <img
                src={author.avatar}
                alt={author.name}
                className="w-16 h-16 rounded-full object-cover border border-editorial-border shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-base text-editorial-text group-hover:text-accent transition-colors">
                    {author.name}
                  </h3>
                  <ArrowRightIcon className="h-3.5 w-3.5 text-editorial-muted group-hover:text-editorial-text group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform shrink-0" />
                </div>
                <p className="text-xs text-editorial-muted font-medium line-clamp-1">
                  {author.role}
                </p>
                <p className="font-serif text-xs text-editorial-muted/80 line-clamp-2 leading-relaxed pt-1">
                  {author.bio}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ethics & Verification */}
      <section className="p-8 rounded-2xl border border-editorial-border bg-editorial-surface-subtle space-y-4">
        <div className="flex items-center gap-2 text-accent">
          <ShieldCheckIcon className="h-5 w-5" />
          <h3 className="font-display font-bold text-lg uppercase tracking-tight text-editorial-text">
            {content.ethicsTitle}
          </h3>
        </div>
        <p className="font-serif text-sm text-editorial-muted leading-relaxed">
          {content.ethicsDesc}
        </p>
      </section>
    </div>
  );
}

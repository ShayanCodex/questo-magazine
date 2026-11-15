import { Link } from 'react-router-dom';
import { ShieldCheckIcon, LockClosedIcon, ArrowLeftIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { siteConfig } from '../lib/site';
import { PRIVACY_PAGE } from '../lib/page-translations';

export function Privacy() {
  const { localePath, language } = useLanguage();
  const content = PRIVACY_PAGE[language.code] || PRIVACY_PAGE.en;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16 font-sans">
      <Seo
        title={content.title}
        description={content.subtitle}
        pathname="/privacy"
      />

      {/* Header */}
      <header className="space-y-4 border-b border-editorial-border pb-8">
        <Link
          to={localePath('/')}
          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium uppercase tracking-wider text-editorial-muted hover:text-editorial-text transition-colors"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5 rtl:rotate-180" />
          <span>{content.backToPub}</span>
        </Link>

        <div className="flex items-center gap-2 pt-2">
          <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheckIcon className="h-4 w-4" />
          </span>
          <span className="text-xs font-sans font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            {content.badge}
          </span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-tight text-editorial-text">
          {content.h1}
        </h1>
        <p className="font-serif text-base sm:text-lg text-editorial-muted max-w-2xl leading-relaxed">
          {content.subtitle}
        </p>
      </header>

      {/* Content Sections */}
      <div className="space-y-10 font-sans text-editorial-text text-sm sm:text-base leading-relaxed">
        {/* Section 1: Zero-Cookie Architecture */}
        <section className="space-y-3 bg-editorial-surface border border-editorial-border p-6 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-editorial-text font-bold">
            <LockClosedIcon className="h-4 w-4" />
            <h2 className="text-base sm:text-lg uppercase tracking-wider">{content.cookieTitle}</h2>
          </div>
          <p className="text-editorial-muted leading-relaxed">
            {content.cookieDesc}
          </p>
        </section>

        {/* Section 2: LocalStorage Usage */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-editorial-text font-bold">
            <CircleStackIcon className="h-5 w-5" />
            <h2 className="font-display font-bold text-xl uppercase tracking-wide text-editorial-text">
              {content.storageTitle}
            </h2>
          </div>
          <p className="text-editorial-muted leading-relaxed">
            {content.storageDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {content.storageItems.map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-editorial-border bg-editorial-surface space-y-1">
                <span className="font-mono text-xs font-bold text-editorial-text block">{item.key}</span>
                <p className="text-xs text-editorial-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Reader Rights */}
        <section className="space-y-3 bg-editorial-surface border border-editorial-border p-6 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-editorial-text font-bold">
            <ShieldCheckIcon className="h-4 w-4" />
            <h2 className="text-base sm:text-lg uppercase tracking-wider">{content.rightsTitle}</h2>
          </div>
          <p className="text-editorial-muted leading-relaxed">
            {content.rightsDesc}
          </p>
        </section>
      </div>

      <footer className="pt-8 border-t border-editorial-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans text-editorial-muted">
        <span>
          {language.code === 'ur' ? `ناشر: ${siteConfig.name} ادارتی بورڈ` : language.code === 'ar' ? `نُشر بواسطة هيئة تحرير ${siteConfig.name}` : `Published by ${siteConfig.name} Editorial Board`}
        </span>
        <span>
          {language.code === 'ur' ? 'آخری تجدید: نومبر 2026' : language.code === 'ar' ? 'آخر تحديث: نوفمبر 2026' : 'Last Updated: November 2026'}
        </span>
      </footer>
    </div>
  );
}

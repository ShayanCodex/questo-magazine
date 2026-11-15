import type { BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TERMS_PAGE } from '../lib/page-translations';

export function Terms() {
  const { t, localePath, language } = useLanguage();
  const content = TERMS_PAGE[language.code] || TERMS_PAGE.en;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: content.breadcrumb },
  ];

  return (
    <div className="space-y-12 max-w-3xl mx-auto font-sans">
      <Seo
        title={`${content.title} — Questo Magazine`}
        description={content.sections[0]?.body || 'Terms of Service'}
        pathname="/terms"
        type="website"
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-4 border-b border-editorial-border pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent block">
          {content.badge}
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-editorial-text uppercase tracking-tight">
          {content.title}
        </h1>
        <p className="font-serif text-sm text-editorial-muted">
          {content.version}
        </p>
      </header>

      <div className="space-y-8 font-serif text-editorial-text/90 text-sm leading-relaxed">
        {content.sections.map((section, idx) => (
          <section key={idx} className="space-y-3">
            <h2 className="font-display font-bold text-lg uppercase tracking-tight text-editorial-text">
              {section.title}
            </h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

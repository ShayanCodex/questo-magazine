import type { BreadcrumbItem } from '../lib/types';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function Terms() {
  const { t, localePath } = useLanguage();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t.home, href: localePath('/') },
    { label: 'Terms of Service' },
  ];

  return (
    <div className="space-y-12 max-w-3xl mx-auto font-sans">
      <Seo
        title="Terms of Service & Publishing Standards — Questo Magazine"
        description="Review Questo Magazine's reader agreement, intellectual property rules, syndication policies, and community conduct guidelines."
        pathname="/terms"
        type="website"
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-4 border-b border-editorial-border pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent block">
          Legal &amp; Regulatory Disclosures
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-editorial-text uppercase tracking-tight">
          Terms of Service
        </h1>
        <p className="font-serif text-sm text-editorial-muted">
          Effective Date: November 13, 2026 • Version 2.4
        </p>
      </header>

      <div className="space-y-8 font-serif text-editorial-text/90 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg uppercase tracking-tight text-editorial-text">
            1. Intellectual Property &amp; Monograph Rights
          </h2>
          <p>
            All original photography, architectural essays, visual layouts, and typographic compositions published in Questo Magazine are protected under international copyright law. Unaltered quotation of up to 150 words is permitted for academic, critical, or non-commercial journalistic purposes, provided full attribution is given to the author and Questo Magazine with a direct hyperlink to the original monograph.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg uppercase tracking-tight text-editorial-text">
            2. Reader Reflections &amp; Discussion Guidelines
          </h2>
          <p>
            Questo provides a 100% login-free guest commentary environment powered by our open cloud database. By submitting a reflection, you agree not to submit unlawful, defamatory, commercial solicitation, or automated spam content. Our editorial team maintains active moderation rights to prune, delete, or archive any commentary that violates professional discourse standards.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg uppercase tracking-tight text-editorial-text">
            3. Syndication &amp; Republication
          </h2>
          <p>
            Commercial republication, translation into languages not currently supported by our static platform, or physical print reproduction requires formal written licensing from our syndicate desk. Inquiries must be submitted via our official contact desk.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg uppercase tracking-tight text-editorial-text">
            4. Zero Runtime Tracking Guarantee
          </h2>
          <p>
            Questo does not deploy cross-site advertising tracking cookies, third-party marketing beacons, or fingerprinting scripts. Technical analytics are strictly anonymized and aggregated without storing personal reader profiles.
          </p>
        </section>
      </div>
    </div>
  );
}


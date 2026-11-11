import { Link } from 'react-router-dom';
import { ShieldCheckIcon, LockClosedIcon, DocumentCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { siteConfig } from '../lib/site';

export function Privacy() {
  const { localePath } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      <Seo
        title="Privacy Policy & Regulatory Disclosures"
        description="Comprehensive privacy disclosures, zero-cookie architecture declaration, and GDPR/CCPA storage policies."
        pathname="/privacy"
      />

      {/* Header */}
      <header className="space-y-4 border-b border-editorial-border pb-8">
        <Link
          to={localePath('/')}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-editorial-muted hover:text-editorial-text transition-colors"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5 rtl:rotate-180" />
          <span>Back to Publication</span>
        </Link>

        <div className="flex items-center gap-2 pt-2">
          <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheckIcon className="h-4 w-4" />
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
            Compliance &amp; Data Ethics
          </span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-editorial-text">
          Privacy Policy &amp; Data Architecture
        </h1>
        <p className="font-serif text-base sm:text-lg text-editorial-muted max-w-2xl leading-relaxed">
          Questo is architected on the premise of radical privacy, zero third-party tracking, and static data sovereignty.
        </p>
      </header>

      {/* Content Sections */}
      <div className="space-y-10 font-sans text-editorial-text text-sm sm:text-base leading-relaxed">
        {/* Section 1: Zero-Cookie Architecture */}
        <section className="space-y-3 bg-editorial-surface border border-editorial-border p-6 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-editorial-text font-bold">
            <LockClosedIcon className="h-4 w-4" />
            <h2 className="text-base sm:text-lg uppercase tracking-wider">1. Zero-Cookie Architecture Guarantee</h2>
          </div>
          <p className="text-editorial-muted">
            Questo does not deploy, read, or monetize advertising cookies, behavioral trackers, or third-party fingerprinting scripts. We do not partner with data brokers or behavioral marketing networks.
          </p>
        </section>

        {/* Section 2: LocalStorage Usage */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-xl uppercase tracking-wide text-editorial-text">
            2. Client-Side Storage Disclosures (EU GDPR &amp; ePrivacy Art. 5(3))
          </h2>
          <p className="text-editorial-muted">
            To provide an uninterrupted, high-performance reading experience without a server-side account, Questo strictly uses the browser&rsquo;s isolated <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-editorial-surface-subtle border border-editorial-border">localStorage</code> API for purely functional preferences:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-lg border border-editorial-border bg-editorial-surface space-y-1">
              <span className="font-mono text-xs font-bold text-editorial-text block">questo-theme</span>
              <p className="text-xs text-editorial-muted">Remembers your dark or light visual interface selection across sessions.</p>
            </div>
            <div className="p-4 rounded-lg border border-editorial-border bg-editorial-surface space-y-1">
              <span className="font-mono text-xs font-bold text-editorial-text block">questo-reading-list</span>
              <p className="text-xs text-editorial-muted">Saves your offline bookmarks locally on your device without transmitting data.</p>
            </div>
            <div className="p-4 rounded-lg border border-editorial-border bg-editorial-surface space-y-1">
              <span className="font-mono text-xs font-bold text-editorial-text block">questo-recent-searches</span>
              <p className="text-xs text-editorial-muted">Retains your recent search terms locally for instant autocomplete recall.</p>
            </div>
            <div className="p-4 rounded-lg border border-editorial-border bg-editorial-surface space-y-1">
              <span className="font-mono text-xs font-bold text-editorial-text block">questo-edge-views-cache</span>
              <p className="text-xs text-editorial-muted">Caches view counts for 60 seconds to eliminate redundant network roundtrips.</p>
            </div>
          </div>
        </section>

        {/* Section 3: View Counts & Analytics */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl uppercase tracking-wide text-editorial-text">
            3. Privacy-Preserving View Metrics
          </h2>
          <p className="text-editorial-muted">
            Article views are computed via the open-source <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-editorial-surface-subtle border border-editorial-border">hits.sh</code> edge counter. No IP addresses, device identifiers, or tracking cookies are collected or stored. Metrics are completely anonymous and aggregate.
          </p>
        </section>

        {/* Section 4: Community Comments */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl uppercase tracking-wide text-editorial-text">
            4. Community Discourse (Giscus)
          </h2>
          <p className="text-editorial-muted">
            Reader comments are powered by <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Giscus</a>, utilizing GitHub Discussions as a public backend. Interacting with comments requires voluntary sign-in through GitHub OAuth. Questo does not receive or store your GitHub credentials, email, or password.
          </p>
        </section>

        {/* Section 5: CCPA Disclosures */}
        <section className="space-y-3 bg-editorial-surface border border-editorial-border p-6 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-editorial-text font-bold">
            <DocumentCheckIcon className="h-4 w-4" />
            <h2 className="text-base sm:text-lg uppercase tracking-wider">5. California Consumer Privacy Act (CCPA)</h2>
          </div>
          <p className="text-editorial-muted">
            <strong>Do Not Sell or Share My Personal Information:</strong> We do not sell, rent, or share personal data with any commercial third parties. You have the right to browse Questo with absolute data anonymity.
          </p>
        </section>
      </div>

      <footer className="pt-8 border-t border-editorial-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-editorial-muted">
        <span>Published by {siteConfig.name} Editorial Board</span>
        <span>Last Updated: November 12, 2026</span>
      </footer>
    </div>
  );
}


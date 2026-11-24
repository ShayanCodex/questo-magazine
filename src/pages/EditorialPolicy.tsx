import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ShieldCheckIcon, DocumentCheckIcon, ScaleIcon, SparklesIcon } from '@heroicons/react/24/outline';

export function EditorialPolicy() {
  const { t, localePath } = useLanguage();

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: 'Editorial Policy & Verification' },
  ];

  const standards = [
    {
      icon: DocumentCheckIcon,
      title: 'Primary Source Verification',
      description:
        'All empirical claims, statistics, and historical citations must be grounded in peer-reviewed journals, institutional archives, governmental filings, or verified primary interviews. Secondary reporting without direct source attribution is strictly prohibited.',
    },
    {
      icon: ScaleIcon,
      title: 'Commercial Neutrality & Independence',
      description:
        'Our editorial staff maintains absolute independence from commercial advertisers, sponsors, and affiliate partners. Coverage decisions are made exclusively on journalistic merit, intellectual rigor, and cultural relevance. Paid placements are never permitted within monograph bodies.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Transparent Corrections & Retractions',
      description:
        'When factual errors occur, we issue immediate, public corrections within the monograph header specifying the date, nature of the error, and corrected data. Substantive retractions are archived with immutable changelogs.',
    },
    {
      icon: SparklesIcon,
      title: 'Human Authorship & Rigor Standard',
      description:
        'Every published monograph is researched, written, and verified by named domain specialists. Automated or synthetic texts are never published unvetted; human critical analysis and editorial oversight govern every syllable.',
    },
  ];

  return (
    <>
      <Seo
        title="Editorial Policy & Fact-Checking Standards — Questo Magazine"
        description="Our journalistic code of ethics: primary source verification, fact-checking workflows, commercial independence, and transparent corrections policy."
        pathname="/editorial-policy"
      />

      <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
        <header className="space-y-4">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-editorial-text tracking-tight uppercase">
            Editorial Policy & Verification
          </h1>
          <p className="font-serif text-base sm:text-xl text-editorial-muted leading-relaxed">
            The journalistic principles, fact-checking workflows, and ethical commitments that govern every monograph published by Questo Magazine.
          </p>
        </header>

        {/* 4 Pillars Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {standards.map((s, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl border border-editorial-border bg-editorial-surface space-y-4 shadow-2xs"
            >
              <div className="h-10 w-10 rounded-full bg-editorial-surface-hover flex items-center justify-center text-editorial-text border border-editorial-border">
                <s.icon className="h-5 w-5" />
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-editorial-text tracking-tight">
                {s.title}
              </h2>
              <p className="font-serif text-sm sm:text-base text-editorial-muted leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </section>

        {/* Detailed Sections */}
        <section className="space-y-8 font-serif text-editorial-text leading-relaxed border-t border-editorial-border pt-10">
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-editorial-text tracking-tight uppercase">
              1. Fact-Checking & Peer Verification Workflow
            </h2>
            <p className="text-editorial-muted">
              Before publication, manuscripts undergo a two-tiered review process. A dedicated copy editor verifies dates, quotes, mathematical models, and architectural specifications against original source documents. For scientific, biomedical, and financial treatises, external domain critics verify the validity of methodological claims.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-editorial-text tracking-tight uppercase">
              2. Conflict of Interest Disclosures
            </h2>
            <p className="text-editorial-muted">
              Authors and critics must disclose any financial, professional, or personal connections to subjects, institutions, or corporate entities reviewed in their monographs. Disclosures appear prominently beneath author credentials.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-editorial-text tracking-tight uppercase">
              3. Open Public Inquiries & Corrections Desk
            </h2>
            <p className="text-editorial-muted">
              We welcome critical reader feedback and factual scrutiny. To report an error or request verification of a source citation, contact our editorial desk directly at <span className="text-editorial-text font-mono font-medium">editorial@questo-magazine.org</span>. All inquiries receive formal review within 48 hours.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

export default EditorialPolicy;

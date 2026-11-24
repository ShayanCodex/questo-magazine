import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ShieldExclamationIcon, HeartIcon, BanknotesIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export function Disclaimer() {
  const { t, localePath } = useLanguage();

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: 'Legal & Content Disclaimers' },
  ];

  return (
    <>
      <Seo
        title="Content, Health & Financial Disclaimers — Questo Magazine"
        description="Official disclaimers regarding health, medical, financial investment, public domain e-books, and advertising disclosure for Questo Magazine."
        pathname="/disclaimer"
      />

      <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
        <header className="space-y-4">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-editorial-text tracking-tight uppercase">
            Legal & Content Disclaimers
          </h1>
          <p className="font-serif text-base sm:text-xl text-editorial-muted leading-relaxed">
            Please read these general and professional disclaimers carefully prior to reviewing content or downloading archived materials on Questo Magazine.
          </p>
        </header>

        <section className="space-y-8 font-serif text-editorial-text leading-relaxed">
          {/* Health & Medical Disclaimer */}
          <div className="p-6 sm:p-8 rounded-2xl border border-editorial-border bg-editorial-surface space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <HeartIcon className="h-5 w-5" />
              </div>
              <h2 className="font-display font-bold text-xl text-editorial-text uppercase tracking-tight">
                Medical & Healthcare Disclaimer
              </h2>
            </div>
            <p className="text-editorial-muted text-sm sm:text-base leading-relaxed">
              Monographs covering physiology, metabolic science, longevity, nutrition, and exercise biomechanics are published strictly for educational, historical, and informational purposes. Content on this platform is not intended to substitute for professional medical advice, diagnosis, or personalized clinical treatment. Always seek the advice of a qualified physician with any questions regarding personal health conditions.
            </p>
          </div>

          {/* Financial & Investment Disclaimer */}
          <div className="p-6 sm:p-8 rounded-2xl border border-editorial-border bg-editorial-surface space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <BanknotesIcon className="h-5 w-5" />
              </div>
              <h2 className="font-display font-bold text-xl text-editorial-text uppercase tracking-tight">
                Financial & Investment Disclaimer
              </h2>
            </div>
            <p className="text-editorial-muted text-sm sm:text-base leading-relaxed">
              Dispatches on macroeconomic indicators, interest rates, capital markets, sovereign debt, commodities, and digital assets represent macroeconomic analysis and editorial opinion. Nothing published on Questo Magazine constitutes financial, legal, tax, or investment advice. Historical performance and statistical backtests do not guarantee future returns.
            </p>
          </div>

          {/* Public Domain & E-Books Disclaimer */}
          <div className="p-6 sm:p-8 rounded-2xl border border-editorial-border bg-editorial-surface space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <BookOpenIcon className="h-5 w-5" />
              </div>
              <h2 className="font-display font-bold text-xl text-editorial-text uppercase tracking-tight">
                Public Domain & Digital Library Disclaimer
              </h2>
            </div>
            <p className="text-editorial-muted text-sm sm:text-base leading-relaxed">
              Works hosted in the Questo Digital Library are curated from verified public domain repositories, including the Internet Archive and Project Gutenberg, or published under Creative Commons licenses. While we verify copyright expiration under United States law (pre-1929 publications), users residing outside the United States are responsible for verifying public domain status within their respective jurisdictions.
            </p>
          </div>

          {/* Advertising & Affiliate Disclosures */}
          <div className="p-6 sm:p-8 rounded-2xl border border-editorial-border bg-editorial-surface space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                <ShieldExclamationIcon className="h-5 w-5" />
              </div>
              <h2 className="font-display font-bold text-xl text-editorial-text uppercase tracking-tight">
                Advertising & Publisher Disclosures
              </h2>
            </div>
            <p className="text-editorial-muted text-sm sm:text-base leading-relaxed">
              Questo Magazine utilizes automated contextual advertising networks (including Google AdSense) to support independent publishing infrastructure. Third-party advertisers may serve cookies or web beacons to present relevant advertisements based on general browsing preferences. All commercial units are clearly labeled with &quot;#Ad&quot; or &quot;Advertisement&quot;.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

export default Disclaimer;

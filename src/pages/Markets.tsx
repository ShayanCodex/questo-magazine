import { useTheme } from '../lib/theme-context';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TradingViewTickerTape } from '../components/markets/TradingViewTickerTape';
import { GlobalMarketOverview } from '../components/markets/GlobalMarketOverview';
import { ForexMatrixWidget } from '../components/markets/ForexMatrixWidget';
import { CryptoMarketWidget } from '../components/markets/CryptoMarketWidget';
import { CommoditiesEnergyWidget } from '../components/markets/CommoditiesEnergyWidget';
import { MacroIndicatorExplorer } from '../components/markets/MacroIndicatorExplorer';
import { GlobalEconomicCalendar } from '../components/markets/GlobalEconomicCalendar';
import { FinancialNewsWire } from '../components/markets/FinancialNewsWire';
import { MarketCoverageSection } from '../components/markets/MarketCoverageSection';
import {
  CheckBadgeIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export function Markets() {
  const { theme } = useTheme();
  const { t, localePath } = useLanguage();

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: t.markets || 'Markets & Financial Intelligence' },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto font-sans">
      <Seo
        title="Worldwide Financial Market Intelligence & Open Research Platform | Questo"
        description="Explore 100% free international capital market metrics, sovereign indicators, foreign exchange rates, cryptocurrency feeds, commodities, and macroeconomic open data."
        pathname="/markets"
        type="website"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Hero Editorial Masthead */}
      <header className="space-y-6 border-b border-editorial-border pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-editorial-surface-subtle border border-editorial-border text-accent">
            <SparklesIcon className="h-3.5 w-3.5" />
            <span>Open Financial Research Platform • Stage 1 Operational</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>32 Global Exchanges Tracked</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-editorial-surface border border-editorial-border text-editorial-muted">
            <CheckBadgeIcon className="h-3.5 w-3.5 text-editorial-text" />
            <span>Zero Subscription Paywalls</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-editorial-text uppercase tracking-tight leading-[1.05]">
            Worldwide Financial Market Intelligence
          </h1>
          <p className="font-serif text-base sm:text-lg text-editorial-muted leading-relaxed max-w-4xl">
            A comprehensive, completely open financial information system covering the Americas, Europe, Asia-Pacific, and the Middle East. Featuring verified exchange benchmarks, sovereign macroeconomic datasets, and transparent latency disclosures without paid dependencies.
          </p>
        </div>

        {/* Quick Nav Jump Anchor Bar */}
        <nav
          aria-label="Market Sections Navigation"
          className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-editorial-border/60"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-editorial-muted me-2">
            Jump to:
          </span>
          {[
            { id: 'indices', label: 'Indices' },
            { id: 'forex', label: 'Forex & FX Converter' },
            { id: 'crypto', label: 'Cryptocurrency' },
            { id: 'commodities', label: 'Commodities' },
            { id: 'macro', label: 'Macro Indicators' },
            { id: 'calendar', label: 'Economic Calendar' },
            { id: 'news', label: 'News Wire' },
            { id: 'coverage', label: 'Coverage Matrix' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className="px-3 py-1 rounded-full text-xs font-sans font-medium bg-editorial-surface border border-editorial-border hover:border-editorial-text hover:text-editorial-text text-editorial-muted transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Top Hero Ticker Tape */}
      <div className="rounded-lg overflow-hidden border border-editorial-border shadow-xs">
        <TradingViewTickerTape colorTheme={theme} />
      </div>

      {/* 1. Global Equity Overview */}
      <section id="indices" className="scroll-mt-24">
        <GlobalMarketOverview colorTheme={theme} />
      </section>

      {/* 2. Forex Cross Rates & Multi-Currency Converter */}
      <section id="forex" className="scroll-mt-24">
        <ForexMatrixWidget />
      </section>

      {/* 3. Cryptocurrency Digital Asset Intelligence */}
      <section id="crypto" className="scroll-mt-24">
        <CryptoMarketWidget />
      </section>

      {/* 4. Commodities, Energy & Metals */}
      <section id="commodities" className="scroll-mt-24">
        <CommoditiesEnergyWidget colorTheme={theme} />
      </section>

      {/* 5. Macroeconomic Indicator Explorer */}
      <section id="macro" className="scroll-mt-24">
        <MacroIndicatorExplorer />
      </section>

      {/* 6. Worldwide Economic Calendar */}
      <section id="calendar" className="scroll-mt-24">
        <GlobalEconomicCalendar colorTheme={theme} />
      </section>

      {/* 7. Worldwide Financial News Wire */}
      <section id="news" className="scroll-mt-24">
        <FinancialNewsWire />
      </section>

      {/* 8. Full Market Coverage & Regulatory Transparency Matrix */}
      <section id="coverage" className="scroll-mt-24">
        <MarketCoverageSection />
      </section>
    </div>
  );
}
export default Markets;

import { Link } from 'react-router-dom';
import { useTheme } from '../lib/theme-context';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TradingViewTickerTape } from '../components/markets/TradingViewTickerTape';
import { LiveMarketHeartbeat } from '../components/markets/LiveMarketHeartbeat';
import { LiveMarketScreenerWidget } from '../components/markets/LiveMarketScreenerWidget';
import { LiveFearGreedIndex } from '../components/markets/LiveFearGreedIndex';
import { CrossAssetCorrelationMatrix } from '../components/markets/CrossAssetCorrelationMatrix';
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
  ViewColumnsIcon,
  ChartBarIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

export function Markets() {
  const { theme } = useTheme();
  const { t, localePath, language } = useLanguage();
  const isUr = language.code === 'ur';
  const isAr = language.code === 'ar';
  const isEs = language.code === 'es';
  const isFr = language.code === 'fr';
  const isDe = language.code === 'de';

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

  const badgePlatform = isUr
    ? 'اوپن فنانشل ریسرچ پلیٹ فارم • مرحلہ 1 فعال'
    : isAr
    ? 'منصة أبحاث مالية مفتوحة • المرحلة 1 تشغيلية'
    : isEs
    ? 'Plataforma Abierta de Investigación Financiera • Fase 1'
    : isFr
    ? 'Plateforme Ouverte de Recherche Financière • Phase 1'
    : isDe
    ? 'Offene Finanzforschungsplattform • Phase 1'
    : 'Open Financial Research Platform • Stage 1 Operational';

  const badgeExchanges = isUr
    ? '32 عالمی اسٹاک ایکسچینجز کا احاطہ'
    : isAr
    ? 'متابعة 32 بورصة عالمية'
    : isEs
    ? '32 Bolsas Globales Monitoreadas'
    : isFr
    ? '32 Bourses Mondiales Suivies'
    : isDe
    ? '32 Globale Börsen Verfolgt'
    : '32 Global Exchanges Tracked';

  const badgeZeroPaywall = isUr
    ? 'بغیر کسی سبسکرپشن فیس کے مفت'
    : isAr
    ? 'خالية تماماً من قيود الدفع'
    : isEs
    ? 'Sin Muros de Pago'
    : isFr
    ? 'Sans Frais d’Abonnement'
    : isDe
    ? 'Ohne Abonnement-Kosten'
    : 'Zero Subscription Paywalls';

  const pageTitle = isUr
    ? 'عالمی مالیاتی مارکیٹ اور تجارتی معلومات'
    : isAr
    ? 'معلومات الأسواق المالية العالمية'
    : isEs
    ? 'Inteligencia de Mercados Financieros Globales'
    : isFr
    ? 'Intelligence des Marchés Financiers Mondiaux'
    : isDe
    ? 'Globale Finanzmarkt-Intelligence'
    : 'Worldwide Financial Market Intelligence';

  const pageSubtitle = isUr
    ? 'امریکہ، یورپ، ایشیا پیسفک اور مشرق وسطیٰ کا احاطہ کرنے والا مکمل اوپن مالیاتی معلوماتی نظام۔ تصدیق شدہ مارکیٹ انڈیکیٹرز اور میکرو اکنامک ڈیٹا سیٹس بغیر کسی فیس کے۔'
    : isAr
    ? 'نظام معلومات مالية شامل ومفتوح يغطي الأمريكتين وأوروبا وآسيا والمحيط الهادئ والشرق الأوسط، مع مؤشرات اقتصادية كلية دقيقة دون اشتراكات.'
    : isEs
    ? 'Un sistema de información financiera abierto y completo que cubre América, Europa, Asia-Pacífico y Oriente Medio con datos macroeconómicos verificados.'
    : isFr
    ? 'Un système d’information financière libre et complet couvrant les Amériques, l’Europe, l’Asie-Pacifique et le Moyen-Orient avec des indices macroéconomiques certifiés.'
    : isDe
    ? 'Ein umfassendes, offenes Finanzinformationssystem für Amerika, Europa, Asien-Pazifik und den Nahen Osten mit geprüften makroökonomischen Daten.'
    : 'A comprehensive, completely open financial information system covering the Americas, Europe, Asia-Pacific, and the Middle East. Featuring verified exchange benchmarks, sovereign macroeconomic datasets, and transparent latency disclosures without paid dependencies.';

  const jumpToLabel = isUr ? 'براہ راست جائیں:' : isAr ? 'الانتقال إلى:' : isEs ? 'Ir a:' : isFr ? 'Aller à :' : isDe ? 'Springe zu:' : 'Jump to:';

  const sections = [
    { id: 'heartbeat', label: isUr ? 'ہارٹ بیٹ' : isAr ? 'النبض' : isEs ? 'Pulso' : isFr ? 'Pouls' : isDe ? 'Puls' : 'Pulse Engine' },
    { id: 'screener-widget', label: isUr ? 'اسکرینر' : isAr ? 'الماسح' : isEs ? 'Escáner' : isFr ? 'Scanner' : isDe ? 'Screener' : 'Live Screener' },
    { id: 'sentiment', label: isUr ? 'جذبات' : isAr ? 'المشاعر' : isEs ? 'Sentimiento' : isFr ? 'Sentiment' : isDe ? 'Stimmung' : 'Fear & Greed' },
    { id: 'indices', label: isUr ? 'انڈیکسز' : isAr ? 'المؤشرات' : isEs ? 'Índices' : isFr ? 'Indices' : isDe ? 'Indizes' : 'Indices' },
    { id: 'forex', label: isUr ? 'فاریکس کرنسی' : isAr ? 'العملات الأجنبية' : isEs ? 'Divisas y FX' : isFr ? 'Devises Forex' : isDe ? 'Devisen & FX' : 'Forex & FX Converter' },
    { id: 'crypto', label: isUr ? 'کرپٹو کرنسی' : isAr ? 'العملات المشفرة' : isEs ? 'Criptomonedas' : isFr ? 'Cryptomonnaies' : isDe ? 'Kryptowährungen' : 'Cryptocurrency' },
    { id: 'commodities', label: isUr ? 'اشیاء اور توانائی' : isAr ? 'السلع والطاقة' : isEs ? 'Materias Primas' : isFr ? 'Matières Premières' : isDe ? 'Rohstoffe' : 'Commodities' },
    { id: 'correlation', label: isUr ? 'ربط' : isAr ? 'الترابط' : isEs ? 'Correlación' : isFr ? 'Corrélation' : isDe ? 'Korrelation' : 'Cross-Asset Radar' },
    { id: 'macro', label: isUr ? 'معاشی اشاریے' : isAr ? 'المؤشرات الكلية' : isEs ? 'Indicadores Macro' : isFr ? 'Indicateurs Macro' : isDe ? 'Makro-Indikatoren' : 'Macro Indicators' },
    { id: 'calendar', label: isUr ? 'معاشی کیلنڈر' : isAr ? 'التقويم الاقتصادي' : isEs ? 'Calendario Económico' : isFr ? 'Calendrier Économique' : isDe ? 'Wirtschaftskalender' : 'Economic Calendar' },
    { id: 'news', label: isUr ? 'مالیاتی خبریں' : isAr ? 'شريط الأخبار' : isEs ? 'Noticias Financieras' : isFr ? 'Fil d’Actualités' : isDe ? 'Nachrichten' : 'News Wire' },
    { id: 'coverage', label: isUr ? 'احاطہ کا نقشہ' : isAr ? 'مصفوفة التغطية' : isEs ? 'Matriz de Cobertura' : isFr ? 'Matrice de Couverture' : isDe ? 'Abdeckungsmatrix' : 'Coverage Matrix' },
  ];

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
            <span>{badgePlatform}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{badgeExchanges}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-editorial-surface border border-editorial-border text-editorial-muted">
            <CheckBadgeIcon className="h-3.5 w-3.5 text-editorial-text" />
            <span>{badgeZeroPaywall}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-editorial-text uppercase tracking-tight leading-[1.05]">
            {pageTitle}
          </h1>
          <p className="font-serif text-base sm:text-lg text-editorial-muted leading-relaxed max-w-4xl">
            {pageSubtitle}
          </p>
        </div>

        {/* Dedicated In-Depth Analytics Navigation Hub */}
        <div className="p-3.5 rounded-xl bg-editorial-surface-subtle border border-editorial-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs font-mono">
            <span className="font-bold text-editorial-text uppercase block">
              ⚡ Dedicated Real-Time Analysis Pages:
            </span>
            <span className="text-[11px] text-editorial-muted">
              Deep dive into second-by-second execution tapes, treemap heatmaps, and institutional terminals.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
            <Link
              to={localePath('/markets/terminal')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-editorial-text text-editorial-bg font-semibold hover:opacity-90 shadow-2xs"
            >
              <ViewColumnsIcon className="w-3.5 h-3.5" />
              <span>Questo Terminal</span>
            </Link>
            <Link
              to={localePath('/markets/screener')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-editorial-surface border border-editorial-border hover:border-editorial-text text-editorial-text font-medium"
            >
              <ChartBarIcon className="w-3.5 h-3.5" />
              <span>Full Screener</span>
            </Link>
            <Link
              to={localePath('/markets/heatmap')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-editorial-surface border border-editorial-border hover:border-editorial-text text-editorial-text font-medium"
            >
              <Squares2X2Icon className="w-3.5 h-3.5" />
              <span>Global Heatmap</span>
            </Link>
          </div>
        </div>

        {/* Quick Nav Jump Anchor Bar */}
        <nav
          aria-label="Market Sections Navigation"
          className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-editorial-border/60"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-editorial-muted me-2">
            {jumpToLabel}
          </span>
          {sections.map((item) => (
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

      {/* 0. Live Market Heartbeat (World Sessions & 1s Clock) */}
      <section id="heartbeat" className="scroll-mt-24">
        <LiveMarketHeartbeat />
      </section>

      {/* 1. Live Market Screener & Scanner Widget */}
      <section id="screener-widget" className="scroll-mt-24">
        <LiveMarketScreenerWidget />
      </section>

      {/* 2. Live Market Sentiment & Fear & Greed Radar */}
      <section id="sentiment" className="scroll-mt-24">
        <LiveFearGreedIndex />
      </section>

      {/* 3. Global Equity Overview */}
      <section id="indices" className="scroll-mt-24">
        <GlobalMarketOverview colorTheme={theme} />
      </section>

      {/* 4. Forex Cross Rates & Multi-Currency Converter */}
      <section id="forex" className="scroll-mt-24">
        <ForexMatrixWidget />
      </section>

      {/* 5. Cryptocurrency Digital Asset Intelligence */}
      <section id="crypto" className="scroll-mt-24">
        <CryptoMarketWidget />
      </section>

      {/* 6. Commodities, Energy & Metals */}
      <section id="commodities" className="scroll-mt-24">
        <CommoditiesEnergyWidget colorTheme={theme} />
      </section>

      {/* 7. Cross-Asset Correlation Matrix */}
      <section id="correlation" className="scroll-mt-24">
        <CrossAssetCorrelationMatrix />
      </section>

      {/* 8. Macroeconomic Indicator Explorer */}
      <section id="macro" className="scroll-mt-24">
        <MacroIndicatorExplorer />
      </section>

      {/* 9. Worldwide Economic Calendar */}
      <section id="calendar" className="scroll-mt-24">
        <GlobalEconomicCalendar colorTheme={theme} />
      </section>

      {/* 10. Worldwide Financial News Wire */}
      <section id="news" className="scroll-mt-24">
        <FinancialNewsWire />
      </section>

      {/* 11. Full Market Coverage & Regulatory Transparency Matrix */}
      <section id="coverage" className="scroll-mt-24">
        <MarketCoverageSection />
      </section>
    </div>
  );
}

export default Markets;

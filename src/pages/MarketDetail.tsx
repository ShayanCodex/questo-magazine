import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../lib/lang-context';
import { useTheme } from '../lib/theme-context';
import { getMarketAssetBySlug } from '../lib/markets';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { GoogleFinanceInteractiveChart } from '../components/markets/GoogleFinanceInteractiveChart';
import { InstitutionalTechnicalGauge } from '../components/markets/InstitutionalTechnicalGauge';
import {
  ArrowLeftIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export function MarketDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { localePath, t } = useLanguage();
  const { theme } = useTheme();

  const asset = slug ? getMarketAssetBySlug(slug) : null;

  if (!asset) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-6 font-sans">
        <h1 className="font-display font-black text-3xl text-editorial-text uppercase">
          Market Intelligence Record Not Found
        </h1>
        <p className="font-serif text-editorial-muted">
          The requested financial instrument or news dispatch does not exist or has been relocated.
        </p>
        <Link
          to={localePath('/markets')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-editorial-text text-editorial-bg text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Return to Markets Intelligence Dashboard</span>
        </Link>
      </div>
    );
  }

  const isPositive = asset.changePercent >= 0;

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: t.markets || 'Markets', href: localePath('/markets') },
    { label: asset.name },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
      <Seo
        title={`${asset.name} (${asset.symbol}) — Live Market Chart & Intelligence | Questo`}
        description={`Live technical analysis, institutional charts, key statistics, and macroeconomic analysis for ${asset.name}. 100% free open intelligence with zero paywalls.`}
        pathname={`/markets/${asset.slug}`}
        type="article"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-editorial-border pb-4">
        <Link
          to={localePath('/markets')}
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-editorial-muted hover:text-editorial-text transition-colors group"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Markets Dashboard</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
              asset.status === 'real-time'
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                : asset.status === 'delayed-15m'
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                : 'bg-editorial-surface-subtle text-editorial-muted border border-editorial-border'
            }`}
          >
            <ClockIcon className="h-3 w-3" />
            <span>{asset.status === 'real-time' ? 'Real-Time Feed' : asset.status === 'delayed-15m' ? '15m Delayed' : 'EOD Official'}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-editorial-surface border border-editorial-border text-editorial-muted">
            <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-500" />
            <span>Verified Public Data</span>
          </span>
        </div>
      </div>

      {/* Asset Header Info */}
      <header className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-editorial-surface-subtle text-editorial-muted border border-editorial-border">
                {asset.type.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-editorial-muted">
                {asset.exchange} • {asset.country}
              </span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-editorial-text uppercase tracking-tight">
              {asset.name}
            </h1>
          </div>

          {/* Large Price Readout */}
          {typeof asset.price === 'number' && (
            <div className="text-start md:text-right">
              <div className="font-mono font-black text-3xl sm:text-4xl tabular-nums text-editorial-text tracking-tight">
                {asset.currency === 'USD' ? '$' : ''}
                {asset.price.toLocaleString(undefined, {
                  minimumFractionDigits: asset.price < 1 ? 4 : 2,
                  maximumFractionDigits: asset.price < 1 ? 4 : 2,
                })}{' '}
                <span className="text-base font-normal text-editorial-muted">{asset.currency}</span>
              </div>
              <div
                className={`inline-flex items-center gap-1 font-mono font-bold text-sm tabular-nums mt-0.5 ${
                  isPositive ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {isPositive ? (
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {asset.change.toFixed(2)} ({isPositive ? '+' : ''}
                  {asset.changePercent.toFixed(2)}%)
                </span>
                <span className="text-[11px] font-normal text-editorial-muted ms-1">Today</span>
              </div>
            </div>
          )}
        </div>

        <p className="font-serif text-sm sm:text-base text-editorial-muted leading-relaxed max-w-4xl">
          {asset.description}
        </p>
      </header>

      {/* Main Feature: Ultrafast Google Finance Style Interactive Vector Chart & TradingView Pro */}
      <section className="space-y-2">
        <GoogleFinanceInteractiveChart
          symbol={asset.symbol}
          name={asset.name}
          currentPrice={typeof asset.price === 'number' ? asset.price : 100}
          change={asset.change}
          changePercent={asset.changePercent}
          currency={asset.currency}
          tvSymbol={asset.tvSymbol}
          googleFinanceUrl={asset.googleFinanceUrl}
          high={asset.high}
          low={asset.low}
          colorTheme={theme}
        />
      </section>

      {/* 2-Column Deep Intelligence Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Left Column (8 cols): In-Depth Analysis, Key Stats & Constituents */}
        <div className="lg:col-span-8 space-y-8">
          {/* Executive Analysis */}
          <div className="rounded-lg border border-editorial-border bg-editorial-surface p-6 space-y-4">
            <h2 className="font-display font-bold text-lg uppercase tracking-wider text-editorial-text flex items-center gap-2 border-b border-editorial-border/60 pb-3">
              <BuildingLibraryIcon className="h-5 w-5 text-editorial-muted" />
              <span>Comprehensive Market Profile &amp; Fundamentals</span>
            </h2>
            <div className="space-y-4 font-serif text-sm text-editorial-text leading-relaxed">
              {asset.fullAnalysis.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Key Statistics Grid */}
          <div className="rounded-lg border border-editorial-border bg-editorial-surface p-6 space-y-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-editorial-text border-b border-editorial-border/60 pb-3">
              Instrument Specifications &amp; Trading Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {asset.keyStats.map((stat, i) => (
                <div
                  key={i}
                  className="p-3 rounded-md bg-editorial-surface-subtle border border-editorial-border/60 flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-editorial-muted">{stat.label}:</span>
                  <span className="font-bold text-editorial-text">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Constituents (if available) */}
          {asset.constituents && asset.constituents.length > 0 && (
            <div className="rounded-lg border border-editorial-border bg-editorial-surface p-6 space-y-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-editorial-text border-b border-editorial-border/60 pb-3">
                Key Index Constituents &amp; Anchor Holdings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {asset.constituents.map((item, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded bg-editorial-bg border border-editorial-border flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-editorial-surface-subtle flex items-center justify-center text-[10px] font-bold text-editorial-muted">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-editorial-text">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal Compliance & Zero-Copyright Notice Box */}
          <div className="p-4 rounded-lg border border-editorial-border bg-editorial-surface-subtle text-xs font-sans text-editorial-muted space-y-2">
            <div className="flex items-center gap-2 font-bold text-editorial-text uppercase tracking-wider text-[11px]">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Data Rights, Legal Attribution &amp; Redistribution Compliance</span>
            </div>
            <p className="leading-relaxed">
              Market data displayed for <strong>{asset.name}</strong> is licensed under authorized TradingView embed terms, European Central Bank public domain reference rules, and official exchange daily quotation disclosures. No proprietary data is scraped or redistributed without permission. Users have full access to interactive technical indicators directly within this platform without external software requirements.
            </p>
          </div>
        </div>

        {/* Right Column (4 cols): Live Technical Analysis Meter & Related Instruments */}
        <div className="lg:col-span-4 space-y-6">
          {/* Native Institutional Technical Analysis Gauge */}
          <InstitutionalTechnicalGauge
            symbol={asset.symbol}
            name={asset.name}
            currentPrice={typeof asset.price === 'number' ? asset.price : 100}
            changePercent={asset.changePercent}
            colorTheme={theme}
          />

          {/* Related Instruments Jump Cards */}
          <div className="rounded-lg border border-editorial-border bg-editorial-surface p-5 space-y-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-editorial-text border-b border-editorial-border/60 pb-2">
              Related Instruments &amp; Benchmarks
            </h3>
            <div className="space-y-2">
              {asset.relatedSlugs.map((relSlug) => {
                const relAsset = getMarketAssetBySlug(relSlug);
                if (!relAsset) return null;
                const isRelPos = relAsset.changePercent >= 0;

                return (
                  <Link
                    key={relSlug}
                    to={localePath(`/markets/${relSlug}`)}
                    className="group block p-3 rounded-md border border-editorial-border bg-editorial-bg hover:border-editorial-text transition-all"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-editorial-text group-hover:text-accent transition-colors">
                        {relAsset.symbol}
                      </span>
                      <span
                        className={`font-semibold tabular-nums text-[11px] ${
                          isRelPos ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {isRelPos ? '+' : ''}
                        {relAsset.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-[11px] font-sans text-editorial-muted truncate mt-0.5">
                      {relAsset.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Return Action Button */}
          <Link
            to={localePath('/markets')}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-md bg-editorial-text text-editorial-bg font-sans text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Explore All Global Markets</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MarketDetail;

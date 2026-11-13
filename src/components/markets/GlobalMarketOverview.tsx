import { useState, useEffect, useRef } from 'react';
import {
  INITIAL_GLOBAL_INDICES,
  type MarketIndex,
} from '../../lib/markets';
import {
  GlobeAmericasIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface GlobalMarketOverviewProps {
  colorTheme?: 'dark' | 'light';
}

export function GlobalMarketOverview({ colorTheme = 'dark' }: GlobalMarketOverviewProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'tradingview'>('cards');
  const [indices] = useState<MarketIndex[]>(INITIAL_GLOBAL_INDICES);
  const tvContainerRef = useRef<HTMLDivElement>(null);

  const filteredIndices =
    selectedRegion === 'all'
      ? indices
      : indices.filter((idx) => {
          if (selectedRegion === 'americas') return idx.region === 'americas';
          if (selectedRegion === 'europe') return idx.region === 'europe';
          if (selectedRegion === 'asia') return idx.region === 'asia-pacific';
          if (selectedRegion === 'middle-east') return idx.region === 'middle-east';
          return true;
        });

  // Load TradingView Market Overview Widget when viewMode === 'tradingview'
  useEffect(() => {
    if (viewMode !== 'tradingview') return;
    const container = tvContainerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: colorTheme,
      dateRange: '12M',
      showChart: true,
      locale: 'en',
      width: '100%',
      height: '600',
      largeChartUrl: '',
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: true,
      plotLineColorGrowing: 'rgba(16, 185, 129, 1)',
      plotLineColorFalling: 'rgba(239, 68, 68, 1)',
      gridLineColor: 'rgba(240, 243, 246, 0.06)',
      scaleFontColor: 'rgba(120, 123, 134, 1)',
      belowLineFillColorGrowing: 'rgba(16, 185, 129, 0.12)',
      belowLineFillColorFalling: 'rgba(239, 68, 68, 0.12)',
      symbolActiveColor: 'rgba(41, 98, 255, 0.12)',
      tabs: [
        {
          title: 'Global Equities',
          symbols: [
            { s: 'FOREXCOM:SPXUSD', d: 'S&P 500 (US)' },
            { s: 'FOREXCOM:NSXUSD', d: 'NASDAQ 100 (US)' },
            { s: 'INDEX:FTSE', d: 'FTSE 100 (UK)' },
            { s: 'INDEX:DAX', d: 'DAX 40 (Germany)' },
            { s: 'INDEX:NKY', d: 'Nikkei 225 (Japan)' },
            { s: 'INDEX:HSI', d: 'Hang Seng (HK)' },
            { s: 'TADAWUL:TASI', d: 'Tadawul TASI (Saudi)' },
            { s: 'PSX:KSE100', d: 'KSE 100 (Pakistan)' },
          ],
        },
        {
          title: 'Commodities & Energy',
          symbols: [
            { s: 'OANDA:XAUUSD', d: 'Gold Spot' },
            { s: 'OANDA:XAGUSD', d: 'Silver Spot' },
            { s: 'TVC:USOIL', d: 'WTI Crude Oil' },
            { s: 'TVC:UKOIL', d: 'Brent Crude Oil' },
            { s: 'TVC:NATGAS', d: 'Henry Hub Natural Gas' },
          ],
        },
      ],
    });

    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [viewMode, colorTheme]);

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-editorial-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-editorial-muted mb-1">
            <GlobeAmericasIcon className="h-4 w-4" />
            <span>Worldwide Market Intelligence • Stage 1</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-editorial-text">
            Global Equity Indices
          </h2>
          <p className="font-serif text-xs sm:text-sm text-editorial-muted mt-1 max-w-2xl">
            Live and 15-minute delayed benchmark indices across the Americas, Europe, Asia-Pacific, and the Middle East with certified source transparency.
          </p>
        </div>

        {/* View Switcher Pill */}
        <div className="flex items-center gap-1.5 p-1 rounded-full border border-editorial-border bg-editorial-surface self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 text-xs font-sans font-medium rounded-full transition-colors cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                : 'text-editorial-muted hover:text-editorial-text'
            }`}
          >
            Multi-Exchange Cards
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tradingview')}
            className={`px-3 py-1 text-xs font-sans font-medium rounded-full transition-colors cursor-pointer ${
              viewMode === 'tradingview'
                ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                : 'text-editorial-muted hover:text-editorial-text'
            }`}
          >
            TradingView Live Chart
          </button>
        </div>
      </div>

      {/* Regional Filter Bar (Only in Card Mode) */}
      {viewMode === 'cards' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: 'all', label: 'All Regions' },
              { id: 'americas', label: 'Americas' },
              { id: 'europe', label: 'Europe' },
              { id: 'asia', label: 'Asia-Pacific' },
              { id: 'middle-east', label: 'Middle East & GCC' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRegion(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                  selectedRegion === tab.id
                    ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                    : 'bg-editorial-surface border border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-sans text-editorial-muted">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Real-Time</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>15m Delay</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-editorial-muted" />
              <span>EOD Official</span>
            </span>
          </div>
        </div>
      )}

      {/* TradingView Live Market View Embed */}
      {viewMode === 'tradingview' ? (
        <div className="rounded-lg border border-editorial-border bg-editorial-surface p-2 sm:p-4 overflow-hidden">
          <div ref={tvContainerRef} className="tradingview-widget-container" />
          <div className="mt-2 text-right text-[10px] text-editorial-muted">
            Financial charts and market overview provided by{' '}
            <a
              href="https://www.tradingview.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-editorial-text underline hover:text-accent"
            >
              TradingView
            </a>
            . Licensed under Free Embed terms.
          </div>
        </div>
      ) : (
        /* Multi-Exchange Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredIndices.map((idx) => {
            const isPositive = idx.change >= 0;
            return (
              <div
                key={idx.id}
                className="group relative rounded-lg border border-editorial-border bg-editorial-surface hover:border-editorial-text p-4 transition-all duration-200 shadow-2xs hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Country & Latency Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-medium text-editorial-muted truncate">
                      {idx.country} • {idx.exchange}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
                        idx.status === 'real-time'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : idx.status === 'delayed-15m'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-editorial-surface-subtle text-editorial-muted border border-editorial-border'
                      }`}
                      title={idx.source}
                    >
                      <ClockIcon className="h-2.5 w-2.5" />
                      {idx.status === 'real-time'
                        ? 'Real-Time'
                        : idx.status === 'delayed-15m'
                        ? '15m Delay'
                        : 'EOD'}
                    </span>
                  </div>

                  {/* Benchmark Title & Symbol */}
                  <div className="flex items-baseline justify-between gap-2 mb-3">
                    <h3 className="font-display font-bold text-base text-editorial-text tracking-tight group-hover:text-accent transition-colors truncate">
                      {idx.name}
                    </h3>
                    <span className="font-mono text-xs font-semibold text-editorial-muted shrink-0">
                      {idx.symbol}
                    </span>
                  </div>

                  {/* Price & Change Row */}
                  <div className="flex items-baseline justify-between gap-2 mb-3">
                    <span className="font-mono font-black text-xl sm:text-2xl tabular-nums text-editorial-text tracking-tight">
                      {idx.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <div
                      className={`flex items-center gap-1 font-mono font-bold text-xs sm:text-sm tabular-nums shrink-0 ${
                        isPositive ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowTrendingUpIcon className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-3.5 w-3.5" />
                      )}
                      <span>
                        {isPositive ? '+' : ''}
                        {idx.change.toFixed(2)} ({isPositive ? '+' : ''}
                        {idx.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>

                  {/* Day High / Low Range */}
                  <div className="space-y-1 py-2 border-t border-editorial-border/60 text-[11px] font-mono text-editorial-muted">
                    <div className="flex items-center justify-between">
                      <span>Day Range:</span>
                      <span className="text-editorial-text">
                        {idx.low.toLocaleString()} – {idx.high.toLocaleString()} {idx.currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Source Attribution */}
                <div className="pt-2.5 mt-2 border-t border-editorial-border/40 flex items-center justify-between text-[10px] text-editorial-muted">
                  <span className="truncate max-w-[190px]" title={idx.source}>
                    {idx.source}
                  </span>
                  <CheckCircleIcon className="h-3 w-3 text-emerald-500 shrink-0" title="Verified Legal Source" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

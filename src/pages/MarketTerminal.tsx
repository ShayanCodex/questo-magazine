import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/lang-context';
import { useTheme } from '../lib/theme-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LiveMarketHeartbeat } from '../components/markets/LiveMarketHeartbeat';
import { LiveOrderFlowTape } from '../components/markets/LiveOrderFlowTape';
import { LiveFearGreedIndex } from '../components/markets/LiveFearGreedIndex';
import { CrossAssetCorrelationMatrix } from '../components/markets/CrossAssetCorrelationMatrix';
import { TradingViewAdvancedChart } from '../components/markets/TradingViewAdvancedChart';
import {
  ArrowLeftIcon,
  BoltIcon,
  BanknotesIcon,
  ChartBarSquareIcon,
} from '@heroicons/react/24/outline';

const TERMINAL_CHART_PRESETS = [
  { id: 'sp500', name: 'S&P 500', symbol: 'CAPITALCOM:US500', basePrice: 5983.99 },
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BINANCE:BTCUSDT', basePrice: 91420.50 },
  { id: 'gold', name: 'Gold Spot', symbol: 'OANDA:XAUUSD', basePrice: 2568.45 },
  { id: 'crude-oil-brent', name: 'Brent Crude', symbol: 'TVC:UKOIL', basePrice: 72.80 },
  { id: 'eur-usd', name: 'EUR / USD', symbol: 'FX:EURUSD', basePrice: 1.0538 },
];

const CENTRAL_BANKS = [
  { name: 'Federal Reserve (Fed)', country: 'United States', rate: '4.50% - 4.75%', stance: 'Easing (Cuts Expected)', nextMeeting: 'Dec 18, 2026' },
  { name: 'European Central Bank (ECB)', country: 'Eurozone', rate: '3.25%', stance: 'Neutral / Gradual', nextMeeting: 'Dec 12, 2026' },
  { name: 'Bank of England (BoE)', country: 'United Kingdom', rate: '4.75%', stance: 'Data Dependent', nextMeeting: 'Dec 19, 2026' },
  { name: 'Bank of Japan (BoJ)', country: 'Japan', rate: '0.25%', stance: 'Hawkish (Hikes Eyed)', nextMeeting: 'Dec 19, 2026' },
  { name: 'State Bank of Pakistan (SBP)', country: 'Pakistan', rate: '15.00%', stance: 'Aggressive Easing', nextMeeting: 'Dec 16, 2026' },
  { name: 'People’s Bank of China (PBOC)', country: 'China', rate: '3.10%', stance: 'Fiscal & Rate Stimulus', nextMeeting: 'Monthly LPR' },
];

export function MarketTerminal() {
  const { localePath, t } = useLanguage();
  const { theme } = useTheme();
  const [selectedAsset, setSelectedAsset] = useState(TERMINAL_CHART_PRESETS[0]);

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: t.markets || 'Markets', href: localePath('/markets') },
    { label: 'Questo Pro Market Terminal' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
      <Seo
        title="Questo Pro Live Financial Terminal & Multi-Asset Command Center"
        description="Comprehensive real-time trading and market intelligence terminal. Second-by-second streaming executions, Level II depth, intermarket correlations, and central bank policy rates."
        pathname="/markets/terminal"
        type="website"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Terminal Title Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-editorial-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={localePath('/markets')}
              className="inline-flex items-center gap-1 text-xs font-mono font-semibold uppercase tracking-wider text-editorial-muted hover:text-editorial-text transition-colors"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span>Back to Markets Dashboard</span>
            </Link>
            <span className="text-editorial-muted">•</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-accent/10 text-accent font-bold uppercase">
              Pro Terminal Mode
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-editorial-text">
            Questo Pro Market Terminal
          </h1>
          <p className="font-serif text-sm sm:text-base text-editorial-muted mt-1 max-w-3xl">
            Integrated institutional command center featuring second-by-second execution tape, Level II order book depth, cross-asset correlation radar, and central bank policy monitoring.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs self-start lg:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <BoltIcon className="w-3.5 h-3.5" />
            <span>High-Frequency Stream Active</span>
          </div>
        </div>
      </div>

      {/* 1. Live Market Heartbeat (World Sessions & 1s Clock) */}
      <LiveMarketHeartbeat />

      {/* 2. Primary Terminal Chart View with Fast Instrument Switcher */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-editorial-border/60 pb-3">
          <div className="flex items-center gap-2">
            <ChartBarSquareIcon className="w-5 h-5 text-accent" />
            <h2 className="font-display font-bold text-lg uppercase tracking-wider text-editorial-text">
              Multi-Asset Advanced Candlestick Terminal
            </h2>
          </div>

          {/* Quick Instrument Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {TERMINAL_CHART_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedAsset(preset)}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  selectedAsset.id === preset.id
                    ? 'bg-editorial-text text-editorial-bg shadow-xs'
                    : 'bg-editorial-surface border border-editorial-border text-editorial-muted hover:text-editorial-text'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Embedded Interactive High-Resolution Chart */}
        <div className="rounded-xl border border-editorial-border bg-editorial-surface p-2 sm:p-4 overflow-hidden shadow-2xs">
          <TradingViewAdvancedChart
            symbol={selectedAsset.symbol}
            colorTheme={theme}
            height={560}
          />
        </div>
      </section>

      {/* 3. Second-by-Second Streaming Order Flow & Level II Depth Ladder */}
      <section className="space-y-4">
        <LiveOrderFlowTape
          symbol={selectedAsset.name}
          basePrice={selectedAsset.basePrice}
        />
      </section>

      {/* 4. Two-Column Intelligence: Sentiment Radar & Central Banks Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (6 cols): Live Fear & Greed Radar */}
        <div className="lg:col-span-6 space-y-6">
          <LiveFearGreedIndex />
        </div>

        {/* Right (6 cols): Central Bank Interest Rates Monitor */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-editorial-border bg-editorial-surface p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-editorial-border/60 pb-3">
              <div className="flex items-center gap-2">
                <BanknotesIcon className="w-5 h-5 text-accent" />
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-editorial-text">
                  Central Bank Policy Rate Monitor
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-editorial-surface-subtle border border-editorial-border text-editorial-muted">
                Global Monetary Stance
              </span>
            </div>

            <p className="font-serif text-xs text-editorial-muted">
              Benchmark policy rates set by primary sovereign central banks governing international borrowing costs and liquidity conditions.
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              {CENTRAL_BANKS.map((cb) => (
                <div
                  key={cb.name}
                  className="p-3 rounded-lg bg-editorial-surface-subtle border border-editorial-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-editorial-text block">
                      {cb.name}
                    </span>
                    <span className="text-[10px] text-editorial-muted font-sans">
                      {cb.country} • Next Meeting: {cb.nextMeeting}
                    </span>
                  </div>

                  <div className="text-start sm:text-end">
                    <span className="font-bold text-accent text-sm block tabular-nums">
                      {cb.rate}
                    </span>
                    <span className="text-[10px] font-sans text-editorial-muted">
                      {cb.stance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Cross-Asset Correlation Matrix */}
      <section className="space-y-4">
        <CrossAssetCorrelationMatrix />
      </section>
    </div>
  );
}

export default MarketTerminal;

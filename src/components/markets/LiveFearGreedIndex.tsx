import { useState } from 'react';
import {
  FireIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface IndicatorFactor {
  name: string;
  score: number; // 0-100
  reading: string;
  status: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  detail: string;
}

const FACTORS: IndicatorFactor[] = [
  {
    name: 'Market Momentum (S&P 500)',
    score: 72,
    reading: '+4.8% above 125-day MA',
    status: 'Greed',
    detail: 'S&P 500 is trading comfortably above its 125-day moving average, signaling institutional accumulation.',
  },
  {
    name: 'Stock Price Strength (52W Highs/Lows)',
    score: 68,
    reading: 'NYSE Net Highs +142',
    status: 'Greed',
    detail: 'The number of stocks hitting new 52-week highs outpaces new 52-week lows by a wide margin.',
  },
  {
    name: 'Stock Price Breadth (McClellan)',
    score: 61,
    reading: '+310 Volume Summation',
    status: 'Greed',
    detail: 'Advancing trading volume exceeds declining volume on major international exchanges.',
  },
  {
    name: 'Put and Call Options Ratio',
    score: 54,
    reading: '0.82 CBOE PCR',
    status: 'Neutral',
    detail: 'Trading volume in bullish call options slightly exceeds protective put option hedges.',
  },
  {
    name: 'Market Volatility (VIX Index)',
    score: 76,
    reading: 'VIX 14.28 (Low Vol)',
    status: 'Extreme Greed',
    detail: 'The CBOE Volatility Index remains well below its 50-day moving average of 18.5, indicating complacency.',
  },
  {
    name: 'Safe Haven Demand (Stocks vs Bonds)',
    score: 65,
    reading: 'Equities +2.4% vs BND',
    status: 'Greed',
    detail: 'Stock returns over the past 20 trading sessions have outperformed safe-haven sovereign treasuries.',
  },
  {
    name: 'Junk Bond Demand (Credit Spread)',
    score: 70,
    reading: '312 bps Option-Adjusted',
    status: 'Greed',
    detail: 'Yield spreads on high-yield corporate bonds are near multi-year lows, reflecting low perceived default risk.',
  },
];

export function LiveFearGreedIndex() {
  const [activeTab, setActiveTab] = useState<'overview' | 'factors'>('overview');
  const compositeScore = 67; // Current Live Score: Greed

  const getStatusLabel = (score: number) => {
    if (score >= 75) return { text: 'Extreme Greed', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 55) return { text: 'Greed', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (score >= 45) return { text: 'Neutral', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    if (score >= 25) return { text: 'Fear', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
    return { text: 'Extreme Fear', color: 'text-rose-600', bg: 'bg-rose-600/15 border-rose-600/30' };
  };

  const status = getStatusLabel(compositeScore);

  return (
    <div className="rounded-xl border border-editorial-border bg-editorial-surface p-5 sm:p-6 space-y-6 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-editorial-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-accent mb-1">
            <FireIcon className="w-4 h-4" />
            <span>Market Sentiment &amp; Behavioral Index</span>
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-tight text-editorial-text">
            Global Fear &amp; Greed Radar
          </h2>
          <p className="font-serif text-xs text-editorial-muted mt-0.5">
            Composite behavioral thermometer derived from 7 multi-market indicators, options flow, and sovereign credit spreads.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-full border border-editorial-border bg-editorial-surface-subtle self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-editorial-text text-editorial-bg font-semibold'
                : 'text-editorial-muted hover:text-editorial-text'
            }`}
          >
            Sentiment Meter
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('factors')}
            className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
              activeTab === 'factors'
                ? 'bg-editorial-text text-editorial-bg font-semibold'
                : 'text-editorial-muted hover:text-editorial-text'
            }`}
          >
            7 Underlying Factors
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main Dial Readout */}
          <div className="md:col-span-5 flex flex-col items-center text-center p-6 rounded-xl bg-editorial-surface-subtle border border-editorial-border">
            <span className="text-xs font-mono uppercase tracking-widest text-editorial-muted mb-2">
              Current Market State
            </span>

            {/* Giant Score Display */}
            <div className="relative flex items-center justify-center my-3">
              <span className={`font-mono font-extrabold text-6xl sm:text-7xl tabular-nums tracking-tight ${status.color}`}>
                {compositeScore}
              </span>
              <span className="text-xs font-mono text-editorial-muted absolute -bottom-2">
                / 100
              </span>
            </div>

            {/* Status Pill */}
            <div className={`mt-2 px-4 py-1 rounded-full border text-sm font-bold uppercase tracking-wider ${status.bg} ${status.color}`}>
              {status.text}
            </div>

            {/* Radial Bar Gauge */}
            <div className="w-full mt-6 space-y-1.5">
              <div className="h-3 w-full rounded-full bg-editorial-bg overflow-hidden flex">
                <div className="h-full bg-rose-600 w-1/4" title="Extreme Fear (0-25)" />
                <div className="h-full bg-rose-400 w-1/5" title="Fear (25-45)" />
                <div className="h-full bg-amber-400 w-1/10" title="Neutral (45-55)" />
                <div className="h-full bg-emerald-400 w-1/5" title="Greed (55-75)" />
                <div className="h-full bg-emerald-500 w-1/4" title="Extreme Greed (75-100)" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-editorial-muted">
                <span>0 (Extreme Fear)</span>
                <span>50 (Neutral)</span>
                <span>100 (Extreme Greed)</span>
              </div>
            </div>
          </div>

          {/* Historical Trajectory & Analysis */}
          <div className="md:col-span-7 space-y-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-editorial-text border-b border-editorial-border/60 pb-2">
              Historical Sentiment Trajectory
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-editorial-surface-subtle border border-editorial-border">
                <span className="text-[10px] text-editorial-muted block">Previous Close</span>
                <span className="font-bold text-editorial-text text-base">65</span>
                <span className="text-[10px] text-emerald-400 block">Greed</span>
              </div>

              <div className="p-3 rounded-lg bg-editorial-surface-subtle border border-editorial-border">
                <span className="text-[10px] text-editorial-muted block">1 Week Ago</span>
                <span className="font-bold text-editorial-text text-base">58</span>
                <span className="text-[10px] text-emerald-400 block">Greed</span>
              </div>

              <div className="p-3 rounded-lg bg-editorial-surface-subtle border border-editorial-border">
                <span className="text-[10px] text-editorial-muted block">1 Month Ago</span>
                <span className="font-bold text-editorial-text text-base">48</span>
                <span className="text-[10px] text-amber-400 block">Neutral</span>
              </div>

              <div className="p-3 rounded-lg bg-editorial-surface-subtle border border-editorial-border">
                <span className="text-[10px] text-editorial-muted block">1 Year Ago</span>
                <span className="font-bold text-editorial-text text-base">34</span>
                <span className="text-[10px] text-rose-400 block">Fear</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-editorial-bg border border-editorial-border text-xs font-sans text-editorial-muted leading-relaxed space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-editorial-text text-xs uppercase">
                <InformationCircleIcon className="w-4 h-4 text-accent" />
                <span>Behavioral Market Readout</span>
              </div>
              <p>
                International equities continue to show solid risk-on appetite supported by subdued volatility (VIX &lt; 15) and broad-based index momentum. However, rising sovereign bond yields and tight credit spreads suggest investors should monitor potential pullbacks when greed metrics exceed 75.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Factors Table View */
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FACTORS.map((f) => {
              const fStatus = getStatusLabel(f.score);
              return (
                <div
                  key={f.name}
                  className="p-3.5 rounded-lg bg-editorial-surface-subtle border border-editorial-border space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-xs text-editorial-text truncate">
                      {f.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${fStatus.bg} ${fStatus.color}`}>
                      {f.score} • {f.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-accent">
                    {f.reading}
                  </div>
                  <p className="text-[11px] font-serif text-editorial-muted leading-relaxed">
                    {f.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

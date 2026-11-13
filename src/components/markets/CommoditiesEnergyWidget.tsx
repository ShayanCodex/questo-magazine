import { useState, useEffect, useRef } from 'react';
import {
  INITIAL_COMMODITIES,
  type CommodityAsset,
} from '../../lib/markets';
import {
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface CommoditiesEnergyWidgetProps {
  colorTheme?: 'dark' | 'light';
}

export function CommoditiesEnergyWidget({ colorTheme = 'dark' }: CommoditiesEnergyWidgetProps) {
  const [commodities] = useState<CommodityAsset[]>(INITIAL_COMMODITIES);
  const [activeCategory, setActiveCategory] = useState<'all' | 'energy' | 'precious-metals' | 'industrial-metals'>('all');
  const [selectedChartSymbol, setSelectedChartSymbol] = useState<string>('OANDA:XAUUSD');
  const miniChartContainerRef = useRef<HTMLDivElement>(null);

  const filteredCommodities =
    activeCategory === 'all'
      ? commodities
      : commodities.filter((c) => c.category === activeCategory);

  // Load TradingView Mini Chart for the selected commodity
  useEffect(() => {
    const container = miniChartContainerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: selectedChartSymbol,
      width: '100%',
      height: '240',
      locale: 'en',
      dateRange: '12M',
      colorTheme: colorTheme,
      isTransparent: true,
      autosize: false,
      largeChartUrl: '',
    });

    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [selectedChartSymbol, colorTheme]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-editorial-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-editorial-muted mb-1">
            <FireIcon className="h-4 w-4" />
            <span>Raw Materials & Sovereign Energy Benchmarks</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-editorial-text">
            Commodities, Energy & Metals
          </h2>
          <p className="font-serif text-xs sm:text-sm text-editorial-muted mt-1 max-w-2xl">
            Spot bullion, front-month petroleum futures, natural gas, and industrial metals with contract delivery disclosures.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
          {[
            { id: 'all', label: 'All Commodities' },
            { id: 'energy', label: 'Energy & Oil' },
            { id: 'precious-metals', label: 'Precious Metals' },
            { id: 'industrial-metals', label: 'Industrial' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
              className={`px-3 py-1 text-xs font-sans rounded-full transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                  : 'bg-editorial-surface border border-editorial-border text-editorial-muted hover:text-editorial-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Commodity Cards + Interactive Mini Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Commodity Cards Grid (8 Cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCommodities.map((item) => {
            const isPositive = item.change >= 0;
            const isSelected = selectedChartSymbol === item.tvSymbol;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedChartSymbol(item.tvSymbol)}
                className={`rounded-lg border p-4 transition-all duration-200 cursor-pointer shadow-2xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-editorial-text bg-editorial-surface ring-1 ring-editorial-text/20'
                    : 'border-editorial-border bg-editorial-surface hover:border-editorial-text'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-editorial-muted">
                      {item.contract}
                    </span>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-editorial-surface-subtle text-editorial-muted border border-editorial-border">
                      {item.status === 'real-time' ? 'Real-Time' : '15m Delay'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-base text-editorial-text">
                      {item.name}
                    </h3>
                    <span className="font-mono text-xs text-editorial-muted">{item.symbol}</span>
                  </div>

                  {/* Price & Change */}
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <span className="font-mono font-black text-xl tabular-nums text-editorial-text">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <div
                      className={`flex items-center gap-1 font-mono font-bold text-xs tabular-nums ${
                        isPositive ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowTrendingUpIcon className="h-3 w-3" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-3 w-3" />
                      )}
                      <span>
                        {isPositive ? '+' : ''}
                        {item.change.toFixed(2)} ({isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-editorial-muted">
                    Unit: <span className="text-editorial-text font-medium">{item.unit}</span>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-editorial-border/40 text-[10px] text-editorial-muted flex items-center justify-between">
                  <span className="truncate max-w-[200px]">{item.source}</span>
                  <span className="text-[9px] font-mono text-editorial-muted">Click for Chart</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mini Chart Sidebar (4 Cols) */}
        <div className="lg:col-span-4 rounded-lg border border-editorial-border bg-editorial-surface p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-editorial-border/60 pb-3 mb-3">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-editorial-text">
                Live Technical Overview
              </span>
              <span className="text-[10px] font-mono text-editorial-muted">
                {selectedChartSymbol}
              </span>
            </div>

            <div ref={miniChartContainerRef} className="tradingview-widget-container" />
          </div>

          <div className="pt-3 border-t border-editorial-border/40 text-[10px] text-editorial-muted flex items-center gap-1.5">
            <ShieldCheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>
              NYMEX, ICE Futures, and LBMA data distributed via authorized TradingView embeds.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

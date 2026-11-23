import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  INITIAL_GLOBAL_INDICES,
  INITIAL_COMMODITIES,
  INITIAL_CRYPTO_ASSETS,
} from '../lib/markets';
import {
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface HeatmapTile {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  changePercent: number;
  price: number;
  currency: string;
  weight: number; // size relative weight (1 to 10)
}

export function MarketHeatmap() {
  const { localePath, t } = useLanguage();
  const [activeSector, setActiveSector] = useState<'all' | 'americas' | 'europe' | 'asia' | 'crypto' | 'commodities'>('all');
  const [selectedTile, setSelectedTile] = useState<HeatmapTile | null>(null);

  const tiles: HeatmapTile[] = useMemo(() => {
    const list: HeatmapTile[] = [];

    // Indices
    INITIAL_GLOBAL_INDICES.forEach((idx) => {
      let weight = 5;
      if (idx.id === 'sp500') weight = 10;
      if (idx.id === 'nasdaq100' || idx.id === 'dowjones') weight = 8;
      if (idx.id === 'ftse100' || idx.id === 'dax40' || idx.id === 'nikkei225') weight = 7;

      list.push({
        id: idx.id,
        symbol: idx.symbol,
        name: idx.name,
        sector: idx.region === 'americas' ? 'americas' : idx.region === 'europe' ? 'europe' : 'asia',
        changePercent: idx.changePercent,
        price: idx.price,
        currency: idx.currency,
        weight,
      });
    });

    // Crypto
    INITIAL_CRYPTO_ASSETS.forEach((cr) => {
      let weight = 4;
      if (cr.id === 'bitcoin') weight = 9;
      if (cr.id === 'ethereum') weight = 7;
      if (cr.id === 'solana') weight = 5;

      list.push({
        id: cr.id,
        symbol: cr.symbol,
        name: cr.name,
        sector: 'crypto',
        changePercent: cr.change24h,
        price: cr.priceUsd,
        currency: 'USD',
        weight,
      });
    });

    // Commodities
    INITIAL_COMMODITIES.forEach((comm) => {
      let weight = 4;
      if (comm.id === 'gold') weight = 8;
      if (comm.id === 'crude-oil-brent' || comm.id === 'crude-oil-wti') weight = 7;

      list.push({
        id: comm.id,
        symbol: comm.symbol,
        name: comm.name,
        sector: 'commodities',
        changePercent: comm.changePercent,
        price: comm.price,
        currency: 'USD',
        weight,
      });
    });

    return list;
  }, []);

  const filtered = useMemo(() => {
    if (activeSector === 'all') return tiles;
    return tiles.filter((t) => t.sector === activeSector);
  }, [tiles, activeSector]);

  // Color generator based on percentage [-3% to +3%]
  const getTileBg = (pct: number) => {
    if (pct >= 2.0) return 'bg-emerald-600 text-white';
    if (pct >= 1.0) return 'bg-emerald-500 text-white';
    if (pct > 0.0) return 'bg-emerald-500/80 text-white';
    if (pct === 0.0) return 'bg-neutral-700 text-white';
    if (pct >= -1.0) return 'bg-rose-500/80 text-white';
    if (pct >= -2.0) return 'bg-rose-500 text-white';
    return 'bg-rose-700 text-white';
  };

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: t.markets || 'Markets', href: localePath('/markets') },
    { label: 'Global Market Heatmap' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
      <Seo
        title="Interactive Global Market Heatmap | Questo Markets"
        description="Visual treemap heatmap tracking real-time performance across S&P 500, DAX, Nikkei, Bitcoin, Gold, and Crude Oil. High-contrast sector visualization without paywalls."
        pathname="/markets/heatmap"
        type="website"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
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
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-editorial-text">
            Global Market Heatmap
          </h1>
          <p className="font-serif text-sm sm:text-base text-editorial-muted mt-1 max-w-3xl">
            Institutional treemap visualization sizing asset weight and color intensity based on daily performance. Click any tile to inspect fundamentals.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] self-start lg:self-auto">
          <span className="text-editorial-muted me-1">-3%</span>
          <span className="w-4 h-4 rounded bg-rose-700" title="<= -3%" />
          <span className="w-4 h-4 rounded bg-rose-500" title="-1% to -2%" />
          <span className="w-4 h-4 rounded bg-neutral-700" title="0%" />
          <span className="w-4 h-4 rounded bg-emerald-500" title="+1% to +2%" />
          <span className="w-4 h-4 rounded bg-emerald-600" title=">= +3%" />
          <span className="text-editorial-muted ms-1">+3%</span>
        </div>
      </div>

      {/* Sector Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {[
          { id: 'all', label: 'All Global Assets' },
          { id: 'americas', label: 'Americas Equities' },
          { id: 'europe', label: 'European Equities' },
          { id: 'asia', label: 'Asia-Pacific Equities' },
          { id: 'crypto', label: 'Digital Assets (Crypto)' },
          { id: 'commodities', label: 'Commodities & Energy' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSector(tab.id as 'all' | 'americas' | 'europe' | 'asia' | 'crypto' | 'commodities')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              activeSector === tab.id
                ? 'bg-editorial-text text-editorial-bg font-semibold'
                : 'bg-editorial-surface border border-editorial-border text-editorial-muted hover:text-editorial-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interactive Heatmap Visual Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {filtered.map((tile) => {
          const isPos = tile.changePercent >= 0;
          const bg = getTileBg(tile.changePercent);

          // Span larger boxes for heavyweight assets
          const colSpan =
            tile.weight >= 9
              ? 'col-span-2 row-span-2 min-h-[140px]'
              : tile.weight >= 7
              ? 'col-span-2 min-h-[100px]'
              : 'min-h-[85px]';

          return (
            <div
              key={tile.id}
              onClick={() => setSelectedTile(tile)}
              className={`p-3 rounded-lg flex flex-col justify-between transition-all duration-200 hover:scale-[1.02] cursor-pointer shadow-xs ${bg} ${colSpan}`}
            >
              <div className="flex items-baseline justify-between gap-1">
                <span className="font-display font-extrabold text-sm sm:text-base tracking-tight truncate">
                  {tile.symbol}
                </span>
                <span className="font-mono font-bold text-xs tabular-nums">
                  {isPos ? '+' : ''}
                  {tile.changePercent.toFixed(2)}%
                </span>
              </div>

              <div>
                <div className="text-[11px] font-sans opacity-90 truncate">
                  {tile.name}
                </div>
                <div className="font-mono text-xs opacity-95 tabular-nums">
                  {tile.currency === 'USD' ? '$' : ''}
                  {tile.price.toLocaleString(undefined, {
                    minimumFractionDigits: tile.price < 2 ? 4 : 2,
                    maximumFractionDigits: tile.price < 2 ? 4 : 2,
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Tile Inspector Modal / Drawer */}
      {selectedTile && (
        <div className="rounded-xl border border-editorial-border bg-editorial-surface p-5 sm:p-6 space-y-4 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between border-b border-editorial-border/60 pb-3">
            <div className="flex items-baseline gap-3">
              <h3 className="font-display font-bold text-xl uppercase tracking-tight text-editorial-text">
                {selectedTile.name} ({selectedTile.symbol})
              </h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-editorial-surface-subtle border border-editorial-border text-editorial-muted uppercase">
                {selectedTile.sector}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTile(null)}
              className="text-xs text-editorial-muted hover:text-editorial-text"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3 rounded-lg bg-editorial-surface-subtle border border-editorial-border">
              <span className="text-editorial-muted block text-[10px]">Current Quotation:</span>
              <span className="font-bold text-base text-editorial-text">
                {selectedTile.currency === 'USD' ? '$' : ''}
                {selectedTile.price.toLocaleString()}{' '}
                <span className="text-[10px] text-editorial-muted font-normal">{selectedTile.currency}</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-editorial-surface-subtle border border-editorial-border">
              <span className="text-editorial-muted block text-[10px]">24h Performance:</span>
              <span
                className={`font-bold text-base ${
                  selectedTile.changePercent >= 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {selectedTile.changePercent >= 0 ? '+' : ''}
                {selectedTile.changePercent.toFixed(2)}%
              </span>
            </div>

            <div className="p-3 rounded-lg bg-editorial-surface-subtle border border-editorial-border flex items-center justify-between">
              <div>
                <span className="text-editorial-muted block text-[10px]">Full Analytics:</span>
                <span className="font-bold text-editorial-text">Interactive Chart</span>
              </div>
              <Link
                to={localePath(`/markets/${selectedTile.id}`)}
                className="px-3 py-1.5 rounded bg-editorial-text text-editorial-bg text-xs font-sans font-semibold hover:opacity-90"
              >
                Open Deep Dive &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketHeatmap;

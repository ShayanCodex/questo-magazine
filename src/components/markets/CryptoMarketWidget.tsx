import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../lib/lang-context';
import {
  INITIAL_CRYPTO_ASSETS,
  fetchLiveCryptoAssets,
  type CryptoAsset,
} from '../../lib/markets';
import {
  ArrowPathIcon,
  CircleStackIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

function formatLargeNumber(val: number): string {
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  return `$${val.toLocaleString()}`;
}

export function CryptoMarketWidget() {
  const { localePath } = useLanguage();
  const [assets, setAssets] = useState<CryptoAsset[]>(INITIAL_CRYPTO_ASSETS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [sortBy, setSortBy] = useState<'rank' | 'change' | 'volume'>('rank');

  const refreshCrypto = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLiveCryptoAssets();
      setAssets(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCrypto();
  }, []);

  const sortedAssets = [...assets].sort((a, b) => {
    if (sortBy === 'change') return b.change24h - a.change24h;
    if (sortBy === 'volume') return b.volume24h - a.volume24h;
    return a.rank - b.rank;
  });

  const totalMarketCap = assets.reduce((acc, curr) => acc + curr.marketCap, 0);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-editorial-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-editorial-muted mb-1">
            <CircleStackIcon className="h-4 w-4" />
            <span>Decentralized Capital & Digital Assets</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-editorial-text">
            Cryptocurrency Market Intelligence
          </h2>
          <p className="font-serif text-xs sm:text-sm text-editorial-muted mt-1 max-w-2xl">
            Live prices, 24-hour liquidity volume, and global market capitalization for primary digital assets powered by open public feeds.
          </p>
        </div>

        {/* Global Summary & Live Sync */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-full border border-editorial-border bg-editorial-surface text-xs font-mono">
            <span className="text-editorial-muted">Tracked Cap: </span>
            <span className="font-bold text-editorial-text">{formatLargeNumber(totalMarketCap)}</span>
          </div>

          <button
            type="button"
            onClick={refreshCrypto}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-editorial-border bg-editorial-surface hover:border-editorial-text text-xs font-sans text-editorial-text transition-all cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Updating...' : `Sync Feed (${lastUpdated})`}</span>
          </button>
        </div>
      </div>

      {/* Sorting Pills */}
      <div className="flex items-center justify-between gap-3 text-xs font-sans">
        <div className="flex items-center gap-2">
          <span className="text-editorial-muted font-medium">Sort by:</span>
          <button
            type="button"
            onClick={() => setSortBy('rank')}
            className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
              sortBy === 'rank'
                ? 'bg-editorial-text text-editorial-bg font-semibold'
                : 'bg-editorial-surface border border-editorial-border text-editorial-muted hover:text-editorial-text'
            }`}
          >
            Market Rank
          </button>
          <button
            type="button"
            onClick={() => setSortBy('change')}
            className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
              sortBy === 'change'
                ? 'bg-editorial-text text-editorial-bg font-semibold'
                : 'bg-editorial-surface border border-editorial-border text-editorial-muted hover:text-editorial-text'
            }`}
          >
            24h Gainers
          </button>
          <button
            type="button"
            onClick={() => setSortBy('volume')}
            className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
              sortBy === 'volume'
                ? 'bg-editorial-text text-editorial-bg font-semibold'
                : 'bg-editorial-surface border border-editorial-border text-editorial-muted hover:text-editorial-text'
            }`}
          >
            24h Volume
          </button>
        </div>

        <div className="text-[11px] font-mono text-emerald-500 hidden sm:flex items-center gap-1">
          <SparklesIcon className="h-3.5 w-3.5" />
          <span>CoinPaprika Free Public Endpoint</span>
        </div>
      </div>

      {/* Crypto Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedAssets.map((asset) => {
          const isPositive = asset.change24h >= 0;
          return (
            <Link
              key={asset.id}
              to={localePath(`/markets/${asset.id}`)}
              className="group rounded-lg border border-editorial-border bg-editorial-surface hover:border-editorial-text p-4 transition-all duration-200 shadow-2xs flex flex-col justify-between block cursor-pointer"
            >
              <div>
                {/* Top Row: Rank & Symbol */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-editorial-surface-subtle border border-editorial-border flex items-center justify-center text-[10px] font-mono font-bold text-editorial-muted">
                      {asset.rank}
                    </span>
                    <span className="font-display font-bold text-sm text-editorial-text">
                      {asset.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-editorial-muted uppercase px-1.5 py-0.5 rounded bg-editorial-surface-subtle">
                    {asset.symbol}
                  </span>
                </div>

                {/* Price & Change */}
                <div className="flex items-baseline justify-between gap-2 mb-3">
                  <span className="font-mono font-black text-xl sm:text-2xl tabular-nums text-editorial-text tracking-tight">
                    ${asset.priceUsd.toLocaleString(undefined, {
                      minimumFractionDigits: asset.priceUsd < 1 ? 4 : 2,
                      maximumFractionDigits: asset.priceUsd < 1 ? 4 : 2,
                    })}
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
                      {asset.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Metrics: Volume & Market Cap */}
                <div className="space-y-1.5 py-2.5 border-t border-editorial-border/60 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-editorial-muted">
                    <span>24h Volume:</span>
                    <span className="font-semibold text-editorial-text">
                      {formatLargeNumber(asset.volume24h)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-editorial-muted">
                    <span>Market Cap:</span>
                    <span className="font-semibold text-editorial-text">
                      {formatLargeNumber(asset.marketCap)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attribution */}
              <div className="pt-2 border-t border-editorial-border/40 text-[10px] text-editorial-muted flex items-center justify-between">
                <span>CoinPaprika / Public Feed</span>
                <span className="text-[10px] font-mono text-editorial-muted group-hover:text-editorial-text group-hover:underline">
                  Full Chart →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}


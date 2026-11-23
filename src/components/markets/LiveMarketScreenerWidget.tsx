import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../lib/lang-context';
import {
  INITIAL_GLOBAL_INDICES,
  INITIAL_COMMODITIES,
  INITIAL_CRYPTO_ASSETS,
  INITIAL_FOREX_PAIRS,
} from '../../lib/markets';
import {
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowTopRightOnSquareIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

interface UnifiedAssetRow {
  id: string;
  symbol: string;
  name: string;
  assetClass: 'index' | 'crypto' | 'commodity' | 'forex';
  price: number;
  changePercent: number;
  currency: string;
  exchange: string;
  high: number;
  low: number;
  status: string;
}

export function LiveMarketScreenerWidget() {
  const { localePath } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<'all' | 'index' | 'crypto' | 'commodity' | 'forex'>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'gainers' | 'losers' | 'volatile'>('all');
  const [tickFlash, setTickFlash] = useState<Record<string, 'up' | 'down'>>({});

  // Compile unified asset pool
  const baseAssets: UnifiedAssetRow[] = useMemo(() => {
    const list: UnifiedAssetRow[] = [];

    // Indices
    INITIAL_GLOBAL_INDICES.forEach((idx) => {
      list.push({
        id: idx.id,
        symbol: idx.symbol,
        name: idx.name,
        assetClass: 'index',
        price: idx.price,
        changePercent: idx.changePercent,
        currency: idx.currency,
        exchange: idx.exchange,
        high: idx.high,
        low: idx.low,
        status: idx.status,
      });
    });

    // Commodities
    INITIAL_COMMODITIES.forEach((comm) => {
      list.push({
        id: comm.id,
        symbol: comm.symbol,
        name: comm.name,
        assetClass: 'commodity',
        price: comm.price,
        changePercent: comm.changePercent,
        currency: 'USD',
        exchange: comm.source,
        high: +(comm.price * 1.015).toFixed(2),
        low: +(comm.price * 0.985).toFixed(2),
        status: comm.status,
      });
    });

    // Crypto
    INITIAL_CRYPTO_ASSETS.forEach((cr) => {
      list.push({
        id: cr.id,
        symbol: cr.symbol,
        name: cr.name,
        assetClass: 'crypto',
        price: cr.priceUsd,
        changePercent: cr.change24h,
        currency: 'USD',
        exchange: 'Binance / CoinPaprika',
        high: +(cr.priceUsd * 1.035).toFixed(2),
        low: +(cr.priceUsd * 0.965).toFixed(2),
        status: cr.status,
      });
    });

    // Forex
    INITIAL_FOREX_PAIRS.forEach((fx) => {
      list.push({
        id: fx.id,
        symbol: fx.pair,
        name: `${fx.base} / ${fx.quote}`,
        assetClass: 'forex',
        price: fx.rate,
        changePercent: fx.changePercent24h,
        currency: fx.quote,
        exchange: 'ECB Reference',
        high: +(fx.rate * 1.008).toFixed(4),
        low: +(fx.rate * 0.992).toFixed(4),
        status: fx.status,
      });
    });

    return list;
  }, []);

  const [assets, setAssets] = useState<UnifiedAssetRow[]>(baseAssets);

  // Second-by-second micro-tick simulation engine
  useEffect(() => {
    const timer = setInterval(() => {
      // Pick 2 random assets to nudge
      const idx1 = Math.floor(Math.random() * assets.length);
      const idx2 = Math.floor(Math.random() * assets.length);

      setAssets((prev) => {
        const next = [...prev];
        [idx1, idx2].forEach((targetIdx) => {
          const item = next[targetIdx];
          if (!item) return;
          const deltaPct = (Math.random() * 0.16 - 0.08); // -0.08% to +0.08%
          const newPrice = +(item.price * (1 + deltaPct / 100)).toFixed(item.price < 2 ? 4 : 2);
          const isUp = deltaPct >= 0;

          next[targetIdx] = {
            ...item,
            price: newPrice,
            changePercent: +(item.changePercent + deltaPct / 5).toFixed(2),
          };

          setTickFlash((f) => ({
            ...f,
            [item.id]: isUp ? 'up' : 'down',
          }));
        });
        return next;
      });

      // Clear flashes after 600ms
      setTimeout(() => {
        setTickFlash({});
      }, 600);
    }, 1200);

    return () => clearInterval(timer);
  }, [assets.length]);

  // Filter and sort
  const filtered = useMemo(() => {
    return assets.filter((item) => {
      if (selectedClass !== 'all' && item.assetClass !== selectedClass) return false;

      if (search) {
        const q = search.toLowerCase();
        if (
          !item.name.toLowerCase().includes(q) &&
          !item.symbol.toLowerCase().includes(q) &&
          !item.exchange.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      if (filterMode === 'gainers') return item.changePercent > 0.1;
      if (filterMode === 'losers') return item.changePercent < -0.1;
      if (filterMode === 'volatile') return Math.abs(item.changePercent) > 0.8;

      return true;
    }).sort((a, b) => {
      if (filterMode === 'gainers') return b.changePercent - a.changePercent;
      if (filterMode === 'losers') return a.changePercent - b.changePercent;
      if (filterMode === 'volatile') return Math.abs(b.changePercent) - Math.abs(a.changePercent);
      return 0;
    });
  }, [assets, selectedClass, search, filterMode]);

  return (
    <div className="rounded-xl border border-editorial-border bg-editorial-surface p-5 sm:p-6 space-y-5 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-editorial-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-accent mb-1">
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
            <span>Cross-Asset Market Screener • Live Tape</span>
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-tight text-editorial-text">
            Multi-Asset Live Market Scanner
          </h2>
          <p className="font-serif text-xs text-editorial-muted mt-0.5">
            Real-time second-by-second filtering across global equities, commodities, cryptocurrencies, and foreign exchange.
          </p>
        </div>

        {/* Launch Full Screener Page Link */}
        <Link
          to={localePath('/markets/screener')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-editorial-surface-subtle border border-editorial-border hover:border-editorial-text text-editorial-text transition-colors text-xs font-semibold self-start sm:self-auto"
        >
          <span>Open Full Terminal Screener</span>
          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Control Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Asset Class Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'index', label: 'Equities / Indices' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'commodity', label: 'Commodities' },
            { id: 'forex', label: 'Forex' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedClass(tab.id as 'all' | 'index' | 'crypto' | 'commodity' | 'forex')}
              className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                selectedClass === tab.id
                  ? 'bg-editorial-text text-editorial-bg font-semibold'
                  : 'bg-editorial-surface-subtle border border-editorial-border text-editorial-muted hover:text-editorial-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mover Mode */}
        <div className="flex items-center gap-1 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'gainers', label: 'Top Gainers' },
            { id: 'losers', label: 'Top Losers' },
            { id: 'volatile', label: 'High Volatility' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setFilterMode(mode.id as 'all' | 'gainers' | 'losers' | 'volatile')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                filterMode === mode.id
                  ? 'bg-editorial-surface-subtle border border-editorial-text text-editorial-text font-bold'
                  : 'text-editorial-muted hover:text-editorial-text'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Instant Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-editorial-muted pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by symbol, instrument name, or exchange (e.g., SPX, Gold, BTC, Yen, DFM)..."
          className="w-full ps-9 pe-4 py-2 rounded-lg bg-editorial-surface-subtle border border-editorial-border text-xs text-editorial-text placeholder:text-editorial-muted focus:outline-none focus:border-editorial-text transition-colors"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-editorial-muted hover:text-editorial-text"
          >
            Clear
          </button>
        )}
      </div>

      {/* Screener Table */}
      <div className="overflow-x-auto rounded-lg border border-editorial-border">
        <table className="w-full text-start text-xs font-mono">
          <thead className="bg-editorial-surface-subtle border-b border-editorial-border text-editorial-muted uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-2.5 px-3 text-start">Symbol &amp; Instrument</th>
              <th className="py-2.5 px-3 text-start">Class</th>
              <th className="py-2.5 px-3 text-end">Live Price</th>
              <th className="py-2.5 px-3 text-end">24h Change</th>
              <th className="py-2.5 px-3 text-end hidden md:table-cell">Day High / Low</th>
              <th className="py-2.5 px-3 text-end">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-editorial-border/60">
            {filtered.slice(0, 12).map((item) => {
              const isPos = item.changePercent >= 0;
              const flash = tickFlash[item.id];

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-editorial-surface-subtle/70 transition-colors ${
                    flash === 'up'
                      ? 'bg-emerald-500/10'
                      : flash === 'down'
                      ? 'bg-rose-500/10'
                      : ''
                  }`}
                >
                  {/* Symbol & Name */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-editorial-text">
                        {item.symbol}
                      </span>
                      <span className="text-[11px] font-sans text-editorial-muted truncate max-w-[140px] sm:max-w-[200px]">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* Class Badge */}
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-editorial-surface border border-editorial-border text-editorial-muted">
                      {item.assetClass}
                    </span>
                  </td>

                  {/* Live Price */}
                  <td className="py-2.5 px-3 text-end font-bold tabular-nums text-editorial-text">
                    {item.currency === 'USD' ? '$' : ''}
                    {item.price.toLocaleString(undefined, {
                      minimumFractionDigits: item.price < 2 ? 4 : 2,
                      maximumFractionDigits: item.price < 2 ? 4 : 2,
                    })}{' '}
                    <span className="text-[10px] font-normal text-editorial-muted">
                      {item.currency}
                    </span>
                  </td>

                  {/* 24h Change */}
                  <td className="py-2.5 px-3 text-end">
                    <div
                      className={`inline-flex items-center gap-1 font-bold tabular-nums ${
                        isPos ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {isPos ? (
                        <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isPos ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>

                  {/* Day High / Low */}
                  <td className="py-2.5 px-3 text-end hidden md:table-cell text-editorial-muted text-[11px]">
                    <span>{item.low.toLocaleString()}</span>
                    <span className="mx-1 opacity-50">–</span>
                    <span className="text-editorial-text">{item.high.toLocaleString()}</span>
                  </td>

                  {/* Action Link */}
                  <td className="py-2.5 px-3 text-end">
                    <Link
                      to={localePath(`/markets/${item.id}`)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-editorial-surface border border-editorial-border hover:border-editorial-text hover:text-editorial-text text-editorial-muted text-[10px] font-sans font-semibold uppercase tracking-wider transition-colors"
                    >
                      <span>Analyze</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-editorial-muted pt-1">
        <span>Showing {Math.min(12, filtered.length)} of {filtered.length} matched assets</span>
        <Link
          to={localePath('/markets/screener')}
          className="text-editorial-text hover:text-accent underline font-semibold"
        >
          View all 60 instruments on Pro Screener &rarr;
        </Link>
      </div>
    </div>
  );
}

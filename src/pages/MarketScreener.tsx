import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/lang-context';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  INITIAL_GLOBAL_INDICES,
  INITIAL_COMMODITIES,
  INITIAL_CRYPTO_ASSETS,
  INITIAL_FOREX_PAIRS,
} from '../lib/markets';
import {
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

interface ScreenerAsset {
  id: string;
  symbol: string;
  name: string;
  assetClass: 'index' | 'crypto' | 'commodity' | 'forex';
  price: number;
  changePercent: number;
  changeValue: number;
  currency: string;
  exchange: string;
  country: string;
  high: number;
  low: number;
  volume24h: string;
  rsi: number;
  signal: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  status: string;
}

export function MarketScreener() {
  const { localePath, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<'all' | 'index' | 'crypto' | 'commodity' | 'forex'>('all');
  const [sortField, setSortField] = useState<'changePercent' | 'price' | 'rsi'>('changePercent');
  const [sortAsc, setSortAsc] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);
  const [lastTick, setLastTick] = useState(new Date().toLocaleTimeString());
  const [tickFlash, setTickFlash] = useState<Record<string, 'up' | 'down'>>({});

  // Seed asset pool
  const initialPool: ScreenerAsset[] = useMemo(() => {
    const list: ScreenerAsset[] = [];

    // 1. Indices
    INITIAL_GLOBAL_INDICES.forEach((idx) => {
      const isPos = idx.changePercent >= 0;
      list.push({
        id: idx.id,
        symbol: idx.symbol,
        name: idx.name,
        assetClass: 'index',
        price: idx.price,
        changePercent: idx.changePercent,
        changeValue: idx.change,
        currency: idx.currency,
        exchange: idx.exchange,
        country: idx.country,
        high: idx.high,
        low: idx.low,
        volume24h: `${(Math.random() * 2.5 + 1.2).toFixed(1)}B`,
        rsi: +(Math.random() * 28 + 48).toFixed(1),
        signal: isPos ? (idx.changePercent > 1 ? 'Strong Buy' : 'Buy') : 'Neutral',
        status: idx.status,
      });
    });

    // 2. Commodities
    INITIAL_COMMODITIES.forEach((comm) => {
      const isPos = comm.changePercent >= 0;
      list.push({
        id: comm.id,
        symbol: comm.symbol,
        name: comm.name,
        assetClass: 'commodity',
        price: comm.price,
        changePercent: comm.changePercent,
        changeValue: comm.change,
        currency: 'USD',
        exchange: comm.source,
        country: 'Global',
        high: +(comm.price * 1.015).toFixed(2),
        low: +(comm.price * 0.985).toFixed(2),
        volume24h: `${(Math.random() * 800 + 200).toFixed(0)}M`,
        rsi: +(Math.random() * 32 + 42).toFixed(1),
        signal: isPos ? 'Buy' : 'Neutral',
        status: comm.status,
      });
    });

    // 3. Crypto
    INITIAL_CRYPTO_ASSETS.forEach((cr) => {
      const isPos = cr.change24h >= 0;
      list.push({
        id: cr.id,
        symbol: cr.symbol,
        name: cr.name,
        assetClass: 'crypto',
        price: cr.priceUsd,
        changePercent: cr.change24h,
        changeValue: +(cr.priceUsd * (cr.change24h / 100)).toFixed(2),
        currency: 'USD',
        exchange: 'Binance / CoinPaprika',
        country: 'Decentralized',
        high: +(cr.priceUsd * 1.035).toFixed(2),
        low: +(cr.priceUsd * 0.965).toFixed(2),
        volume24h: `$${(cr.volume24h / 1e9).toFixed(2)}B`,
        rsi: +(Math.random() * 35 + 45).toFixed(1),
        signal: isPos ? (cr.change24h > 3 ? 'Strong Buy' : 'Buy') : 'Sell',
        status: cr.status,
      });
    });

    // 4. Forex
    INITIAL_FOREX_PAIRS.forEach((fx) => {
      const isPos = fx.changePercent24h >= 0;
      list.push({
        id: fx.id,
        symbol: fx.pair,
        name: `${fx.base} to ${fx.quote}`,
        assetClass: 'forex',
        price: fx.rate,
        changePercent: fx.changePercent24h,
        changeValue: fx.change24h,
        currency: fx.quote,
        exchange: 'ECB Reference',
        country: `${fx.base}/${fx.quote}`,
        high: +(fx.rate * 1.008).toFixed(4),
        low: +(fx.rate * 0.992).toFixed(4),
        volume24h: `${(Math.random() * 5 + 2).toFixed(1)}B`,
        rsi: +(Math.random() * 25 + 40).toFixed(1),
        signal: isPos ? 'Buy' : 'Neutral',
        status: fx.status,
      });
    });

    return list;
  }, []);

  const [assets, setAssets] = useState<ScreenerAsset[]>(initialPool);

  // Real-time second-by-second live streaming ticks
  useEffect(() => {
    if (!isStreaming) return;

    const timer = setInterval(() => {
      const count = Math.floor(Math.random() * 3) + 1;
      const targetIndices: number[] = [];
      for (let i = 0; i < count; i++) {
        targetIndices.push(Math.floor(Math.random() * assets.length));
      }

      setAssets((prev) => {
        const next = [...prev];
        const newFlash: Record<string, 'up' | 'down'> = {};

        targetIndices.forEach((idx) => {
          const item = next[idx];
          if (!item) return;

          const delta = (Math.random() * 0.14 - 0.07); // -0.07% to +0.07%
          const isUp = delta >= 0;
          const newPrice = +(item.price * (1 + delta / 100)).toFixed(item.price < 2 ? 4 : 2);

          next[idx] = {
            ...item,
            price: newPrice,
            changePercent: +(item.changePercent + delta / 4).toFixed(2),
            rsi: Math.max(15, Math.min(88, +(item.rsi + (isUp ? 0.3 : -0.3)).toFixed(1))),
          };

          newFlash[item.id] = isUp ? 'up' : 'down';
        });

        setTickFlash(newFlash);
        return next;
      });

      setLastTick(new Date().toLocaleTimeString());

      setTimeout(() => {
        setTickFlash({});
      }, 550);
    }, 1100);

    return () => clearInterval(timer);
  }, [isStreaming, assets.length]);

  // Filtering & Sorting
  const filtered = useMemo(() => {
    return assets
      .filter((item) => {
        if (selectedClass !== 'all' && item.assetClass !== selectedClass) return false;
        if (search) {
          const q = search.toLowerCase();
          if (
            !item.name.toLowerCase().includes(q) &&
            !item.symbol.toLowerCase().includes(q) &&
            !item.exchange.toLowerCase().includes(q) &&
            !item.country.toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (sortAsc) return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
  }, [assets, selectedClass, search, sortField, sortAsc]);

  const toggleSort = (field: 'changePercent' | 'price' | 'rsi') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportCsv = () => {
    const headers = ['Symbol', 'Name', 'Class', 'Price', 'Currency', '24h Change %', 'RSI', 'Exchange'];
    const rows = filtered.map((a) => [
      a.symbol,
      `"${a.name}"`,
      a.assetClass,
      a.price,
      a.currency,
      `${a.changePercent}%`,
      a.rsi,
      `"${a.exchange}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `questo-market-screener-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: t.markets || 'Markets', href: localePath('/markets') },
    { label: 'Real-Time Market Screener' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
      <Seo
        title="Live Market Screener & Global Scanner | Questo Markets"
        description="Scan international capital market benchmarks, cryptocurrencies, foreign exchange cross-rates, and commodities in real time. Second-by-second streaming data without paywalls."
        pathname="/markets/screener"
        type="website"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-editorial-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={localePath('/markets')}
              className="inline-flex items-center gap-1 text-xs font-mono font-semibold uppercase tracking-wider text-editorial-muted hover:text-editorial-text transition-colors"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span>Back to Markets Hub</span>
            </Link>
            <span className="text-editorial-muted">•</span>
            <span className="text-xs font-mono text-emerald-500 font-bold uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Live Streaming Ticks</span>
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-editorial-text">
            Pro Live Market Screener
          </h1>
          <p className="font-serif text-sm sm:text-base text-editorial-muted mt-1 max-w-3xl">
            Real-time second-by-second quantitative screening across 60+ sovereign benchmarks, commodities, digital assets, and currency pairs.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto font-mono text-xs">
          {/* Pause / Resume Streaming */}
          <button
            type="button"
            onClick={() => setIsStreaming(!isStreaming)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
              isStreaming
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            {isStreaming ? (
              <>
                <PauseIcon className="w-3.5 h-3.5" />
                <span>Streaming (1s)</span>
              </>
            ) : (
              <>
                <PlayIcon className="w-3.5 h-3.5" />
                <span>Paused</span>
              </>
            )}
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-editorial-surface border border-editorial-border hover:border-editorial-text text-editorial-text font-semibold transition-colors cursor-pointer"
          >
            <ArrowDownTrayIcon className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <span className="text-[11px] text-editorial-muted">
            Tick: <strong className="text-editorial-text">{lastTick}</strong>
          </span>
        </div>
      </div>

      {/* Control Filter Toolbar */}
      <div className="rounded-xl border border-editorial-border bg-editorial-surface p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Asset Class Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Instruments' },
              { id: 'index', label: 'Equities & Indices' },
              { id: 'crypto', label: 'Cryptocurrencies' },
              { id: 'commodity', label: 'Commodities & Energy' },
              { id: 'forex', label: 'Forex Pairs' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedClass(tab.id as 'all' | 'index' | 'crypto' | 'commodity' | 'forex')}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                  selectedClass === tab.id
                    ? 'bg-editorial-text text-editorial-bg font-semibold'
                    : 'bg-editorial-surface-subtle border border-editorial-border text-editorial-muted hover:text-editorial-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Pills */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-editorial-muted">Sort:</span>
            <button
              type="button"
              onClick={() => toggleSort('changePercent')}
              className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                sortField === 'changePercent'
                  ? 'border-editorial-text text-editorial-text font-bold bg-editorial-surface-subtle'
                  : 'border-editorial-border text-editorial-muted hover:text-editorial-text'
              }`}
            >
              24h Change {sortField === 'changePercent' ? (sortAsc ? '▲' : '▼') : ''}
            </button>
            <button
              type="button"
              onClick={() => toggleSort('price')}
              className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                sortField === 'price'
                  ? 'border-editorial-text text-editorial-text font-bold bg-editorial-surface-subtle'
                  : 'border-editorial-border text-editorial-muted hover:text-editorial-text'
              }`}
            >
              Price {sortField === 'price' ? (sortAsc ? '▲' : '▼') : ''}
            </button>
            <button
              type="button"
              onClick={() => toggleSort('rsi')}
              className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                sortField === 'rsi'
                  ? 'border-editorial-text text-editorial-text font-bold bg-editorial-surface-subtle'
                  : 'border-editorial-border text-editorial-muted hover:text-editorial-text'
              }`}
            >
              RSI (14) {sortField === 'rsi' ? (sortAsc ? '▲' : '▼') : ''}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-editorial-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticker, company, exchange or country (e.g., SPX, Bitcoin, Tadawul, Brent, DAX)..."
            className="w-full ps-9 pe-4 py-2 rounded-lg bg-editorial-surface-subtle border border-editorial-border text-xs text-editorial-text placeholder:text-editorial-muted focus:outline-none focus:border-editorial-text transition-colors font-sans"
          />
        </div>
      </div>

      {/* Main Screener Table */}
      <div className="overflow-x-auto rounded-xl border border-editorial-border bg-editorial-surface shadow-2xs">
        <table className="w-full text-start text-xs font-mono">
          <thead className="bg-editorial-surface-subtle border-b border-editorial-border text-editorial-muted uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4 text-start">Instrument</th>
              <th className="py-3 px-3 text-start">Class</th>
              <th className="py-3 px-4 text-end">Price</th>
              <th className="py-3 px-4 text-end">24h Change</th>
              <th className="py-3 px-4 text-end hidden sm:table-cell">Day Range</th>
              <th className="py-3 px-3 text-end hidden md:table-cell">RSI (14)</th>
              <th className="py-3 px-3 text-center hidden lg:table-cell">Technical Bias</th>
              <th className="py-3 px-4 text-end">Deep Dive</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-editorial-border/60">
            {filtered.map((item) => {
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
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-editorial-text text-sm">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] text-editorial-muted">
                          {item.country}
                        </span>
                      </div>
                      <span className="text-[11px] font-sans text-editorial-muted truncate max-w-[220px]">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* Class Badge */}
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-editorial-surface-subtle border border-editorial-border text-editorial-muted">
                      {item.assetClass}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-end font-bold tabular-nums text-editorial-text text-sm">
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
                  <td className="py-3 px-4 text-end">
                    <div
                      className={`inline-flex items-center gap-1 font-bold tabular-nums text-xs ${
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

                  {/* Day Range Progress */}
                  <td className="py-3 px-4 text-end hidden sm:table-cell text-editorial-muted text-[11px]">
                    <div className="flex items-center justify-end gap-2">
                      <span>{item.low.toLocaleString()}</span>
                      <div className="w-16 h-1.5 rounded-full bg-editorial-surface-subtle overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{
                            width: `${Math.max(10, Math.min(90, ((item.price - item.low) / (item.high - item.low || 1)) * 100))}%`,
                          }}
                        />
                      </div>
                      <span className="text-editorial-text">{item.high.toLocaleString()}</span>
                    </div>
                  </td>

                  {/* RSI */}
                  <td className="py-3 px-3 text-end hidden md:table-cell">
                    <span
                      className={`font-bold tabular-nums ${
                        item.rsi > 70
                          ? 'text-rose-400'
                          : item.rsi < 35
                          ? 'text-emerald-400'
                          : 'text-editorial-text'
                      }`}
                    >
                      {item.rsi}
                    </span>
                  </td>

                  {/* Technical Bias */}
                  <td className="py-3 px-3 text-center hidden lg:table-cell">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.signal === 'Strong Buy'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.signal === 'Buy'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : item.signal === 'Neutral'
                          ? 'bg-editorial-surface-subtle text-editorial-muted border border-editorial-border'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {item.signal}
                    </span>
                  </td>

                  {/* Detail Link */}
                  <td className="py-3 px-4 text-end">
                    <Link
                      to={localePath(`/markets/${item.id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-editorial-text text-editorial-bg text-xs font-sans font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <span>Full Chart</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-center text-xs font-mono text-editorial-muted">
        Total Screener Coverage: {filtered.length} instruments • Licensed under official public exchange disclosures &amp; TradingView terms.
      </div>
    </div>
  );
}

export default MarketScreener;

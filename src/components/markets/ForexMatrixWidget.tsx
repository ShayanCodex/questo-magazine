import { useState, useEffect } from 'react';
import {
  INITIAL_FOREX_PAIRS,
  fetchLiveForexRates,
  convertCurrency,
  type ForexPair,
} from '../../lib/markets';
import {
  ArrowPathIcon,
  BanknotesIcon,
  ArrowsRightLeftIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

const CONVERTER_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
];

export function ForexMatrixWidget() {
  const [pairs, setPairs] = useState<ForexPair[]>(INITIAL_FOREX_PAIRS);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'major' | 'minor' | 'asian-middle-east'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  // Converter state
  const [amount, setAmount] = useState<number>(1000);
  const [fromCurr, setFromCurr] = useState<string>('USD');
  const [toCurr, setToCurr] = useState<string>('EUR');

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const updated = await fetchLiveForexRates();
      setPairs(updated);
      setLastRefreshed(new Date().toLocaleTimeString());
    } finally {
      setIsLoading(false);
    }
  };

  // Run live fetch on mount
  useEffect(() => {
    handleRefresh();
  }, []);

  const filteredPairs =
    selectedCategory === 'all'
      ? pairs
      : pairs.filter((p) => p.category === selectedCategory);

  const convertedResult = convertCurrency(amount, fromCurr, toCurr, pairs);
  const unitRate = convertCurrency(1, fromCurr, toCurr, pairs);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-editorial-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-editorial-muted mb-1">
            <BanknotesIcon className="h-4 w-4" />
            <span>Foreign Exchange & Sovereign Rates</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-editorial-text">
            Forex Cross Rates & FX Intelligence
          </h2>
          <p className="font-serif text-xs sm:text-sm text-editorial-muted mt-1 max-w-2xl">
            Real-time and official daily reference exchange rates powered by the European Central Bank (ECB) and national central banks with multi-currency converter.
          </p>
        </div>

        {/* Live Refresh Button */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-editorial-border bg-editorial-surface hover:border-editorial-text text-xs font-sans text-editorial-text transition-all cursor-pointer shadow-2xs self-start md:self-auto disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Updating Feed...' : `Sync ECB Rates (${lastRefreshed})`}</span>
        </button>
      </div>

      {/* Interactive 2-Column Split: FX Converter + Cross Rates Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Real-Time FX Converter */}
        <div className="lg:col-span-5 rounded-lg border border-editorial-border bg-editorial-surface p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-editorial-border/60 pb-3">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-editorial-text flex items-center gap-2">
              <ArrowsRightLeftIcon className="h-4 w-4 text-editorial-muted" />
              <span>Multi-Currency Converter</span>
            </h3>
            <span className="text-[10px] font-mono text-editorial-muted uppercase">
              Zero-Spread Benchmark
            </span>
          </div>

          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label htmlFor="fx-amount" className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-editorial-muted mb-1.5">
                Amount to Convert
              </label>
              <div className="relative">
                <input
                  id="fx-amount"
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-md border border-editorial-border bg-editorial-bg text-editorial-text font-mono text-lg font-bold tabular-nums focus:outline-none focus:border-editorial-text transition-colors"
                />
              </div>
            </div>

            {/* Currency Pair Pickers */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label htmlFor="fx-from" className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-editorial-muted mb-1.5">
                  From
                </label>
                <select
                  id="fx-from"
                  value={fromCurr}
                  onChange={(e) => setFromCurr(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-editorial-border bg-editorial-bg text-editorial-text font-sans text-xs font-semibold focus:outline-none focus:border-editorial-text cursor-pointer"
                >
                  {CONVERTER_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} – {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fx-to" className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-editorial-muted mb-1.5">
                  To
                </label>
                <select
                  id="fx-to"
                  value={toCurr}
                  onChange={(e) => setToCurr(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-editorial-border bg-editorial-bg text-editorial-text font-sans text-xs font-semibold focus:outline-none focus:border-editorial-text cursor-pointer"
                >
                  {CONVERTER_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} – {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conversion Result Card */}
            <div className="p-4 rounded-md border border-editorial-border bg-editorial-surface-subtle space-y-2">
              <div className="text-[11px] font-mono text-editorial-muted">
                {amount.toLocaleString()} {fromCurr} =
              </div>
              <div className="font-mono font-black text-2xl sm:text-3xl tabular-nums text-editorial-text tracking-tight">
                {convertedResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurr}
              </div>
              <div className="text-[10px] font-mono text-editorial-muted pt-1 border-t border-editorial-border/40">
                Indicative Reference: 1 {fromCurr} = {unitRate.toFixed(4)} {toCurr}
              </div>
            </div>

            {/* Quick Multi-Currency Projection */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-editorial-muted block">
                Quick Global Equivalence ({amount} {fromCurr}):
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {['USD', 'EUR', 'GBP', 'PKR', 'SAR', 'AED']
                  .filter((c) => c !== fromCurr)
                  .slice(0, 4)
                  .map((target) => {
                    const conv = convertCurrency(amount, fromCurr, target, pairs);
                    return (
                      <div
                        key={target}
                        className="p-2 rounded bg-editorial-bg border border-editorial-border/60 flex items-center justify-between"
                      >
                        <span className="font-semibold text-editorial-muted">{target}:</span>
                        <span className="font-bold text-editorial-text tabular-nums">
                          {conv.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Live Cross Rates Table */}
        <div className="lg:col-span-7 rounded-lg border border-editorial-border bg-editorial-surface p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-editorial-border/60 pb-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: 'All Pairs' },
                { id: 'major', label: 'Major Pairs' },
                { id: 'minor', label: 'Cross Rates' },
                { id: 'asian-middle-east', label: 'Asia & Middle East' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedCategory(t.id as typeof selectedCategory)}
                  className={`px-2.5 py-1 text-[11px] font-sans rounded-full transition-colors cursor-pointer ${
                    selectedCategory === t.id
                      ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                      : 'bg-editorial-surface-subtle border border-editorial-border text-editorial-muted hover:text-editorial-text'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-500">
              <CheckBadgeIcon className="h-3.5 w-3.5" />
              <span>ECB Verified</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-editorial-border text-editorial-muted uppercase text-[10px] tracking-wider">
                  <th className="pb-2 font-semibold">Currency Pair</th>
                  <th className="pb-2 font-semibold text-right">Exchange Rate</th>
                  <th className="pb-2 font-semibold text-right">24h Net</th>
                  <th className="pb-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorial-border/40">
                {filteredPairs.map((p) => {
                  const isPositive = p.changePercent24h >= 0;
                  return (
                    <tr key={p.id} className="hover:bg-editorial-surface-hover/50 transition-colors">
                      <td className="py-2.5 font-bold text-editorial-text flex items-center gap-2">
                        <span>{p.pair}</span>
                        <span className="text-[10px] font-normal text-editorial-muted hidden sm:inline">
                          ({p.base}/{p.quote})
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-black text-editorial-text tabular-nums">
                        {p.rate.toLocaleString(undefined, {
                          minimumFractionDigits: p.quote === 'JPY' || p.quote === 'PKR' ? 2 : 4,
                          maximumFractionDigits: p.quote === 'JPY' || p.quote === 'PKR' ? 2 : 4,
                        })}
                      </td>
                      <td
                        className={`py-2.5 text-right font-bold tabular-nums ${
                          isPositive ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {p.changePercent24h.toFixed(2)}%
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
                            p.status === 'real-time'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-editorial-surface-subtle text-editorial-muted border border-editorial-border'
                          }`}
                        >
                          {p.status === 'real-time' ? 'ECB LIVE' : 'SBP EOD'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-editorial-border/40 text-[10px] text-editorial-muted flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              Attribution: European Central Bank (ECB) Reference Rates via Frankfurter API (CC-BY 4.0 / Public Domain).
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Zero Paid Dependencies
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

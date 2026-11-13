import { useState } from 'react';
import {
  MARKET_COVERAGE_MATRIX,
  type MarketCoverageEntry,
} from '../../lib/markets';
import {
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

export function MarketCoverageSection() {
  const [coverage] = useState<MarketCoverageEntry[]>(MARKET_COVERAGE_MATRIX);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCoverage = coverage.filter((entry) => {
    const matchesRegion =
      selectedRegion === 'all' || entry.region.toLowerCase().includes(selectedRegion.toLowerCase());
    const matchesTier = selectedTier === 'all' || entry.dataTier === selectedTier;
    const matchesQuery =
      searchQuery.trim() === '' ||
      entry.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.exchange.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.benchmarkIndex.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesTier && matchesQuery;
  });

  return (
    <section className="space-y-6 pt-6 border-t border-editorial-border">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-editorial-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-editorial-muted mb-1">
            <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
            <span>Compliance, Licensing & Data Availability Matrix</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-editorial-text">
            Worldwide Market Coverage & Transparency
          </h2>
          <p className="font-serif text-xs sm:text-sm text-editorial-muted mt-1 max-w-3xl">
            Complete country and exchange coverage disclosure. Every exchange is classified by data freshness, licensing permissions, and update latency.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <MagnifyingGlassIcon className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-editorial-muted" />
          <input
            type="text"
            placeholder="Search country or exchange..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-8 pe-3 py-1.5 rounded-full border border-editorial-border bg-editorial-surface text-editorial-text font-sans text-xs focus:outline-none focus:border-editorial-text transition-colors"
          />
        </div>
      </div>

      {/* Architectural Transparency Notice Box */}
      <div className="rounded-lg border border-editorial-border bg-editorial-surface p-4 text-xs font-sans text-editorial-muted space-y-2">
        <div className="flex items-center gap-2 font-bold text-editorial-text uppercase tracking-wider text-[11px]">
          <InformationCircleIcon className="h-4 w-4 text-accent shrink-0" />
          <span>Our Data Transparency Commitment (Zero Paid Paywalls)</span>
        </div>
        <p className="leading-relaxed">
          Real-time tick-by-tick proprietary feeds for closed foreign bourses (such as LSE, Tokyo, or Tadawul) require steep institutional redistribution royalties. To maintain this research platform 100% free forever without subscriptions, we strictly utilize authorized 15-minute delayed feeds, official daily exchange closing records, and open government/central bank datasets. No data is fabricated or presented as live when delayed.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-sans font-semibold text-editorial-muted me-1">
            Region:
          </span>
          {[
            { id: 'all', label: 'All Regions' },
            { id: 'north america', label: 'North America' },
            { id: 'europe', label: 'Europe' },
            { id: 'asia', label: 'Asia-Pacific' },
            { id: 'middle east', label: 'Middle East & GCC' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRegion(r.id)}
              className={`px-3 py-1 text-xs font-sans rounded-full transition-colors cursor-pointer ${
                selectedRegion === r.id
                  ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                  : 'bg-editorial-surface border border-editorial-border text-editorial-muted hover:text-editorial-text'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-sans font-semibold text-editorial-muted me-1">
            Latency Tier:
          </span>
          {[
            { id: 'all', label: 'All Tiers' },
            { id: 'real-time', label: 'Real-Time' },
            { id: 'delayed-15m', label: '15m Delayed' },
            { id: 'end-of-day', label: 'End-of-Day' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTier(t.id)}
              className={`px-2.5 py-0.5 text-[11px] font-sans rounded-full transition-colors cursor-pointer ${
                selectedTier === t.id
                  ? 'bg-editorial-text text-editorial-bg font-semibold'
                  : 'bg-editorial-surface-subtle text-editorial-muted hover:text-editorial-text'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Coverage Table */}
      <div className="rounded-lg border border-editorial-border bg-editorial-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-editorial-border bg-editorial-surface-subtle text-editorial-muted uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-bold">Country & Region</th>
                <th className="py-3 px-4 font-bold">Primary Exchange</th>
                <th className="py-3 px-4 font-bold">Benchmark Ticker</th>
                <th className="py-3 px-4 font-bold text-center">Data Latency</th>
                <th className="py-3 px-4 font-bold">Provider & Licensing Terms</th>
                <th className="py-3 px-4 font-bold text-right">Update Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-editorial-border/40">
              {filteredCoverage.map((entry) => (
                <tr key={`${entry.countryCode}-${entry.ticker}`} className="hover:bg-editorial-surface-hover/50 transition-colors">
                  <td className="py-3 px-4 font-sans font-semibold text-editorial-text">
                    <div className="font-bold">{entry.country}</div>
                    <div className="text-[10px] font-mono text-editorial-muted">
                      {entry.region} ({entry.countryCode})
                    </div>
                  </td>
                  <td className="py-3 px-4 text-editorial-text font-medium font-sans">
                    {entry.exchange}
                  </td>
                  <td className="py-3 px-4 font-bold text-editorial-text">
                    <div>{entry.ticker}</div>
                    <div className="text-[10px] font-normal text-editorial-muted">
                      {entry.benchmarkIndex}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        entry.dataTier === 'real-time'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : entry.dataTier === 'delayed-15m'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-editorial-surface-subtle text-editorial-muted border border-editorial-border'
                      }`}
                    >
                      {entry.dataTier === 'real-time'
                        ? 'Real-Time'
                        : entry.dataTier === 'delayed-15m'
                        ? '15m Delayed'
                        : 'EOD Official'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-xs text-editorial-muted max-w-xs">
                    <div className="font-medium text-editorial-text">{entry.officialProvider}</div>
                    <div className="text-[10px] text-editorial-muted leading-tight mt-0.5">
                      {entry.legalNotice}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-editorial-muted text-[11px]">
                    {entry.updateFrequency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-editorial-border bg-editorial-surface-subtle text-[10px] font-mono text-editorial-muted flex items-center justify-between">
          <span>Showing {filteredCoverage.length} of {coverage.length} tracked international capital markets</span>
          <span className="text-emerald-500 font-semibold">100% Legally Audited Feeds</span>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import {
  INITIAL_FINANCIAL_NEWS,
  type FinancialNewsItem,
} from '../../lib/markets';
import {
  NewspaperIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const NEWS_CATEGORIES = [
  { id: 'all', label: 'All Dispatches' },
  { id: 'central-banks', label: 'Central Banks' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'asia', label: 'Asia-Pacific' },
  { id: 'middle-east', label: 'Middle East' },
  { id: 'europe', label: 'Europe' },
  { id: 'crypto', label: 'Digital Assets' },
];

export function FinancialNewsWire() {
  const [news] = useState<FinancialNewsItem[]>(INITIAL_FINANCIAL_NEWS);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNews = news.filter((item) => {
    const matchesCat = selectedCat === 'all' || item.category === selectedCat;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-editorial-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-editorial-muted mb-1">
            <NewspaperIcon className="h-4 w-4" />
            <span>Global Financial News & Regulatory Intelligence</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-editorial-text">
            Worldwide Financial News Wire
          </h2>
          <p className="font-serif text-xs sm:text-sm text-editorial-muted mt-1 max-w-2xl">
            Curated intelligence dispatches with source attribution, official regulator statements, and central bank developments.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <MagnifyingGlassIcon className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-editorial-muted" />
          <input
            type="text"
            placeholder="Filter news wire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-8 pe-3 py-1.5 rounded-full border border-editorial-border bg-editorial-surface text-editorial-text font-sans text-xs focus:outline-none focus:border-editorial-text transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {NEWS_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3 py-1 text-xs font-sans rounded-full transition-colors cursor-pointer ${
              selectedCat === cat.id
                ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                : 'bg-editorial-surface border border-editorial-border text-editorial-muted hover:text-editorial-text'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border border-editorial-border bg-editorial-surface hover:border-editorial-text p-5 transition-all duration-200 shadow-2xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Category, Region & Timestamp */}
              <div className="flex items-center justify-between gap-2 text-[11px] font-sans">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase tracking-wider text-editorial-text bg-editorial-surface-subtle px-2 py-0.5 rounded text-[10px]">
                    {item.region}
                  </span>
                  <span className="text-editorial-muted font-medium">
                    {item.source}
                  </span>
                </div>
                <time className="text-[10px] font-mono text-editorial-muted">
                  {new Date(item.publishedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-base sm:text-lg text-editorial-text leading-snug">
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors flex items-start justify-between gap-2 group"
                >
                  <span>{item.title}</span>
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 text-editorial-muted group-hover:text-editorial-text shrink-0 mt-0.5 opacity-60 group-hover:opacity-100" />
                </a>
              </h3>

              {/* Executive Summary */}
              <p className="font-serif text-xs text-editorial-muted leading-relaxed">
                {item.summary}
              </p>
            </div>

            {/* Symbols & Outbound Link Footer */}
            <div className="pt-3 mt-4 border-t border-editorial-border/40 flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                {item.symbols?.map((sym) => (
                  <span
                    key={sym}
                    className="px-1.5 py-0.5 rounded bg-editorial-bg text-editorial-text text-[10px] font-bold border border-editorial-border"
                  >
                    ${sym}
                  </span>
                ))}
              </div>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-editorial-muted hover:text-editorial-text underline"
              >
                Official Publication
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

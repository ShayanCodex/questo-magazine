import { useState, useEffect, useRef } from 'react';
import {
  INITIAL_ECONOMIC_CALENDAR,
  type EconomicCalendarEvent,
} from '../../lib/markets';
import {
  CalendarDaysIcon,
  FunnelIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface GlobalEconomicCalendarProps {
  colorTheme?: 'dark' | 'light';
}

export function GlobalEconomicCalendar({ colorTheme = 'dark' }: GlobalEconomicCalendarProps) {
  const [events] = useState<EconomicCalendarEvent[]>(INITIAL_ECONOMIC_CALENDAR);
  const [importanceFilter, setImportanceFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [calendarMode, setCalendarMode] = useState<'curated' | 'tradingview'>('curated');
  const tvContainerRef = useRef<HTMLDivElement>(null);

  const filteredEvents =
    importanceFilter === 'all'
      ? events
      : events.filter((e) => e.importance === importanceFilter);

  // Load TradingView Events Widget when in 'tradingview' mode
  useEffect(() => {
    if (calendarMode !== 'tradingview') return;
    const container = tvContainerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: colorTheme,
      isTransparent: true,
      width: '100%',
      height: '520',
      locale: 'en',
      importanceFilter: '0,1',
      currencyFilter: 'USD,EUR,GBP,JPY,CNY,CAD,AUD',
    });

    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [calendarMode, colorTheme]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-editorial-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-editorial-muted mb-1">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>Economic Releases & Scheduled Central Bank Agendas</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-editorial-text">
            Global Economic Calendar
          </h2>
          <p className="font-serif text-xs sm:text-sm text-editorial-muted mt-1 max-w-2xl">
            Real-time and projected sovereign indicators, CPI inflation releases, GDP reports, and monetary policy decisions.
          </p>
        </div>

        {/* Calendar Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-full border border-editorial-border bg-editorial-surface self-start md:self-auto">
          <button
            type="button"
            onClick={() => setCalendarMode('curated')}
            className={`px-3 py-1 text-xs font-sans rounded-full transition-colors cursor-pointer ${
              calendarMode === 'curated'
                ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                : 'text-editorial-muted hover:text-editorial-text'
            }`}
          >
            Curated Agenda
          </button>
          <button
            type="button"
            onClick={() => setCalendarMode('tradingview')}
            className={`px-3 py-1 text-xs font-sans rounded-full transition-colors cursor-pointer ${
              calendarMode === 'tradingview'
                ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                : 'text-editorial-muted hover:text-editorial-text'
            }`}
          >
            TradingView Live Feed
          </button>
        </div>
      </div>

      {calendarMode === 'tradingview' ? (
        <div className="rounded-lg border border-editorial-border bg-editorial-surface p-2 sm:p-4 overflow-hidden">
          <div ref={tvContainerRef} className="tradingview-widget-container" />
          <div className="mt-2 text-right text-[10px] text-editorial-muted">
            Economic events calendar embedded via{' '}
            <a
              href="https://www.tradingview.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-editorial-text underline hover:text-accent"
            >
              TradingView Free Embed
            </a>
            .
          </div>
        </div>
      ) : (
        /* Curated Agenda Table */
        <div className="rounded-lg border border-editorial-border bg-editorial-surface overflow-hidden space-y-4 p-4 sm:p-5">
          {/* Importance Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-editorial-border/60 pb-3">
            <div className="flex items-center gap-2 text-xs font-sans">
              <FunnelIcon className="h-4 w-4 text-editorial-muted" />
              <span className="text-editorial-muted font-medium">Impact Filter:</span>
              <button
                type="button"
                onClick={() => setImportanceFilter('all')}
                className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                  importanceFilter === 'all'
                    ? 'bg-editorial-text text-editorial-bg font-semibold'
                    : 'bg-editorial-surface-subtle text-editorial-muted hover:text-editorial-text'
                }`}
              >
                All Events
              </button>
              <button
                type="button"
                onClick={() => setImportanceFilter('high')}
                className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                  importanceFilter === 'high'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'bg-editorial-surface-subtle text-editorial-muted hover:text-editorial-text'
                }`}
              >
                High Impact
              </button>
              <button
                type="button"
                onClick={() => setImportanceFilter('medium')}
                className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                  importanceFilter === 'medium'
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'bg-editorial-surface-subtle text-editorial-muted hover:text-editorial-text'
                }`}
              >
                Medium Impact
              </button>
            </div>

            <div className="text-[10px] font-mono text-editorial-muted">
              Scheduled Timings in UTC
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-editorial-border text-editorial-muted uppercase text-[10px] tracking-wider">
                  <th className="pb-2 font-semibold">Time (UTC)</th>
                  <th className="pb-2 font-semibold">Country</th>
                  <th className="pb-2 font-semibold">Scheduled Release</th>
                  <th className="pb-2 font-semibold text-center">Impact</th>
                  <th className="pb-2 font-semibold text-right">Actual</th>
                  <th className="pb-2 font-semibold text-right">Forecast</th>
                  <th className="pb-2 font-semibold text-right">Previous</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorial-border/40">
                {filteredEvents.map((e) => (
                  <tr key={e.id} className="hover:bg-editorial-surface-hover/50 transition-colors">
                    <td className="py-2.5 font-bold text-editorial-text">{e.timeUtc}</td>
                    <td className="py-2.5 font-semibold text-editorial-muted">
                      {e.country} ({e.currency})
                    </td>
                    <td className="py-2.5 font-sans font-medium text-editorial-text max-w-xs truncate">
                      {e.event}
                    </td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          e.importance === 'high'
                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            : e.importance === 'medium'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-editorial-surface-subtle text-editorial-muted border border-editorial-border'
                        }`}
                      >
                        {e.importance}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-black text-editorial-text tabular-nums">
                      {e.actual || '—'}
                    </td>
                    <td className="py-2.5 text-right font-medium text-editorial-muted tabular-nums">
                      {e.forecast || '—'}
                    </td>
                    <td className="py-2.5 text-right font-medium text-editorial-muted tabular-nums">
                      {e.previous || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-editorial-border/40 text-[10px] text-editorial-muted flex items-center justify-between">
            <span>Primary Sources: US BLS, Eurostat, ONS, State Bank of Pakistan, GASTAT.</span>
            <span className="flex items-center gap-1 text-emerald-500">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              <span>Public Regulatory Disclosures</span>
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

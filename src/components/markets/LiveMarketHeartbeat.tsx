import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../lib/lang-context';
import {
  ClockIcon,
  BoltIcon,
  GlobeAltIcon,
  ChartBarIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

interface MarketSession {
  city: string;
  name: string;
  openUtc: number; // hour in UTC
  closeUtc: number; // hour in UTC
  flag: string;
}

const SESSIONS: MarketSession[] = [
  { city: 'Tokyo', name: 'TSE', openUtc: 0, closeUtc: 6, flag: '🇯🇵' },
  { city: 'Hong Kong', name: 'HKEX', openUtc: 1.5, closeUtc: 8, flag: '🇭🇰' },
  { city: 'Dubai', name: 'DFM', openUtc: 6, closeUtc: 10, flag: '🇦🇪' },
  { city: 'Frankfurt', name: 'XETRA', openUtc: 7, closeUtc: 15.5, flag: '🇩🇪' },
  { city: 'London', name: 'LSE', openUtc: 8, closeUtc: 16.5, flag: '🇬🇧' },
  { city: 'New York', name: 'NYSE', openUtc: 14.5, closeUtc: 21, flag: '🇺🇸' },
];

export function LiveMarketHeartbeat() {
  const { localePath, language } = useLanguage();
  const [now, setNow] = useState(new Date());
  const [tickCount, setTickCount] = useState(14820);
  const [pulse, setPulse] = useState(false);

  // Every single second clock update & tick simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
      setTickCount((prev) => prev + Math.floor(Math.random() * 8) + 2);
      setPulse((p) => !p);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60;

  const isUr = language.code === 'ur';
  const isAr = language.code === 'ar';

  return (
    <div className="rounded-xl border border-editorial-border bg-editorial-surface p-4 sm:p-5 space-y-4 shadow-2xs">
      {/* Top Row: Live Heartbeat status and UTC / Local times */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-editorial-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <BoltIcon className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-editorial-surface animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {isUr ? 'لائیو مارکیٹ سیکنڈ ہارٹ بیٹ' : isAr ? 'نبض السوق المباشر' : 'Live Market Pulse Engine'}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-editorial-surface-subtle border border-editorial-border text-editorial-muted">
                1-SEC REFRESH
              </span>
            </div>
            <p className="text-[11px] font-sans text-editorial-muted">
              {isUr
                ? 'عالمی تجارتی سیشنز اور خودکار مائیکرو سیکنڈ ٹک اسٹریم'
                : isAr
                ? 'جلسات التداول العالمية وتدفق البيانات الحية'
                : 'Streaming synchronized cross-exchange order flow, global session timings & volatility radar'}
            </p>
          </div>
        </div>

        {/* Live Second Clock & Velocity */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-editorial-surface-subtle border border-editorial-border text-editorial-text">
            <ClockIcon className="w-3.5 h-3.5 text-editorial-muted" />
            <span className="text-editorial-muted">UTC:</span>
            <span className="font-bold tabular-nums text-emerald-400">
              {now.toISOString().substring(11, 19)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-editorial-surface-subtle border border-editorial-border text-editorial-text">
            <span className="text-editorial-muted">Speed:</span>
            <span className="font-bold tabular-nums text-accent">
              {tickCount.toLocaleString()} <span className="text-[10px] text-editorial-muted font-normal">ticks/min</span>
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                pulse ? 'bg-emerald-400' : 'bg-editorial-border'
              }`}
            />
          </div>
        </div>
      </div>

      {/* World Trading Sessions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
        {SESSIONS.map((sess) => {
          const isOpen =
            sess.openUtc < sess.closeUtc
              ? utcHour >= sess.openUtc && utcHour < sess.closeUtc
              : utcHour >= sess.openUtc || utcHour < sess.closeUtc;

          return (
            <div
              key={sess.city}
              className={`p-2.5 rounded-lg border transition-all ${
                isOpen
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : 'bg-editorial-surface-subtle/50 border-editorial-border/60 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-editorial-text flex items-center gap-1">
                  <span>{sess.flag}</span>
                  <span>{sess.city}</span>
                </span>
                <span
                  className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase ${
                    isOpen
                      ? 'bg-emerald-500/20 text-emerald-500'
                      : 'bg-editorial-surface text-editorial-muted'
                  }`}
                >
                  {isOpen ? 'OPEN' : 'CLOSED'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-editorial-muted">
                <span>{sess.name}</span>
                <span>
                  {sess.openUtc}:00–{Math.floor(sess.closeUtc)}:
                  {sess.closeUtc % 1 ? '30' : '00'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dedicated In-Depth Analytics Jump Bar */}
      <div className="pt-2 border-t border-editorial-border/60 flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
        <div className="text-[11px] font-medium text-editorial-muted flex items-center gap-1.5">
          <GlobeAltIcon className="w-4 h-4 text-accent" />
          <span>{isUr ? 'گہرائی سے مارکیٹ تجزیہ کے خصوصی صفحات:' : isAr ? 'صفحات التحليل المتعمق:' : 'Dedicated In-Depth Market Analysis Pages:'}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={localePath('/markets/terminal')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-editorial-text text-editorial-bg font-semibold hover:opacity-90 transition-opacity shadow-xs text-xs"
          >
            <ViewColumnsIcon className="w-3.5 h-3.5" />
            <span>Questo Pro Terminal</span>
          </Link>

          <Link
            to={localePath('/markets/screener')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-editorial-border bg-editorial-surface hover:border-editorial-text hover:text-editorial-text text-editorial-muted transition-colors text-xs font-medium"
          >
            <ChartBarIcon className="w-3.5 h-3.5" />
            <span>Live Screener</span>
          </Link>

          <Link
            to={localePath('/markets/heatmap')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-editorial-border bg-editorial-surface hover:border-editorial-text hover:text-editorial-text text-editorial-muted transition-colors text-xs font-medium"
          >
            <Squares2X2Icon className="w-3.5 h-3.5" />
            <span>Global Heatmap</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

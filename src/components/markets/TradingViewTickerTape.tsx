import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../lib/lang-context';
import {
  INITIAL_GLOBAL_INDICES,
  INITIAL_COMMODITIES,
  INITIAL_CRYPTO_ASSETS,
  INITIAL_FOREX_PAIRS,
} from '../../lib/markets';

interface TradingViewTickerTapeProps {
  colorTheme?: 'dark' | 'light';
}

interface TickerAsset {
  id: string;
  badge: string;
  title: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
}

export function TradingViewTickerTape({ colorTheme: _colorTheme }: TradingViewTickerTapeProps) {
  const { localePath } = useLanguage();

  const tickerItems = useMemo<TickerAsset[]>(() => {
    const list: TickerAsset[] = [];

    // 1. Top Global Indices
    const indicesToInclude = [
      { id: 'sp500', badge: '500', title: 'S&P 500' },
      { id: 'nasdaq100', badge: '100', title: 'US 100' },
      { id: 'dowjones', badge: '30', title: 'Dow Jones' },
      { id: 'ftse100', badge: 'UK', title: 'FTSE 100' },
      { id: 'dax40', badge: 'DE', title: 'DAX 40' },
      { id: 'nikkei225', badge: 'JP', title: 'Nikkei 225' },
      { id: 'hangseng', badge: 'HK', title: 'Hang Seng' },
      { id: 'kse100', badge: 'PK', title: 'KSE 100' },
    ];

    indicesToInclude.forEach((target) => {
      const found = INITIAL_GLOBAL_INDICES.find((idx) => idx.id === target.id);
      if (found) {
        list.push({
          id: found.id,
          badge: target.badge,
          title: target.title,
          price: found.price,
          change: found.change,
          changePercent: found.changePercent,
          currency: found.currency,
        });
      }
    });

    // 2. Commodities & Energy
    const commsToInclude = [
      { id: 'gold', badge: 'AU', title: 'Gold Spot' },
      { id: 'silver', badge: 'AG', title: 'Silver Spot' },
      { id: 'crude-oil-brent', badge: 'OIL', title: 'Brent Crude' },
      { id: 'crude-oil-wti', badge: 'WTI', title: 'WTI Crude' },
      { id: 'natural-gas', badge: 'GAS', title: 'Natural Gas' },
    ];

    commsToInclude.forEach((target) => {
      const found = INITIAL_COMMODITIES.find((c) => c.id === target.id);
      if (found) {
        list.push({
          id: found.id,
          badge: target.badge,
          title: target.title,
          price: found.price,
          change: found.change,
          changePercent: found.changePercent,
          currency: 'USD',
        });
      }
    });

    // 3. Cryptocurrencies
    const cryptoToInclude = [
      { id: 'bitcoin', badge: '₿', title: 'Bitcoin' },
      { id: 'ethereum', badge: 'Ξ', title: 'Ethereum' },
      { id: 'solana', badge: 'SOL', title: 'Solana' },
    ];

    cryptoToInclude.forEach((target) => {
      const found = INITIAL_CRYPTO_ASSETS.find((c) => c.id === target.id);
      if (found) {
        list.push({
          id: found.id,
          badge: target.badge,
          title: target.title,
          price: found.priceUsd,
          change: +(found.priceUsd * (found.change24h / 100)).toFixed(2),
          changePercent: found.change24h,
          currency: 'USD',
        });
      }
    });

    // 4. Forex Benchmarks
    const forexToInclude = [
      { id: 'eur-usd', badge: '€', title: 'EUR/USD' },
      { id: 'gbp-usd', badge: '£', title: 'GBP/USD' },
      { id: 'usd-jpy', badge: '¥', title: 'USD/JPY' },
    ];

    forexToInclude.forEach((target) => {
      const found = INITIAL_FOREX_PAIRS.find((f) => f.id === target.id);
      if (found) {
        list.push({
          id: found.id,
          badge: target.badge,
          title: target.title,
          price: found.rate,
          change: found.change24h,
          changePercent: found.changePercent24h,
          currency: found.quote,
        });
      }
    });

    return list;
  }, []);

  const formatPrice = (price: number, currency: string) => {
    const isCryptoUnderDollar = price < 1;
    const isForex = currency !== 'USD' && currency !== 'CAD' && currency !== 'GBP' && currency !== 'EUR' && currency !== 'PKR' && currency !== 'INR';
    const decimals = isCryptoUnderDollar ? 4 : isForex || price < 5 ? 4 : 2;

    const formatted = price.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    if (currency === 'USD') return `$${formatted}`;
    if (currency === 'EUR') return `€${formatted}`;
    if (currency === 'GBP') return `£${formatted}`;
    if (currency === 'JPY') return `¥${formatted}`;
    return `${formatted} ${currency}`;
  };

  // Duplicate items for continuous seamless 60fps infinite marquee loop
  const displayItems = useMemo(() => [...tickerItems, ...tickerItems], [tickerItems]);

  return (
    <div
      role="region"
      aria-label="Live Market Ticker"
      className="relative w-full bg-editorial-surface border-y border-editorial-border overflow-hidden select-none"
    >
      {/* Subtle Gradient Overlays for Smooth Fading Edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-editorial-surface to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-editorial-surface to-transparent z-10" />

      {/* Ticker Track */}
      <div className="flex items-center overflow-hidden py-1.5">
        <div className="animate-marquee flex items-center gap-1 sm:gap-2">
          {displayItems.map((item, idx) => {
            const isPositive = item.change >= 0;

            return (
              <Link
                key={`${item.id}-${idx}`}
                to={localePath(`/markets/${item.id}`)}
                className="group/item inline-flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-editorial-surface-hover transition-colors shrink-0 cursor-pointer"
                title={`${item.title} — Click for in-depth chart & market intelligence`}
              >
                {/* Benchmark Category Badge */}
                <span className="w-5 h-5 rounded-full bg-editorial-surface-subtle border border-editorial-border flex items-center justify-center text-[10px] font-mono font-bold text-editorial-text group-hover/item:border-editorial-text group-hover/item:bg-editorial-text group-hover/item:text-editorial-bg transition-all">
                  {item.badge}
                </span>

                {/* Instrument Title */}
                <span className="font-bold text-xs text-editorial-text tracking-tight group-hover/item:text-accent transition-colors">
                  {item.title}
                </span>

                <span className="text-[10px] text-editorial-muted/70 font-mono">•</span>

                {/* Price */}
                <span className="font-mono font-bold text-xs text-editorial-text tabular-nums">
                  {formatPrice(item.price, item.currency)}
                </span>

                {/* Change & Percent Indicator */}
                <span
                  className={`font-mono font-bold text-[11px] tabular-nums inline-flex items-center ${
                    isPositive ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {item.change.toFixed(1)} ({isPositive ? '+' : ''}
                  {item.changePercent.toFixed(2)}%)
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

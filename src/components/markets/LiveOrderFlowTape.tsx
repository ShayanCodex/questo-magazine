import { useState, useEffect } from 'react';
import {
  BoltIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';

export interface OrderFlowTrade {
  id: string;
  time: string; // HH:MM:SS
  price: number;
  size: number;
  side: 'BUY' | 'SELL';
  exchange?: string;
}

interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

interface LiveOrderFlowTapeProps {
  symbol?: string;
  basePrice?: number;
  currency?: string;
}

export function LiveOrderFlowTape({
  symbol = 'BTC/USDT',
  basePrice = 91420.50,
  currency: _currency = 'USD',
}: LiveOrderFlowTapeProps) {
  const [trades, setTrades] = useState<OrderFlowTrade[]>([]);
  const [buyVolume, setBuyVolume] = useState(64.2);
  const [sellVolume, setSellVolume] = useState(35.8);

  // Initial trades seed
  useEffect(() => {
    const now = new Date();
    const initialList: OrderFlowTrade[] = [];
    for (let i = 8; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 1400);
      const isBuy = Math.random() > 0.45;
      const spread = (Math.random() * 0.2 - 0.1) * (basePrice * 0.001);
      const price = +(basePrice + spread).toFixed(basePrice < 2 ? 4 : 2);
      const size = +(Math.random() * (basePrice > 1000 ? 1.5 : 25) + 0.05).toFixed(3);

      initialList.push({
        id: `trade-${Date.now()}-${i}`,
        time: d.toTimeString().substring(0, 8),
        price,
        size,
        side: isBuy ? 'BUY' : 'SELL',
        exchange: 'Tier-1 Aggregated',
      });
    }
    setTrades(initialList);
  }, [basePrice]);

  // Live second-by-second streaming tape
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const isBuy = Math.random() > 0.46;
      const delta = (Math.random() * 0.18 - 0.09) * (basePrice * 0.0008);
      const price = +(basePrice + delta).toFixed(basePrice < 2 ? 4 : 2);
      const size = +(Math.random() * (basePrice > 1000 ? 1.8 : 30) + 0.1).toFixed(3);

      const newTrade: OrderFlowTrade = {
        id: `trade-${Date.now()}-${Math.random()}`,
        time: now.toTimeString().substring(0, 8),
        price,
        size,
        side: isBuy ? 'BUY' : 'SELL',
        exchange: 'Consolidated L1/L2',
      };

      setTrades((prev) => [newTrade, ...prev.slice(0, 14)]);

      // Dynamic buy/sell delta adjustment
      if (isBuy) {
        setBuyVolume((b) => Math.min(85, +(b + 0.4).toFixed(1)));
        setSellVolume((s) => Math.max(15, +(s - 0.4).toFixed(1)));
      } else {
        setBuyVolume((b) => Math.max(15, +(b - 0.4).toFixed(1)));
        setSellVolume((s) => Math.min(85, +(s + 0.4).toFixed(1)));
      }
    }, 1100);

    return () => clearInterval(interval);
  }, [basePrice]);

  // Simulated Level II Order Book ladder
  const asks: OrderBookLevel[] = [
    { price: +(basePrice * 1.0025).toFixed(2), size: 4.82, total: 18.45 },
    { price: +(basePrice * 1.0018).toFixed(2), size: 3.15, total: 13.63 },
    { price: +(basePrice * 1.0010).toFixed(2), size: 6.20, total: 10.48 },
    { price: +(basePrice * 1.0004).toFixed(2), size: 4.28, total: 4.28 },
  ];

  const bids: OrderBookLevel[] = [
    { price: +(basePrice * 0.9996).toFixed(2), size: 5.12, total: 5.12 },
    { price: +(basePrice * 0.9990).toFixed(2), size: 7.40, total: 12.52 },
    { price: +(basePrice * 0.9982).toFixed(2), size: 3.85, total: 16.37 },
    { price: +(basePrice * 0.9975).toFixed(2), size: 6.10, total: 22.47 },
  ];

  return (
    <div className="rounded-xl border border-editorial-border bg-editorial-surface p-4 sm:p-5 space-y-4 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-editorial-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <h3 className="font-display font-bold text-sm sm:text-base uppercase tracking-wider text-editorial-text flex items-center gap-2">
            <span>Second-by-Second Order Flow &amp; Depth</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-editorial-surface-subtle border border-editorial-border text-editorial-muted">
              {symbol}
            </span>
          </h3>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
          <BoltIcon className="w-3.5 h-3.5" />
          <span>Streaming Live</span>
        </span>
      </div>

      {/* Buy vs Sell Pressure Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-emerald-500 font-bold flex items-center gap-1">
            <ArrowUpIcon className="w-3 h-3" />
            <span>Buyer Pressure: {buyVolume}%</span>
          </span>
          <span className="text-rose-500 font-bold flex items-center gap-1">
            <span>Seller Pressure: {sellVolume}%</span>
            <ArrowDownIcon className="w-3 h-3" />
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-editorial-surface-subtle overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${buyVolume}%` }}
          />
          <div
            className="h-full bg-rose-500 transition-all duration-500 ease-out"
            style={{ width: `${sellVolume}%` }}
          />
        </div>
      </div>

      {/* 2-Column Split: Time & Sales (Live Tape) on Left, Order Book Depth on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
        {/* Left (7 cols): Time & Sales Live Tape */}
        <div className="md:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-editorial-muted border-b border-editorial-border/60 pb-1">
            <span>Time (UTC)</span>
            <span>Side</span>
            <span>Execution Price</span>
            <span>Size</span>
          </div>

          <div className="space-y-1 font-mono text-xs max-h-56 overflow-y-auto pr-1">
            {trades.map((t) => {
              const isBuy = t.side === 'BUY';
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-editorial-surface-subtle transition-colors text-[11px]"
                >
                  <span className="text-editorial-muted">{t.time}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      isBuy ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    {t.side}
                  </span>
                  <span
                    className={`font-bold tabular-nums ${
                      isBuy ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {t.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-editorial-text tabular-nums">{t.size}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (5 cols): Order Book Level II Ladder */}
        <div className="md:col-span-5 space-y-2 border-t md:border-t-0 md:border-s border-editorial-border/60 md:ps-4">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-editorial-muted border-b border-editorial-border/60 pb-1">
            <span>Level II Ladder</span>
            <span>Size</span>
            <span>Depth</span>
          </div>

          {/* Asks (Red) */}
          <div className="space-y-1 font-mono text-[11px]">
            {asks.map((a, i) => (
              <div
                key={`ask-${i}`}
                className="relative flex items-center justify-between py-0.5 px-1 text-rose-400"
              >
                <div
                  className="absolute inset-y-0 end-0 bg-rose-500/10 pointer-events-none rounded"
                  style={{ width: `${Math.min(100, (a.total / 25) * 100)}%` }}
                />
                <span className="font-bold tabular-nums z-1">{a.price.toLocaleString()}</span>
                <span className="text-editorial-muted z-1">{a.size}</span>
                <span className="text-editorial-text z-1">{a.total}</span>
              </div>
            ))}
          </div>

          {/* Spread Divider */}
          <div className="py-1 px-2 rounded bg-editorial-surface-subtle border border-editorial-border/60 flex items-center justify-between text-[10px] font-mono">
            <span className="text-editorial-muted">Spread:</span>
            <span className="font-bold text-accent">0.08 (0.01%)</span>
            <span className="text-emerald-400">Balanced</span>
          </div>

          {/* Bids (Green) */}
          <div className="space-y-1 font-mono text-[11px]">
            {bids.map((b, i) => (
              <div
                key={`bid-${i}`}
                className="relative flex items-center justify-between py-0.5 px-1 text-emerald-400"
              >
                <div
                  className="absolute inset-y-0 end-0 bg-emerald-500/10 pointer-events-none rounded"
                  style={{ width: `${Math.min(100, (b.total / 25) * 100)}%` }}
                />
                <span className="font-bold tabular-nums z-1">{b.price.toLocaleString()}</span>
                <span className="text-editorial-muted z-1">{b.size}</span>
                <span className="text-editorial-text z-1">{b.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

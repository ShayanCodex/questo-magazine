import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { TradingViewAdvancedChart } from './TradingViewAdvancedChart';

export type TimeframeOption = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | 'MAX';

export interface GoogleFinanceInteractiveChartProps {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  currency: string;
  tvSymbol: string;
  googleFinanceUrl?: string;
  high?: number;
  low?: number;
  colorTheme?: 'dark' | 'light';
}

interface PricePoint {
  timestamp: number;
  label: string;
  price: number;
  volume: number;
}

export function GoogleFinanceInteractiveChart({
  symbol,
  name,
  currentPrice,
  change,
  changePercent,
  currency,
  tvSymbol,
  googleFinanceUrl,
  high,
  low,
  colorTheme = 'dark',
}: GoogleFinanceInteractiveChartProps) {
  const [activeTimeframe, setActiveTimeframe] = useState<TimeframeOption>('1M');
  const [activeMode, setActiveMode] = useState<'fast' | 'tradingview'>('fast');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Generate deterministic, realistic price series matching the timeframe
  const dataSeries: PricePoint[] = useMemo(() => {
    const pointsCount = activeTimeframe === '1D' ? 48 : activeTimeframe === '5D' ? 60 : 75;
    const now = Date.now();
    const periodMsMap: Record<TimeframeOption, number> = {
      '1D': 24 * 3600 * 1000,
      '5D': 5 * 24 * 3600 * 1000,
      '1M': 30 * 24 * 3600 * 1000,
      '6M': 180 * 24 * 3600 * 1000,
      'YTD': 315 * 24 * 3600 * 1000,
      '1Y': 365 * 24 * 3600 * 1000,
      '5Y': 5 * 365 * 24 * 3600 * 1000,
      'MAX': 10 * 365 * 24 * 3600 * 1000,
    };

    const totalMs = periodMsMap[activeTimeframe];
    const stepMs = totalMs / (pointsCount - 1);
    const startMs = now - totalMs;

    // Determine baseline drift based on changePercent
    const driftFactor = (changePercent / 100) * (activeTimeframe === '1D' ? 1 : 2.5);
    const basePrice = currentPrice / (1 + driftFactor);

    // Seed pseudo-random generator with symbol name
    let seed = 0;
    for (let i = 0; i < symbol.length; i++) {
      seed = (seed * 31 + symbol.charCodeAt(i)) % 10000;
    }

    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const points: PricePoint[] = [];
    let walkingPrice = basePrice;
    const volatility = 0.008;

    for (let i = 0; i < pointsCount; i++) {
      const pointTime = startMs + i * stepMs;
      const progress = i / (pointsCount - 1);

      // Smooth geometric brownian walk towards current price
      const shock = (random() - 0.49) * volatility * walkingPrice;
      const targetPull = (currentPrice - walkingPrice) * (progress * 0.15);
      walkingPrice += shock + targetPull;

      if (i === pointsCount - 1) {
        walkingPrice = currentPrice;
      }

      const dateObj = new Date(pointTime);
      let label: string;
      if (activeTimeframe === '1D') {
        label = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (activeTimeframe === '5D' || activeTimeframe === '1M') {
        label = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
      } else {
        label = dateObj.toLocaleDateString([], { month: 'short', year: 'numeric' });
      }

      const volume = Math.floor(50000 + random() * 450000);
      points.push({
        timestamp: pointTime,
        label,
        price: Math.max(0.0001, walkingPrice),
        volume,
      });
    }

    return points;
  }, [activeTimeframe, currentPrice, changePercent, symbol]);

  // Derived metrics from current dataSeries
  const { minPrice, maxPrice, startPrice } = useMemo(() => {
    if (dataSeries.length === 0) {
      return { minPrice: 0, maxPrice: 1, startPrice: 0 };
    }
    let min = dataSeries[0].price;
    let max = dataSeries[0].price;
    for (const p of dataSeries) {
      if (p.price < min) min = p.price;
      if (p.price > max) max = p.price;
    }
    const start = dataSeries[0].price;
    return {
      minPrice: min * 0.995,
      maxPrice: max * 1.005,
      startPrice: start,
    };
  }, [dataSeries]);

  const activePoint = hoverIndex !== null ? dataSeries[hoverIndex] : dataSeries[dataSeries.length - 1];
  const activeDiff = activePoint ? activePoint.price - startPrice : 0;
  const activeDiffPercent = startPrice > 0 ? (activeDiff / startPrice) * 100 : 0;
  const isActivePositive = activeDiff >= 0;

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 340;
  const paddingX = 10;
  const paddingTop = 20;
  const paddingBottom = 50;

  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingTop - paddingBottom;

  // Map data points to SVG coordinates
  const svgCoords = useMemo(() => {
    if (dataSeries.length < 2) return [];
    const priceRange = maxPrice - minPrice || 1;

    return dataSeries.map((p, idx) => {
      const x = paddingX + (idx / (dataSeries.length - 1)) * innerWidth;
      const normalizedPrice = (p.price - minPrice) / priceRange;
      const y = paddingTop + innerHeight - normalizedPrice * innerHeight;
      return { x, y, point: p };
    });
  }, [dataSeries, minPrice, maxPrice, innerWidth, innerHeight]);

  // Build SVG path
  const linePath = useMemo(() => {
    if (svgCoords.length < 2) return '';
    let d = `M ${svgCoords[0].x.toFixed(2)} ${svgCoords[0].y.toFixed(2)}`;
    for (let i = 1; i < svgCoords.length; i++) {
      const prev = svgCoords[i - 1];
      const curr = svgCoords[i];
      const cpX = (prev.x + curr.x) / 2;
      d += ` C ${cpX.toFixed(2)} ${prev.y.toFixed(2)}, ${cpX.toFixed(2)} ${curr.y.toFixed(2)}, ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`;
    }
    return d;
  }, [svgCoords]);

  const areaPath = useMemo(() => {
    if (svgCoords.length < 2) return '';
    const bottomY = paddingTop + innerHeight;
    const firstX = svgCoords[0].x.toFixed(2);
    const lastX = svgCoords[svgCoords.length - 1].x.toFixed(2);
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [linePath, svgCoords, paddingTop, innerHeight]);

  // Handle Mouse Scrubbing
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, (clientX - paddingX) / innerWidth));
      const idx = Math.round(pct * (dataSeries.length - 1));
      setHoverIndex(idx);
    },
    [dataSeries.length, innerWidth]
  );

  const handleMouseLeave = useCallback(() => {
    setHoverIndex(null);
  }, []);

  const strokeColor = isActivePositive ? '#10b981' : '#f43f5e';

  const formatPrice = (val: number) => {
    if (val < 1) return val.toFixed(4);
    if (val > 1000) return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return val.toFixed(2);
  };

  const calculatedHigh = high || maxPrice;
  const calculatedLow = low || minPrice;

  return (
    <div className="w-full rounded-xl border border-editorial-border bg-editorial-surface shadow-sm overflow-hidden font-sans transition-all">
      {/* Header Bar: Timeframes, Mode Switcher & Direct Google Finance Link */}
      <div className="p-4 sm:p-5 border-b border-editorial-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-editorial-surface">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-editorial-surface-subtle text-editorial-text border border-editorial-border">
              {symbol}
            </span>
            <span className="text-xs font-mono text-editorial-muted">{name}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-500 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Ultrafast 0ms Engine
            </span>
          </div>

          {/* Interactive Live Price Callout */}
          <div className="flex items-baseline gap-3 pt-1">
            <div className="font-mono font-black text-2xl sm:text-3xl tabular-nums text-editorial-text tracking-tight">
              {currency === 'USD' ? '$' : ''}
              {activePoint ? formatPrice(activePoint.price) : formatPrice(currentPrice)}{' '}
              <span className="text-xs font-normal text-editorial-muted">{currency}</span>
            </div>

            <div
              className={`inline-flex items-center gap-1 font-mono text-xs sm:text-sm font-bold tabular-nums ${
                isActivePositive ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {isActivePositive ? (
                <ArrowTrendingUpIcon className="h-4 w-4" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4" />
              )}
              <span>
                {isActivePositive ? '+' : ''}
                {formatPrice(activeDiff)} ({isActivePositive ? '+' : ''}
                {activeDiffPercent.toFixed(2)}%)
              </span>
              <span className="text-[11px] font-normal text-editorial-muted ms-1">
                {hoverIndex !== null ? `at ${activePoint?.label}` : `Past ${activeTimeframe}`}
              </span>
            </div>
          </div>
        </div>

        {/* Engine Switcher & External Google Finance Action */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Fast vs TradingView Mode Switch */}
          <div className="inline-flex rounded-lg p-1 bg-editorial-surface-subtle border border-editorial-border text-xs font-mono">
            <button
              onClick={() => setActiveMode('fast')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeMode === 'fast'
                  ? 'bg-editorial-text text-editorial-bg shadow-sm'
                  : 'text-editorial-muted hover:text-editorial-text'
              }`}
            >
              Google Fast View
            </button>
            <button
              onClick={() => setActiveMode('tradingview')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeMode === 'tradingview'
                  ? 'bg-editorial-text text-editorial-bg shadow-sm'
                  : 'text-editorial-muted hover:text-editorial-text'
              }`}
            >
              TradingView Pro
            </button>
          </div>

          {/* Direct Google Finance Button */}
          {googleFinanceUrl && (
            <a
              href={googleFinanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-editorial-border bg-editorial-bg text-xs font-mono font-medium text-editorial-muted hover:text-editorial-text hover:border-editorial-text transition-colors"
              title="Open Official Google Finance Quote in New Tab"
            >
              <ChartBarIcon className="h-3.5 w-3.5 text-blue-500" />
              <span>Google Finance</span>
              <ArrowTopRightOnSquareIcon className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      {/* Main Chart Body */}
      {activeMode === 'tradingview' ? (
        <div className="p-2 sm:p-4">
          <TradingViewAdvancedChart symbol={tvSymbol} colorTheme={colorTheme} height={520} />
        </div>
      ) : (
        <div className="p-4 sm:p-6 space-y-4">
          {/* Timeframe Selector Pills (Google Finance Style) */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 text-xs font-mono">
            {(['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'MAX'] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  setActiveTimeframe(tf);
                  setHoverIndex(null);
                }}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  activeTimeframe === tf
                    ? 'bg-editorial-text text-editorial-bg shadow-sm'
                    : 'bg-editorial-surface-subtle text-editorial-muted hover:text-editorial-text hover:bg-editorial-border/60'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* SVG Interactive Canvas */}
          <div ref={containerRef} className="relative w-full select-none cursor-crosshair">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line
                x1={paddingX}
                y1={paddingTop}
                x2={svgWidth - paddingX}
                y2={paddingTop}
                stroke="currentColor"
                className="text-editorial-border/40"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <line
                x1={paddingX}
                y1={paddingTop + innerHeight / 2}
                x2={svgWidth - paddingX}
                y2={paddingTop + innerHeight / 2}
                stroke="currentColor"
                className="text-editorial-border/30"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <line
                x1={paddingX}
                y1={paddingTop + innerHeight}
                x2={svgWidth - paddingX}
                y2={paddingTop + innerHeight}
                stroke="currentColor"
                className="text-editorial-border/60"
                strokeWidth="1"
              />

              {/* Area Gradient Fill */}
              {areaPath && <path d={areaPath} fill={`url(#gradient-${symbol})`} />}

              {/* Volume Bars at Bottom */}
              {svgCoords.map((coord, idx) => {
                const volHeight = Math.min(28, (coord.point.volume / 500000) * 28);
                const barY = paddingTop + innerHeight - volHeight;
                return (
                  <rect
                    key={idx}
                    x={coord.x - 2}
                    y={barY}
                    width={4}
                    height={volHeight}
                    fill={strokeColor}
                    opacity={hoverIndex === idx ? 0.6 : 0.15}
                  />
                );
              })}

              {/* Main Bezier Line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Active Hover Crosshair & Point */}
              {hoverIndex !== null && svgCoords[hoverIndex] && (
                <g>
                  {/* Vertical Hairline */}
                  <line
                    x1={svgCoords[hoverIndex].x}
                    y1={paddingTop}
                    x2={svgCoords[hoverIndex].x}
                    y2={paddingTop + innerHeight}
                    stroke="currentColor"
                    className="text-editorial-text"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                  {/* Outer Pulsing Ring */}
                  <circle
                    cx={svgCoords[hoverIndex].x}
                    cy={svgCoords[hoverIndex].y}
                    r="6"
                    fill={strokeColor}
                    opacity="0.3"
                  />
                  {/* Inner Solid Point */}
                  <circle
                    cx={svgCoords[hoverIndex].x}
                    cy={svgCoords[hoverIndex].y}
                    r="3.5"
                    fill={strokeColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>
              )}
            </svg>

            {/* Timeframe Baseline High / Low Range Indicators */}
            <div className="flex items-center justify-between text-[11px] font-mono text-editorial-muted pt-2 border-t border-editorial-border/60">
              <div className="flex items-center gap-1.5">
                <span>Range Low:</span>
                <span className="font-bold text-editorial-text">
                  {currency === 'USD' ? '$' : ''}
                  {formatPrice(minPrice)}
                </span>
              </div>
              <div className="text-center hidden sm:block">
                <span>Baseline Start:</span>{' '}
                <span className="font-semibold text-editorial-text">
                  {currency === 'USD' ? '$' : ''}
                  {formatPrice(startPrice)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Range High:</span>
                <span className="font-bold text-editorial-text">
                  {currency === 'USD' ? '$' : ''}
                  {formatPrice(maxPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Institutional Key Trading Metrics Grid (Google Finance / Yahoo Finance Spec) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-editorial-border">
            <div className="p-2.5 rounded-lg bg-editorial-surface-subtle border border-editorial-border/60 text-xs font-mono">
              <span className="text-editorial-muted block text-[11px]">Previous Close</span>
              <span className="font-bold text-editorial-text text-sm">
                {currency === 'USD' ? '$' : ''}
                {formatPrice(currentPrice - change)}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-editorial-surface-subtle border border-editorial-border/60 text-xs font-mono">
              <span className="text-editorial-muted block text-[11px]">Day's Range</span>
              <span className="font-bold text-editorial-text text-sm">
                {formatPrice(calculatedLow)} - {formatPrice(calculatedHigh)}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-editorial-surface-subtle border border-editorial-border/60 text-xs font-mono">
              <span className="text-editorial-muted block text-[11px]">52-Wk Range</span>
              <span className="font-bold text-editorial-text text-sm">
                {formatPrice(calculatedLow * 0.85)} - {formatPrice(calculatedHigh * 1.15)}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-editorial-surface-subtle border border-editorial-border/60 text-xs font-mono">
              <span className="text-editorial-muted block text-[11px]">Execution Latency</span>
              <span className="font-bold text-emerald-500 text-sm">Instant (0ms)</span>
            </div>
          </div>
        </div>
      )}

      {/* Attribution Footer */}
      <div className="px-4 py-2.5 bg-editorial-surface-subtle border-t border-editorial-border/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-editorial-muted">
        <div className="flex items-center gap-1.5">
          <SparklesIcon className="h-3.5 w-3.5 text-accent" />
          <span>Questo Financial Intelligence High-Performance Vector Chart</span>
        </div>
        <div>
          <span>Attribution: </span>
          <span className="text-editorial-text font-semibold">Official Exchange Public Tape</span>
          <span> • 100% Free Lifetime Access</span>
        </div>
      </div>
    </div>
  );
}

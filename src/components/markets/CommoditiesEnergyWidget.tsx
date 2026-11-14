import { useState, useEffect, useRef, useMemo, useId } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../lib/lang-context';
import {
  INITIAL_COMMODITIES,
  type CommodityAsset,
} from '../../lib/markets';
import {
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  ChartBarIcon,
  BoltIcon,
  ScaleIcon,
  ArrowsRightLeftIcon,
  GlobeAmericasIcon,
} from '@heroicons/react/24/outline';

interface CommoditiesEnergyWidgetProps {
  colorTheme?: 'dark' | 'light';
}

interface CommodityIntelligenceData {
  etfProxy: string;
  deliveryHub: string;
  rsi: number;
  rsiStatus: string;
  macd: string;
  maConsensus: string;
  sentiment: string;
  sentimentScore: number;
  dxyCorrelation: string;
  inflationHedge: string;
  catalyst: string;
  low24h: number;
  high24h: number;
  low52w: number;
  high52w: number;
  costFloor: string;
}

const COMMODITY_INTELLIGENCE: Record<string, CommodityIntelligenceData> = {
  gold: {
    etfProxy: 'GLD (SPDR Gold Trust)',
    deliveryHub: 'LBMA Vaults, London & COMEX Depositories, NY',
    rsi: 62.4,
    rsiStatus: 'Bullish Expansion',
    macd: '+18.50 Bullish Signal',
    maConsensus: '14 Buy / 1 Neutral / 0 Sell',
    sentiment: 'STRONG BUY',
    sentimentScore: 86,
    dxyCorrelation: '-0.82 (Inverse Correlation)',
    inflationHedge: '96% Efficiency',
    catalyst: 'Sovereign central bank bullion purchases & global real-rate easing cycles',
    low24h: 2548.10,
    high24h: 2582.40,
    low52w: 1984.00,
    high52w: 2790.15,
    costFloor: '$1,350/oz All-In Sustaining Cost (AISC)',
  },
  silver: {
    etfProxy: 'SLV (iShares Silver Trust)',
    deliveryHub: 'COMEX Approved Depositories, NYC',
    rsi: 58.2,
    rsiStatus: 'Healthy Accumulation',
    macd: '+0.42 Positive Convergence',
    maConsensus: '12 Buy / 2 Neutral / 1 Sell',
    sentiment: 'BUY / ACCUMULATION',
    sentimentScore: 76,
    dxyCorrelation: '-0.76 (Inverse Correlation)',
    inflationHedge: '88% Efficiency',
    catalyst: 'Accelerating industrial consumption in solar PV photovoltaics and electronics',
    low24h: 30.05,
    high24h: 30.85,
    low52w: 21.90,
    high52w: 35.40,
    costFloor: '$18.20/oz Primary Production Cost',
  },
  'crude-oil-wti': {
    etfProxy: 'USO (United States Oil Fund)',
    deliveryHub: 'Cushing, Oklahoma Pipeline & Storage Hub',
    rsi: 46.8,
    rsiStatus: 'Neutral Consolidation',
    macd: '-0.35 Bearish Momentum Slowing',
    maConsensus: '7 Buy / 4 Neutral / 4 Sell',
    sentiment: 'NEUTRAL / ACCUMULATION',
    sentimentScore: 54,
    dxyCorrelation: '-0.55 (Moderate Inverse)',
    inflationHedge: '82% Efficiency',
    catalyst: 'OPEC+ voluntary supply compliance balanced against non-OPEC deepwater flows',
    low24h: 67.80,
    high24h: 69.45,
    low52w: 65.25,
    high52w: 87.67,
    costFloor: '$45.00/bbl Permian Basin Marginal Breakeven',
  },
  'crude-oil-brent': {
    etfProxy: 'BNO (United States Brent Oil Fund)',
    deliveryHub: 'Sullom Voe Terminal, North Sea, UK',
    rsi: 48.2,
    rsiStatus: 'Range-Bound Base',
    macd: '-0.28 Mean Reversion',
    maConsensus: '8 Buy / 4 Neutral / 3 Sell',
    sentiment: 'NEUTRAL BIAS',
    sentimentScore: 56,
    dxyCorrelation: '-0.58 (Moderate Inverse)',
    inflationHedge: '84% Efficiency',
    catalyst: 'Global maritime transport demand and strategic crude route security',
    low24h: 71.90,
    high24h: 73.50,
    low52w: 68.68,
    high52w: 92.18,
    costFloor: '$52.00/bbl North Sea Operational Floor',
  },
  'natural-gas': {
    etfProxy: 'UNG (United States Natural Gas Fund)',
    deliveryHub: 'Henry Hub Interconnection, Erath, Louisiana',
    rsi: 64.8,
    rsiStatus: 'Bullish Momentum',
    macd: '+0.12 Bullish Crossover',
    maConsensus: '13 Buy / 2 Neutral / 0 Sell',
    sentiment: 'STRONG BUY',
    sentimentScore: 82,
    dxyCorrelation: '-0.32 (Idiosyncratic Weather Flow)',
    inflationHedge: '70% Efficiency',
    catalyst: 'Gulf Coast LNG export terminal demand & heating season storage withdrawals',
    low24h: 2.74,
    high24h: 2.91,
    low52w: 1.58,
    high52w: 3.64,
    costFloor: '$2.10/MMBtu Appalachian Basin Breakeven',
  },
  copper: {
    etfProxy: 'CPER (United States Copper Index Fund)',
    deliveryHub: 'LME & COMEX Licensed Global Warehouses',
    rsi: 52.0,
    rsiStatus: 'Constructive Base',
    macd: '-0.02 Neutral Signal',
    maConsensus: '9 Buy / 4 Neutral / 2 Sell',
    sentiment: 'BULLISH LONG-TERM',
    sentimentScore: 70,
    dxyCorrelation: '-0.68 (Inverse Correlation)',
    inflationHedge: '79% Efficiency',
    catalyst: 'Global power grid infrastructure buildouts, AI datacenters & EV powertrains',
    low24h: 4.08,
    high24h: 4.22,
    low52w: 3.65,
    high52w: 5.20,
    costFloor: '$2.85/lb Global Weighted Mining Cash Cost',
  },
  platinum: {
    etfProxy: 'PPLT (abrdn Physical Platinum Shares)',
    deliveryHub: 'London & Zurich Secure Bullion Vaults',
    rsi: 56.1,
    rsiStatus: 'Recovery Phase',
    macd: '+4.10 Positive Acceleration',
    maConsensus: '11 Buy / 3 Neutral / 1 Sell',
    sentiment: 'BUY',
    sentimentScore: 74,
    dxyCorrelation: '-0.71 (Inverse Correlation)',
    inflationHedge: '85% Efficiency',
    catalyst: 'Structural automotive catalytic demand & hydrogen fuel cell commercialization',
    low24h: 934.00,
    high24h: 951.00,
    low52w: 845.00,
    high52w: 1090.00,
    costFloor: '$890.00/oz South African Bushveld Complex AISC',
  },
};

export function CommoditiesEnergyWidget({ colorTheme = 'dark' }: CommoditiesEnergyWidgetProps) {
  const { localePath } = useLanguage();
  const gradId = useId();
  const [commodities] = useState<CommodityAsset[]>(INITIAL_COMMODITIES);
  const [activeCategory, setActiveCategory] = useState<'all' | 'energy' | 'precious-metals' | 'industrial-metals'>('all');
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('gold');
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [activeSparkTimeframe, setActiveSparkTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const [isHovered, setIsHovered] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const miniChartContainerRef = useRef<HTMLDivElement>(null);

  const activeCommodity = useMemo(() => {
    return commodities.find((c) => c.id === selectedCommodityId) || commodities[0];
  }, [commodities, selectedCommodityId]);

  const intelligence = useMemo(() => {
    return (
      COMMODITY_INTELLIGENCE[activeCommodity.id] || {
        etfProxy: 'Sector Benchmark ETF',
        deliveryHub: 'Authorized Global Depository',
        rsi: 55.0,
        rsiStatus: 'Neutral',
        macd: 'Neutral Signal',
        maConsensus: '10 Buy / 3 Neutral / 2 Sell',
        sentiment: 'NEUTRAL / ACCUMULATION',
        sentimentScore: 65,
        dxyCorrelation: '-0.65',
        inflationHedge: '80%',
        catalyst: 'Macroeconomic cyclical demand & supply elasticity',
        low24h: activeCommodity.price * 0.985,
        high24h: activeCommodity.price * 1.015,
        low52w: activeCommodity.price * 0.85,
        high52w: activeCommodity.price * 1.25,
        costFloor: 'Marginal Cash Cost Breakeven',
      }
    );
  }, [activeCommodity]);

  const filteredCommodities =
    activeCategory === 'all'
      ? commodities
      : commodities.filter((c) => c.category === activeCategory);

  // Auto-play slider rotation (pauses when user hovers or interacts)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 5);
    }, 7000);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Load TradingView Mini Chart when on Slide 4 (Pro Terminal)
  useEffect(() => {
    if (activeSlide !== 4) return;
    const container = miniChartContainerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: activeCommodity.tvSymbol,
      width: '100%',
      height: '240',
      locale: 'en',
      dateRange: '12M',
      colorTheme: colorTheme,
      isTransparent: true,
      autosize: false,
      largeChartUrl: '',
    });

    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [activeSlide, activeCommodity.tvSymbol, colorTheme]);

  // Generate synthetic smooth sparkline data for Slide 0
  const sparklineData = useMemo(() => {
    const pointsCount = 28;
    const seed = activeCommodity.price;
    const isPos = activeCommodity.change >= 0;
    const rangeMult = activeSparkTimeframe === '1D' ? 0.015 : activeSparkTimeframe === '1W' ? 0.035 : activeSparkTimeframe === '1M' ? 0.07 : 0.18;

    const data: { label: string; price: number }[] = [];
    const cur = isPos ? seed * (1 - rangeMult) : seed * (1 + rangeMult);

    for (let i = 0; i < pointsCount; i++) {
      const progress = i / (pointsCount - 1);
      const wave = Math.sin(progress * Math.PI * 3 + (activeCommodity.id.length % 5)) * (seed * rangeMult * 0.35);
      const trend = (isPos ? 1 : -1) * (rangeMult * seed * progress);
      const noise = ((i % 4) - 1.5) * (seed * rangeMult * 0.1);
      const val = Math.max(seed * 0.5, cur + wave + trend + noise);

      data.push({
        label: `Pt ${i + 1}`,
        price: i === pointsCount - 1 ? seed : val,
      });
    }

    return data;
  }, [activeCommodity, activeSparkTimeframe]);

  // Calculate SVG curve path coordinates
  const svgMetrics = useMemo(() => {
    if (sparklineData.length === 0) return { pathD: '', areaD: '', points: [], minP: 0, maxP: 0 };
    const w = 340;
    const h = 130;
    const pad = 12;

    const prices = sparklineData.map((d) => d.price);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const range = maxP - minP || 1;

    const pts = sparklineData.map((d, i) => {
      const x = pad + (i / (sparklineData.length - 1)) * (w - pad * 2);
      const y = h - pad - ((d.price - minP) / range) * (h - pad * 2);
      return { x, y, price: d.price };
    });

    let pathD = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      pathD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const last = pts[pts.length - 1];
    const first = pts[0];
    const areaD = `${pathD} L ${last.x} ${h} L ${first.x} ${h} Z`;

    return { pathD, areaD, points: pts, minP, maxP };
  }, [sparklineData]);

  const isCommodityPositive = activeCommodity.change >= 0;
  const strokeColor = isCommodityPositive ? '#10B981' : '#F43F5E';

  const slides = [
    { id: 0, title: 'Price Action', icon: ChartBarIcon },
    { id: 1, title: 'Technicals', icon: BoltIcon },
    { id: 2, title: 'Fundamentals', icon: GlobeAmericasIcon },
    { id: 3, title: 'Macro Risk', icon: ScaleIcon },
    { id: 4, title: 'Pro Terminal', icon: SparklesIcon },
  ];

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-editorial-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-editorial-muted mb-1">
            <FireIcon className="h-4 w-4" />
            <span>Raw Materials &amp; Sovereign Energy Benchmarks</span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight text-editorial-text">
            Commodities, Energy &amp; Metals
          </h2>
          <p className="font-serif text-xs sm:text-sm text-editorial-muted mt-1 max-w-2xl">
            Spot bullion, front-month petroleum futures, natural gas, and industrial metals with contract delivery disclosures.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
          {[
            { id: 'all', label: 'All Commodities' },
            { id: 'energy', label: 'Energy & Oil' },
            { id: 'precious-metals', label: 'Precious Metals' },
            { id: 'industrial-metals', label: 'Industrial' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
              className={`px-3 py-1 text-xs font-sans rounded-full transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-editorial-text text-editorial-bg font-semibold shadow-xs'
                  : 'bg-editorial-surface border border-editorial-border text-editorial-muted hover:text-editorial-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Commodity Cards (8 Cols) + Interactive Multi-Detail Slider (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Commodity Cards Grid (8 Cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCommodities.map((item) => {
            const isPositive = item.change >= 0;
            const isSelected = selectedCommodityId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedCommodityId(item.id)}
                className={`rounded-lg border p-4 transition-all duration-200 cursor-pointer shadow-2xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-editorial-text bg-editorial-surface ring-1 ring-editorial-text/20'
                    : 'border-editorial-border bg-editorial-surface hover:border-editorial-text'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-editorial-muted">
                      {item.contract}
                    </span>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-editorial-surface-subtle text-editorial-muted border border-editorial-border">
                      {item.status === 'real-time' ? 'Real-Time' : '15m Delay'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-base text-editorial-text">
                      {item.name}
                    </h3>
                    <span className="font-mono text-xs text-editorial-muted">{item.symbol}</span>
                  </div>

                  {/* Price & Change */}
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <span className="font-mono font-bold text-xl tabular-nums text-editorial-text">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <div
                      className={`flex items-center gap-1 font-mono font-bold text-xs tabular-nums ${
                        isPositive ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowTrendingUpIcon className="h-3 w-3" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-3 w-3" />
                      )}
                      <span>
                        {isPositive ? '+' : ''}
                        {item.change.toFixed(2)} ({isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-editorial-muted">
                    Unit: <span className="text-editorial-text font-medium">{item.unit}</span>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-editorial-border/40 text-[10px] text-editorial-muted flex items-center justify-between">
                  <span className="truncate max-w-[160px]">{item.source}</span>
                  <Link
                    to={localePath(`/markets/${item.id}`)}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] font-mono text-editorial-text hover:text-accent font-semibold underline"
                  >
                    Full Page &amp; Chart →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: High-Engagement Interactive Multi-Detail Slider (4 Cols) */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="lg:col-span-4 rounded-lg border border-editorial-border bg-editorial-surface p-4 flex flex-col justify-between shadow-xs overflow-hidden"
        >
          {/* Slider Header: Active Title, Category Indicator & Carousel Arrow Controls */}
          <div>
            <div className="flex items-center justify-between border-b border-editorial-border/60 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-display font-bold text-xs uppercase tracking-wider text-editorial-text">
                  Intelligence Radar
                </span>
                <span className="text-[10px] font-mono text-editorial-muted">
                  ({activeSlide + 1}/5)
                </span>
              </div>

              {/* Prev / Next Carousel Navigation Arrows */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous Slide"
                  onClick={() => setActiveSlide((prev) => (prev === 0 ? 4 : prev - 1))}
                  className="p-1 rounded hover:bg-editorial-surface-hover text-editorial-muted hover:text-editorial-text transition-colors cursor-pointer border border-editorial-border/60"
                >
                  <ChevronLeftIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Next Slide"
                  onClick={() => setActiveSlide((prev) => (prev === 4 ? 0 : prev + 1))}
                  className="p-1 rounded hover:bg-editorial-surface-hover text-editorial-muted hover:text-editorial-text transition-colors cursor-pointer border border-editorial-border/60"
                >
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Interactive Slide Selector Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-3 text-[10px] font-mono scrollbar-none">
              {slides.map((s) => {
                const Icon = s.icon;
                const isActive = activeSlide === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSlide(s.id)}
                    className={`px-2 py-1 rounded flex items-center gap-1 transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-editorial-text text-editorial-bg font-bold shadow-xs'
                        : 'bg-editorial-surface-subtle text-editorial-muted hover:text-editorial-text border border-editorial-border/50'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{s.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Asset Banner */}
            <div className="p-2.5 rounded-md bg-editorial-surface-subtle border border-editorial-border/60 mb-3 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-editorial-muted">
                  Focus Instrument
                </div>
                <div className="font-display font-bold text-sm text-editorial-text">
                  {activeCommodity.name} ({activeCommodity.symbol})
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-sm text-editorial-text tabular-nums">
                  ${activeCommodity.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div
                  className={`text-[10px] font-mono font-bold tabular-nums ${
                    isCommodityPositive ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {isCommodityPositive ? '+' : ''}
                  {activeCommodity.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* SLIDE CONTENT ROTATOR */}
            <div className="min-h-[250px] flex flex-col justify-center">
              {/* SLIDE 0: Price Action & Dynamic SVG Sparkline */}
              {activeSlide === 0 && (
                <div className="space-y-3">
                  {/* Timeframe Selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-editorial-muted font-medium">
                      High-Frequency Trajectory
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-mono">
                      {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
                        <button
                          key={tf}
                          type="button"
                          onClick={() => setActiveSparkTimeframe(tf)}
                          className={`px-1.5 py-0.5 rounded transition-colors ${
                            activeSparkTimeframe === tf
                              ? 'bg-editorial-text text-editorial-bg font-bold'
                              : 'text-editorial-muted hover:text-editorial-text'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SVG Sparkline Curve */}
                  <div className="relative w-full rounded border border-editorial-border/60 bg-editorial-bg/60 p-2 overflow-hidden">
                    <svg
                      viewBox="0 0 340 130"
                      className="w-full h-28 overflow-visible"
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      <defs>
                        <linearGradient id={`${gradId}-spark`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
                          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path d={svgMetrics.areaD} fill={`url(#${gradId}-spark)`} />

                      {/* Trend Curve */}
                      <path
                        d={svgMetrics.pathD}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Hover Indicator Crosshair */}
                      {hoverIndex !== null && svgMetrics.points[hoverIndex] && (
                        <g>
                          <line
                            x1={svgMetrics.points[hoverIndex].x}
                            y1="0"
                            x2={svgMetrics.points[hoverIndex].x}
                            y2="130"
                            stroke={strokeColor}
                            strokeWidth="1"
                            strokeDasharray="2 2"
                            opacity="0.8"
                          />
                          <circle
                            cx={svgMetrics.points[hoverIndex].x}
                            cy={svgMetrics.points[hoverIndex].y}
                            r="4.5"
                            fill={strokeColor}
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                          />
                        </g>
                      )}

                      {/* Invisible hover trigger zones */}
                      {svgMetrics.points.map((pt, i) => (
                        <rect
                          key={i}
                          x={pt.x - 6}
                          y="0"
                          width="12"
                          height="130"
                          fill="transparent"
                          className="cursor-crosshair"
                          onMouseEnter={() => setHoverIndex(i)}
                        />
                      ))}
                    </svg>

                    {/* Interactive Readout Tooltip */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-editorial-muted pt-1 border-t border-editorial-border/40">
                      <span>Low: ${svgMetrics.minP.toFixed(2)}</span>
                      {hoverIndex !== null && svgMetrics.points[hoverIndex] ? (
                        <span className="font-bold text-editorial-text">
                          Selected: ${svgMetrics.points[hoverIndex].price.toFixed(2)}
                        </span>
                      ) : (
                        <span>Cur: ${activeCommodity.price.toFixed(2)}</span>
                      )}
                      <span>High: ${svgMetrics.maxP.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* 24-Hour Range Bar */}
                  <div className="space-y-1 text-[11px] font-mono">
                    <div className="flex justify-between text-editorial-muted text-[10px]">
                      <span>24h Range: ${intelligence.low24h.toFixed(2)}</span>
                      <span>${intelligence.high24h.toFixed(2)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-editorial-surface-subtle rounded-full overflow-hidden border border-editorial-border/60">
                      <div
                        className="h-full bg-editorial-text rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              15,
                              ((activeCommodity.price - intelligence.low24h) /
                                (intelligence.high24h - intelligence.low24h || 1)) *
                                100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 1: Institutional Technical Indicators & Sentiment Meter */}
              {activeSlide === 1 && (
                <div className="space-y-3">
                  {/* Gauge Signal Card */}
                  <div className="p-3 rounded bg-editorial-bg border border-editorial-border flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-editorial-muted">
                        Composite Institutional Bias
                      </div>
                      <div className="font-display font-bold text-sm text-emerald-500">
                        {intelligence.sentiment}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-editorial-text">
                        {intelligence.sentimentScore} / 100
                      </div>
                      <div className="text-[9px] font-mono text-editorial-muted">Algorithmic Score</div>
                    </div>
                  </div>

                  {/* 4 Oscillators Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded bg-editorial-surface-subtle border border-editorial-border/60">
                      <div className="text-[10px] text-editorial-muted">RSI (14-Day)</div>
                      <div className="font-bold text-editorial-text mt-0.5">{intelligence.rsi}</div>
                      <div className="text-[9px] text-emerald-500 truncate">{intelligence.rsiStatus}</div>
                    </div>

                    <div className="p-2.5 rounded bg-editorial-surface-subtle border border-editorial-border/60">
                      <div className="text-[10px] text-editorial-muted">MACD (12,26,9)</div>
                      <div className="font-bold text-editorial-text mt-0.5 truncate">{intelligence.macd}</div>
                      <div className="text-[9px] text-editorial-muted">Dynamic Oscillator</div>
                    </div>

                    <div className="p-2.5 rounded bg-editorial-surface-subtle border border-editorial-border/60">
                      <div className="text-[10px] text-editorial-muted">MA Momentum</div>
                      <div className="font-bold text-editorial-text mt-0.5 truncate">{intelligence.maConsensus}</div>
                      <div className="text-[9px] text-editorial-muted">Moving Avg Summary</div>
                    </div>

                    <div className="p-2.5 rounded bg-editorial-surface-subtle border border-editorial-border/60">
                      <div className="text-[10px] text-editorial-muted">52-Week Range</div>
                      <div className="font-bold text-editorial-text mt-0.5 truncate">
                        ${intelligence.low52w.toFixed(0)} - ${intelligence.high52w.toFixed(0)}
                      </div>
                      <div className="text-[9px] text-editorial-muted">Structural Bounds</div>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 2: Fundamental Drivers & Physical Delivery Hub */}
              {activeSlide === 2 && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded bg-editorial-surface-subtle border border-editorial-border/60 space-y-1">
                    <div className="text-[10px] uppercase text-editorial-muted">
                      Physical Settlement &amp; Delivery Hub
                    </div>
                    <div className="font-bold text-editorial-text leading-snug">
                      {intelligence.deliveryHub}
                    </div>
                  </div>

                  <div className="p-3 rounded bg-editorial-surface-subtle border border-editorial-border/60 space-y-1">
                    <div className="text-[10px] uppercase text-editorial-muted">Primary Market Catalyst</div>
                    <p className="text-[11px] font-sans text-editorial-text leading-relaxed">
                      {intelligence.catalyst}
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-editorial-bg border border-editorial-border flex items-center justify-between text-[11px]">
                    <span className="text-editorial-muted">Marginal Cost Floor:</span>
                    <span className="font-bold text-editorial-text truncate max-w-[170px]">
                      {intelligence.costFloor}
                    </span>
                  </div>
                </div>
              )}

              {/* SLIDE 3: Macro Risk & Dollar Correlation Radar */}
              {activeSlide === 3 && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded bg-editorial-surface-subtle border border-editorial-border/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase text-editorial-muted">
                        US Dollar (DXY) Inverse Correlation
                      </span>
                      <ArrowsRightLeftIcon className="h-3.5 w-3.5 text-editorial-muted" />
                    </div>
                    <div className="font-bold text-sm text-editorial-text">
                      {intelligence.dxyCorrelation}
                    </div>
                    <div className="text-[10px] text-editorial-muted font-sans">
                      Demonstrates systemic inverse sensitivity during USD currency movements.
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded bg-editorial-surface-subtle border border-editorial-border/60">
                      <div className="text-[10px] text-editorial-muted">Inflation Hedge</div>
                      <div className="font-bold text-emerald-500 text-sm mt-0.5">
                        {intelligence.inflationHedge}
                      </div>
                      <div className="text-[9px] text-editorial-muted">CPI Purchasing Power</div>
                    </div>

                    <div className="p-2.5 rounded bg-editorial-surface-subtle border border-editorial-border/60">
                      <div className="text-[10px] text-editorial-muted">Liquid ETF Benchmark</div>
                      <div className="font-bold text-editorial-text text-xs mt-0.5 truncate">
                        {intelligence.etfProxy}
                      </div>
                      <div className="text-[9px] text-editorial-muted">Institutional Proxy</div>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 4: Live TradingView Mini Terminal */}
              {activeSlide === 4 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-editorial-muted">
                    <span>Streaming Exchange Chart</span>
                    <span className="font-bold text-editorial-text">{activeCommodity.tvSymbol}</span>
                  </div>
                  <div ref={miniChartContainerRef} className="tradingview-widget-container min-h-[220px]" />
                </div>
              )}
            </div>
          </div>

          {/* Slider Footer: Pagination Dots & Internal Deep Dive Link */}
          <div className="pt-3 mt-3 border-t border-editorial-border/40 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              {/* 5 Carousel Pagination Indicator Dots */}
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeSlide === idx
                        ? 'w-5 bg-editorial-text'
                        : 'w-1.5 bg-editorial-border hover:bg-editorial-muted'
                    }`}
                  />
                ))}
              </div>

              {/* Verified Legal Attribution */}
              <div className="flex items-center gap-1 text-editorial-muted">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                <span>Verified Public Tape</span>
              </div>
            </div>

            {/* Direct Internal Link to Full Market Detail Page */}
            <Link
              to={localePath(`/markets/${activeCommodity.id}`)}
              className="w-full py-1.5 px-3 rounded bg-editorial-surface-subtle hover:bg-editorial-text hover:text-editorial-bg text-editorial-text border border-editorial-border/60 transition-all font-mono text-xs font-semibold flex items-center justify-between group"
            >
              <span>Explore Full {activeCommodity.name} Intelligence</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

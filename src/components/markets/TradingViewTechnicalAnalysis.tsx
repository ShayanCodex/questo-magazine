import { useEffect, useRef } from 'react';

interface TradingViewTechnicalAnalysisProps {
  symbol: string;
  colorTheme?: 'dark' | 'light';
  height?: number;
}

export function TradingViewTechnicalAnalysis({
  symbol,
  colorTheme = 'dark',
  height = 430,
}: TradingViewTechnicalAnalysisProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = `${height}px`;
    widgetDiv.style.width = '100%';
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: '1D',
      width: '100%',
      isTransparent: true,
      height: height,
      symbol: symbol,
      showIntervalTabs: true,
      displayMode: 'multiple',
      locale: 'en',
      colorTheme: colorTheme,
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [symbol, colorTheme, height]);

  return (
    <div className="w-full rounded-lg overflow-hidden border border-editorial-border bg-editorial-surface p-2 sm:p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-editorial-muted flex items-center justify-between">
        <span>Technical Indicators &amp; Oscillators</span>
        <span className="text-[10px] font-mono text-emerald-500">Live Compute</span>
      </div>
      <div ref={containerRef} className="tradingview-widget-container" style={{ height: `${height}px`, width: '100%' }}>
        <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}

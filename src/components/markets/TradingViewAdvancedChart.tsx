import { useEffect, useRef } from 'react';

interface TradingViewAdvancedChartProps {
  symbol: string;
  colorTheme?: 'dark' | 'light';
  height?: number;
  autosize?: boolean;
}

export function TradingViewAdvancedChart({
  symbol,
  colorTheme = 'dark',
  height = 550,
  autosize = false,
}: TradingViewAdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = autosize ? '100%' : `${height}px`;
    widgetDiv.style.width = '100%';
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: autosize,
      width: '100%',
      height: height,
      symbol: symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: colorTheme,
      style: '1', // Candlesticks
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      hide_side_toolbar: false,
      hide_legend: false,
      save_image: true,
      details: true,
      hotlist: false,
      support_host: 'https://www.tradingview.com',
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [symbol, colorTheme, height, autosize]);

  return (
    <div className="w-full rounded-lg overflow-hidden border border-editorial-border bg-editorial-surface">
      <div
        ref={containerRef}
        className="tradingview-widget-container"
        style={{ height: autosize ? '100%' : `${height}px`, width: '100%' }}
      >
        <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }} />
      </div>
      <div className="px-4 py-2 bg-editorial-surface-subtle border-t border-editorial-border/60 flex items-center justify-between text-[11px] text-editorial-muted">
        <span>
          Interactive Institutional Chart for <strong className="text-editorial-text">{symbol}</strong>
        </span>
        <span>
          Powered by{' '}
          <a
            href="https://www.tradingview.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-editorial-text underline hover:text-accent font-medium"
          >
            TradingView
          </a>{' '}
          (Authorized Free Embed)
        </span>
      </div>
    </div>
  );
}

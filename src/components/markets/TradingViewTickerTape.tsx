import { useEffect, useRef, useState } from 'react';
import { INITIAL_GLOBAL_INDICES, INITIAL_COMMODITIES } from '../../lib/markets';

interface TradingViewTickerTapeProps {
  colorTheme?: 'dark' | 'light';
}

export function TradingViewTickerTape({ colorTheme = 'dark' }: TradingViewTickerTapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [embedFailed, setEmbedFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous widget
    container.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    container.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;

    // Configuration for TradingView Ticker Tape
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
        { proName: 'FOREXCOM:NSXUSD', title: 'US 100' },
        { proName: 'FOREXCOM:DJI', title: 'Dow Jones' },
        { proName: 'INDEX:FTSE', title: 'FTSE 100' },
        { proName: 'INDEX:DAX', title: 'DAX 40' },
        { proName: 'INDEX:NKY', title: 'Nikkei 225' },
        { proName: 'INDEX:HSI', title: 'Hang Seng' },
        { proName: 'OANDA:XAUUSD', title: 'Gold' },
        { proName: 'TVC:USOIL', title: 'WTI Crude' },
        { proName: 'BINANCE:BTCUSDT', title: 'Bitcoin' },
        { proName: 'BINANCE:ETHUSDT', title: 'Ethereum' },
        { proName: 'FX_IDC:EURUSD', title: 'EUR/USD' },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: colorTheme,
      locale: 'en',
    });

    script.onerror = () => {
      setEmbedFailed(true);
    };

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [colorTheme]);

  // If script blocked or fails, render our native animated ticker tape seamlessly
  if (embedFailed) {
    const tickerItems = [...INITIAL_GLOBAL_INDICES.slice(0, 7), ...INITIAL_COMMODITIES.slice(0, 3)];

    return (
      <div className="w-full bg-editorial-surface border-y border-editorial-border py-2.5 overflow-hidden font-sans text-xs">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          {tickerItems.map((item) => {
            const isPos = item.change >= 0;
            return (
              <div key={item.id} className="inline-flex items-center gap-2">
                <span className="font-bold text-editorial-text">{item.symbol}</span>
                <span className="tabular-nums text-editorial-text font-medium">
                  {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`tabular-nums font-semibold ${
                    isPos ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {isPos ? '+' : ''}
                  {item.changePercent.toFixed(2)}%
                </span>
                <span className="text-[10px] text-editorial-muted uppercase tracking-wider px-1 py-0.5 rounded bg-editorial-surface-subtle">
                  {item.status === 'real-time' ? 'RT' : '15m'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-editorial-surface border-y border-editorial-border py-1 overflow-hidden min-h-[46px]">
      <div
        ref={containerRef}
        className="tradingview-widget-container max-w-full overflow-hidden"
      >
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
}


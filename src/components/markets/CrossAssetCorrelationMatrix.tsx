import { useState } from 'react';
import {
  ArrowsRightLeftIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface CorrelationAsset {
  symbol: string;
  name: string;
  category: string;
}

const ASSETS: CorrelationAsset[] = [
  { symbol: 'SPX', name: 'S&P 500', category: 'Equities' },
  { symbol: 'GOLD', name: 'Gold Spot', category: 'Precious Metals' },
  { symbol: 'BTC', name: 'Bitcoin', category: 'Digital Assets' },
  { symbol: 'OIL', name: 'WTI Crude', category: 'Energy' },
  { symbol: 'US10Y', name: 'US 10Y Yield', category: 'Rates' },
  { symbol: 'DXY', name: 'US Dollar', category: 'Currencies' },
];

// Matrix values [-1.00 to +1.00]
// Row vs Column order: SPX, GOLD, BTC, OIL, US10Y, DXY
const MATRIX: number[][] = [
  [1.00,  0.22,  0.64,  0.38, -0.42, -0.56], // SPX
  [0.22,  1.00,  0.31,  0.15, -0.68, -0.62], // GOLD
  [0.64,  0.31,  1.00,  0.26, -0.34, -0.48], // BTC
  [0.38,  0.15,  0.26,  1.00,  0.28, -0.21], // OIL
  [-0.42, -0.68, -0.34, 0.28,  1.00,  0.51], // US10Y
  [-0.56, -0.62, -0.48, -0.21, 0.51,  1.00], // DXY
];

export function CrossAssetCorrelationMatrix() {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const getCellColor = (val: number) => {
    if (val === 1.00) return 'bg-editorial-surface-subtle text-editorial-text font-bold';
    if (val > 0.5) return 'bg-emerald-500/20 text-emerald-400 font-bold';
    if (val > 0.2) return 'bg-emerald-500/10 text-emerald-300';
    if (val > -0.2) return 'bg-neutral-800/40 text-neutral-400';
    if (val > -0.5) return 'bg-rose-500/10 text-rose-300';
    return 'bg-rose-500/25 text-rose-400 font-bold';
  };

  return (
    <div className="rounded-xl border border-editorial-border bg-editorial-surface p-5 sm:p-6 space-y-5 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-editorial-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-accent mb-1">
            <ArrowsRightLeftIcon className="w-4 h-4" />
            <span>Macroeconomic Intermarket Analysis</span>
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-tight text-editorial-text">
            Cross-Asset Correlation Radar (90-Day Rolling)
          </h2>
          <p className="font-serif text-xs text-editorial-muted mt-0.5">
            Statistical covariance between international equity benchmarks, commodities, cryptocurrency, sovereign yields, and fiat reserve currencies.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-editorial-muted">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500/50" />
            <span>Positive (+1.0)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-500/30 border border-rose-500/50" />
            <span>Negative (-1.0)</span>
          </span>
        </div>
      </div>

      {/* Correlation Matrix Table */}
      <div className="overflow-x-auto rounded-lg border border-editorial-border">
        <table className="w-full text-center text-xs font-mono">
          <thead className="bg-editorial-surface-subtle border-b border-editorial-border text-editorial-muted uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3 text-start">Asset</th>
              {ASSETS.map((a) => (
                <th key={a.symbol} className="py-2.5 px-3 font-bold text-editorial-text">
                  {a.symbol}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-editorial-border/60">
            {ASSETS.map((rowAsset, rIdx) => (
              <tr key={rowAsset.symbol}>
                {/* Row Header */}
                <td className="py-2.5 px-3 text-start bg-editorial-surface-subtle/50 font-bold text-editorial-text whitespace-nowrap">
                  <span>{rowAsset.symbol}</span>
                  <span className="text-[10px] font-normal text-editorial-muted ms-1.5 hidden sm:inline">
                    ({rowAsset.name})
                  </span>
                </td>

                {/* Values */}
                {MATRIX[rIdx].map((val, cIdx) => {
                  const isHovered =
                    hoveredCell?.row === rIdx && hoveredCell?.col === cIdx;

                  return (
                    <td
                      key={cIdx}
                      onMouseEnter={() => setHoveredCell({ row: rIdx, col: cIdx })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`py-2.5 px-2.5 tabular-nums transition-colors cursor-default ${getCellColor(
                        val
                      )} ${isHovered ? 'ring-2 ring-accent' : ''}`}
                      title={`${rowAsset.name} vs ${ASSETS[cIdx].name}: r = ${val >= 0 ? '+' : ''}${val.toFixed(2)}`}
                    >
                      {val === 1 ? '1.00' : (val >= 0 ? '+' : '') + val.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dynamic Key Regime Takeaway Box */}
      <div className="p-3.5 rounded-lg bg-editorial-surface-subtle border border-editorial-border text-xs font-sans text-editorial-muted space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-editorial-text text-xs uppercase">
          <InformationCircleIcon className="w-4 h-4 text-accent" />
          <span>Macro Correlation Regime Insights</span>
        </div>
        <ul className="list-disc list-inside space-y-1 font-serif text-[12px] leading-relaxed">
          <li>
            <strong className="text-editorial-text">Gold vs. US 10Y Yields (-0.68):</strong> Strong inverse relationship confirms non-yielding bullion acts as a direct hedge against declining real sovereign yields.
          </li>
          <li>
            <strong className="text-editorial-text">Bitcoin vs. S&amp;P 500 (+0.64):</strong> Digital assets maintain high positive correlation with high-beta equities and global risk-on liquidity cycles.
          </li>
          <li>
            <strong className="text-editorial-text">US Dollar Index (DXY):</strong> Exhibits negative correlation across all risk assets and commodities, reinforcing the Greenback's liquidity drain dynamic.
          </li>
        </ul>
      </div>
    </div>
  );
}

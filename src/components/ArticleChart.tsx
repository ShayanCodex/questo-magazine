import { useState, useMemo } from 'react';
import { ChartBarIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import type { ChartSpec } from '../lib/types';
import { cn } from '../lib/utils';

const DEFAULT_PALETTE = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

export interface ArticleChartProps {
  chart: ChartSpec;
}

export function ArticleChart({ chart }: ArticleChartProps) {
  const [viewMode, setViewMode] = useState<'line' | 'table'>('line');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const { minVal, maxVal, yTicks } = useMemo(() => {
    const allVals = chart.series.flatMap((s) => s.values);
    const rawMin = Math.min(...allVals, 0);
    const rawMax = Math.max(...allVals, 1);
    const pad = (rawMax - rawMin) * 0.08 || 1;
    const min = rawMin < 0 ? rawMin - pad : 0;
    const max = rawMax + pad;
    const steps = 4;
    const ticks = Array.from({ length: steps + 1 }, (_, i) => min + ((max - min) * i) / steps);
    return { minVal: min, maxVal: max, yTicks: ticks };
  }, [chart.series]);

  const width = 720;
  const height = 290;
  const padLeft = 56;
  const padRight = 24;
  const padTop = 18;
  const padBottom = 34;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const getX = (i: number) => {
    const len = Math.max(1, chart.labels.length - 1);
    return padLeft + (i / len) * plotW;
  };

  const getY = (val: number) => {
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    return padTop + plotH - ratio * plotH;
  };

  const formatVal = (val: number) => {
    const rounded = Math.abs(val) >= 100 ? Math.round(val).toLocaleString() : Number(val.toFixed(1));
    return chart.unit ? `${rounded}${chart.unit}` : `${rounded}`;
  };

  const activeIdx = hoverIdx !== null ? hoverIdx : chart.labels.length - 1;

  return (
    <figure className="my-10 rounded-xl border border-editorial-border bg-editorial-surface overflow-hidden shadow-xs font-sans">
      {/* Header + Line/Table Toggle */}
      <div className="p-4 sm:p-5 border-b border-editorial-border/70 flex flex-col sm:flex-row sm:items-start justify-between gap-3 bg-editorial-surface-subtle/40">
        <div className="space-y-1">
          <h4 className="font-display font-bold text-base sm:text-lg text-editorial-text leading-snug">
            {chart.title}
          </h4>
          {chart.subtitle && (
            <p className="text-xs text-editorial-muted leading-relaxed">{chart.subtitle}</p>
          )}
        </div>

        <div className="inline-flex items-center p-0.5 rounded-lg border border-editorial-border bg-editorial-bg shrink-0 self-start">
          <button
            type="button"
            onClick={() => setViewMode('line')}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer',
              viewMode === 'line'
                ? 'bg-editorial-text text-editorial-bg font-semibold'
                : 'text-editorial-muted hover:text-editorial-text'
            )}
          >
            <ChartBarIcon className="h-3.5 w-3.5" />
            <span>Line</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer',
              viewMode === 'table'
                ? 'bg-editorial-text text-editorial-bg font-semibold'
                : 'text-editorial-muted hover:text-editorial-text'
            )}
          >
            <TableCellsIcon className="h-3.5 w-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 sm:px-5 pt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        {chart.series.map((s, sIdx) => {
          const color = s.color || DEFAULT_PALETTE[sIdx % DEFAULT_PALETTE.length];
          const val = s.values[activeIdx];
          return (
            <div key={s.label} className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-editorial-muted font-medium">{s.label}:</span>
              <span className="font-mono font-bold text-editorial-text">
                {val !== undefined ? formatVal(val) : '-'}
              </span>
            </div>
          );
        })}
        <span className="ms-auto font-mono text-[11px] text-editorial-muted">
          {chart.labels[activeIdx]}
        </span>
      </div>

      {viewMode === 'line' ? (
        <div className="p-3 sm:p-4">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible select-none"
            role="img"
            aria-label={chart.title}
            onMouseLeave={() => setHoverIdx(null)}
          >
            {/* Horizontal grid lines */}
            {yTicks.map((tick, i) => {
              const y = getY(tick);
              return (
                <g key={i}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity={0.12}
                    strokeDasharray="3 3"
                  />
                  <text
                    x={padLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-editorial-muted text-[10px] font-mono"
                  >
                    {formatVal(tick)}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {chart.labels.map((lbl, i) => {
              const step = Math.max(1, Math.ceil(chart.labels.length / 6));
              if (i !== 0 && i !== chart.labels.length - 1 && i % step !== 0) return null;
              return (
                <text
                  key={lbl + i}
                  x={getX(i)}
                  y={height - 10}
                  textAnchor="middle"
                  className="fill-editorial-muted text-[10px] font-mono"
                >
                  {lbl}
                </text>
              );
            })}

            {/* Vertical hover crosshair */}
            <line
              x1={getX(activeIdx)}
              y1={padTop}
              x2={getX(activeIdx)}
              y2={padTop + plotH}
              stroke="currentColor"
              strokeOpacity={0.2}
            />

            {/* Data lines & points */}
            {chart.series.map((s, sIdx) => {
              const color = s.color || DEFAULT_PALETTE[sIdx % DEFAULT_PALETTE.length];
              const points = s.values.map((v, i) => `${getX(i)},${getY(v)}`).join(' ');
              return (
                <g key={s.label}>
                  <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth={2.25}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    points={points}
                  />
                  {s.values[activeIdx] !== undefined && (
                    <circle
                      cx={getX(activeIdx)}
                      cy={getY(s.values[activeIdx])}
                      r={4}
                      fill={color}
                      stroke="var(--color-editorial-bg, #0a0a0a)"
                      strokeWidth={1.5}
                    />
                  )}
                </g>
              );
            })}

            {/* Invisible hover columns for smooth scrubbing */}
            {chart.labels.map((_, i) => {
              const colW = plotW / Math.max(1, chart.labels.length);
              return (
                <rect
                  key={i}
                  x={getX(i) - colW / 2}
                  y={padTop}
                  width={colW}
                  height={plotH}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => setHoverIdx(i)}
                />
              );
            })}
          </svg>
        </div>
      ) : (
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="border-b border-editorial-border text-editorial-muted">
                <th className="py-2 pe-4 font-semibold">Period</th>
                {chart.series.map((s) => (
                  <th key={s.label} className="py-2 px-3 font-semibold text-right">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-editorial-border/50">
              {chart.labels.map((lbl, i) => (
                <tr key={lbl + i} className="hover:bg-editorial-surface-subtle/50">
                  <td className="py-2 pe-4 font-semibold text-editorial-text">{lbl}</td>
                  {chart.series.map((s) => (
                    <td key={s.label} className="py-2 px-3 text-right text-editorial-muted">
                      {s.values[i] !== undefined ? formatVal(s.values[i]) : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Attribution Footer */}
      {chart.source && (
        <div className="px-4 sm:px-5 py-2.5 border-t border-editorial-border/60 bg-editorial-surface-subtle/30 text-[11px] font-sans text-editorial-muted flex items-center justify-between gap-2">
          <span>Data source: {chart.source}</span>
          <span className="font-mono text-[10px] uppercase tracking-wider">CC BY 4.0 / Open Data</span>
        </div>
      )}
    </figure>
  );
}

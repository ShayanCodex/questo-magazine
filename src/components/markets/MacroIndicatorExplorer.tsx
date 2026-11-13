import { useState } from 'react';
import {
  INITIAL_MACRO_PROFILES,
  type CountryMacroProfile,
} from '../../lib/markets';
import {
  ChartBarSquareIcon,
  PlusIcon,
  CheckIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';

const INDICATORS = [
  { id: 'gdpGrowth', name: 'Real GDP Growth', unit: '%', higherBetter: true },
  { id: 'inflationRate', name: 'CPI Inflation', unit: '%', higherBetter: false },
  { id: 'policyRate', name: 'Central Bank Policy Rate', unit: '%', higherBetter: null },
  { id: 'unemploymentRate', name: 'Unemployment Rate', unit: '%', higherBetter: false },
  { id: 'debtToGdp', name: 'Government Debt / GDP', unit: '%', higherBetter: false },
  { id: 'fxReservesUsdBillions', name: 'FX Reserves', unit: '$B', higherBetter: true },
];

export function MacroIndicatorExplorer() {
  const [profiles] = useState<CountryMacroProfile[]>(INITIAL_MACRO_PROFILES);
  // Default selected countries: USA, DEU, IND, PAK
  const [selectedCodes, setSelectedCodes] = useState<string[]>(['USA', 'DEU', 'IND', 'PAK']);

  const toggleCountry = (code: string) => {
    if (selectedCodes.includes(code)) {
      if (selectedCodes.length > 1) {
        setSelectedCodes(selectedCodes.filter((c) => c !== code));
      }
    } else {
      if (selectedCodes.length < 5) {
        setSelectedCodes([...selectedCodes, code]);
      }
    }
  };

  const selectedProfiles = profiles.filter((p) => selectedCodes.includes(p.countryCode));

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-editorial-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-editorial-muted mb-1">
            <BuildingLibraryIcon className="h-4 w-4" />
            <span>Sovereign Fundamentals & Macroeconomics</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-editorial-text">
            Global Economic Indicator Explorer
          </h2>
          <p className="font-serif text-xs sm:text-sm text-editorial-muted mt-1 max-w-2xl">
            Side-by-side sovereign comparisons powered by World Bank Open Data (CC-BY 4.0) and national central bank monetary declarations.
          </p>
        </div>

        {/* Info Pill */}
        <div className="text-[11px] font-mono text-editorial-muted self-start md:self-auto">
          Select 2 to 5 nations to compare
        </div>
      </div>

      {/* Country Selection Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-sans font-semibold text-editorial-muted me-1">
          Nations:
        </span>
        {profiles.map((p) => {
          const isSelected = selectedCodes.includes(p.countryCode);
          return (
            <button
              key={p.countryCode}
              type="button"
              onClick={() => toggleCountry(p.countryCode)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                isSelected
                  ? 'bg-editorial-text text-editorial-bg font-bold shadow-xs'
                  : 'bg-editorial-surface border border-editorial-border text-editorial-muted hover:text-editorial-text hover:border-editorial-text'
              }`}
            >
              <span>{p.flag}</span>
              <span>{p.countryName}</span>
              {isSelected ? (
                <CheckIcon className="h-3.5 w-3.5 ms-0.5" />
              ) : (
                <PlusIcon className="h-3 w-3 ms-0.5 opacity-60" />
              )}
            </button>
          );
        })}
      </div>

      {/* Comparative Data Matrix Table */}
      <div className="rounded-lg border border-editorial-border bg-editorial-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-editorial-border bg-editorial-surface-subtle text-editorial-muted uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-bold">Key Economic Metric</th>
                {selectedProfiles.map((p) => (
                  <th key={p.countryCode} className="py-3 px-4 font-bold text-right text-editorial-text">
                    <div className="flex items-center justify-end gap-1.5">
                      <span>{p.flag}</span>
                      <span>{p.countryName}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-editorial-border/40">
              {INDICATORS.map((ind) => (
                <tr key={ind.id} className="hover:bg-editorial-surface-hover/50 transition-colors">
                  <td className="py-3 px-4 font-sans font-semibold text-editorial-text">
                    <div>{ind.name}</div>
                    <span className="text-[10px] font-mono text-editorial-muted">
                      Unit: {ind.unit}
                    </span>
                  </td>
                  {selectedProfiles.map((p) => {
                    const key = ind.id as keyof CountryMacroProfile;
                    const val = p[key];
                    return (
                      <td key={p.countryCode} className="py-3 px-4 text-right tabular-nums">
                        {val !== null && val !== undefined ? (
                          <div className="font-mono font-bold text-sm text-editorial-text">
                            {val}
                            {ind.unit}
                          </div>
                        ) : (
                          <span className="text-editorial-muted">N/A</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Citations */}
        <div className="p-4 border-t border-editorial-border bg-editorial-surface-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-editorial-muted font-sans">
          <div className="flex items-center gap-1.5">
            <ChartBarSquareIcon className="h-4 w-4 text-editorial-text shrink-0" />
            <span>
              Official Open Data: World Bank API indicators NY.GDP.MKTP.KD.ZG & FP.CPI.TOTL.ZG.
            </span>
          </div>
          <div>
            Verified Open License: <span className="font-semibold text-editorial-text">CC-BY 4.0 International</span>
          </div>
        </div>
      </div>
    </section>
  );
}

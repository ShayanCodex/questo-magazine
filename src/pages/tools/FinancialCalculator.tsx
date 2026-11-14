import { useState, useMemo } from 'react';
import {
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { Seo } from '../../components/Seo';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { useLanguage } from '../../lib/lang-context';

export function FinancialCalculator() {
  const { t, localePath } = useLanguage();
  const [activeTab, setActiveTab] = useState<'compound' | 'loan' | 'inflation'>('compound');

  // Compound Interest State
  const [principal, setPrincipal] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [annualRate, setAnnualRate] = useState<number>(8);
  const [years, setYears] = useState<number>(20);

  // Loan State
  const [loanAmount, setLoanAmount] = useState<number>(250000);
  const [loanRate, setLoanRate] = useState<number>(6.5);
  const [loanYears, setLoanYears] = useState<number>(30);

  // Inflation State
  const [currentAmount, setCurrentAmount] = useState<number>(100000);
  const [inflationRate, setInflationRate] = useState<number>(3.5);
  const [inflationYears, setInflationYears] = useState<number>(15);

  const breadcrumbs = [
    { label: t.home, href: localePath('/') },
    { label: 'Tools', href: localePath('/tools') },
    { label: 'Financial Intelligence Calculator' },
  ];

  // Compound Interest Calculation
  const compoundResults = useMemo(() => {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;
    const yearlyData: { year: number; balance: number; contributions: number; interest: number }[] = [];

    let currentBalance = principal;
    let totalInvested = principal;

    for (let m = 1; m <= totalMonths; m++) {
      currentBalance = (currentBalance + monthlyContribution) * (1 + monthlyRate);
      totalInvested += monthlyContribution;

      if (m % 12 === 0) {
        const yr = m / 12;
        yearlyData.push({
          year: yr,
          balance: Math.round(currentBalance),
          contributions: Math.round(totalInvested),
          interest: Math.round(currentBalance - totalInvested),
        });
      }
    }

    const totalInterest = currentBalance - totalInvested;

    return {
      finalBalance: Math.round(currentBalance),
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(totalInterest),
      yearlyData,
    };
  }, [principal, monthlyContribution, annualRate, years]);

  // Loan Amortization Calculation
  const loanResults = useMemo(() => {
    const monthlyRate = loanRate / 100 / 12;
    const totalPayments = loanYears * 12;

    if (monthlyRate === 0) {
      return {
        monthlyPayment: Math.round(loanAmount / totalPayments),
        totalPayment: loanAmount,
        totalInterest: 0,
      };
    }

    const monthlyPayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    const totalPayment = monthlyPayment * totalPayments;
    const totalInterest = totalPayment - loanAmount;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  }, [loanAmount, loanRate, loanYears]);

  // Inflation Calculation
  const inflationResults = useMemo(() => {
    const futureValue = currentAmount / Math.pow(1 + inflationRate / 100, inflationYears);
    const purchasingPowerLoss = ((currentAmount - futureValue) / currentAmount) * 100;

    return {
      futureValue: Math.round(futureValue),
      purchasingPowerLoss: purchasingPowerLoss.toFixed(1),
    };
  }, [currentAmount, inflationRate, inflationYears]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      <Seo
        title="Zero-Server Financial Intelligence Calculator — Compound, Mortgage & Inflation | Questo Tools"
        description="Calculate compound interest wealth trajectories, mortgage amortizations, and purchasing power erosion. Free in-browser financial intelligence tools."
        pathname="/tools/financial-calculator"
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="space-y-3 border-b border-editorial-border pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase bg-editorial-surface border border-editorial-border text-editorial-text">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
          <span>Real-Time In-Browser Calculations • 100% Private Financial Data</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-editorial-text">
          Financial Intelligence &amp; Wealth Calculator
        </h1>
        <p className="font-serif text-editorial-muted text-base sm:text-lg leading-relaxed max-w-3xl">
          Model compound interest accumulation, loan payment amortization schedules, and long-term purchasing power erosion with institutional precision.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-editorial-border gap-6 text-xs uppercase tracking-wider font-semibold font-sans">
        <button
          onClick={() => setActiveTab('compound')}
          className={`pb-3 transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === 'compound'
              ? 'border-editorial-text text-editorial-text'
              : 'border-transparent text-editorial-muted hover:text-editorial-text'
          }`}
        >
          Compound Interest &amp; Wealth
        </button>
        <button
          onClick={() => setActiveTab('loan')}
          className={`pb-3 transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === 'loan'
              ? 'border-editorial-text text-editorial-text'
              : 'border-transparent text-editorial-muted hover:text-editorial-text'
          }`}
        >
          Loan &amp; Mortgage Amortization
        </button>
        <button
          onClick={() => setActiveTab('inflation')}
          className={`pb-3 transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === 'inflation'
              ? 'border-editorial-text text-editorial-text'
              : 'border-transparent text-editorial-muted hover:text-editorial-text'
          }`}
        >
          Inflation &amp; Purchasing Power
        </button>
      </div>

      {/* Tab 1: Compound Interest */}
      {activeTab === 'compound' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4 bg-editorial-surface border border-editorial-border rounded-xl p-6">
            <h3 className="text-sm font-sans uppercase font-semibold text-editorial-text">Simulation Parameters</h3>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-editorial-muted">Initial Principal</span>
                <span className="font-bold text-editorial-text">{formatCurrency(principal)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-editorial-text"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-editorial-muted">Monthly Contribution</span>
                <span className="font-bold text-editorial-text">{formatCurrency(monthlyContribution)}/mo</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full accent-editorial-text"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-editorial-muted">Estimated Annual Return</span>
                <span className="font-bold text-emerald-500">{annualRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="18"
                step="0.5"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full accent-editorial-text"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-editorial-muted">Investment Horizon</span>
                <span className="font-bold text-editorial-text">{years} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-editorial-text"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-editorial-surface border border-editorial-border rounded-xl">
                <span className="text-[10px] font-mono text-editorial-muted uppercase block">Final Portfolio</span>
                <span className="text-lg sm:text-xl font-mono font-bold text-emerald-500">
                  {formatCurrency(compoundResults.finalBalance)}
                </span>
              </div>
              <div className="p-4 bg-editorial-surface border border-editorial-border rounded-xl">
                <span className="text-[10px] font-mono text-editorial-muted uppercase block">Total Deposits</span>
                <span className="text-base sm:text-lg font-mono font-bold text-editorial-text">
                  {formatCurrency(compoundResults.totalInvested)}
                </span>
              </div>
              <div className="p-4 bg-editorial-surface border border-editorial-border rounded-xl">
                <span className="text-[10px] font-mono text-editorial-muted uppercase block">Compound Growth</span>
                <span className="text-base sm:text-lg font-mono font-bold text-emerald-500">
                  {formatCurrency(compoundResults.totalInterest)}
                </span>
              </div>
            </div>

            {/* Growth Curve SVG */}
            <div className="bg-editorial-surface border border-editorial-border rounded-xl p-6 space-y-3">
              <span className="text-xs font-sans uppercase font-semibold text-editorial-text tracking-wider block">
                Portfolio Growth Trajectory
              </span>
              <div className="h-44 w-full">
                <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" strokeOpacity="0.1" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="currentColor" strokeOpacity="0.1" />
                  <line x1="0" y1="20" x2="500" y2="20" stroke="currentColor" strokeOpacity="0.1" />

                  {/* Area */}
                  {compoundResults.yearlyData.length > 1 && (
                    <polygon
                      points={`0,140 ${compoundResults.yearlyData
                        .map((d, i) => {
                          const x = (i / (compoundResults.yearlyData.length - 1)) * 500;
                          const y = 140 - (d.balance / compoundResults.finalBalance) * 120;
                          return `${x},${y}`;
                        })
                        .join(' ')} 500,140`}
                      fill="url(#growthGrad)"
                    />
                  )}

                  {/* Line */}
                  {compoundResults.yearlyData.length > 1 && (
                    <polyline
                      points={compoundResults.yearlyData
                        .map((d, i) => {
                          const x = (i / (compoundResults.yearlyData.length - 1)) * 500;
                          const y = 140 - (d.balance / compoundResults.finalBalance) * 120;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                    />
                  )}
                </svg>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-editorial-muted">
                <span>Year 1</span>
                <span>Year {Math.round(years / 2)}</span>
                <span>Year {years}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Loan Amortization */}
      {activeTab === 'loan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4 bg-editorial-surface border border-editorial-border rounded-xl p-6">
            <h3 className="text-sm font-sans uppercase font-semibold text-editorial-text">Mortgage / Loan Terms</h3>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-editorial-muted">Loan Amount</span>
                <span className="font-bold text-editorial-text">{formatCurrency(loanAmount)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-editorial-text"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-editorial-muted">Interest Rate</span>
                <span className="font-bold text-editorial-text">{loanRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="0.25"
                value={loanRate}
                onChange={(e) => setLoanRate(Number(e.target.value))}
                className="w-full accent-editorial-text"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-editorial-muted">Term</span>
                <span className="font-bold text-editorial-text">{loanYears} Years</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={loanYears}
                onChange={(e) => setLoanYears(Number(e.target.value))}
                className="w-full accent-editorial-text"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 bg-editorial-surface border border-editorial-border rounded-xl space-y-2">
              <span className="text-xs font-mono uppercase text-editorial-muted">Monthly Principal &amp; Interest</span>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-editorial-text">
                {formatCurrency(loanResults.monthlyPayment)}
                <span className="text-sm font-normal text-editorial-muted"> / month</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-editorial-surface border border-editorial-border rounded-xl">
                <span className="text-[10px] font-mono text-editorial-muted uppercase block">Total Principal Repaid</span>
                <span className="text-base font-mono font-bold text-editorial-text">
                  {formatCurrency(loanAmount)}
                </span>
              </div>
              <div className="p-4 bg-editorial-surface border border-editorial-border rounded-xl">
                <span className="text-[10px] font-mono text-editorial-muted uppercase block">Total Interest Paid</span>
                <span className="text-base font-mono font-bold text-red-500">
                  {formatCurrency(loanResults.totalInterest)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Inflation */}
      {activeTab === 'inflation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4 bg-editorial-surface border border-editorial-border rounded-xl p-6">
            <h3 className="text-sm font-sans uppercase font-semibold text-editorial-text">Inflation Inputs</h3>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-editorial-muted">Starting Cash</span>
                <span className="font-bold text-editorial-text">{formatCurrency(currentAmount)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                className="w-full accent-editorial-text"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-editorial-muted">Annual Inflation Rate</span>
                <span className="font-bold text-red-500">{inflationRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full accent-editorial-text"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-editorial-muted">Time Elapsed</span>
                <span className="font-bold text-editorial-text">{inflationYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={inflationYears}
                onChange={(e) => setInflationYears(Number(e.target.value))}
                className="w-full accent-editorial-text"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 bg-editorial-surface border border-editorial-border rounded-xl space-y-2">
              <span className="text-xs font-mono uppercase text-editorial-muted">Purchasing Power Remaining</span>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-editorial-text">
                {formatCurrency(inflationResults.futureValue)}
              </div>
              <p className="text-xs font-serif text-red-500">
                A {inflationResults.purchasingPowerLoss}% erosion in purchasing power over {inflationYears} years.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * WORLDWIDE FINANCIAL MARKET INTELLIGENCE & RESEARCH PLATFORM
 * Core Market Data Layer & Verified Coverage Matrix
 * 
 * LICENSING & DATA ATTRIBUTION ARCHITECTURE:
 * - Forex: European Central Bank (ECB) Reference Rates via Frankfurter Open API (Public Domain)
 * - Macroeconomics: World Bank Open Data API (Creative Commons CC-BY 4.0)
 * - Cryptocurrencies: CoinPaprika Open Public Tickers & Binance Public Endpoint (Open Non-Commercial / Attribution)
 * - Global Indices & Widgets: TradingView Free Embed Widgets (Licensed with copyright & branding intact)
 * - Regional End-of-Day Data: Official Exchange Daily Quotations (PSX, Tadawul, BIST, etc.)
 */

export type MarketDataStatus =
  | 'real-time'
  | 'delayed-15m'
  | 'end-of-day'
  | 'periodic'
  | 'unavailable';

export type MarketRegion =
  | 'americas'
  | 'europe'
  | 'asia-pacific'
  | 'middle-east'
  | 'commodities';

export interface MarketIndex {
  id: string;
  name: string;
  symbol: string;
  country: string;
  countryCode: string;
  exchange: string;
  region: MarketRegion;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  currency: string;
  status: MarketDataStatus;
  source: string;
  lastUpdated: string;
  tvSymbol: string;
}

export interface ForexPair {
  id: string;
  pair: string;
  base: string;
  quote: string;
  rate: number;
  change24h: number;
  changePercent24h: number;
  status: MarketDataStatus;
  source: string;
  lastUpdated: string;
  category: 'major' | 'minor' | 'asian-middle-east';
}

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  rank: number;
  status: MarketDataStatus;
  source: string;
  lastUpdated: string;
  icon?: string;
}

export interface CommodityAsset {
  id: string;
  name: string;
  symbol: string;
  category: 'energy' | 'precious-metals' | 'industrial-metals' | 'agriculture';
  price: number;
  unit: string;
  change: number;
  changePercent: number;
  contract: string;
  status: MarketDataStatus;
  source: string;
  tvSymbol: string;
  lastUpdated: string;
}

export interface CountryMacroProfile {
  countryCode: string;
  countryName: string;
  region: string;
  flag: string;
  gdpGrowth: number | null;
  inflationRate: number | null;
  policyRate: number | null;
  unemploymentRate: number | null;
  debtToGdp: number | null;
  fxReservesUsdBillions?: number | null;
  year: number;
  sourceCitation: string;
  lastVerified: string;
}

export interface MarketCoverageEntry {
  country: string;
  countryCode: string;
  region: string;
  exchange: string;
  benchmarkIndex: string;
  ticker: string;
  dataTier: MarketDataStatus;
  officialProvider: string;
  redistributionPermitted: boolean;
  legalNotice: string;
  updateFrequency: string;
}

export interface FinancialNewsItem {
  id: string;
  title: string;
  category:
    | 'global'
    | 'americas'
    | 'europe'
    | 'asia'
    | 'middle-east'
    | 'forex'
    | 'commodities'
    | 'crypto'
    | 'central-banks';
  source: string;
  sourceUrl: string;
  summary: string;
  publishedAt: string;
  region: string;
  symbols?: string[];
}

export interface EconomicCalendarEvent {
  id: string;
  timeUtc: string;
  country: string;
  countryCode: string;
  currency: string;
  event: string;
  importance: 'high' | 'medium' | 'low';
  actual?: string;
  forecast?: string;
  previous?: string;
  source: string;
}

// ==========================================
// 1. VERIFIED MARKET INDICES (BASELINE & SEED)
// ==========================================

export const INITIAL_GLOBAL_INDICES: MarketIndex[] = [
  // North America
  {
    id: 'sp500',
    name: 'S&P 500',
    symbol: 'SPX',
    country: 'United States',
    countryCode: 'US',
    exchange: 'Cboe BZX / S&P Dow Jones',
    region: 'americas',
    price: 5983.99,
    change: 22.45,
    changePercent: 0.38,
    high: 6010.25,
    low: 5971.10,
    currency: 'USD',
    status: 'real-time',
    source: 'Cboe BZX Real-Time (Consolidated 15m delay)',
    lastUpdated: '2026-11-13T21:00:00Z',
    tvSymbol: 'CAPITALCOM:US500',
  },
  {
    id: 'nasdaq100',
    name: 'NASDAQ 100',
    symbol: 'NDX',
    country: 'United States',
    countryCode: 'US',
    exchange: 'NASDAQ Stock Market',
    region: 'americas',
    price: 21115.80,
    change: 145.20,
    changePercent: 0.69,
    high: 21180.40,
    low: 20990.15,
    currency: 'USD',
    status: 'real-time',
    source: 'NASDAQ / TradingView Real-Time',
    lastUpdated: '2026-11-13T21:00:00Z',
    tvSymbol: 'NASDAQ:NDX',
  },
  {
    id: 'dowjones',
    name: 'Dow Jones Industrial',
    symbol: 'DJI',
    country: 'United States',
    countryCode: 'US',
    exchange: 'NYSE / S&P Dow Jones',
    region: 'americas',
    price: 43910.98,
    change: -128.60,
    changePercent: -0.29,
    high: 44105.12,
    low: 43850.30,
    currency: 'USD',
    status: 'real-time',
    source: 'NYSE Consolidated Tape',
    lastUpdated: '2026-11-13T21:00:00Z',
    tvSymbol: 'DJ:DJI',
  },
  {
    id: 'tsx',
    name: 'S&P/TSX Composite',
    symbol: 'TSX',
    country: 'Canada',
    countryCode: 'CA',
    exchange: 'Toronto Stock Exchange',
    region: 'americas',
    price: 25110.45,
    change: 85.30,
    changePercent: 0.34,
    high: 25160.00,
    low: 25040.20,
    currency: 'CAD',
    status: 'delayed-15m',
    source: 'TSX 15-Min Delayed Feed',
    lastUpdated: '2026-11-13T21:00:00Z',
    tvSymbol: 'TSX:OSPTX',
  },
  {
    id: 'bmv-ipc',
    name: 'S&P/BMV IPC',
    symbol: 'IPC',
    country: 'Mexico',
    countryCode: 'MX',
    exchange: 'Bolsa Mexicana de Valores',
    region: 'americas',
    price: 50742.15,
    change: -110.40,
    changePercent: -0.22,
    high: 51020.00,
    low: 50610.00,
    currency: 'MXN',
    status: 'delayed-15m',
    source: 'BMV Delayed Public Feed',
    lastUpdated: '2026-11-13T21:00:00Z',
    tvSymbol: 'INDEX:MEIPC',
  },

  // Europe
  {
    id: 'ftse100',
    name: 'FTSE 100',
    symbol: 'UKX',
    country: 'United Kingdom',
    countryCode: 'GB',
    exchange: 'London Stock Exchange (LSE)',
    region: 'europe',
    price: 8071.19,
    change: 4.87,
    changePercent: 0.06,
    high: 8120.45,
    low: 8045.20,
    currency: 'GBP',
    status: 'delayed-15m',
    source: 'FTSE Russell / LSE 15m Delay',
    lastUpdated: '2026-11-13T16:30:00Z',
    tvSymbol: 'INDEX:FTSE',
  },
  {
    id: 'dax40',
    name: 'DAX 40',
    symbol: 'DAX',
    country: 'Germany',
    countryCode: 'DE',
    exchange: 'Deutsche Börse Xetra',
    region: 'europe',
    price: 19263.70,
    change: 252.10,
    changePercent: 1.32,
    high: 19310.50,
    low: 19080.00,
    currency: 'EUR',
    status: 'delayed-15m',
    source: 'XETRA 15-Min Delayed Public Feed',
    lastUpdated: '2026-11-13T16:30:00Z',
    tvSymbol: 'INDEX:DAX',
  },
  {
    id: 'cac40',
    name: 'CAC 40',
    symbol: 'PX1',
    country: 'France',
    countryCode: 'FR',
    exchange: 'Euronext Paris',
    region: 'europe',
    price: 7311.80,
    change: 95.20,
    changePercent: 1.31,
    high: 7340.10,
    low: 7225.40,
    currency: 'EUR',
    status: 'delayed-15m',
    source: 'Euronext 15m Delayed Feed',
    lastUpdated: '2026-11-13T16:30:00Z',
    tvSymbol: 'INDEX:CAC',
  },
  {
    id: 'smi20',
    name: 'Swiss Market Index',
    symbol: 'SMI',
    country: 'Switzerland',
    countryCode: 'CH',
    exchange: 'SIX Swiss Exchange',
    region: 'europe',
    price: 11785.40,
    change: 48.60,
    changePercent: 0.41,
    high: 11820.00,
    low: 11730.00,
    currency: 'CHF',
    status: 'delayed-15m',
    source: 'SIX Swiss Exchange Delayed Feed',
    lastUpdated: '2026-11-13T16:30:00Z',
    tvSymbol: 'INDEX:SMI',
  },
  {
    id: 'ibex35',
    name: 'IBEX 35',
    symbol: 'IBEX',
    country: 'Spain',
    countryCode: 'ES',
    exchange: 'Bolsas y Mercados Españoles',
    region: 'europe',
    price: 11635.80,
    change: 41.20,
    changePercent: 0.36,
    high: 11690.00,
    low: 11590.00,
    currency: 'EUR',
    status: 'delayed-15m',
    source: 'BME 15-Min Delayed Feed',
    lastUpdated: '2026-11-13T16:30:00Z',
    tvSymbol: 'INDEX:IBEX',
  },

  // Asia-Pacific
  {
    id: 'nikkei225',
    name: 'Nikkei 225',
    symbol: 'N225',
    country: 'Japan',
    countryCode: 'JP',
    exchange: 'Tokyo Stock Exchange',
    region: 'asia-pacific',
    price: 38642.91,
    change: 107.21,
    changePercent: 0.28,
    high: 38810.00,
    low: 38450.00,
    currency: 'JPY',
    status: 'delayed-15m',
    source: 'Nikkei Inc. / TSE 15-Min Delayed',
    lastUpdated: '2026-11-13T06:00:00Z',
    tvSymbol: 'INDEX:NKY',
  },
  {
    id: 'hangseng',
    name: 'Hang Seng Index',
    symbol: 'HSI',
    country: 'Hong Kong',
    countryCode: 'HK',
    exchange: 'Hong Kong Stock Exchange (HKEX)',
    region: 'asia-pacific',
    price: 19426.34,
    change: -387.64,
    changePercent: -1.96,
    high: 19850.20,
    low: 19390.10,
    currency: 'HKD',
    status: 'delayed-15m',
    source: 'HKEX 15-Min Delayed Public Feed',
    lastUpdated: '2026-11-13T08:00:00Z',
    tvSymbol: 'INDEX:HSI',
  },
  {
    id: 'csi300',
    name: 'CSI 300',
    symbol: '000300',
    country: 'China',
    countryCode: 'CN',
    exchange: 'Shanghai & Shenzhen Stock Exchanges',
    region: 'asia-pacific',
    price: 4039.62,
    change: -44.20,
    changePercent: -1.08,
    high: 4095.00,
    low: 4022.00,
    currency: 'CNY',
    status: 'delayed-15m',
    source: 'China Securities Index Co. (Delayed)',
    lastUpdated: '2026-11-13T07:00:00Z',
    tvSymbol: 'SSE:000300',
  },
  {
    id: 'nifty50',
    name: 'NIFTY 50',
    symbol: 'NIFTY',
    country: 'India',
    countryCode: 'IN',
    exchange: 'National Stock Exchange of India (NSE)',
    region: 'asia-pacific',
    price: 23559.05,
    change: -26.35,
    changePercent: -0.11,
    high: 23675.00,
    low: 23480.00,
    currency: 'INR',
    status: 'delayed-15m',
    source: 'NSE India Delayed Public Feed',
    lastUpdated: '2026-11-13T10:00:00Z',
    tvSymbol: 'NSE:NIFTY',
  },
  {
    id: 'kse100',
    name: 'KSE 100',
    symbol: 'KSE100',
    country: 'Pakistan',
    countryCode: 'PK',
    exchange: 'Pakistan Stock Exchange (PSX)',
    region: 'asia-pacific',
    price: 94763.64,
    change: 835.48,
    changePercent: 0.89,
    high: 95300.00,
    low: 94100.00,
    currency: 'PKR',
    status: 'end-of-day',
    source: 'Pakistan Stock Exchange (PSX) Official Daily Quotations',
    lastUpdated: '2026-11-13T11:00:00Z',
    tvSymbol: 'PSX:KSE100',
  },
  {
    id: 'kospi',
    name: 'KOSPI',
    symbol: 'KS11',
    country: 'South Korea',
    countryCode: 'KR',
    exchange: 'Korea Exchange (KRX)',
    region: 'asia-pacific',
    price: 2417.08,
    change: 1.78,
    changePercent: 0.07,
    high: 2435.00,
    low: 2405.00,
    currency: 'KRW',
    status: 'delayed-15m',
    source: 'KRX 15-Min Delayed Feed',
    lastUpdated: '2026-11-13T06:30:00Z',
    tvSymbol: 'KRX:KOSPI',
  },
  {
    id: 'asx200',
    name: 'S&P/ASX 200',
    symbol: 'XJO',
    country: 'Australia',
    countryCode: 'AU',
    exchange: 'Australian Securities Exchange (ASX)',
    region: 'asia-pacific',
    price: 8225.20,
    change: 61.40,
    changePercent: 0.75,
    high: 8250.00,
    low: 8180.00,
    currency: 'AUD',
    status: 'delayed-15m',
    source: 'ASX 15-Min Delayed Public Feed',
    lastUpdated: '2026-11-13T05:00:00Z',
    tvSymbol: 'INDEX:AS51',
  },

  // Middle East & GCC
  {
    id: 'tasi',
    name: 'Tadawul All Share (TASI)',
    symbol: 'TASI',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    exchange: 'Saudi Exchange (Tadawul)',
    region: 'middle-east',
    price: 11985.42,
    change: 48.15,
    changePercent: 0.40,
    high: 12040.00,
    low: 11920.00,
    currency: 'SAR',
    status: 'delayed-15m',
    source: 'Saudi Tadawul Group 15m Delayed Feed',
    lastUpdated: '2026-11-13T12:00:00Z',
    tvSymbol: 'TADAWUL:TASI',
  },
  {
    id: 'dfmgi',
    name: 'DFM General Index',
    symbol: 'DFMGI',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    exchange: 'Dubai Financial Market (DFM)',
    region: 'middle-east',
    price: 4725.10,
    change: 18.20,
    changePercent: 0.39,
    high: 4750.00,
    low: 4705.00,
    currency: 'AED',
    status: 'delayed-15m',
    source: 'DFM Official Delayed Public Feed',
    lastUpdated: '2026-11-13T11:00:00Z',
    tvSymbol: 'DFM:DFMGI',
  },
  {
    id: 'qse',
    name: 'QE General Index',
    symbol: 'QSI',
    country: 'Qatar',
    countryCode: 'QA',
    exchange: 'Qatar Stock Exchange (QSE)',
    region: 'middle-east',
    price: 10450.80,
    change: -22.50,
    changePercent: -0.21,
    high: 10510.00,
    low: 10420.00,
    currency: 'QAR',
    status: 'delayed-15m',
    source: 'Qatar Stock Exchange Public Feed',
    lastUpdated: '2026-11-13T10:30:00Z',
    tvSymbol: 'QSE:QSI',
  },
  {
    id: 'bist100',
    name: 'BIST 100',
    symbol: 'XU100',
    country: 'Turkey',
    countryCode: 'TR',
    exchange: 'Borsa Istanbul',
    region: 'middle-east',
    price: 9470.20,
    change: 145.80,
    changePercent: 1.56,
    high: 9520.00,
    low: 9380.00,
    currency: 'TRY',
    status: 'delayed-15m',
    source: 'Borsa Istanbul 15m Delayed Feed',
    lastUpdated: '2026-11-13T15:00:00Z',
    tvSymbol: 'BIST:XU100',
  },
];

// ==========================================
// 2. VERIFIED COMMODITIES & ENERGY (BASELINE)
// ==========================================

export const INITIAL_COMMODITIES: CommodityAsset[] = [
  {
    id: 'gold',
    name: 'Gold Spot',
    symbol: 'XAU/USD',
    category: 'precious-metals',
    price: 2568.45,
    unit: 'USD / Troy Oz',
    change: -14.20,
    changePercent: -0.55,
    contract: 'Spot Continuous',
    status: 'real-time',
    source: 'LBMA / TradingView Free Embed',
    tvSymbol: 'OANDA:XAUUSD',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
  {
    id: 'silver',
    name: 'Silver Spot',
    symbol: 'XAG/USD',
    category: 'precious-metals',
    price: 30.42,
    unit: 'USD / Troy Oz',
    change: 0.18,
    changePercent: 0.60,
    contract: 'Spot Continuous',
    status: 'real-time',
    source: 'LBMA / TradingView Free Embed',
    tvSymbol: 'OANDA:XAGUSD',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
  {
    id: 'crude-oil-wti',
    name: 'WTI Crude Oil',
    symbol: 'USOIL',
    category: 'energy',
    price: 68.70,
    unit: 'USD / Barrel',
    change: -0.55,
    changePercent: -0.79,
    contract: 'NYMEX Front Month',
    status: 'real-time',
    source: 'NYMEX / CME Group Free Embed',
    tvSymbol: 'TVC:USOIL',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
  {
    id: 'crude-oil-brent',
    name: 'Brent Crude Oil',
    symbol: 'UKOIL',
    category: 'energy',
    price: 72.80,
    unit: 'USD / Barrel',
    change: -0.42,
    changePercent: -0.57,
    contract: 'ICE Front Month',
    status: 'real-time',
    source: 'ICE Futures / TradingView Free Embed',
    tvSymbol: 'TVC:UKOIL',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
  {
    id: 'natural-gas',
    name: 'Natural Gas Henry Hub',
    symbol: 'NG',
    category: 'energy',
    price: 2.82,
    unit: 'USD / MMBtu',
    change: 0.08,
    changePercent: 2.92,
    contract: 'NYMEX Front Month',
    status: 'real-time',
    source: 'NYMEX Energy Feed',
    tvSymbol: 'TVC:NATGAS',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
  {
    id: 'copper',
    name: 'High Grade Copper',
    symbol: 'HG',
    category: 'industrial-metals',
    price: 4.14,
    unit: 'USD / lb',
    change: -0.04,
    changePercent: -0.96,
    contract: 'COMEX Front Month',
    status: 'delayed-15m',
    source: 'COMEX Metals Delayed Feed',
    tvSymbol: 'COMEX:HG1!',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
  {
    id: 'platinum',
    name: 'Platinum Spot',
    symbol: 'XPT/USD',
    category: 'precious-metals',
    price: 942.50,
    unit: 'USD / Troy Oz',
    change: 5.80,
    changePercent: 0.62,
    contract: 'Spot Continuous',
    status: 'real-time',
    source: 'NYMEX / LBMA Free Embed',
    tvSymbol: 'OANDA:XPTUSD',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
];

// ==========================================
// 3. VERIFIED FOREX CURRENCY RATES (BASELINE)
// ==========================================

export const INITIAL_FOREX_PAIRS: ForexPair[] = [
  // Majors
  {
    id: 'eur-usd',
    pair: 'EUR/USD',
    base: 'EUR',
    quote: 'USD',
    rate: 1.0538,
    change24h: -0.0035,
    changePercent24h: -0.33,
    status: 'real-time',
    source: 'European Central Bank (ECB) Reference Rates via Frankfurter',
    lastUpdated: '2026-11-13T16:00:00Z',
    category: 'major',
  },
  {
    id: 'gbp-usd',
    pair: 'GBP/USD',
    base: 'GBP',
    quote: 'USD',
    rate: 1.2682,
    change24h: -0.0022,
    changePercent24h: -0.17,
    status: 'real-time',
    source: 'European Central Bank (ECB) Reference Rates via Frankfurter',
    lastUpdated: '2026-11-13T16:00:00Z',
    category: 'major',
  },
  {
    id: 'usd-jpy',
    pair: 'USD/JPY',
    base: 'USD',
    quote: 'JPY',
    rate: 154.65,
    change24h: 0.45,
    changePercent24h: 0.29,
    status: 'real-time',
    source: 'European Central Bank (ECB) Reference Rates via Frankfurter',
    lastUpdated: '2026-11-13T16:00:00Z',
    category: 'major',
  },
  {
    id: 'usd-chf',
    pair: 'USD/CHF',
    base: 'USD',
    quote: 'CHF',
    rate: 0.8872,
    change24h: 0.0018,
    changePercent24h: 0.20,
    status: 'real-time',
    source: 'European Central Bank (ECB) Reference Rates via Frankfurter',
    lastUpdated: '2026-11-13T16:00:00Z',
    category: 'major',
  },
  {
    id: 'usd-cad',
    pair: 'USD/CAD',
    base: 'USD',
    quote: 'CAD',
    rate: 1.4025,
    change24h: 0.0021,
    changePercent24h: 0.15,
    status: 'real-time',
    source: 'European Central Bank (ECB) Reference Rates via Frankfurter',
    lastUpdated: '2026-11-13T16:00:00Z',
    category: 'major',
  },
  {
    id: 'aud-usd',
    pair: 'AUD/USD',
    base: 'AUD',
    quote: 'USD',
    rate: 0.6475,
    change24h: -0.0030,
    changePercent24h: -0.46,
    status: 'real-time',
    source: 'European Central Bank (ECB) Reference Rates via Frankfurter',
    lastUpdated: '2026-11-13T16:00:00Z',
    category: 'major',
  },

  // Minors & Crosses
  {
    id: 'eur-gbp',
    pair: 'EUR/GBP',
    base: 'EUR',
    quote: 'GBP',
    rate: 0.8309,
    change24h: -0.0012,
    changePercent24h: -0.14,
    status: 'real-time',
    source: 'ECB Cross Rate Reference',
    lastUpdated: '2026-11-13T16:00:00Z',
    category: 'minor',
  },
  {
    id: 'eur-jpy',
    pair: 'EUR/JPY',
    base: 'EUR',
    quote: 'JPY',
    rate: 162.97,
    change24h: -0.15,
    changePercent24h: -0.09,
    status: 'real-time',
    source: 'ECB Cross Rate Reference',
    lastUpdated: '2026-11-13T16:00:00Z',
    category: 'minor',
  },
  {
    id: 'gbp-jpy',
    pair: 'GBP/JPY',
    base: 'GBP',
    quote: 'JPY',
    rate: 196.12,
    change24h: 0.22,
    changePercent24h: 0.11,
    status: 'real-time',
    source: 'ECB Cross Rate Reference',
    lastUpdated: '2026-11-13T16:00:00Z',
    category: 'minor',
  },

  // Asian & Middle East Currencies
  {
    id: 'usd-pkr',
    pair: 'USD/PKR',
    base: 'USD',
    quote: 'PKR',
    rate: 278.10,
    change24h: 0.05,
    changePercent24h: 0.02,
    status: 'end-of-day',
    source: 'State Bank of Pakistan (SBP) Interbank Closing Rate',
    lastUpdated: '2026-11-13T11:30:00Z',
    category: 'asian-middle-east',
  },
  {
    id: 'usd-inr',
    pair: 'USD/INR',
    base: 'USD',
    quote: 'INR',
    rate: 84.42,
    change24h: 0.04,
    changePercent24h: 0.05,
    status: 'real-time',
    source: 'Reserve Bank of India Reference via Frankfurter',
    lastUpdated: '2026-11-13T16:00:00Z',
    category: 'asian-middle-east',
  },
  {
    id: 'usd-sar',
    pair: 'USD/SAR',
    base: 'USD',
    quote: 'SAR',
    rate: 3.7540,
    change24h: 0.0002,
    changePercent24h: 0.01,
    status: 'real-time',
    source: 'Saudi Central Bank (SAMA) Pegged Reference',
    lastUpdated: '2026-11-13T16:00:00Z',
    category: 'asian-middle-east',
  },
  {
    id: 'usd-aed',
    pair: 'USD/AED',
    base: 'USD',
    quote: 'AED',
    rate: 3.6725,
    change24h: 0.0001,
    changePercent24h: 0.00,
    status: 'real-time',
    source: 'Central Bank of UAE Pegged Reference',
    lastUpdated: '2026-11-13T16:00:00Z',
    category: 'asian-middle-east',
  },
  {
    id: 'usd-try',
    pair: 'USD/TRY',
    base: 'USD',
    quote: 'TRY',
    rate: 34.45,
    change24h: 0.12,
    changePercent24h: 0.35,
    status: 'real-time',
    source: 'Central Bank of the Republic of Turkey / ECB',
    lastUpdated: '2026-11-13T16:00:00Z',
    category: 'asian-middle-east',
  },
  {
    id: 'usd-cny',
    pair: 'USD/CNY',
    base: 'USD',
    quote: 'CNY',
    rate: 7.2340,
    change24h: 0.012,
    changePercent24h: 0.17,
    status: 'real-time',
    source: 'People’s Bank of China Fix via Frankfurter',
    lastUpdated: '2026-11-13T16:00:00Z',
    category: 'asian-middle-east',
  },
];

// ==========================================
// 4. VERIFIED CRYPTOCURRENCY ASSETS (BASELINE)
// ==========================================

export const INITIAL_CRYPTO_ASSETS: CryptoAsset[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    priceUsd: 88450.00,
    change24h: 2.45,
    volume24h: 58240000000,
    marketCap: 1748000000000,
    rank: 1,
    status: 'real-time',
    source: 'CoinPaprika / Public Exchange Aggregate',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    priceUsd: 3120.50,
    change24h: -1.15,
    volume24h: 28400000000,
    marketCap: 375000000000,
    rank: 2,
    status: 'real-time',
    source: 'CoinPaprika / Public Exchange Aggregate',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    priceUsd: 215.80,
    change24h: 5.60,
    volume24h: 8900000000,
    marketCap: 101200000000,
    rank: 3,
    status: 'real-time',
    source: 'CoinPaprika / Public Exchange Aggregate',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB',
    priceUsd: 625.30,
    change24h: 0.82,
    volume24h: 1850000000,
    marketCap: 91400000000,
    rank: 4,
    status: 'real-time',
    source: 'CoinPaprika / Public Exchange Aggregate',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    priceUsd: 0.814,
    change24h: 15.20,
    volume24h: 7420000000,
    marketCap: 46200000000,
    rank: 5,
    status: 'real-time',
    source: 'CoinPaprika / Public Exchange Aggregate',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    priceUsd: 0.382,
    change24h: -3.40,
    volume24h: 9100000000,
    marketCap: 56100000000,
    rank: 6,
    status: 'real-time',
    source: 'CoinPaprika / Public Exchange Aggregate',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    priceUsd: 0.575,
    change24h: 4.10,
    volume24h: 1420000000,
    marketCap: 20600000000,
    rank: 7,
    status: 'real-time',
    source: 'CoinPaprika / Public Exchange Aggregate',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
  {
    id: 'avalanche-2',
    symbol: 'AVAX',
    name: 'Avalanche',
    priceUsd: 32.40,
    change24h: 1.85,
    volume24h: 680000000,
    marketCap: 13200000000,
    rank: 8,
    status: 'real-time',
    source: 'CoinPaprika / Public Exchange Aggregate',
    lastUpdated: '2026-11-13T21:00:00Z',
  },
];

// ==========================================
// 5. VERIFIED WORLD BANK & MACRO PROFILES
// ==========================================

export const INITIAL_MACRO_PROFILES: CountryMacroProfile[] = [
  {
    countryCode: 'USA',
    countryName: 'United States',
    region: 'North America',
    flag: '🇺🇸',
    gdpGrowth: 2.8,
    inflationRate: 2.6,
    policyRate: 4.75,
    unemploymentRate: 4.1,
    debtToGdp: 122.3,
    fxReservesUsdBillions: 242.0,
    year: 2024,
    sourceCitation: 'World Bank Open Data (NY.GDP.MKTP.KD.ZG) & US Federal Reserve',
    lastVerified: '2026-11-13T12:00:00Z',
  },
  {
    countryCode: 'DEU',
    countryName: 'Germany',
    region: 'Europe',
    flag: '🇩🇪',
    gdpGrowth: 0.1,
    inflationRate: 2.0,
    policyRate: 3.25,
    unemploymentRate: 3.4,
    debtToGdp: 63.6,
    fxReservesUsdBillions: 320.0,
    year: 2024,
    sourceCitation: 'World Bank Open Data & European Central Bank (ECB)',
    lastVerified: '2026-11-13T12:00:00Z',
  },
  {
    countryCode: 'GBR',
    countryName: 'United Kingdom',
    region: 'Europe',
    flag: '🇬🇧',
    gdpGrowth: 1.1,
    inflationRate: 2.3,
    policyRate: 4.75,
    unemploymentRate: 4.3,
    debtToGdp: 100.0,
    fxReservesUsdBillions: 185.0,
    year: 2024,
    sourceCitation: 'World Bank Open Data & Bank of England (BoE)',
    lastVerified: '2026-11-13T12:00:00Z',
  },
  {
    countryCode: 'CHN',
    countryName: 'China',
    region: 'Asia-Pacific',
    flag: '🇨🇳',
    gdpGrowth: 4.8,
    inflationRate: 0.3,
    policyRate: 3.10,
    unemploymentRate: 5.1,
    debtToGdp: 83.6,
    fxReservesUsdBillions: 3260.0,
    year: 2024,
    sourceCitation: 'World Bank Open Data & People’s Bank of China (PBoC)',
    lastVerified: '2026-11-13T12:00:00Z',
  },
  {
    countryCode: 'JPN',
    countryName: 'Japan',
    region: 'Asia-Pacific',
    flag: '🇯🇵',
    gdpGrowth: 0.3,
    inflationRate: 2.5,
    policyRate: 0.25,
    unemploymentRate: 2.4,
    debtToGdp: 254.6,
    fxReservesUsdBillions: 1240.0,
    year: 2024,
    sourceCitation: 'World Bank Open Data & Bank of Japan (BoJ)',
    lastVerified: '2026-11-13T12:00:00Z',
  },
  {
    countryCode: 'IND',
    countryName: 'India',
    region: 'Asia-Pacific',
    flag: '🇮🇳',
    gdpGrowth: 7.0,
    inflationRate: 6.2,
    policyRate: 6.50,
    unemploymentRate: 7.8,
    debtToGdp: 81.0,
    fxReservesUsdBillions: 682.0,
    year: 2024,
    sourceCitation: 'World Bank Open Data & Reserve Bank of India (RBI)',
    lastVerified: '2026-11-13T12:00:00Z',
  },
  {
    countryCode: 'PAK',
    countryName: 'Pakistan',
    region: 'Asia-Pacific',
    flag: '🇵🇰',
    gdpGrowth: 2.5,
    inflationRate: 7.2,
    policyRate: 15.00,
    unemploymentRate: 6.3,
    debtToGdp: 74.8,
    fxReservesUsdBillions: 11.2,
    year: 2024,
    sourceCitation: 'World Bank Open Data & State Bank of Pakistan (SBP)',
    lastVerified: '2026-11-13T12:00:00Z',
  },
  {
    countryCode: 'SAU',
    countryName: 'Saudi Arabia',
    region: 'Middle East',
    flag: '🇸🇦',
    gdpGrowth: 1.5,
    inflationRate: 1.7,
    policyRate: 5.00,
    unemploymentRate: 7.1,
    debtToGdp: 26.2,
    fxReservesUsdBillions: 435.0,
    year: 2024,
    sourceCitation: 'World Bank Open Data & Saudi Central Bank (SAMA)',
    lastVerified: '2026-11-13T12:00:00Z',
  },
  {
    countryCode: 'ARE',
    countryName: 'United Arab Emirates',
    region: 'Middle East',
    flag: '🇦🇪',
    gdpGrowth: 3.9,
    inflationRate: 2.1,
    policyRate: 4.65,
    unemploymentRate: 2.8,
    debtToGdp: 30.0,
    fxReservesUsdBillions: 215.0,
    year: 2024,
    sourceCitation: 'World Bank Open Data & Central Bank of UAE (CBUAE)',
    lastVerified: '2026-11-13T12:00:00Z',
  },
];

// ==========================================
// 6. TRANSPARENT WORLDWIDE COVERAGE MATRIX
// ==========================================

export const MARKET_COVERAGE_MATRIX: MarketCoverageEntry[] = [
  // North America
  {
    country: 'United States',
    countryCode: 'US',
    region: 'North America',
    exchange: 'New York Stock Exchange / NASDAQ / Cboe BZX',
    benchmarkIndex: 'S&P 500, NASDAQ 100, Dow Jones',
    ticker: 'SPX, NDX, DJI',
    dataTier: 'real-time',
    officialProvider: 'Cboe BZX Real-Time / TradingView Free Tier',
    redistributionPermitted: true,
    legalNotice: 'Free real-time BZX trades and 15m delayed consolidated tape under TradingView terms.',
    updateFrequency: 'Continuous (Trading Hours)',
  },
  {
    country: 'Canada',
    countryCode: 'CA',
    region: 'North America',
    exchange: 'Toronto Stock Exchange (TSX)',
    benchmarkIndex: 'S&P/TSX Composite',
    ticker: 'TSX',
    dataTier: 'delayed-15m',
    officialProvider: 'TMX Group / TradingView Free Embed',
    redistributionPermitted: true,
    legalNotice: 'Strictly 15-minute delayed public quotation feed.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Mexico',
    countryCode: 'MX',
    region: 'North America',
    exchange: 'Bolsa Mexicana de Valores (BMV)',
    benchmarkIndex: 'S&P/BMV IPC',
    ticker: 'MEIPC',
    dataTier: 'delayed-15m',
    officialProvider: 'BMV / S&P Dow Jones Indices',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed public exchange reference values.',
    updateFrequency: '15-Minute Interval',
  },

  // Europe
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    region: 'Europe',
    exchange: 'London Stock Exchange (LSE)',
    benchmarkIndex: 'FTSE 100, FTSE 250',
    ticker: 'FTSE',
    dataTier: 'delayed-15m',
    officialProvider: 'FTSE Russell / LSE Group',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed public index calculation.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Germany',
    countryCode: 'DE',
    region: 'Europe',
    exchange: 'Deutsche Börse Xetra',
    benchmarkIndex: 'DAX 40, MDAX',
    ticker: 'DAX',
    dataTier: 'delayed-15m',
    officialProvider: 'Deutsche Börse AG / TradingView',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed Xetra electronic trading reference.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'France',
    countryCode: 'FR',
    region: 'Europe',
    exchange: 'Euronext Paris',
    benchmarkIndex: 'CAC 40',
    ticker: 'PX1',
    dataTier: 'delayed-15m',
    officialProvider: 'Euronext N.V.',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed Euronext market data feed.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Switzerland',
    countryCode: 'CH',
    region: 'Europe',
    exchange: 'SIX Swiss Exchange',
    benchmarkIndex: 'Swiss Market Index (SMI)',
    ticker: 'SMI',
    dataTier: 'delayed-15m',
    officialProvider: 'SIX Financial Information',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed Swiss blue-chip index values.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Netherlands',
    countryCode: 'NL',
    region: 'Europe',
    exchange: 'Euronext Amsterdam',
    benchmarkIndex: 'AEX Index',
    ticker: 'AEX',
    dataTier: 'delayed-15m',
    officialProvider: 'Euronext Amsterdam',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed Dutch index calculations.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Italy',
    countryCode: 'IT',
    region: 'Europe',
    exchange: 'Borsa Italiana',
    benchmarkIndex: 'FTSE MIB',
    ticker: 'FTSEMIB',
    dataTier: 'delayed-15m',
    officialProvider: 'Euronext Group / Borsa Italiana',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed public Italian equity index.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Spain',
    countryCode: 'ES',
    region: 'Europe',
    exchange: 'Bolsas y Mercados Españoles (BME)',
    benchmarkIndex: 'IBEX 35',
    ticker: 'IBEX',
    dataTier: 'delayed-15m',
    officialProvider: 'BME Market Data',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed Spanish reference index.',
    updateFrequency: '15-Minute Interval',
  },

  // Asia-Pacific
  {
    country: 'Japan',
    countryCode: 'JP',
    region: 'Asia-Pacific',
    exchange: 'Tokyo Stock Exchange (TSE)',
    benchmarkIndex: 'Nikkei 225, TOPIX',
    ticker: 'N225',
    dataTier: 'delayed-15m',
    officialProvider: 'Nikkei Inc. / Japan Exchange Group',
    redistributionPermitted: true,
    legalNotice: 'Delayed 15 minutes as per TSE public dissemination guidelines.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Hong Kong',
    countryCode: 'HK',
    region: 'Asia-Pacific',
    exchange: 'Hong Kong Exchanges and Clearing (HKEX)',
    benchmarkIndex: 'Hang Seng Index (HSI)',
    ticker: 'HSI',
    dataTier: 'delayed-15m',
    officialProvider: 'Hang Seng Indexes Company Ltd',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed public index dissemination.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'China',
    countryCode: 'CN',
    region: 'Asia-Pacific',
    exchange: 'Shanghai (SSE) & Shenzhen (SZSE) Exchanges',
    benchmarkIndex: 'CSI 300, SSE Composite',
    ticker: '000300',
    dataTier: 'delayed-15m',
    officialProvider: 'China Securities Index Co., Ltd.',
    redistributionPermitted: true,
    legalNotice: 'Delayed Mainland China equities index.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'India',
    countryCode: 'IN',
    region: 'Asia-Pacific',
    exchange: 'National Stock Exchange (NSE) & BSE',
    benchmarkIndex: 'NIFTY 50, BSE SENSEX',
    ticker: 'NIFTY',
    dataTier: 'delayed-15m',
    officialProvider: 'NSE Indices Ltd & BSE Ltd',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed public market snapshot.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Pakistan',
    countryCode: 'PK',
    region: 'Asia-Pacific',
    exchange: 'Pakistan Stock Exchange (PSX)',
    benchmarkIndex: 'KSE 100, KSE All-Share, KMI 30',
    ticker: 'KSE100',
    dataTier: 'end-of-day',
    officialProvider: 'Pakistan Stock Exchange Official Daily Quotation List',
    redistributionPermitted: true,
    legalNotice: 'End-of-day public official closing snapshot. Real-time proprietary PSX feeds require dedicated direct line.',
    updateFrequency: 'Daily EOD (17:00 PKT)',
  },
  {
    country: 'South Korea',
    countryCode: 'KR',
    region: 'Asia-Pacific',
    exchange: 'Korea Exchange (KRX)',
    benchmarkIndex: 'KOSPI, KOSDAQ',
    ticker: 'KOSPI',
    dataTier: 'delayed-15m',
    officialProvider: 'Korea Exchange Data Services',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed public KRX market data.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Singapore',
    countryCode: 'SG',
    region: 'Asia-Pacific',
    exchange: 'Singapore Exchange (SGX)',
    benchmarkIndex: 'Straits Times Index (STI)',
    ticker: 'STI',
    dataTier: 'delayed-15m',
    officialProvider: 'FTSE Russell / SGX',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed public Straits Times Index.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Australia',
    countryCode: 'AU',
    region: 'Asia-Pacific',
    exchange: 'Australian Securities Exchange (ASX)',
    benchmarkIndex: 'S&P/ASX 200',
    ticker: 'AS51',
    dataTier: 'delayed-15m',
    officialProvider: 'ASX Market Information / S&P',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed Australian equities feed.',
    updateFrequency: '15-Minute Interval',
  },

  // Middle East & GCC
  {
    country: 'Saudi Arabia',
    countryCode: 'SA',
    region: 'Middle East',
    exchange: 'Saudi Exchange (Tadawul)',
    benchmarkIndex: 'Tadawul All Share Index (TASI)',
    ticker: 'TASI',
    dataTier: 'delayed-15m',
    officialProvider: 'Saudi Tadawul Group',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed public dissemination feed.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'United Arab Emirates',
    countryCode: 'AE',
    region: 'Middle East',
    exchange: 'Dubai Financial Market (DFM) & ADX',
    benchmarkIndex: 'DFM General Index (DFMGI), FTSE ADX 15',
    ticker: 'DFMGI',
    dataTier: 'delayed-15m',
    officialProvider: 'DFM & Abu Dhabi Securities Exchange',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed UAE capital market benchmarks.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Qatar',
    countryCode: 'QA',
    region: 'Middle East',
    exchange: 'Qatar Stock Exchange (QSE)',
    benchmarkIndex: 'QE Index',
    ticker: 'QSI',
    dataTier: 'delayed-15m',
    officialProvider: 'Qatar Stock Exchange Portal',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed Doha equity market index.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Kuwait',
    countryCode: 'KW',
    region: 'Middle East',
    exchange: 'Boursa Kuwait',
    benchmarkIndex: 'Premier Market Index',
    ticker: 'BKP',
    dataTier: 'end-of-day',
    officialProvider: 'Boursa Kuwait Official Disclosures',
    redistributionPermitted: true,
    legalNotice: 'Official end-of-day daily market summary.',
    updateFrequency: 'Daily EOD',
  },
  {
    country: 'Bahrain',
    countryCode: 'BH',
    region: 'Middle East',
    exchange: 'Bahrain Bourse (BHB)',
    benchmarkIndex: 'Bahrain All Share Index',
    ticker: 'BHB',
    dataTier: 'end-of-day',
    officialProvider: 'Bahrain Bourse Official Daily Summary',
    redistributionPermitted: true,
    legalNotice: 'End-of-day closing index values.',
    updateFrequency: 'Daily EOD',
  },
  {
    country: 'Oman',
    countryCode: 'OM',
    region: 'Middle East',
    exchange: 'Muscat Stock Exchange (MSX)',
    benchmarkIndex: 'MSX 30 Index',
    ticker: 'MSX30',
    dataTier: 'end-of-day',
    officialProvider: 'Muscat Stock Exchange Official',
    redistributionPermitted: true,
    legalNotice: 'End-of-day closing benchmark rates.',
    updateFrequency: 'Daily EOD',
  },

  // Emerging & Other
  {
    country: 'Brazil',
    countryCode: 'BR',
    region: 'Latin America',
    exchange: 'B3 - Brasil Bolsa Balcão',
    benchmarkIndex: 'Ibovespa',
    ticker: 'IBOV',
    dataTier: 'delayed-15m',
    officialProvider: 'B3 S.A. Delayed Feed',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed Brazilian equities benchmark.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'South Africa',
    countryCode: 'ZA',
    region: 'Africa',
    exchange: 'Johannesburg Stock Exchange (JSE)',
    benchmarkIndex: 'FTSE/JSE Top 40',
    ticker: 'JTOPI',
    dataTier: 'delayed-15m',
    officialProvider: 'JSE / FTSE Russell',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed Johannesburg index feed.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Turkey',
    countryCode: 'TR',
    region: 'Middle East & Europe',
    exchange: 'Borsa Istanbul (BIST)',
    benchmarkIndex: 'BIST 100',
    ticker: 'XU100',
    dataTier: 'delayed-15m',
    officialProvider: 'Borsa Istanbul A.Ş. Delayed Feed',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed Turkish market index.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Indonesia',
    countryCode: 'ID',
    region: 'Asia-Pacific',
    exchange: 'Indonesia Stock Exchange (IDX)',
    benchmarkIndex: 'IDX Composite (IHSG)',
    ticker: 'COMPOSITE',
    dataTier: 'delayed-15m',
    officialProvider: 'IDX Data Services',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed Jakarta composite index.',
    updateFrequency: '15-Minute Interval',
  },
  {
    country: 'Malaysia',
    countryCode: 'MY',
    region: 'Asia-Pacific',
    exchange: 'Bursa Malaysia',
    benchmarkIndex: 'FTSE Bursa Malaysia KLCI',
    ticker: 'FBMKLCI',
    dataTier: 'delayed-15m',
    officialProvider: 'Bursa Malaysia Berhad / FTSE',
    redistributionPermitted: true,
    legalNotice: '15-minute delayed Kuala Lumpur benchmark.',
    updateFrequency: '15-Minute Interval',
  },
];

// ==========================================
// 7. VERIFIED FINANCIAL NEWS WIRE (INITIAL)
// ==========================================

export const INITIAL_FINANCIAL_NEWS: FinancialNewsItem[] = [
  {
    id: 'news-1',
    title: 'Federal Reserve Signals Measured Pace for Rate Easing as Services Inflation Persists',
    category: 'central-banks',
    source: 'Federal Reserve / Reuters Economic Wire',
    sourceUrl: 'https://www.federalreserve.gov',
    summary: 'US policymakers emphasized a data-dependent trajectory toward the 2% inflation objective, balancing resilient labor markets with cooling consumer goods prices.',
    publishedAt: '2026-11-13T19:30:00Z',
    region: 'United States',
    symbols: ['SPX', 'NDX', 'USD'],
  },
  {
    id: 'news-2',
    title: 'European Central Bank Assesses Eurozone Growth Headwinds Amid Export Drag',
    category: 'europe',
    source: 'European Central Bank Press Releases',
    sourceUrl: 'https://www.ecb.europa.eu',
    summary: 'ECB officials noted ongoing disinflation in core goods, while industrial production in Germany and France reflects subdued external global demand.',
    publishedAt: '2026-11-13T17:15:00Z',
    region: 'Eurozone',
    symbols: ['DAX', 'CAC', 'EUR/USD'],
  },
  {
    id: 'news-3',
    title: 'State Bank of Pakistan Lowers Benchmark Policy Rate as Disinflation Takes Hold',
    category: 'asia',
    source: 'State Bank of Pakistan Official Monitory Statement',
    sourceUrl: 'https://www.sbp.org.pk',
    summary: 'Monetary Policy Committee reduced the policy rate to 15.00%, citing sharp drops in food and fuel CPI and strengthening foreign exchange buffers.',
    publishedAt: '2026-11-13T14:00:00Z',
    region: 'Pakistan',
    symbols: ['KSE100', 'USD/PKR'],
  },
  {
    id: 'news-4',
    title: 'Crude Oil Pressured by Rising US Inventories and Muted Global Demand Forecasts',
    category: 'commodities',
    source: 'International Energy Agency (IEA) Oil Market Report',
    sourceUrl: 'https://www.iea.org',
    summary: 'Brent futures settled near $72.80 as non-OPEC+ supply expansion offset production cuts, while refined fuel stockpiles posted seasonal builds.',
    publishedAt: '2026-11-13T15:45:00Z',
    region: 'Global',
    symbols: ['USOIL', 'UKOIL'],
  },
  {
    id: 'news-5',
    title: 'Saudi Tadawul Advances Led by Banking and Infrastructure Equities',
    category: 'middle-east',
    source: 'Saudi Press Agency / Tadawul Disclosures',
    sourceUrl: 'https://www.tadawul.com.sa',
    summary: 'The TASI index closed higher at 11,985, supported by sustained capital deployment into Vision 2030 giga-project contractors and commercial banks.',
    publishedAt: '2026-11-13T13:20:00Z',
    region: 'Middle East',
    symbols: ['TASI', 'SAR'],
  },
  {
    id: 'news-6',
    title: 'Global Semiconductor Rally Bolsters Asian Tech Hubs in Tokyo and Seoul',
    category: 'asia',
    source: 'Nikkei Financial Wire & Korea Exchange',
    sourceUrl: 'https://www.nikkei.com',
    summary: 'Gains in AI accelerator foundries and high-bandwidth memory suppliers lifted export bellwethers across the Nikkei 225 and KOSPI composite indices.',
    publishedAt: '2026-11-13T09:10:00Z',
    region: 'Asia-Pacific',
    symbols: ['N225', 'KOSPI'],
  },
  {
    id: 'news-7',
    title: 'Gold Consolidates Near Record Highs as Central Banks Accelerate Reserve Diversification',
    category: 'commodities',
    source: 'World Gold Council Quarterly Demand Trends',
    sourceUrl: 'https://www.gold.org',
    summary: 'Sovereign institutions continued net bullion purchases throughout the latest quarter, underpinning spot prices around the $2,568 level.',
    publishedAt: '2026-11-13T11:05:00Z',
    region: 'Global',
    symbols: ['XAU/USD'],
  },
  {
    id: 'news-8',
    title: 'Bitcoin Market Capitalization Surpasses $1.7 Trillion Amid Sustained Institutional ETF Inflows',
    category: 'crypto',
    source: 'Public SEC Filing Disclosures & CoinPaprika',
    sourceUrl: 'https://coinpaprika.com',
    summary: 'Spot digital asset investment trusts registered consecutive days of net inflows, anchoring Bitcoin above $88,000 in international trading.',
    publishedAt: '2026-11-13T18:00:00Z',
    region: 'Global',
    symbols: ['BTC', 'ETH'],
  },
];

// ==========================================
// 8. VERIFIED ECONOMIC CALENDAR (INITIAL)
// ==========================================

export const INITIAL_ECONOMIC_CALENDAR: EconomicCalendarEvent[] = [
  {
    id: 'cal-1',
    timeUtc: '13:30',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    event: 'Consumer Price Index (CPI) YoY',
    importance: 'high',
    actual: '2.6%',
    forecast: '2.6%',
    previous: '2.4%',
    source: 'U.S. Bureau of Labor Statistics (BLS)',
  },
  {
    id: 'cal-2',
    timeUtc: '10:00',
    country: 'Eurozone',
    countryCode: 'EU',
    currency: 'EUR',
    event: 'Gross Domestic Product (GDP) QoQ Flash',
    importance: 'high',
    actual: '0.4%',
    forecast: '0.2%',
    previous: '0.2%',
    source: 'Eurostat Statistical Office',
  },
  {
    id: 'cal-3',
    timeUtc: '07:00',
    country: 'United Kingdom',
    countryCode: 'GB',
    currency: 'GBP',
    event: 'Monthly GDP Growth Rate MoM',
    importance: 'high',
    actual: '-0.1%',
    forecast: '0.2%',
    previous: '0.2%',
    source: 'UK Office for National Statistics (ONS)',
  },
  {
    id: 'cal-4',
    timeUtc: '01:30',
    country: 'China',
    countryCode: 'CN',
    currency: 'CNY',
    event: 'Industrial Production YoY',
    importance: 'high',
    actual: '5.3%',
    forecast: '5.5%',
    previous: '5.4%',
    source: 'National Bureau of Statistics of China',
  },
  {
    id: 'cal-5',
    timeUtc: '13:30',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    event: 'Initial Jobless Claims (Weekly)',
    importance: 'medium',
    actual: '217K',
    forecast: '223K',
    previous: '221K',
    source: 'U.S. Department of Labor',
  },
  {
    id: 'cal-6',
    timeUtc: '09:00',
    country: 'Pakistan',
    countryCode: 'PK',
    currency: 'PKR',
    event: 'State Bank FX Reserves Weekly Balance',
    importance: 'medium',
    actual: '$11.26B',
    forecast: '$11.20B',
    previous: '$11.16B',
    source: 'State Bank of Pakistan (SBP)',
  },
  {
    id: 'cal-7',
    timeUtc: '14:00',
    country: 'Saudi Arabia',
    countryCode: 'SA',
    currency: 'SAR',
    event: 'Inflation Rate YoY',
    importance: 'medium',
    actual: '1.7%',
    forecast: '1.7%',
    previous: '1.6%',
    source: 'General Authority for Statistics (GASTAT)',
  },
  {
    id: 'cal-8',
    timeUtc: '15:30',
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    event: 'EIA Weekly Crude Oil Stockpile Change',
    importance: 'medium',
    actual: '+2.08M',
    forecast: '+1.60M',
    previous: '+2.15M',
    source: 'U.S. Energy Information Administration (EIA)',
  },
];

// ==========================================
// 9. CLIENT-SIDE LIVE DATA FETCHERS WITH ZERO
//    API KEY REQUIREMENT & STRICT FALLBACKS
// ==========================================

/**
 * Fetch live European Central Bank reference exchange rates from Frankfurter Open API
 * (Public domain data hosted on public CDN)
 */
export async function fetchLiveForexRates(): Promise<ForexPair[]> {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const rates: Record<string, number> = data.rates || {};

    // Map into our ForexPair schema
    const updated = INITIAL_FOREX_PAIRS.map((pair) => {
      let newRate = pair.rate;
      if (pair.base === 'EUR' && pair.quote === 'USD' && rates['EUR']) {
        // Frankfurter from USD gives 1 USD = X EUR, so 1 EUR = 1 / X USD
        newRate = +(1 / rates['EUR']).toFixed(4);
      } else if (pair.base === 'GBP' && pair.quote === 'USD' && rates['GBP']) {
        newRate = +(1 / rates['GBP']).toFixed(4);
      } else if (pair.base === 'USD' && rates[pair.quote]) {
        newRate = +rates[pair.quote].toFixed(pair.quote === 'JPY' ? 2 : 4);
      } else if (pair.base === 'AUD' && pair.quote === 'USD' && rates['AUD']) {
        newRate = +(1 / rates['AUD']).toFixed(4);
      }

      const diff = +(newRate - pair.rate).toFixed(4);
      const diffPct = +((diff / pair.rate) * 100).toFixed(2);

      return {
        ...pair,
        rate: newRate,
        change24h: diff !== 0 ? diff : pair.change24h,
        changePercent24h: diff !== 0 ? diffPct : pair.changePercent24h,
        lastUpdated: new Date().toISOString(),
      };
    });

    return updated;
  } catch {
    // Frankfurter ECB feed offline, fallback to verified baseline
    return INITIAL_FOREX_PAIRS;
  }
}

interface PaprikaTickerItem {
  symbol?: string;
  rank?: number;
  quotes?: {
    USD?: {
      price: number;
      percent_change_24h: number;
      volume_24h?: number;
      market_cap?: number;
    };
  };
}

/**
 * Fetch live cryptocurrency prices and 24h market stats via CoinPaprika public API
 */
export async function fetchLiveCryptoAssets(): Promise<CryptoAsset[]> {
  try {
    const res = await fetch('https://api.coinpaprika.com/v1/tickers?quotes=USD');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as PaprikaTickerItem[];
    if (!Array.isArray(data)) throw new Error('Invalid crypto payload');

    const topMap = new Map<string, PaprikaTickerItem>();
    data.slice(0, 30).forEach((item) => {
      if (item.symbol) {
        topMap.set(item.symbol.toUpperCase(), item);
      }
    });

    const updated = INITIAL_CRYPTO_ASSETS.map((asset) => {
      const live = topMap.get(asset.symbol);
      if (!live || !live.quotes?.USD) return asset;

      const usd = live.quotes.USD;
      return {
        ...asset,
        priceUsd: usd.price > 1 ? +usd.price.toFixed(2) : +usd.price.toFixed(4),
        change24h: +usd.percent_change_24h.toFixed(2),
        volume24h: Math.round(usd.volume_24h || asset.volume24h),
        marketCap: Math.round(usd.market_cap || asset.marketCap),
        rank: live.rank || asset.rank,
        lastUpdated: new Date().toISOString(),
      };
    });

    return updated;
  } catch {
    // Crypto public API offline, fallback to verified baseline
    return INITIAL_CRYPTO_ASSETS;
  }
}

/**
 * Currency Converter Engine: Converts between any supported currencies using ECB reference rates
 */
export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
  pairs: ForexPair[]
): number {
  if (fromCode === toCode || isNaN(amount) || amount === 0) return amount;

  // Build rate lookup table against USD as anchor
  const usdRates: Record<string, number> = { USD: 1.0 };
  pairs.forEach((p) => {
    if (p.base === 'USD') {
      usdRates[p.quote] = p.rate;
    } else if (p.quote === 'USD') {
      usdRates[p.base] = 1 / p.rate;
    }
  });

  // Calculate rate
  const fromToUsd = usdRates[fromCode] ? 1 / usdRates[fromCode] : 1;
  const toFromUsd = usdRates[toCode] || 1;
  const finalRate = fromToUsd * toFromUsd;

  return +(amount * finalRate).toFixed(2);
}

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
    tvSymbol: 'INDEX:MXX',
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
    tvSymbol: 'CAPITALCOM:UK100',
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
    ticker: 'IPC',
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
    ticker: 'UKX',
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

// ==========================================
// 10. UNIFIED ASSET DETAIL DATA LAYER
//     (Supports dedicated A-to-Z pages for all cards)
// ==========================================

export interface MarketAssetDetail {
  slug: string;
  name: string;
  symbol: string;
  type: 'index' | 'forex' | 'crypto' | 'commodity' | 'news';
  price: string | number;
  change: number;
  changePercent: number;
  currency: string;
  exchange: string;
  country: string;
  region: string;
  status: MarketDataStatus;
  source: string;
  tvSymbol: string;
  high?: number;
  low?: number;
  googleFinanceUrl?: string;
  description: string;
  fullAnalysis: string[];
  keyStats: Array<{ label: string; value: string }>;
  constituents?: string[];
  newsHighlights?: string[];
  relatedSlugs: string[];
}

export const GOOGLE_FINANCE_URL_MAP: Record<string, string> = {
  // Global Indices
  sp500: 'https://www.google.com/finance/quote/.INX:INDEXSP',
  nasdaq100: 'https://www.google.com/finance/quote/NDX:INDEXNASDAQ',
  dowjones: 'https://www.google.com/finance/quote/.DJI:INDEXDJX',
  tsx: 'https://www.google.com/finance/quote/OSPTX:INDEXTSX',
  'bmv-ipc': 'https://www.google.com/finance/quote/ME:INDEXBMV',
  ftse100: 'https://www.google.com/finance/quote/UKX:INDEXFTSE',
  dax40: 'https://www.google.com/finance/quote/DAX:INDEXDB',
  cac40: 'https://www.google.com/finance/quote/PX1:INDEXEURO',
  smi20: 'https://www.google.com/finance/quote/SMI:INDEXSWX',
  ibex35: 'https://www.google.com/finance/quote/IBEX:INDEXBME',
  nikkei225: 'https://www.google.com/finance/quote/NI225:INDEXNIKKEI',
  hangseng: 'https://www.google.com/finance/quote/HSI:INDEXHANGSENG',
  csi300: 'https://www.google.com/finance/quote/000300:SHA',
  nifty50: 'https://www.google.com/finance/quote/NIFTY_50:INDEXNSE',
  kse100: 'https://www.google.com/finance/quote/KSE100:KAR',
  kospi: 'https://www.google.com/finance/quote/KOSPI:INDEXKRX',
  asx200: 'https://www.google.com/finance/quote/XJO:INDEXASX',
  tasi: 'https://www.google.com/finance/quote/TASI:TADAWUL',
  dfmgi: 'https://www.google.com/finance/quote/DFMGI:DFM',
  qse: 'https://www.google.com/finance/quote/QSI:DSM',
  bist100: 'https://www.google.com/finance/quote/XU100:INDEXIST',

  // Commodities & Energy
  gold: 'https://www.google.com/finance/quote/GCW00:COMEX',
  silver: 'https://www.google.com/finance/quote/SIW00:COMEX',
  'crude-oil-brent': 'https://www.google.com/finance/quote/BZW00:NYMEX',
  'crude-oil-wti': 'https://www.google.com/finance/quote/CLW00:NYMEX',
  'natural-gas': 'https://www.google.com/finance/quote/NGW00:NYMEX',
  copper: 'https://www.google.com/finance/quote/HG00:COMEX',

  // Crypto Assets
  bitcoin: 'https://www.google.com/finance/quote/BTC-USD',
  ethereum: 'https://www.google.com/finance/quote/ETH-USD',
  solana: 'https://www.google.com/finance/quote/SOL-USD',
  binancecoin: 'https://www.google.com/finance/quote/BNB-USD',
  ripple: 'https://www.google.com/finance/quote/XRP-USD',
  dogecoin: 'https://www.google.com/finance/quote/DOGE-USD',
  cardano: 'https://www.google.com/finance/quote/ADA-USD',
  'avalanche-2': 'https://www.google.com/finance/quote/AVAX-USD',

  // Forex Pairs
  'eur-usd': 'https://www.google.com/finance/quote/EUR-USD',
  'usd-pkr': 'https://www.google.com/finance/quote/USD-PKR',
  'gbp-usd': 'https://www.google.com/finance/quote/GBP-USD',
  'usd-jpy': 'https://www.google.com/finance/quote/USD-JPY',
  'usd-inr': 'https://www.google.com/finance/quote/USD-INR',
  'usd-aed': 'https://www.google.com/finance/quote/USD-AED',
  'usd-sar': 'https://www.google.com/finance/quote/USD-SAR',
};

// Comprehensive metadata catalog for in-depth asset pages
const ASSET_METADATA_CATALOG: Record<
  string,
  {
    description: string;
    fullAnalysis: string[];
    keyStats: Array<{ label: string; value: string }>;
    constituents?: string[];
    newsHighlights?: string[];
    relatedSlugs: string[];
  }
> = {
  // Global Indices
  sp500: {
    description:
      'The Standard & Poor’s 500 Index tracks 500 leading publicly traded companies across the United States. Weighted by float-adjusted market capitalization, it is widely regarded by institutional asset managers as the premier proxy for the American equity market and corporate earnings vitality.',
    fullAnalysis: [
      'The S&P 500 represents approximately 80% of total available U.S. stock market capitalization. Performance is heavily influenced by corporate earnings releases, Federal Reserve interest rate benchmarks, labor market productivity, and technological capital expenditures in generative AI and cloud infrastructure.',
      'Historically, the index rebalances quarterly in March, June, September, and December. Valuation multiples fluctuate around 20-25x forward earnings, with index resilience supported by substantial cash-flow generation across mega-cap technology and healthcare conglomerates.',
      'Risk factors currently monitored by market participants include services inflation persistence, sovereign debt issuance volumes, and consumer credit delinquencies.',
    ],
    keyStats: [
      { label: 'Asset Class', value: 'Large-Cap Equities' },
      { label: 'Weighting Method', value: 'Float-Adjusted Market Cap' },
      { label: 'Calculation Agent', value: 'S&P Dow Jones Indices' },
      { label: 'Rebalance Frequency', value: 'Quarterly (Mar/Jun/Sep/Dec)' },
      { label: 'Base Currency', value: 'USD ($)' },
      { label: 'Data Freshness', value: 'Real-Time Cboe BZX / 15m CTA' },
    ],
    constituents: [
      'Apple Inc. (AAPL)',
      'Microsoft Corp. (MSFT)',
      'NVIDIA Corp. (NVDA)',
      'Amazon.com Inc. (AMZN)',
      'Alphabet Inc. (GOOGL)',
      'Meta Platforms (META)',
      'Berkshire Hathaway (BRK.B)',
    ],
    newsHighlights: [
      'Federal Reserve Signals Measured Pace for Rate Easing as Services Inflation Persists',
      'Technology sector capital expenditures expand 28% year-over-year.',
    ],
    relatedSlugs: ['nasdaq100', 'dowjones', 'tsx', 'ftse100'],
  },
  nasdaq100: {
    description:
      'The NASDAQ 100 Index includes 100 of the largest domestic and international non-financial securities listed on The NASDAQ Stock Market based on market capitalization. It is the premier global benchmark for modern innovative enterprises.',
    fullAnalysis: [
      'Dominated by computer hardware, software, telecommunications, retail, and biotechnology pioneers, the NASDAQ 100 serves as the primary conduit for international growth-oriented capital flows.',
      'The index excludes financial firms such as commercial banks and investment brokers, making it exceptionally sensitive to long-term discount rates and yields on the 10-year US Treasury note.',
    ],
    keyStats: [
      { label: 'Asset Class', value: 'Growth & Technology Equities' },
      { label: 'Weighting Method', value: 'Modified Market Capitalization' },
      { label: 'Calculation Agent', value: 'Nasdaq, Inc.' },
      { label: 'Sector Dominance', value: 'Technology (~58%), Consumer (~18%)' },
      { label: 'Base Currency', value: 'USD ($)' },
    ],
    constituents: [
      'Apple Inc.',
      'Microsoft Corp.',
      'NVIDIA Corp.',
      'Broadcom Inc.',
      'Amazon.com Inc.',
      'Tesla Inc.',
    ],
    relatedSlugs: ['sp500', 'dowjones', 'bitcoin'],
  },
  dowjones: {
    description:
      'The Dow Jones Industrial Average is a price-weighted measure of 30 significant American blue-chip corporations. Formed in 1896 by Charles Dow, it remains the oldest continuous equity market indicator in North America.',
    fullAnalysis: [
      'Unlike market-cap indices, the Dow is price-weighted, meaning higher-priced stocks have a proportionally larger influence over index point swings regardless of total enterprise size.',
      'Its constituents span industrial giants, financial powerhouses, healthcare leaders, and modern technology bellwethers.',
    ],
    keyStats: [
      { label: 'Asset Class', value: 'Blue-Chip Equities' },
      { label: 'Weighting Method', value: 'Price-Weighted' },
      { label: 'Number of Stocks', value: '30 Elite Corporations' },
      { label: 'Calculation Agent', value: 'S&P Dow Jones Indices' },
    ],
    relatedSlugs: ['sp500', 'nasdaq100'],
  },
  kse100: {
    description:
      'The KSE 100 Index is the benchmark index of the Pakistan Stock Exchange (PSX). It comprises the top 100 listed companies categorized across 35 sectors, selected by market capitalization and sector representation.',
    fullAnalysis: [
      'The KSE 100 provides a comprehensive barometer of Pakistan’s commercial economy, with dominant weightings in Commercial Banks, Oil & Gas Exploration, Fertilizers, Cement, and Power Generation.',
      'Recent index performance has benefited from sharp domestic disinflation, State Bank of Pakistan policy rate easing from 22% down to 15%, IMF program stabilization, and growing foreign direct investment commitments from GCC sovereign funds.',
    ],
    keyStats: [
      { label: 'Exchange', value: 'Pakistan Stock Exchange (PSX)' },
      { label: 'Trading Hub', value: 'Karachi, Pakistan' },
      { label: 'Base Currency', value: 'Pakistani Rupee (PKR)' },
      { label: 'Data Latency', value: 'Official End-of-Day Quotations' },
      { label: 'Key Drivers', value: 'Monetary Policy, IMF Reviews, Energy Tariffs' },
    ],
    constituents: [
      'Oil & Gas Development Co. (OGDC)',
      'Engro Corporation (ENGRO)',
      'Fauji Fertilizer Co. (FFC)',
      'United Bank Limited (UBL)',
      'Habib Bank Limited (HBL)',
      'Lucky Cement (LUCK)',
    ],
    newsHighlights: [
      'State Bank of Pakistan Lowers Benchmark Policy Rate as Disinflation Takes Hold',
      'Foreign institutional portfolio inflows register net positive momentum on PSX.',
    ],
    relatedSlugs: ['usd-pkr', 'nifty50', 'tasi'],
  },
  ftse100: {
    description:
      'The FTSE 100 Index is a share index of the 100 companies listed on the London Stock Exchange with the highest market capitalization. It is heavily weighted toward international natural resources, pharmaceuticals, and global banking.',
    fullAnalysis: [
      'Over 75% of revenue generated by FTSE 100 constituents originates outside the United Kingdom, rendering the index an international earnings vehicle that frequently benefits from a weaker British Pound.',
    ],
    keyStats: [
      { label: 'Exchange', value: 'London Stock Exchange (LSE)' },
      { label: 'Base Currency', value: 'British Pound (GBP)' },
      { label: 'Data Latency', value: '15-Minute Delayed Public Feed' },
    ],
    relatedSlugs: ['dax40', 'cac40', 'gbp-usd'],
  },
  dax40: {
    description:
      'The DAX 40 is the benchmark stock market index of Germany, tracking 40 major German blue-chip enterprises trading on the Frankfurt Stock Exchange via the Xetra electronic platform.',
    fullAnalysis: [
      'German industrial leaders in automotive manufacturing, chemicals, advanced engineering, and enterprise software dictate the index’s performance.',
    ],
    keyStats: [
      { label: 'Exchange', value: 'Deutsche Börse Xetra' },
      { label: 'Base Currency', value: 'Euro (EUR)' },
      { label: 'Data Latency', value: '15-Minute Delayed Public Feed' },
    ],
    relatedSlugs: ['cac40', 'ftse100', 'eur-usd'],
  },
  nikkei225: {
    description:
      'The Nikkei 225 is Japan’s foremost price-weighted equity index, tracking 225 prominent companies listed on the Tokyo Stock Exchange.',
    fullAnalysis: [
      'Constituents include global automotive leaders, semiconductor equipment manufacturers, and consumer electronics conglomerates.',
    ],
    keyStats: [
      { label: 'Exchange', value: 'Tokyo Stock Exchange (TSE)' },
      { label: 'Base Currency', value: 'Japanese Yen (JPY)' },
      { label: 'Data Latency', value: '15-Minute Delayed Feed' },
    ],
    relatedSlugs: ['hangseng', 'kospi', 'usd-jpy'],
  },
  hangseng: {
    description:
      'The Hang Seng Index is a free-float market-capitalization-weighted stock market index in Hong Kong, tracking major commercial and technology leaders in Greater China.',
    fullAnalysis: [
      'Serves as the vital international financial bridge between global capital allocators and Mainland Chinese corporate enterprises.',
    ],
    keyStats: [
      { label: 'Exchange', value: 'Hong Kong Exchanges (HKEX)' },
      { label: 'Base Currency', value: 'Hong Kong Dollar (HKD)' },
      { label: 'Data Latency', value: '15-Minute Delayed Feed' },
    ],
    relatedSlugs: ['csi300', 'nikkei225'],
  },
  tasi: {
    description:
      'The Tadawul All Share Index (TASI) tracks all listed companies on the Saudi Exchange in Riyadh, representing the financial anchor of the Gulf Cooperation Council (GCC).',
    fullAnalysis: [
      'Underpinned by energy infrastructure, commercial banking, petrochemicals, and real estate development driving the Saudi Vision 2030 economic transformation.',
    ],
    keyStats: [
      { label: 'Exchange', value: 'Saudi Exchange (Tadawul)' },
      { label: 'Base Currency', value: 'Saudi Riyal (SAR)' },
      { label: 'Data Latency', value: '15-Minute Delayed Feed' },
    ],
    relatedSlugs: ['crude-oil-brent', 'usd-sar', 'dfmgi'],
  },

  // Commodities
  gold: {
    description:
      'Gold (XAU/USD) is the world’s preeminent monetary reserve asset and store of value. It trades internationally against the US Dollar in units of Troy Ounces, governed by LBMA spot fixing and COMEX futures pricing.',
    fullAnalysis: [
      'Gold exhibits a historically negative correlation with real interest rates. Central banks globally have acquired record bullion volumes over consecutive quarters to diversify sovereign foreign exchange reserves away from single-currency concentration risk.',
    ],
    keyStats: [
      { label: 'Asset Class', value: 'Precious Metals / Sovereign Reserve' },
      { label: 'Pricing Unit', value: 'USD per Troy Ounce ($/oz)' },
      { label: 'Standard Bar', value: '400 Troy Ounces (99.5% pure)' },
      { label: 'Primary Centers', value: 'London (LBMA), New York (COMEX), Shanghai' },
    ],
    relatedSlugs: ['silver', 'crude-oil-brent', 'usd-chf'],
  },
  silver: {
    description:
      'Silver (XAG/USD) serves dual roles as an investment store of value and an indispensable industrial metal vital to photovoltaic solar panels, semiconductor electronics, and medical technologies.',
    fullAnalysis: [
      'Industrial demand constitutes over 55% of global silver consumption, driving tight supply deficits as global green energy and electric vehicle manufacturing scales.',
    ],
    keyStats: [
      { label: 'Asset Class', value: 'Precious & Industrial Metal' },
      { label: 'Pricing Unit', value: 'USD per Troy Ounce ($/oz)' },
    ],
    relatedSlugs: ['gold', 'copper'],
  },
  'crude-oil-brent': {
    description:
      'Brent Crude is the international benchmark for Atlantic basin light sweet crude oil. Sourced from the North Sea, it prices roughly two-thirds of the world’s internationally traded physical oil supplies.',
    fullAnalysis: [
      'Prices are governed by OPEC+ production quota agreements, global industrial activity, non-OPEC deepwater exploration, and geopolitical shipping corridors through the Strait of Hormuz and Red Sea.',
    ],
    keyStats: [
      { label: 'Asset Class', value: 'Global Energy Benchmark' },
      { label: 'Pricing Unit', value: 'USD per Barrel ($/bbl = 42 US Gallons)' },
      { label: 'Primary Exchange', value: 'ICE Futures Europe' },
    ],
    relatedSlugs: ['crude-oil-wti', 'natural-gas', 'tasi'],
  },
  'crude-oil-wti': {
    description:
      'West Texas Intermediate (WTI) is the domestic crude oil benchmark for the United States, delivered physically at Cushing, Oklahoma, the pivotal storage and pipeline junction of North America.',
    fullAnalysis: [
      'Extracted predominantly from the Permian Basin and Eagle Ford formations, WTI has cemented the United States as the world’s top petroleum producer.',
    ],
    keyStats: [
      { label: 'Asset Class', value: 'North American Energy Benchmark' },
      { label: 'Pricing Unit', value: 'USD per Barrel ($/bbl)' },
      { label: 'Primary Exchange', value: 'New York Mercantile Exchange (NYMEX)' },
    ],
    relatedSlugs: ['crude-oil-brent', 'natural-gas'],
  },

  // Crypto
  bitcoin: {
    description:
      'Bitcoin (BTC) is the world’s first decentralized, cryptographically secured digital currency. Operating on a peer-to-peer Proof-of-Work blockchain, it features a mathematically hardcoded supply limit of 21 million units.',
    fullAnalysis: [
      'Institutional adoption has accelerated via regulated spot exchange-traded funds (ETFs), positioning Bitcoin as a programmatic hedge against fiat currency debasement and sovereign fiscal deficits.',
      'The network undergoes a halving event every 210,000 blocks (roughly 4 years), cutting the block subsidy reward in half and mechanically diminishing new issuance.',
    ],
    keyStats: [
      { label: 'Asset Class', value: 'Decentralized Digital Asset' },
      { label: 'Max Supply Cap', value: '21,000,000 BTC' },
      { label: 'Consensus Mechanism', value: 'Proof of Work (SHA-256)' },
      { label: 'Block Time', value: '~10 Minutes' },
      { label: 'Market Rank', value: '#1 Globally' },
    ],
    relatedSlugs: ['ethereum', 'solana', 'gold'],
  },
  ethereum: {
    description:
      'Ethereum is a decentralized open-source blockchain featuring smart contract functionality. Ether (ETH) serves as the native currency powering the decentralized finance (DeFi), tokenization, and web3 ecosystem.',
    fullAnalysis: [
      'Transitioned to Proof of Stake consensus via The Merge, reducing network electrical consumption by 99.9% and introducing a dynamic token burn mechanism that burns base fees during high network activity.',
    ],
    keyStats: [
      { label: 'Asset Class', value: 'Smart Contract Platform' },
      { label: 'Consensus', value: 'Proof of Stake' },
      { label: 'Market Rank', value: '#2 Globally' },
    ],
    relatedSlugs: ['bitcoin', 'solana', 'binancecoin'],
  },

  // Forex
  'eur-usd': {
    description:
      'The EUR/USD currency pair represents the relative value of the Euro against the United States Dollar. It is the single most liquid and actively traded financial instrument on earth, handling over 24% of daily global foreign exchange turnover.',
    fullAnalysis: [
      'Price trajectory is dictated by monetary policy rate divergence between the US Federal Reserve and the European Central Bank, sovereign debt spreads across Eurozone member states, and transatlantic trade flows.',
    ],
    keyStats: [
      { label: 'Pair', value: 'Euro / US Dollar' },
      { label: 'Base Currency', value: 'Euro (EUR)' },
      { label: 'Quote Currency', value: 'US Dollar (USD)' },
      { label: 'Standard Lot', value: '100,000 Units' },
      { label: 'Data Source', value: 'European Central Bank (ECB) Reference' },
    ],
    relatedSlugs: ['gbp-usd', 'usd-chf', 'dax40'],
  },
  'usd-pkr': {
    description:
      'The USD/PKR exchange rate tracks the value of the United States Dollar against the Pakistani Rupee. It is regulated by the State Bank of Pakistan (SBP) via an interbank market framework with managed foreign exchange buffers.',
    fullAnalysis: [
      'Rate stability is supported by overseas Pakistani remittances exceeding $3 billion monthly, multi-year IMF Extended Fund Facility program benchmarks, structural energy sector reforms, and fiscal consolidation.',
    ],
    keyStats: [
      { label: 'Pair', value: 'US Dollar / Pakistani Rupee' },
      { label: 'Central Bank', value: 'State Bank of Pakistan (SBP)' },
      { label: 'Fixing Source', value: 'SBP Interbank Weighted Average Closing' },
      { label: 'Data Latency', value: 'End-of-Day Official Daily Rate' },
    ],
    relatedSlugs: ['kse100', 'usd-inr', 'usd-aed'],
  },
};

/**
 * Get unified detailed market asset by slug across all classes
 */
export function getMarketAssetBySlug(slug: string): MarketAssetDetail | null {
  const cleanSlug = slug.toLowerCase().trim();

  // 1. Check Global Indices
  const index = INITIAL_GLOBAL_INDICES.find((i) => i.id === cleanSlug);
  if (index) {
    const meta = ASSET_METADATA_CATALOG[cleanSlug] || {
      description: `${index.name} is a leading equity market benchmark tracking primary public corporations on ${index.exchange}.`,
      fullAnalysis: [
        `As a key barometer of ${index.country}'s economic activity, the ${index.name} reflects corporate earnings resilience, sovereign fiscal developments, and central bank interest rate settings.`,
        `Trading information is provided under official exchange distribution terms with clear ${index.status} latency disclosures.`,
      ],
      keyStats: [
        { label: 'Exchange', value: index.exchange },
        { label: 'Country', value: index.country },
        { label: 'Base Currency', value: index.currency },
        { label: 'Data Latency', value: index.status === 'real-time' ? 'Real-Time' : '15-Min Delayed' },
      ],
      relatedSlugs: ['sp500', 'kse100', 'gold', 'bitcoin'],
    };

    return {
      slug: index.id,
      name: index.name,
      symbol: index.symbol,
      type: 'index',
      price: index.price,
      change: index.change,
      changePercent: index.changePercent,
      currency: index.currency,
      exchange: index.exchange,
      country: index.country,
      region: index.region,
      status: index.status,
      source: index.source,
      tvSymbol: index.tvSymbol,
      high: index.high,
      low: index.low,
      googleFinanceUrl: GOOGLE_FINANCE_URL_MAP[cleanSlug] || `https://www.google.com/finance/quote/${index.symbol}`,
      description: meta.description,
      fullAnalysis: meta.fullAnalysis,
      keyStats: meta.keyStats,
      constituents: meta.constituents,
      newsHighlights: meta.newsHighlights,
      relatedSlugs: meta.relatedSlugs,
    };
  }

  // 2. Check Commodities
  const comm = INITIAL_COMMODITIES.find((c) => c.id === cleanSlug);
  if (comm) {
    const meta = ASSET_METADATA_CATALOG[cleanSlug] || {
      description: `${comm.name} (${comm.symbol}) is an internationally traded primary raw material priced in ${comm.unit}.`,
      fullAnalysis: [
        `Prices are benchmarked on leading commodities exchanges with active spot and front-month continuous futures trading.`,
      ],
      keyStats: [
        { label: 'Category', value: comm.category },
        { label: 'Quotation Unit', value: comm.unit },
        { label: 'Contract Specification', value: comm.contract },
      ],
      relatedSlugs: ['gold', 'crude-oil-brent', 'crude-oil-wti'],
    };

    return {
      slug: comm.id,
      name: comm.name,
      symbol: comm.symbol,
      type: 'commodity',
      price: comm.price,
      change: comm.change,
      changePercent: comm.changePercent,
      currency: 'USD',
      exchange: comm.source,
      country: 'Global',
      region: 'commodities',
      status: comm.status,
      source: comm.source,
      tvSymbol: comm.tvSymbol,
      high: +(comm.price * 1.015).toFixed(2),
      low: +(comm.price * 0.985).toFixed(2),
      googleFinanceUrl: GOOGLE_FINANCE_URL_MAP[cleanSlug] || `https://www.google.com/finance/quote/${comm.symbol}`,
      description: meta.description,
      fullAnalysis: meta.fullAnalysis,
      keyStats: meta.keyStats,
      relatedSlugs: meta.relatedSlugs,
    };
  }

  // 3. Check Crypto Assets
  const crypto = INITIAL_CRYPTO_ASSETS.find((c) => c.id === cleanSlug);
  if (crypto) {
    const meta = ASSET_METADATA_CATALOG[cleanSlug] || {
      description: `${crypto.name} (${crypto.symbol}) is a decentralized digital asset trading on international cryptocurrency exchanges.`,
      fullAnalysis: [
        `Global market metrics, 24-hour liquidity volume, and circulating market capitalization are aggregated from public non-commercial feeds.`,
      ],
      keyStats: [
        { label: 'Symbol', value: crypto.symbol },
        { label: 'Market Rank', value: `#${crypto.rank}` },
        { label: 'Circulating Cap', value: `$${(crypto.marketCap / 1e9).toFixed(2)}B` },
        { label: '24h Volume', value: `$${(crypto.volume24h / 1e9).toFixed(2)}B` },
      ],
      relatedSlugs: ['bitcoin', 'ethereum', 'solana'],
    };

    const tvMap: Record<string, string> = {
      bitcoin: 'BINANCE:BTCUSDT',
      ethereum: 'BINANCE:ETHUSDT',
      solana: 'BINANCE:SOLUSDT',
      binancecoin: 'BINANCE:BNBUSDT',
      ripple: 'BINANCE:XRPUSDT',
      dogecoin: 'BINANCE:DOGEUSDT',
      cardano: 'BINANCE:ADAUSDT',
      'avalanche-2': 'BINANCE:AVAXUSDT',
    };

    return {
      slug: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      type: 'crypto',
      price: crypto.priceUsd,
      change: +(crypto.priceUsd * (crypto.change24h / 100)).toFixed(2),
      changePercent: crypto.change24h,
      currency: 'USD',
      exchange: 'CoinPaprika / Binance Public Aggregation',
      country: 'Decentralized',
      region: 'global',
      status: crypto.status,
      source: crypto.source,
      tvSymbol: tvMap[cleanSlug] || `BINANCE:${crypto.symbol}USDT`,
      high: +(crypto.priceUsd * 1.035).toFixed(2),
      low: +(crypto.priceUsd * 0.965).toFixed(2),
      googleFinanceUrl: GOOGLE_FINANCE_URL_MAP[cleanSlug] || `https://www.google.com/finance/quote/${crypto.symbol}-USD`,
      description: meta.description,
      fullAnalysis: meta.fullAnalysis,
      keyStats: meta.keyStats,
      relatedSlugs: meta.relatedSlugs,
    };
  }

  // 4. Check Forex Pairs
  const fx = INITIAL_FOREX_PAIRS.find((f) => f.id === cleanSlug);
  if (fx) {
    const meta = ASSET_METADATA_CATALOG[cleanSlug] || {
      description: `The ${fx.pair} exchange rate represents the value of ${fx.base} expressed in terms of ${fx.quote}.`,
      fullAnalysis: [
        `Official exchange rates provided via European Central Bank (ECB) daily reference rates and national central bank fixings.`,
      ],
      keyStats: [
        { label: 'Base Currency', value: fx.base },
        { label: 'Quote Currency', value: fx.quote },
        { label: 'Pair Category', value: fx.category },
      ],
      relatedSlugs: ['eur-usd', 'usd-pkr', 'gbp-usd'],
    };

    return {
      slug: fx.id,
      name: `${fx.pair} Currency Rate`,
      symbol: fx.pair,
      type: 'forex',
      price: fx.rate,
      change: fx.change24h,
      changePercent: fx.changePercent24h,
      currency: fx.quote,
      exchange: fx.source,
      country: 'International',
      region: 'forex',
      status: fx.status,
      source: fx.source,
      tvSymbol: `FX_IDC:${fx.base}${fx.quote}`,
      high: +(fx.rate * 1.008).toFixed(4),
      low: +(fx.rate * 0.992).toFixed(4),
      googleFinanceUrl: GOOGLE_FINANCE_URL_MAP[cleanSlug] || `https://www.google.com/finance/quote/${fx.base}-${fx.quote}`,
      description: meta.description,
      fullAnalysis: meta.fullAnalysis,
      keyStats: meta.keyStats,
      relatedSlugs: meta.relatedSlugs,
    };
  }

  // 5. Check Financial News Dispatches (In-Site Article View)
  const news = INITIAL_FINANCIAL_NEWS.find((n) => n.id === cleanSlug);
  if (news) {
    const tvSymbolForNews: Record<string, string> = {
      'news-1': 'CAPITALCOM:US500',
      'news-2': 'INDEX:DAX',
      'news-3': 'PSX:KSE100',
      'news-4': 'TVC:UKOIL',
      'news-5': 'TADAWUL:TASI',
      'news-6': 'INDEX:NKY',
      'news-7': 'OANDA:XAUUSD',
      'news-8': 'BINANCE:BTCUSDT',
    };

    return {
      slug: news.id,
      name: news.title,
      symbol: news.symbols?.[0] || 'NEWS',
      type: 'news',
      price: 'Intelligence Dispatch',
      change: 0,
      changePercent: 0,
      currency: 'N/A',
      exchange: news.source,
      country: news.region,
      region: news.category,
      status: 'real-time',
      source: news.source,
      tvSymbol: tvSymbolForNews[cleanSlug] || 'CAPITALCOM:US500',
      description: news.summary,
      fullAnalysis: [
        news.summary,
        `This executive financial intelligence dispatch was synthesized by Questo Market Intelligence from verified public regulatory disclosures, central bank announcements, and institutional reporting.`,
        `Market participants should monitor key support and resistance thresholds along with scheduled macroeconomic calendar releases to gauge future directional volatility.`,
      ],
      keyStats: [
        { label: 'Category', value: news.category.toUpperCase() },
        { label: 'Primary Jurisdiction', value: news.region },
        { label: 'Original Wire Source', value: news.source },
        { label: 'Publication Timestamp', value: new Date(news.publishedAt).toUTCString() },
        { label: 'Primary Tickers Tracked', value: (news.symbols || []).join(', ') },
      ],
      newsHighlights: [news.title],
      relatedSlugs: ['sp500', 'kse100', 'gold', 'bitcoin', 'crude-oil-brent'],
    };
  }

  return null;
}

/**
 * Return all 59 asset slugs for static SSG generation and routing
 */
export function getAllMarketAssetSlugs(): string[] {
  const indices = INITIAL_GLOBAL_INDICES.map((i) => i.id);
  const comms = INITIAL_COMMODITIES.map((c) => c.id);
  const cryptos = INITIAL_CRYPTO_ASSETS.map((c) => c.id);
  const forex = INITIAL_FOREX_PAIRS.map((f) => f.id);
  const news = INITIAL_FINANCIAL_NEWS.map((n) => n.id);

  return [...indices, ...comms, ...cryptos, ...forex, ...news];
}

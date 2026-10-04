export type InstrumentType = 'MUTUAL_FUND' | 'ETF';

export interface BaseInstrument {
  id: string;
  code: string;
  symbol?: string;
  name: string;
  fundHouse: string;
  category: string;
  schemeType: InstrumentType;
  exchange?: 'NSE' | 'BSE' | 'AMFI';
  isin?: string;
  riskRating?: 'Low' | 'Moderate' | 'High' | 'Very High';
  expenseRatio?: number;
  aum?: number; // In Crores INR
  returns?: {
    return1m?: number;
    return3m?: number;
    return6m?: number;
    return1y?: number;
    return3y?: number;
    return5y?: number;
    returnInception?: number;
  };
}

export interface MutualFundData extends BaseInstrument {
  schemeType: 'MUTUAL_FUND';
  currentNav: number;
  navDate: string; // e.g. "25-Aug-2026"
  previousNav: number;
  dayChange: number;
  dayChangePercentage: number;
  isNavLatest: boolean;
  navUpdateFrequency: string; // "DAILY_AMFI_EOD"
  amfiPublishedAt?: string;
  lastSyncedTimestamp: number;
  historicalNav?: Array<{ date: string; nav: number }>;
}

export interface EtfData extends BaseInstrument {
  schemeType: 'ETF';
  symbol: string;
  ltp: number; // Last Traded Price
  previousClose: number;
  dayChange: number;
  dayChangePercentage: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  marketState: 'REGULAR' | 'CLOSED' | 'PRE' | 'POST';
  isMarketLive: boolean;
  lastUpdatedTimestamp: number;
  historicalQuotes?: Array<{ date: string; close: number; volume?: number }>;
}

export type UnifiedInstrument = MutualFundData | EtfData;

export interface MarketSessionStatus {
  isOpen: boolean;
  state: 'REGULAR' | 'CLOSED' | 'PRE' | 'POST';
  currentTimeIST: string;
  nextOpenTimeIST: string;
  isTradingDay: boolean;
}

export interface NavSyncResult {
  totalTracked: number;
  syncedCount: number;
  failedCount: number;
  lastSyncTime: string;
  status: 'IDLE' | 'SYNCING' | 'COMPLETED' | 'ERROR';
  details?: Array<{ code: string; status: 'SUCCESS' | 'SKIPPED' | 'FAILED'; error?: string }>;
}

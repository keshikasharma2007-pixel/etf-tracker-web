// The raw ETF definition — just what we need to identify and fetch each ETF
export interface ETFDefinition {
  ticker: string;       // e.g. "SPY"
  name: string;         // e.g. "SPDR S&P 500 ETF Trust"
  assetClass: AssetClass;
}

export type AssetClass =
  | "US Equity"
  | "International Equity"
  | "Fixed Income"
  | "Commodity"
  | "Real Estate"
  | "Sector"
  | "Inverse/Leveraged";

// The fully computed ETF object returned by the API
export interface ETFData {
  ticker: string;
  name: string;
  assetClass: AssetClass;
  cmp: number;              // Current market price
  dma20: number;            // 20-day moving average
  diff: number;             // cmp - dma20
  percentFromDMA: number;   // (diff / dma20) * 100 — negative means below DMA (buy signal)
  rank: number;             // 1 = most discounted vs 20 DMA
  volume: number;           // Daily volume
  lastUpdated: string;      // ISO timestamp of last data fetch
}

// The full API response shape sent to the frontend
export interface ETFApiResponse {
  etfs: ETFData[];
  top3: ETFData[];          // Pre-computed top 3 buys
  marketStatus: MarketStatus;
  lastUpdated: string;
  nextRefresh: string;      // ISO timestamp of next scheduled refresh
}

export interface MarketStatus {
  isOpen: boolean;
  label: string;            // e.g. "Market Open" | "Market Closed" | "Pre-Market"
  nextEventLabel: string;   // e.g. "Closes in 2h 34m" | "Opens in 6h 12m"
  nextEventTime: string;    // ISO timestamp
}

// Shape of what yahoo-finance2 returns for a quote — we only pick what we need
export interface YahooQuote {
  regularMarketPrice: number;
  regularMarketVolume: number;
  shortName: string;
}

// Shape of a single historical price entry from yahoo-finance2
export interface YahooHistoricalEntry {
  date: Date;
  close: number;
}

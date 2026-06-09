// These types mirror the backend's etf.types.ts exactly.
// In a more mature monorepo you'd share this via a /packages/shared workspace,
// but for simplicity we keep a copy here and keep them in sync manually.

export type AssetClass =
  | "US Equity"
  | "International Equity"
  | "Fixed Income"
  | "Commodity"
  | "Real Estate"
  | "Sector"
  | "Inverse/Leveraged";

export interface ETFData {
  ticker: string;
  name: string;
  assetClass: AssetClass;
  cmp: number;
  dma20: number;
  diff: number;
  percentFromDMA: number;  // negative = below 20 DMA = buy signal
  rank: number;
  volume: number;
  lastUpdated: string;
}

export interface MarketStatus {
  isOpen: boolean;
  label: string;
  nextEventLabel: string;
  nextEventTime: string;
}

export interface ETFApiResponse {
  etfs: ETFData[];
  top3: ETFData[];
  marketStatus: MarketStatus;
  lastUpdated: string;
  nextRefresh: string;
}

// Sort column options available in the table
export type SortKey = "rank" | "ticker" | "cmp" | "dma20" | "percentFromDMA" | "volume";
export type SortDirection = "asc" | "desc";

// Filter state managed by Zustand
export interface FilterState {
  assetClass: AssetClass | "All";
  search: string;
  sortKey: SortKey;
  sortDirection: SortDirection;
  fundAmount: number; // user's total fund in USD for the calculator
}

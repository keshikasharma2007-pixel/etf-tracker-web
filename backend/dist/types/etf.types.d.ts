export interface ETFDefinition {
    ticker: string;
    name: string;
    assetClass: AssetClass;
}
export type AssetClass = "US Equity" | "International Equity" | "Fixed Income" | "Commodity" | "Real Estate" | "Sector" | "Inverse/Leveraged";
export interface ETFData {
    ticker: string;
    name: string;
    assetClass: AssetClass;
    cmp: number;
    dma20: number;
    diff: number;
    percentFromDMA: number;
    rank: number;
    volume: number;
    lastUpdated: string;
}
export interface ETFApiResponse {
    etfs: ETFData[];
    top3: ETFData[];
    marketStatus: MarketStatus;
    lastUpdated: string;
    nextRefresh: string;
}
export interface MarketStatus {
    isOpen: boolean;
    label: string;
    nextEventLabel: string;
    nextEventTime: string;
}
export interface YahooQuote {
    regularMarketPrice: number;
    regularMarketVolume: number;
    shortName: string;
}
export interface YahooHistoricalEntry {
    date: Date;
    close: number;
}
//# sourceMappingURL=etf.types.d.ts.map
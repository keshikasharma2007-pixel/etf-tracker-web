"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllETFData = fetchAllETFData;
const yahoo_finance2_1 = __importDefault(require("yahoo-finance2"));
const etfList_1 = require("../data/etfList");
const marketHours_1 = require("../utils/marketHours");
const HISTORY_DAYS = 30;
const yahooFinance = new yahoo_finance2_1.default();
// Replicates the Google Sheet formula: take the 20 most recent trading day closes
// and compute their simple average. Yahoo returns history oldest-first, so we slice from the end.
function compute20DMAByDate(closes) {
    const recent20 = closes.slice(-20);
    if (recent20.length < 20)
        return NaN;
    const sum = recent20.reduce((acc, price) => acc + price, 0);
    return sum / 20;
}
// Cast to any — yahoo-finance2 v3 has complex overloaded return types that don't
// infer cleanly in strict mode. We validate and re-type the values we use below.
async function fetchQuote(ticker) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const quote = await yahooFinance.quote(ticker);
        if (!quote?.regularMarketPrice)
            return null;
        return {
            price: quote.regularMarketPrice,
            volume: (quote.regularMarketVolume ?? 0),
        };
    }
    catch {
        return null;
    }
}
async function fetch20DMA(ticker) {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - HISTORY_DAYS);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const history = await yahooFinance.historical(ticker, {
            period1: startDate,
            period2: endDate,
            interval: "1d",
        });
        if (!history || history.length < 20)
            return null;
        const closes = history
            .map((entry) => entry.close)
            .filter((c) => c != null);
        return compute20DMAByDate(closes);
    }
    catch {
        return null;
    }
}
async function processBatch(items, batchSize, processor, delayMs = 200) {
    const results = new Map();
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(async (ticker) => ({ ticker, result: await processor(ticker) })));
        batchResults.forEach(({ ticker, result }) => results.set(ticker, result));
        if (i + batchSize < items.length) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
    return results;
}
async function fetchAllETFData() {
    console.log("[Yahoo] Starting ETF data fetch...");
    const now = new Date().toISOString();
    const tickers = etfList_1.ETF_LIST.map((e) => e.ticker);
    const [quoteMap, dmaMap] = await Promise.all([
        processBatch(tickers, 10, fetchQuote),
        processBatch(tickers, 5, fetch20DMA, 400),
    ]);
    const etfs = [];
    for (const def of etfList_1.ETF_LIST) {
        const quote = quoteMap.get(def.ticker);
        const dma20 = dmaMap.get(def.ticker);
        if (!quote || !dma20 || isNaN(dma20))
            continue;
        const diff = quote.price - dma20;
        const percentFromDMA = (diff / dma20) * 100;
        etfs.push({
            ticker: def.ticker,
            name: def.name,
            assetClass: def.assetClass,
            cmp: parseFloat(quote.price.toFixed(2)),
            dma20: parseFloat(dma20.toFixed(2)),
            diff: parseFloat(diff.toFixed(2)),
            percentFromDMA: parseFloat(percentFromDMA.toFixed(4)),
            rank: 0,
            volume: quote.volume,
            lastUpdated: now,
        });
    }
    etfs.sort((a, b) => a.percentFromDMA - b.percentFromDMA);
    etfs.forEach((etf, i) => (etf.rank = i + 1));
    const top3 = etfs.slice(0, 3);
    const marketStatus = (0, marketHours_1.getMarketStatus)();
    const nextRefresh = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    console.log(`[Yahoo] Fetch complete. ${etfs.length} ETFs processed.`);
    return { etfs, top3, marketStatus, lastUpdated: now, nextRefresh };
}
//# sourceMappingURL=yahooFinance.service.js.map
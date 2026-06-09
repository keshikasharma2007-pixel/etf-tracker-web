"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getETFs = getETFs;
exports.forceRefresh = forceRefresh;
const redis_service_1 = require("../services/redis.service");
const yahooFinance_service_1 = require("../services/yahooFinance.service");
const marketHours_1 = require("../utils/marketHours");
// GET /api/etfs
// 1. Check Redis cache — return immediately if fresh data exists
// 2. Cache miss → fetch from Yahoo Finance, store in Redis, return
async function getETFs(req, res) {
    try {
        const cached = await redis_service_1.redisService.get();
        if (cached) {
            // Always return updated market status even when serving cached ETF data,
            // since market open/closed status changes by the minute
            cached.marketStatus = (0, marketHours_1.getMarketStatus)();
            res.json(cached);
            return;
        }
        // Cache miss — fetch live data (this takes a few seconds)
        const data = await (0, yahooFinance_service_1.fetchAllETFData)();
        await redis_service_1.redisService.set(data);
        res.json(data);
    }
    catch (err) {
        console.error("[Controller] Error fetching ETF data:", err);
        res.status(500).json({ error: "Failed to fetch ETF data. Please try again." });
    }
}
// POST /api/etfs/refresh  (internal use — called by the cron job or manually)
// Force-invalidates cache and triggers a fresh fetch
async function forceRefresh(req, res) {
    try {
        await redis_service_1.redisService.invalidate();
        const data = await (0, yahooFinance_service_1.fetchAllETFData)();
        await redis_service_1.redisService.set(data);
        res.json({ success: true, etfsProcessed: data.etfs.length });
    }
    catch (err) {
        console.error("[Controller] Force refresh error:", err);
        res.status(500).json({ error: "Refresh failed." });
    }
}
//# sourceMappingURL=etf.controller.js.map
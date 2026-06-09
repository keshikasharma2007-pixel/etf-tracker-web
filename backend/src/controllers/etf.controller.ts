import { Request, Response } from "express";
import { redisService } from "../services/redis.service";
import { fetchAllETFData } from "../services/yahooFinance.service";
import { getMarketStatus } from "../utils/marketHours";

// GET /api/etfs
// 1. Check Redis cache — return immediately if fresh data exists
// 2. Cache miss → fetch from Yahoo Finance, store in Redis, return
export async function getETFs(req: Request, res: Response): Promise<void> {
  try {
    const cached = await redisService.get();

    if (cached) {
      // Always return updated market status even when serving cached ETF data,
      // since market open/closed status changes by the minute
      cached.marketStatus = getMarketStatus();
      res.json(cached);
      return;
    }

    // Cache miss — fetch live data (this takes a few seconds)
    const data = await fetchAllETFData();
    await redisService.set(data);
    res.json(data);
  } catch (err) {
    console.error("[Controller] Error fetching ETF data:", err);
    res.status(500).json({ error: "Failed to fetch ETF data. Please try again." });
  }
}

// POST /api/etfs/refresh  (internal use — called by the cron job or manually)
// Force-invalidates cache and triggers a fresh fetch
export async function forceRefresh(req: Request, res: Response): Promise<void> {
  try {
    await redisService.invalidate();
    const data = await fetchAllETFData();
    await redisService.set(data);
    res.json({ success: true, etfsProcessed: data.etfs.length });
  } catch (err) {
    console.error("[Controller] Force refresh error:", err);
    res.status(500).json({ error: "Refresh failed." });
  }
}

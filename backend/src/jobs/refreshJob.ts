import cron from "node-cron";
import { fetchAllETFData } from "../services/yahooFinance.service";
import { redisService } from "../services/redis.service";
import { isMarketOpen } from "../utils/marketHours";

// Runs every 15 minutes during market hours (Mon–Fri, 9:30–16:00 ET).
// Cron syntax: "*/15 * * * *" = "at minute 0, 15, 30, 45 of every hour, every day"
// We then guard with isMarketOpen() so we don't hit Yahoo Finance overnight or on weekends.
export function startRefreshJob(): void {
  cron.schedule("*/15 * * * *", async () => {
    if (!isMarketOpen()) {
      console.log("[Cron] Market closed — skipping refresh.");
      return;
    }

    console.log("[Cron] Market open — refreshing ETF data...");
    try {
      await redisService.invalidate();
      const data = await fetchAllETFData();
      await redisService.set(data);
      console.log(`[Cron] Refresh complete. ${data.etfs.length} ETFs updated.`);
    } catch (err) {
      console.error("[Cron] Refresh failed:", err);
      // Don't rethrow — a failed refresh just means we serve slightly stale cached data
    }
  });

  console.log("[Cron] Refresh job scheduled (every 15 mins, market hours only).");
}

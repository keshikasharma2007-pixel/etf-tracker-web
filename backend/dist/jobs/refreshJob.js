"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startRefreshJob = startRefreshJob;
const node_cron_1 = __importDefault(require("node-cron"));
const yahooFinance_service_1 = require("../services/yahooFinance.service");
const redis_service_1 = require("../services/redis.service");
const marketHours_1 = require("../utils/marketHours");
// Runs every 15 minutes during market hours (Mon–Fri, 9:30–16:00 ET).
// Cron syntax: "*/15 * * * *" = "at minute 0, 15, 30, 45 of every hour, every day"
// We then guard with isMarketOpen() so we don't hit Yahoo Finance overnight or on weekends.
function startRefreshJob() {
    node_cron_1.default.schedule("*/15 * * * *", async () => {
        if (!(0, marketHours_1.isMarketOpen)()) {
            console.log("[Cron] Market closed — skipping refresh.");
            return;
        }
        console.log("[Cron] Market open — refreshing ETF data...");
        try {
            await redis_service_1.redisService.invalidate();
            const data = await (0, yahooFinance_service_1.fetchAllETFData)();
            await redis_service_1.redisService.set(data);
            console.log(`[Cron] Refresh complete. ${data.etfs.length} ETFs updated.`);
        }
        catch (err) {
            console.error("[Cron] Refresh failed:", err);
            // Don't rethrow — a failed refresh just means we serve slightly stale cached data
        }
    });
    console.log("[Cron] Refresh job scheduled (every 15 mins, market hours only).");
}
//# sourceMappingURL=refreshJob.js.map
import { Redis } from "@upstash/redis";
import { ETFApiResponse } from "../types/etf.types";

// Upstash's Redis client uses HTTP under the hood (REST API), not a raw TCP socket.
// This is why it works in serverless/edge environments — no persistent connection needed.
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CACHE_KEY = "etf:all";
const CACHE_TTL = parseInt(process.env.CACHE_TTL_SECONDS || "900"); // default 15 mins

export const redisService = {
  // Retrieves cached ETF data. Returns null on cache miss or error.
  async get(): Promise<ETFApiResponse | null> {
    try {
      const data = await redis.get<ETFApiResponse>(CACHE_KEY);
      return data ?? null;
    } catch (err) {
      // Don't crash the app on a cache miss or Redis outage — just return null
      // and let the caller fall through to a fresh Yahoo Finance fetch
      console.error("[Redis] GET error:", err);
      return null;
    }
  },

  // Stores ETF data with a TTL so stale data auto-expires from Redis
  async set(data: ETFApiResponse): Promise<void> {
    try {
      // EX sets expiry in seconds — after CACHE_TTL seconds Redis drops the key automatically
      await redis.set(CACHE_KEY, data, { ex: CACHE_TTL });
    } catch (err) {
      console.error("[Redis] SET error:", err);
    }
  },

  // Force-invalidates the cache (called manually or before a forced refresh)
  async invalidate(): Promise<void> {
    try {
      await redis.del(CACHE_KEY);
    } catch (err) {
      console.error("[Redis] DEL error:", err);
    }
  },
};

import { Router } from "express";
import { getETFs, forceRefresh } from "../controllers/etf.controller";

const router = Router();

// Public endpoint — frontend polls this every 15 minutes
router.get("/", getETFs);

// Internal refresh endpoint — triggered by the cron job
// In production you'd want to secure this with a secret header,
// but for a personal project it's low risk since it's just a cache refresh
router.post("/refresh", forceRefresh);

export default router;

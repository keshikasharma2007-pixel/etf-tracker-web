"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const etf_controller_1 = require("../controllers/etf.controller");
const router = (0, express_1.Router)();
// Public endpoint — frontend polls this every 15 minutes
router.get("/", etf_controller_1.getETFs);
// Internal refresh endpoint — triggered by the cron job
// In production you'd want to secure this with a secret header,
// but for a personal project it's low risk since it's just a cache refresh
router.post("/refresh", etf_controller_1.forceRefresh);
exports.default = router;
//# sourceMappingURL=etf.routes.js.map
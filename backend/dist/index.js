"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // Must be first — loads .env before any other imports read process.env
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = require("./middleware/cors");
const rateLimit_1 = require("./middleware/rateLimit");
const etf_routes_1 = __importDefault(require("./routes/etf.routes"));
const refreshJob_1 = require("./jobs/refreshJob");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// --- Middleware stack (order matters in Express) ---
// helmet sets secure HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.)
app.use((0, helmet_1.default)());
// CORS must come before routes so preflight OPTIONS requests are handled correctly
app.use(cors_1.corsMiddleware);
app.use(express_1.default.json());
// Rate limiter applied globally — all routes under /api are subject to it
app.use("/api", rateLimit_1.apiRateLimiter);
// --- Routes ---
app.use("/api/etfs", etf_routes_1.default);
// Health check — used by Render to verify the server is alive
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// --- Start server ---
app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
    (0, refreshJob_1.startRefreshJob)();
});
exports.default = app;
//# sourceMappingURL=index.js.map
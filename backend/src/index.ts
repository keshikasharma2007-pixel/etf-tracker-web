import "dotenv/config"; // Must be first — loads .env before any other imports read process.env
import express from "express";
import helmet from "helmet";
import { corsMiddleware } from "./middleware/cors";
import { apiRateLimiter } from "./middleware/rateLimit";
import etfRoutes from "./routes/etf.routes";
import { startRefreshJob } from "./jobs/refreshJob";

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware stack (order matters in Express) ---

// helmet sets secure HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.)
app.use(helmet());

// CORS must come before routes so preflight OPTIONS requests are handled correctly
app.use(corsMiddleware);

app.use(express.json());

// Rate limiter applied globally — all routes under /api are subject to it
app.use("/api", apiRateLimiter);

// --- Routes ---
app.use("/api/etfs", etfRoutes);

// Health check — used by Render to verify the server is alive
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
  startRefreshJob();
});

export default app;

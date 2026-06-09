import cors from "cors";

// Whitelist of allowed origins — only requests from these URLs will be accepted.
// In dev, we allow localhost:5173 (Vite dev server).
// In prod, we allow only your Cloudflare Pages domain.
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. server-to-server, curl, Postman during dev)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  methods: ["GET"],          // This API is read-only
  allowedHeaders: ["Content-Type"],
  credentials: false,        // No cookies/auth headers needed
});

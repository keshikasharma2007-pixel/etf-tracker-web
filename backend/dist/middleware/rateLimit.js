"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Limits each IP to 60 requests per 15-minute window.
// Since the frontend auto-refreshes every 15 mins, a real user should never hit this.
// This protects against scrapers or someone hammering the endpoint in a loop.
exports.apiRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 60,
    standardHeaders: true, // Return rate limit info in the RateLimit-* headers
    legacyHeaders: false,
    message: {
        error: "Too many requests from this IP, please try again in 15 minutes.",
    },
});
//# sourceMappingURL=rateLimit.js.map
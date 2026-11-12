import { createRateLimiter } from "../middleware/rate-limiter.middleware";

// IP-based rate limiter
export const ipRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,

  maxRequests: 20,

  keyPrefix: "rate-limit:ip",

  keyGenerator: (req) => req.ip ?? null
});

// Authenticated user-based rate limiter
export const userRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,

  maxRequests: 30,

  keyPrefix: "rate-limit:user",

  keyGenerator: (req) => req.user?.userId ?? null
});
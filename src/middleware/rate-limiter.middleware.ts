import { Request, Response, NextFunction } from 'express';

import { redisClient } from '../config/redis';

interface RateLimitOptions {
    windowMs: number,
    maxRequests: number,
    keyPrefix: string,
    keyGenerator: (req: Request) => string | null;
}

// Redis Lua script

const rateLimitScript = `
  local current = redis.call("INCR", KEYS[1])

  if current == 1 then
  redis.call("PEXPIRE", KEYS[1] ARGV[1])
  end

  local ttl = redis.call("PTTL", KEYS[1])

  return { current, ttl }
`;

export const createRateLimiter = (
    options: RateLimitOptions
) => {
    const {
        windowMs,
        maxRequests,
        keyPrefix,
        keyGenerator
    } = options;

    return async (
        req: Request,
        res: Response,
        _next: NextFunction
    ): Promise<void> => {
        try {
            if (!redisClient.isReady) {
                throw new Error("Redis is now unavailable")
            }

            const identifier = keyGenerator(req);

            if (!identifier) {
                res.status(401).json({
                    success: false,
                    message: "Unable to identify request"
                });

                return;
            }

            const redisKey = `${keyPrefix}:${identifier}`;

            const result = await redisClient.eval(
                rateLimitScript,
                {
                    keys: [redisKey],
                    arguments: [String(windowMs)]
                }
            ) as number[];

            const currentRequests = result[0];
            const ttl = result[1];

            const remainingRequests = Math.max(0, maxRequests - currentRequests);
            const resetTime = Math.ceil(Math.max(0, ttl) / 1000);

            // rate-limit response header

            res.setHeader("RateLimit-limit", maxRequests);
            res.setHeader("RateLimit-Remaining", remainingRequests);
            res.setHeader("RateLimit-Reset", resetTime);

            if (currentRequests > maxRequests) {
                res.setHeader("Retry-After", resetTime);

                res.status(429).json({
                    success: false,
                    message: "Too many requests",
                    retryAfter: resetTime
                });
                return
            }

            res.setHeader(`X-RateLimit-limit`, maxRequests)

            res.setHeader("X-RateLimit-Remaining", remainingRequests);

            res.setHeader("X-RateLimit-Reset", resetTime);

            _next();

        } catch (error) {
            console.error("Rate limiter error:", error);
            res.status(503).json({
                success: false,
                message: "Rate limiting service temporarily unavailable"
            });
        }
    }
}
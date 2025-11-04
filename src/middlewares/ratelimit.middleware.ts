// @ts-nocheck
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiterMinute = new RateLimiterMemory({
  points: 10, // 1 request
  duration: 60, // per 1 minute
});

const rateLimiterTwoMinutes = new RateLimiterMemory({
  points: 20, // 2 requests
  duration: 120, // per 2 minutes
});

const rateLimiterFiveMinutes = new RateLimiterMemory({
  points: 40, // 5 requests
  duration: 300, // per 5 minutes
});

const rateLimiterHour = new RateLimiterMemory({
  points: 50, // 15 requests
  duration: 3600, // per 1 hour
});

export const rateLimitMiddleware = async (req, res, next) => {
  try {
    await rateLimiterMinute.consume(req.ip);
    await rateLimiterTwoMinutes.consume(req.ip);
    await rateLimiterFiveMinutes.consume(req.ip);
    await rateLimiterHour.consume(req.ip);
    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        statusCode: 401, 
        message: "Too many requests, please try again later.",
      });
  }
};

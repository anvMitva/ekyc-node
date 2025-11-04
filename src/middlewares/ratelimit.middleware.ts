import type { Request, Response, NextFunction } from "express";
import type { RateLimitResponse } from "../types/ratelimit.js";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiterMinute = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per 1 minute
});

const rateLimiterTwoMinutes = new RateLimiterMemory({
  points: 20, // 20 requests
  duration: 120, // per 2 minutes
});

const rateLimiterFiveMinutes = new RateLimiterMemory({
  points: 40, // 40 requests
  duration: 300, // per 5 minutes
});

const rateLimiterHour = new RateLimiterMemory({
  points: 50, // 50 requests
  duration: 3600, // per 1 hour
});

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const clientIp = req.ip || 'unknown';
    
    await rateLimiterMinute.consume(clientIp);
    await rateLimiterTwoMinutes.consume(clientIp);
    await rateLimiterFiveMinutes.consume(clientIp);
    await rateLimiterHour.consume(clientIp);
    
    next();
  } catch (error) {
    const response: RateLimitResponse = {
      statusCode: 429,
      message: "Too many requests, please try again later.",
    };
    
    return res.status(response.statusCode).json(response);
  }
};

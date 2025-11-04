/**
 * Type definitions for rate limit middleware
 */
import type { Request, Response, NextFunction } from 'express';

/**
 * Rate limiter configuration
 */
export interface RateLimiterConfig {
  points: number;
  duration: number;
}

/**
 * Rate limit response
 */
export interface RateLimitResponse {
  statusCode: number;
  message: string;
}

/**
 * Rate limit middleware function type
 */
export type RateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

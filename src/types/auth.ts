/**
 * Type definitions for auth middleware
 */
import type { Request, Response, NextFunction } from 'express';

/**
 * JWT payload structure
 */
export interface JwtPayload {
  userId: string;
  username: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

/**
 * Extended Express Request with user and authToken
 */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  authToken?: string;
}

/**
 * Auth middleware function type
 */
export type AuthMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

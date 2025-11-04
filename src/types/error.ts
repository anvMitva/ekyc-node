/**
 * Type definitions for error middleware
 */
import type { Request, Response, NextFunction } from 'express';

/**
 * Error types enumeration
 */
export type ErrorType =
  | 'INTERNAL_SERVER_ERROR'
  | 'API_ERROR'
  | 'DATABASE_ERROR'
  | 'SYSTEM_ERROR'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Log levels
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors: string[];
  stack?: string;
  technicalMessage?: string;
  errorType?: string;
}

/**
 * Error log data structure
 */
export interface ErrorLogData {
  errorType: ErrorType;
  msgToUser: string;
  message: string;
  stack?: string;
  statusCode: number;
  request: string;
  user: string;
}

/**
 * Custom error with additional properties
 */
export interface CustomError extends Error {
  statusCode?: number;
  errors?: string[];
  code?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

/**
 * Error handler middleware function type
 */
export type ErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => Response;

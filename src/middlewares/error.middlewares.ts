import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/auth.js";
import type { CustomError, ErrorType, ErrorLogData } from "../types/error.js";
import {
  ConnectionError,
  DatabaseError,
  ForeignKeyConstraintError,
  TimeoutError,
  UniqueConstraintError,
  ValidationError,
} from "sequelize";
import logger from "../logger/winston.logger.js";
import { ApiError } from "../utils/ApiError.js";
import { SERVER_CONFIG } from "../config/index.js";

export const errorHandler = (
  err: CustomError,
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response => {
  const username = req.user?.username || "anonymous";
  let statusCode = 500;
  let userMessage = "Something went wrong. Please try again later.";
  let errors: string[] = [];
  let errorType: ErrorType = "UNKNOWN_ERROR";
  let logLevel: "error" | "warn" | "info" = "error";

  // 1. USER-FACING ERRORS (Business Logic - from config)
  if (err.statusCode && err.message && typeof err.message === 'string') {
    statusCode = err.statusCode;
    userMessage = err.message;
    errors = err.errors || [];
    errorType = "INTERNAL_SERVER_ERROR";
    logLevel = "warn";
  }
  // 2. EXISTING ApiError instances
  else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    userMessage = err.message;
    errors = err.errors || [];
    errorType = "API_ERROR";
    logLevel = "warn";
  }
  // 3. DATABASE ERRORS (Hide technical details from user)
  else if (
    err instanceof DatabaseError ||
    err instanceof ForeignKeyConstraintError ||
    err instanceof UniqueConstraintError ||
    err instanceof ConnectionError ||
    err instanceof TimeoutError ||
    err instanceof ValidationError
  ) {
    statusCode = 500;
    userMessage = "Database service is temporarily unavailable. Please try again later.";
    errorType = "DATABASE_ERROR";
    logLevel = "error";
  }
  // 4. SYSTEM ERRORS (Syntax, undefined, null reference, etc.)
  else if (
    err instanceof TypeError ||
    err instanceof ReferenceError ||
    err instanceof SyntaxError ||
    err.name === 'TypeError' ||
    err.name === 'ReferenceError' ||
    err.name === 'SyntaxError'
  ) {
    statusCode = 500;
    userMessage = "A technical error occurred. Our team has been notified.";
    errorType = "SYSTEM_ERROR";
    logLevel = "error";
  }
  // 5. NETWORK/CONNECTION ERRORS
  else if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.code === 'ENOTFOUND') {
    statusCode = 503;
    userMessage = "Service temporarily unavailable. Please try again in a few moments.";
    errorType = "NETWORK_ERROR";
    logLevel = "error";
  }
  // 6. VALIDATION ERRORS (Input validation)
  else if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    userMessage = "Please check your input and try again.";
    errors = Array.isArray(err.errors) ? err.errors : [err.message];
    errorType = "VALIDATION_ERROR";
    logLevel = "info";
  }
  // 7. UNKNOWN ERRORS (Catch-all)
  else {
    statusCode = 500;
    userMessage = "An unexpected error occurred. Please try again later.";
    errorType = "UNKNOWN_ERROR";
    logLevel = "error";
  }

  // Single log based on determined log level with stack trace
  const logData: ErrorLogData = {
    errorType: errorType,
    msgToUser: userMessage,
    message: err.message,
    stack: err.stack,
    statusCode: statusCode,
    request: `${req.method} ${req.originalUrl}`,
    user: username
  };

  logger.error(logData);

  // Legacy logging format (keep for compatibility)
  const legacyLogMessage = [
    (req as any).ip || req.headers["x-forwarded-for"] || (req as any).connection?.remoteAddress,
    "||",
    username,
    "||",
    req.method,
    "||",
    req.originalUrl,
    "||",
    statusCode,
    "||",
    userMessage,
  ].join(" ");

  logger.error(legacyLogMessage);

  // Send user-friendly response
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: userMessage,
    errors: errors,
    ...(SERVER_CONFIG.NODE_ENV === 'development' && {
      stack: err.stack,
      technicalMessage: err.message,
      errorType: err.constructor.name
    })
  });
};

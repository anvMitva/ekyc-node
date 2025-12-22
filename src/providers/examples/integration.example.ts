/**
 * Provider System Integration Example
 * Shows how to integrate the provider system into the existing app
 */

// ============================================================
// STEP 1: Update your app startup (index.ts or loader)
// ============================================================

/*
// src/index.ts
import dotenv from "dotenv";
import startApp from "./loader/index.loader.js";
import { ProviderCronService } from "./providers/index.js";

dotenv.config({ path: "./.env" });

try {
  // Start the provider cache refresh cron
  await ProviderCronService.start();
  
  startApp();
} catch (error) {
  throw error;
}
*/

// ============================================================
// STEP 2: Example Controller using KRA Service
// ============================================================

import type { Request, Response, NextFunction } from "express";
import { kraService, smsService } from "../index.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import logger from "../../logger/winston.logger.js";

/**
 * KRA Verification Controller
 * Uses the new provider system with automatic fallback
 */
export const verifyKra = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { panNumber, fullName, dateOfBirth } = req.body;
    
    // Get correlation ID from request (if using correlation middleware)
    const correlationId = (req as any).correlationId || undefined;

    logger.info("KRA verification request received", {
      pan: panNumber.substring(0, 2) + "****" + panNumber.substring(8),
    });

    // Call the KRA service - it handles provider selection and fallback
    const result = await kraService.verify({
      panNumber,
      fullName,
      dateOfBirth,
      correlationId,
      uid: (req as any).user?.uid,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    if (result.success && result.data) {
      logger.info("KRA verification successful", {
        provider: result.provider,
        status: result.data.data.status,
        duration: result.duration,
      });

      return res.status(200).json(
        new ApiResponse(200, {
          status: result.data.data.status,
          isRegistered: result.data.data.isRegistered,
          details: result.data.data.details,
          provider: result.provider, // Optional: show which provider was used
        }, "KRA verification successful")
      );
    } else {
      logger.error("KRA verification failed", {
        error: result.error?.message,
        isProviderFailure: result.error?.isProviderFailure,
      });

      // Different handling based on error type
      if (result.error?.isProviderFailure) {
        throw new ApiError(503, "KRA service is temporarily unavailable. Please try again later.");
      } else {
        throw new ApiError(400, result.error?.message || "KRA verification failed");
      }
    }
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      logger.error("Unexpected error in KRA verification", {
        error: (error as Error).message,
      });
      next(new ApiError(500, "An unexpected error occurred"));
    }
  }
};

/**
 * Send OTP Controller (Updated to use new SMS service)
 */
export const sendOtpWithProvider = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { mobile, otp } = req.body;
    const correlationId = (req as any).correlationId;

    // Use the new SMS service with automatic fallback
    const result = await smsService.sendSignupOtp(mobile, otp, {
      correlationId,
      uid: (req as any).user?.uid,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    if (result.success) {
      logger.info("OTP sent successfully", {
        provider: result.provider,
        duration: result.duration,
      });

      return res.status(200).json(
        new ApiResponse(200, {
          messageId: result.data?.data.messageId,
        }, "OTP sent successfully")
      );
    } else {
      throw new ApiError(503, "Failed to send OTP. Please try again.");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Provider Health Check Endpoint
 */
export const getProviderHealth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const kraHealth = await kraService.getProvidersHealth();
  const smsHealth = await smsService.getProvidersHealth();

  return res.status(200).json(
    new ApiResponse(200, {
      kra: kraHealth,
      sms: smsHealth,
    }, "Provider health status")
  );
};

// ============================================================
// STEP 3: Add routes
// ============================================================

/*
// src/routes/kyc.route.ts
import { Router } from "express";
import { verifyKra, sendOtpWithProvider, getProviderHealth } from "../controllers/kyc.controller.js";

const router = Router();

router.post("/verify-kra", verifyKra);
router.post("/send-otp", sendOtpWithProvider);
router.get("/provider-health", getProviderHealth);

export default router;
*/

// ============================================================
// STEP 4: Database Setup
// ============================================================

/*
Run the seed script to create tables and initial data:

npx ts-node --esm src/providers/seed.ts

Or create the tables manually:

CREATE TABLE providers (
  id INT IDENTITY(1,1) PRIMARY KEY,
  module_name VARCHAR(50) NOT NULL,
  provider_code VARCHAR(50) NOT NULL,
  provider_name VARCHAR(100) NOT NULL,
  enabled BIT DEFAULT 1,
  priority INT DEFAULT 1,
  timeout INT DEFAULT 30000,
  base_url VARCHAR(500) NOT NULL,
  api_key VARCHAR(500) NOT NULL,
  api_secret VARCHAR(500),
  rate_limit TEXT,
  retry_config TEXT,
  headers TEXT,
  metadata TEXT,
  is_healthy BIT DEFAULT 1,
  failure_count INT DEFAULT 0,
  last_failure DATETIME,
  last_success DATETIME,
  circuit_breaker_open BIT DEFAULT 0,
  cooldown_until DATETIME,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE()
);

CREATE UNIQUE INDEX idx_module_provider ON providers(module_name, provider_code);
CREATE INDEX idx_module_enabled_priority ON providers(module_name, enabled, priority);

CREATE TABLE provider_logs (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  correlation_id VARCHAR(100) NOT NULL,
  module_name VARCHAR(50) NOT NULL,
  operation VARCHAR(100) NOT NULL,
  provider_code VARCHAR(50) NOT NULL,
  attempt_number INT NOT NULL,
  request_payload TEXT NOT NULL,
  response_data TEXT,
  status_code INT,
  success BIT DEFAULT 0,
  is_provider_failure BIT DEFAULT 0,
  error_message TEXT,
  duration INT NOT NULL,
  ip VARCHAR(50),
  user_agent VARCHAR(500),
  uid VARCHAR(100),
  created_at DATETIME DEFAULT GETDATE()
);

CREATE INDEX idx_correlation_id ON provider_logs(correlation_id);
CREATE INDEX idx_module_provider_log ON provider_logs(module_name, provider_code);
CREATE INDEX idx_created_at ON provider_logs(created_at);
*/

// ============================================================
// STEP 5: Environment Variables
// ============================================================

/*
Add these to your .env file:

# Provider System
PROVIDER_CACHE_REFRESH_INTERVAL=120000
PROVIDER_ALERTS_ENABLED=true
PROVIDER_ALERT_EMAILS=admin@example.com
PROVIDER_FAILURE_THRESHOLD=3

# KRA Providers
CAMS_API_KEY=your-cams-api-key
CAMS_API_SECRET=your-cams-secret
ONGRID_API_KEY=your-ongrid-api-key
ONGRID_CLIENT_ID=your-ongrid-client-id

# SMS Providers  
TWOFACTOR_API_KEY=your-2factor-api-key
*/

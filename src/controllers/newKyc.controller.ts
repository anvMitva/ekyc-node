import type { Request, Response, NextFunction } from "express";
import {
  checkIfKycExists,
  checkMobileEmailUniqueness,
  fetchClientDeviceData,
} from "../services/client.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../logger/winston.logger.js";
import { getPublicClientIp } from "../utils/commonUtils.js";
import { ekycSequelize } from "../utils/dbConnection.js";
import type {
  SendOtpRequestBody,
  SendOtpRequestQuery,
} from "../types/newKyc.js";

/**
 * Send OTP Controller
 * Handles OTP generation and sending for KYC verification
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {Promise<Response | void>}
 */
export const sendOtp = async (
  req: Request<{}, {}, SendOtpRequestBody, SendOtpRequestQuery>,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  // Start a transaction
  const transaction = await ekycSequelize.transaction();

  try {
    const { mobile, email } = req.body;
    const { apCode, rmCode, schemeCode, referralCode, source } = req.query;

    // Get client IP and User Agent
    const ip = getPublicClientIp(req);
    const userAgent = req.get("User-Agent") || "";

    logger.info("Send OTP request received", { mobile, email, ip });

    const deviceData = await fetchClientDeviceData(ip, userAgent);

    const { matchedData, emailMatches, mobileMatches } =
      await checkMobileEmailUniqueness({
        email,
        mobile,
        deviceData,
        apCode,
      });

    // Check if KYC exists and upsert lead in one function
    const leadUid = await checkIfKycExists({
      mobile,
      email,
      apCode,
      rmCode,
      schemeCode,
      referralCode,
      source,
      deviceData,
      ip,
      userAgent,
      transaction,
    });
    
    logger.info("Lead operation completed", {
      uid: leadUid,
    });

    // TODO: Implement the following:
    // - Generate OTP
    // - Send SMS
    // - Send Email
    // - Log activity
    // - Update timestamp
    // - Service preference based routing

    // Commit transaction
    await transaction.commit();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "OTP sent successfully"));
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    
    const err = error as Error;
    logger.error("Error in sendOtp controller", {
      error: err.message,
      stack: err.stack,
    });
    
    next(error);
  }
};

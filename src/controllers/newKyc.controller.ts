// @ts-nocheck
import { checkIfKycExists, checkMobileEmailUniqueness, fetchClientDeviceData } from "../services/client.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../logger/winston.logger.js";
import { getPublicClientIp } from "../utils/commonUtils.js";
import { ekycSequelize } from "../utils/dbConnection.js";
import { NextFunction, Request, Response } from "express";

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  // Start a transaction
  const transaction = await ekycSequelize.transaction();

  try {
    const { mobile, email } = req.body;
    const { apCode, rmCode, schemeCode, referralCode, source } = req.query;

    // Get client IP and User Agent
    const ip = getPublicClientIp(req);
    const userAgent = req.get("User-Agent");

    logger.info("Send OTP request received", { mobile, email, ip });

    const deviceData = await fetchClientDeviceData(ip, userAgent);

    const { matchedData, emailMatches, mobileMatches } = await checkMobileEmailUniqueness({
      email, mobile, deviceData, apCode
    });

    // Check if KYC exists and upsert lead in one function
    const leadUid = await checkIfKycExists({ mobile, email, apCode, rmCode, schemeCode, referralCode, source, deviceData, ip, userAgent, transaction });
    logger.info("Lead operation completed", {
      uid: leadUid
    });

    // otp 
    // sms
    // email
    // activcty log
    // ts
    // service prefrence based

    // Commit transaction
    await transaction.commit();

    return res.status(200).json(
      new ApiResponse(200, {}, "OTP sent successfully")
    );
  } catch (error: any) {
    // Rollback transaction on error
    await transaction.rollback();
    logger.error("Error in sendOtp controller", { error: error.message, stack: error.stack });
    next(error);
  }
};

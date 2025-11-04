import expressUseragent from "express-useragent";
import geoip from "geoip-lite";

import logger from "../logger/winston.logger.js";
import { ApiError } from "../utils/ApiError.js";
import crmsDb from "./db/crms.db.js";
import kycDb from "./db/kyc.db.js";
import leadsDb from "./db/leads.db.js";
import { generateUid } from "../utils/utils.js";

import { MatchResult, ClientDeviceData, CheckUniquenessParams, CheckUniquenessResult, CheckKycExistsParams, PendingLead, LeadUpsertPayload, GeoLookupResult } from "../types/entities/signup.js";

/**
 * Check if mobile and email are unique in the database
 * @param {string} email - Email address to check
 * @param {string} mobile - Mobile number to check
 * @returns {Promise<Object>} Uniqueness check result
 */
export async function checkMobileEmailUniqueness({ email, mobile, deviceData, apCode }: CheckUniquenessParams): Promise<CheckUniquenessResult> {
  try {
    const matchedData = (await crmsDb.getClientByMobileEmail(mobile, email)) as MatchResult;

    const city = deviceData?.location?.city?.toLowerCase() || "";
    const state = deviceData?.location?.state?.toLowerCase() || "";
    const hasApCode = apCode != null && apCode.trim() !== "";

    const isLocationAllowed = city === "surat" || (["gujarat", "guj", "gj"].includes(state) && hasApCode);

    // Determine the limit based on location
    const matchLimit = isLocationAllowed ? 4 : 0;

    // Check mobile matches
    if (matchedData.mobileMatches.length > matchLimit) {
      logger.warn("Mobile matches exceed limit");
      throw new ApiError(400, "Mobile already exists", []);
    }

    // Check email matches
    if (matchedData.emailMatches.length > matchLimit) {
      logger.warn("Email matches exceed limit");
      throw new ApiError(400, "Email already exists", []);
    }

    return {
      matchedData,
      emailMatches: matchedData.emailMatches.length > 1,
      mobileMatches: matchedData.mobileMatches.length > 1,
    };
  } catch (error) {
    logger.error("Error checking mobile/email uniqueness", {
      error: error.message
    });
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Internal Server Error", [error], error.stack);
  }
}

/**
 * Fetch client device and location data from IP and User Agent
 * @param {string} ip - Client IP address
 * @param {string} userAgent - User agent string
 * @returns {Promise<Object>} Device and location information
 */
export async function fetchClientDeviceData(ip: string, userAgent: string): Promise<ClientDeviceData> {
  try {
    const ua = expressUseragent.parse(userAgent);
    const deviceInfo = {
      browser: ua?.browser || "Unknown",
      browserVersion: ua?.version || "Unknown",
      os: ua?.os || "Unknown",
      platform: ua?.platform || "Unknown",
      isMobile: ua?.isMobile || false,
      isDesktop: ua?.isDesktop || false,
      isTablet: ua?.isTablet || false,
      isBot: ua?.isBot || false,
      source: ua?.source || "Unknown",
    };

    // Handle localhost/development IPs
    let clientIp = ip;
    if (
      ip === "::1" ||
      ip === "127.0.0.1" ||
      ip.startsWith("::ffff:127.0.0.1")
    ) {
      logger.warn("Localhost IP detected, geolocation will be unavailable", {
        ip,
      });
      clientIp = null;
    }
    // Fetch Geolocation (latitude, longitude, city, etc.) from IP
    const geo: GeoLookupResult | null = clientIp ? (geoip.lookup(clientIp) as GeoLookupResult | null) : null;

    const locationInfo = {
      ip: clientIp,
      country: geo?.country || "Unknown",
      countryCode: geo?.country_iso_code || geo?.country || "Unknown",
      region: geo?.region_name || geo?.region || "Unknown", // State Name
      state: geo?.region_name || geo?.region || "Unknown", // State Name
      stateCode: geo?.region || "Unknown", // State Code (CA, NY, etc.)
      city: geo?.city || "Unknown",
      latitude: geo?.ll?.[0] ?? null,
      longitude: geo?.ll?.[1] ?? null,
      timezone: geo?.timezone || "Unknown",
      range: geo?.range ?? null,
      metro: geo?.metro ?? null,
      area: geo?.area ?? null,
    };

    const result = {
      device: deviceInfo,
      location: locationInfo,
      timestamp: new Date().toISOString(),
    };

    logger.info("Client device data fetched successfully");
    return result;
  } catch (error) {
    logger.error("Error fetching client device data", {
      error: error.message,
    });

    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Internal Server Error", [error], error.stack);
  }
}

export async function checkIfKycExists({
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
  transaction = null,
}: CheckKycExistsParams): Promise<string> {
  try {
  const kycData = await kycDb.findPendingKYCByMobileOrEmail(mobile, email);
  const hasPendingKyc = typeof kycData === "number" ? kycData > 0 : Boolean(kycData);

  if (hasPendingKyc) {
      logger.warn("KYC already exists", { mobile, email });
      throw new ApiError(400, "KYC already exists", []);
    }

    // Check if pending lead exists
    const pendingLead = (await leadsDb.findPendingLeadByMobileOrEmail(mobile, email, transaction)) as PendingLead | null;

    // Construct lead data
    const leadData: LeadUpsertPayload = {
      mobile,
      email,
      rmCode: rmCode || null,
      apCode: apCode || null,
      schemeCode: schemeCode || null,
      referralCode: referralCode || null,
      source: source || null,
      ip: deviceData?.location?.ip || ip || null,
      location: deviceData?.location?.city || null,
      latitude: deviceData?.location?.latitude || null,
      longitude: deviceData?.location?.longitude || null,
      device: deviceData?.device?.platform || null,
      userAgent: userAgent || null,
      otpStatus: "pending",
      panStatus: "pending",
    };

    const uid = pendingLead?.uid ?? generateUid();

    if (pendingLead) {
      await leadsDb.updateByUid(uid, leadData, transaction);
    } else {
      await leadsDb.create({ uid, ...leadData }, transaction);
    }

    logger.info("Lead upserted in checkIfKycExists", {
      uid: uid
    });

    return uid;
  } catch (error) {
    logger.error("Error in checkIfKycExists", {
      error: error.message,
    });
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Internal Server Error", [error], error.stack);
  }
}


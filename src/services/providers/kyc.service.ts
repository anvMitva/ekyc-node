import { Sequelize, QueryTypes } from "sequelize";
import axios from "axios";
import type { AxiosResponse } from "axios";
import { crmsSequelize, redisClient } from "../../utils/dbConnection.js";
import { CacheService } from "../cache.service.js";
import { convertToCamelCase } from "../../utils/format.js";
import logger from "../../logger/winston.logger.js";
import { API_URLS, DB_CONFIG, RESPONSE_CONFIG } from "../../config/index.js";
import { ApiError } from "../../utils/ApiError.js";
import type {
  Nullable,
  ClientKycResult,
  ApiResponseData,
} from "../../types/kyc.js";

// ==================== Helper Functions ====================

/**
 * Get remaining seconds until end of day
 * @returns {number} Seconds until midnight
 */
function getTodayRemainingTime(): number {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  return Math.floor((endOfDay.getTime() - now.getTime()) / 1000);
}

// ==================== Exported Functions ====================

// ==================== Exported Functions ====================

/**
 * Get client KYC data with caching support
 * @param {string} clientId - Client ID
 * @param {boolean} bypassCache - Whether to bypass cache
 * @returns {Promise<ClientKycResult[]>} Client KYC data
 */
export async function getClientKyc(
  clientId: string,
  bypassCache: boolean = false
): Promise<ClientKycResult[]> {
  try {
    const CRMS_DB = DB_CONFIG.CRMS.NAME;
    logger.info(
      `Fetching KYC data for client: ${clientId}${bypassCache ? " (bypassing cache)" : ""}`
    );

    const redisKey = CacheService.generateKey("connect", `${clientId}:kyc`);
    let cachedKYC = await CacheService.get(redisClient as any, redisKey, bypassCache);

    if (cachedKYC) {
      logger.info(`KYC data fetched from Redis for client: ${clientId}`);
      return cachedKYC as ClientKycResult[];
    }

    const results = await crmsSequelize.query(
      `SELECT * FROM [${CRMS_DB}].[dbo].[TBL_SALES_KYC] WHERE client_id = ?`,
      {
        replacements: [clientId],
        type: QueryTypes.SELECT,
      }
    );

    // Transform keys to camelCase
    let transformedResults = convertToCamelCase(results) as ClientKycResult[];

    if (!transformedResults || transformedResults.length === 0) {
      logger.info(`Client data not found for ${clientId}, attempting to insert`);
      await insertClientKyc(clientId);

      const newResults = await crmsSequelize.query(
        `SELECT * FROM [${CRMS_DB}].[dbo].[TBL_SALES_KYC] WHERE client_id = ?`,
        {
          replacements: [clientId],
          type: QueryTypes.SELECT,
        }
      );

      transformedResults = convertToCamelCase(newResults) as ClientKycResult[];
      logger.info(
        `KYC data successfully inserted and retrieved for client: ${clientId}`
      );

      if (!transformedResults || transformedResults.length === 0) {
        logger.error(
          `Client data not found after insertion attempt for ${clientId}`
        );
        throw new ApiError(
          RESPONSE_CONFIG.CLIENT_NOT_FOUND.statusCode,
          RESPONSE_CONFIG.CLIENT_NOT_FOUND.message
        );
      }
    }

    const expireIn = getTodayRemainingTime();
    await CacheService.set(redisClient as any, redisKey, transformedResults, expireIn);
    logger.info(
      `KYC data cached in Redis for client: ${clientId} with expiry: ${expireIn}s`
    );
    return transformedResults;
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Error while fetching client kyc details ${clientId}: ${err.message}`
    );
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Internal Server Error", [error], err.stack);
  }
}

/**
 * Insert client KYC data via external API
 * @param {string} clientId - Client ID
 * @returns {Promise<void>}
 */
export async function insertClientKyc(clientId: string): Promise<void> {
  try {
    const config = {
      params: { client_id: clientId },
    };

    const { data }: AxiosResponse<ApiResponseData> = await axios.get(
      `${API_URLS.CRMS_TOKEN}/api/v1/kyc/save-kyc-client-wise`,
      config
    );

    if (data.statusCode !== 200) {
      logger.error(
        `Error while inserting client kyc details ${clientId}: ${data?.message}`
      );
      throw new ApiError(
        RESPONSE_CONFIG.BAD_REQUEST.statusCode,
        RESPONSE_CONFIG.BAD_REQUEST.message
      );
    }
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Error while inserting client kyc details ${clientId}: ${err.message}`
    );
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Internal Server Error", [error], err.stack);
  }
}

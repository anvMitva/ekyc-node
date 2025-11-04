// @ts-nocheck
import { Sequelize } from "sequelize"
import { crmsSequelize, redisClient } from "../../utils/dbConnection.js"
import { CacheService } from "../cache.service.js"
import { convertToCamelCase } from "../../utils/format.js"
import logger from "../../logger/winston.logger.js"
import { API_URLS, DB_CONFIG, RESPONSE_CONFIG } from "../../config/index.js"

export const getClientKyc = async (clientId, bypassCache = false) => {
  try {
    const CRMS_DB = DB_CONFIG.CRMS_DB_NAME
    logger.info(
      `Fetching KYC data for client: ${clientId}${bypassCache ? ' (bypassing cache)' : ''
      }`
    )

    const redisKey = CacheService.generateKey('connect', `${clientId}:kyc`)
    let cachedKYC = await CacheService.get(redisClient, redisKey, bypassCache)

    if (cachedKYC) {
      logger.info(`KYC data fetched from Redis for client: ${clientId}`)
      return cachedKYC
    }

    const results = await crmsSequelize.query(
      `SELECT * FROM [${CRMS_DB}].[dbo].[TBL_SALES_KYC] WHERE client_id = ?`,
      {
        replacements: [clientId],
        type: Sequelize.QueryTypes.SELECT
      }
    )

    // Transform keys to camelCase
    let transformedResults = convertToCamelCase(results)

    if (!transformedResults || transformedResults.length === 0) {
      logger.info(`Client data not found for ${clientId}, attempting to insert`)
      await insertClientKyc(clientId)

      const newResults = await crmsSequelize.query(
        `SELECT * FROM [${CRMS_DB}].[dbo].[TBL_SALES_KYC] WHERE client_id = ?`,
        {
          replacements: [clientId],
          type: Sequelize.QueryTypes.SELECT
        }
      )

      transformedResults = convertToCamelCase(newResults)
      logger.info(
        `KYC data successfully inserted and retrieved for client: ${clientId}`
      )

      if (!transformedResults || transformedResults.length === 0) {
        logger.error(
          `Client data not found after insertion attempt for ${clientId}`
        )
        throw new ApiError(RESPONSE_CONFIG.CLIENT_NOT_FOUND.statusCode, RESPONSE_CONFIG.CLIENT_NOT_FOUND.message)
      }
    }

    const expireIn = getTodayRemainingTime()
    await CacheService.set(redisClient, redisKey, transformedResults, expireIn)
    logger.info(
      `KYC data cached in Redis for client: ${clientId} with expiry: ${expireIn}s`
    )
    return transformedResults
  } catch (error) {
    logger.error(
      `Error while fetching client kyc details ${clientId}: ${error.message}`
    )
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Internal Server Error", [error], error.stack);
  }
}

export const insertClientKyc = async clientId => {
  try {
    const config = {
      params: { client_id: clientId }
    }

    const { data } = await axios.get(`${API_URLS.CRMS_TOKEN}/api/v1/kyc/save-kyc-client-wise`, config ) 

    if (data.statusCode !== 200) {
      logger.error(`Error while inserting client kyc details ${clientId}: ${data?.message}`)
      throw new ApiError(RESPONSE_CONFIG.BAD_REQUEST.statusCode, RESPONSE_CONFIG.BAD_REQUEST.message)
    }

  } catch (error) {
    logger.error(`Error while inserting client kyc details ${clientId}: ${error.message}`)
    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Internal Server Error", [error], error.stack);
  }
}

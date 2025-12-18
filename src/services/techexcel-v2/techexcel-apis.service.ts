import { COMPANY_CODE_MAP } from "../../constant.js";
import logger from "../../logger/winston.logger.js";
import { ApiError } from "../../utils/ApiError.js";
import { getFinancialYear, getTodayRemainingTime } from "../../utils/date.js";
import { redisClient } from "../../utils/dbConnection.js";
import { CacheService } from "../cache.service.js";
import { techExcelAPICall } from "./techexcel.service.js";
import type {
    GetClientDataV2Params,
    GetRevenueDataV2Params,
    GetDPHoldingDataV2Params,
    GetFadaybookV2Params,
    GetBankDetailsParams,
    GetPaymentRequestStatusParams,
    ClientRecord,
    RevenueRecord,
    DPHoldingRecord,
    FADayBookRecord,
    BankDetailsRecord,
    PaymentRequestStatusRecord,
    DataWithTimestamp,
    DPHoldingResponseData,
    CachedDPHoldingData,
    HoldingSummary
} from "../../types/techexcel.js";

/**
 * Generate summary data for DP holding records
 * @param records - Array of DP holding records
 * @returns Summary object with total value, quantity, and scrip count
 */
function tradingHoldingSummaryV2(records: DPHoldingRecord[]): HoldingSummary {
    if (!Array.isArray(records) || records.length === 0) {
        return {
            totalValue: 0,
            totalQuantity: 0,
            scripCount: 0
        };
    }

    const summary: HoldingSummary = records.reduce<HoldingSummary>((acc, record) => {
        // Adjust these field names based on actual API response structure
        const value = parseFloat(record.market_value || record.value || '0');
        const quantity = parseInt(record.quantity || record.qty || '0', 10);
        
        return {
            totalValue: acc.totalValue + (isNaN(value) ? 0 : value),
            totalQuantity: acc.totalQuantity + (isNaN(quantity) ? 0 : quantity),
            scripCount: acc.scripCount + 1
        };
    }, {
        totalValue: 0,
        totalQuantity: 0,
        scripCount: 0
    });

    return summary;
}

export const getClientDataV2 = async ({
    clientId,
    fromDate = "01/04/2010",
    toDate = "21/08/2025",
    branchCode = "",
    mobileNo = "",
    emailId = "",
    panVerificationDate = "",
    isHardRefresh = false,
}: GetClientDataV2Params): Promise<ClientRecord[]> => {
    try {
        logger.info(`Calling Client List API for ${clientId}`);

        const redisKey = CacheService.generateKey(
            'connect',
            `${clientId}:kyc`
        )
        let cachedData = await CacheService.get<ClientRecord[]>(
            redisClient as any,
            redisKey,
            isHardRefresh
        )
        if (cachedData) {
            logger.info(`Returning cached client data with key: ${redisKey}`);
            return cachedData;
        }

        const records = await techExcelAPICall(
            "entry/client_list",
            {
                "CLIENT_ID": clientId,
                "FROM_DATE": fromDate,
                "TO_DATE": toDate,
                "BRANCH_CODE": branchCode,
                "MOBILE_NO": mobileNo,
                "EMAIL_ID": emailId,
                "PAN_VERIFICATION_DATE": panVerificationDate
            }
        );

        if (!Array.isArray(records)) {
            logger.error("Client List API did not return a valid array");
            return [];
        }

        logger.info(`Client List API returned ${records.length} records for ${clientId}`);

        const ttl = getTodayRemainingTime();
        await CacheService.set(redisClient as any, redisKey, records, ttl);
        return records || [];

    } catch (error) {
        const err = error as Error & { statusCode?: number };
        logger.error(`Error while fetching Client List data: ${err.message}`);
        throw new ApiError(
            err.statusCode || 500,
            err.message || "Internal server error"
        );
    }
};

export const getRevenueDataV2 = async ({
    clientId,
    fromDate = "",
    toDate = "",
    companyCode = "BSE_CASH,NSE_CASH,NSE_FNO,BSE_FNO",
    branch = "",
    scripSymbol = "",
    remshireCode = "",
    policy = "BWA_CRM2",
}: GetRevenueDataV2Params): Promise<RevenueRecord[]> => {
    try {
        logger.info(`Calling Revenue API for ${clientId}`);

        const records = await techExcelAPICall(
            "entry/brk_remeshire_view",
            {
                "CLIENT_ID": clientId,
                "TO_DATE": toDate,
                "FROM_DATE": fromDate,
                "COMPANY_CODE": companyCode,
                "BRANCH": branch,
                "SCRIP_SYMBOL": scripSymbol,
                "Remshire_Code": remshireCode,
                "POLICY": policy
            }
        );

        if (!Array.isArray(records)) {
            logger.error("Revenue API did not return a valid array");
            return [];
        }

        logger.info(`Revenue API returned ${records.length} records for ${clientId}`);

        return records || [];
    } catch (error) {
        const err = error as Error & { statusCode?: number };
        logger.error(`Error while fetching Revenue data: ${err.message}`);
        throw new ApiError(
            err.statusCode || 500,
            err.message || "Internal server error"
        );
    }
};

export const getDPHoldingDataV2 = async ({
    clientCode,
    toDate,
    finstyr = getFinancialYear(),
    isHardRefresh = false,
    showSummaryOnly = false,
    persistPermanent = true,
    storeRedis = true,
}: GetDPHoldingDataV2Params): Promise<DPHoldingResponseData | HoldingSummary | DPHoldingRecord[]> => {
    try {
        logger.info(`DP Holding API for ${clientCode} - ${toDate}`);

        const redisKey = CacheService.generateKey(
            'client_reports',
            `${clientCode}:${finstyr}:dpHolding:${toDate}`
        )

        let cachedData: CachedDPHoldingData | null = null;

        if (storeRedis) {
            cachedData = await CacheService.get<CachedDPHoldingData>(redisClient as any, redisKey, isHardRefresh);
        }

        if (cachedData) {
            logger.info(`Returning cached DP holding data with key: ${redisKey}`);

            const summaryData = !cachedData.summaryData ? tradingHoldingSummaryV2(cachedData.data || []) : cachedData.summaryData;

            if (showSummaryOnly) {
                return summaryData;
            }


            return {
                data: cachedData.data,
                updatedAt: cachedData.updatedAt,
                summaryData: summaryData,
            };
        }

        const records = await techExcelAPICall(
            "entry/dp_holding",
            {
                "Client_code": clientCode,
                "To_date": toDate
            }
        );

        if (!Array.isArray(records)) {
            logger.error("DP Holding API did not return a valid array");
            return [];
        }

        logger.info(`DP Holding API returned ${records.length} records for ${clientCode}`);

        const summaryData = tradingHoldingSummaryV2(records || []);
        const data: CachedDPHoldingData = {
            data: records || [],
            updatedAt: new Date().toISOString(),
            summaryData
        };

        if (storeRedis) {
            const ttl = finstyr != getFinancialYear() && persistPermanent
                ? undefined
                : getTodayRemainingTime();
            await CacheService.set(redisClient as any, redisKey, data, ttl);
        }

        if (showSummaryOnly) {
            return summaryData;
        }

        return data as DPHoldingResponseData;
    } catch (error) {
        const err = error as Error & { statusCode?: number };
        logger.error(`Error while fetching DP Holding data: ${err.message}`);
        throw new ApiError(
            err.statusCode || 500,
            err.message || "Internal server error"
        );
    }
};

export const getFadaybookV2 = async ({
    clientCode,
    fromDate,
    toDate,
    companyCode = COMPANY_CODE_MAP.Group1,
    transType,
    finstyr = getFinancialYear(),
    isHardRefresh = false,
    persistPermanent = true,
}: GetFadaybookV2Params): Promise<DataWithTimestamp<FADayBookRecord>> => {
    try {
        logger.info(`FA Day Book API for ${clientCode} - ${transType} - ${fromDate} to ${toDate}`);

        const redisKey = CacheService.generateKey(
            'client_reports',
            `${clientCode}:${finstyr}:payinPayout:${fromDate}-${toDate}:${companyCode}:${transType}`
        )
        let cachedData = await CacheService.get<DataWithTimestamp<FADayBookRecord>>(
            redisClient as any,
            redisKey,
            isHardRefresh
        )
        if (cachedData) {
            logger.info(`Returning cached FA day book data with key: ${redisKey}`);
            return cachedData;
        }

        const records = await techExcelAPICall(
            "entry/fa_day_book",
            {
                "CLIENT_CODE": clientCode,
                "FROM_DATE": fromDate,
                "TO_DATE": toDate,
                "COMPANY_CODE": companyCode,
                "TRANS_TYPE": transType
            }
        );

        if (!Array.isArray(records)) {
            logger.error("FA Day Book API did not return a valid array");
            return {
                data: [],
                updatedAt: new Date().toISOString()
            };
        }

        logger.info(`FA Day Book API returned ${records.length} records for ${clientCode}`);

        const data: DataWithTimestamp<FADayBookRecord> = {
            data: records || [],
            updatedAt: new Date().toISOString(),
        }

        const ttl = finstyr != getFinancialYear() && persistPermanent
            ? undefined
            : getTodayRemainingTime();
        await CacheService.set(redisClient as any, redisKey, data, ttl);

        return data;
    } catch (error) {
        const err = error as Error & { statusCode?: number };
        logger.error(`Error while fetching FA Day Book data: ${err.message}`);
        throw new ApiError(
            err.statusCode || 500,
            err.message || "Internal server error"
        );
    }
};

export const getBankDetails = async ({
    clientCode,
    isHardRefresh = false,
    storeRedis = true,
}: GetBankDetailsParams): Promise<DataWithTimestamp<BankDetailsRecord>> => {
    try {
        logger.info(`Calling Bank Details API for ${clientCode}`);

        const redisKey = CacheService.generateKey(
            'connect',
            `${clientCode}:bankDetails`
        );

        let cachedData: DataWithTimestamp<BankDetailsRecord> | null = null;

        if (storeRedis) {
            cachedData = await CacheService.get<DataWithTimestamp<BankDetailsRecord>>(redisClient as any, redisKey, isHardRefresh);
        }

        if (cachedData) {
            logger.info(`Returning cached bank details data with key: ${redisKey}`);
            return cachedData;
        }

        const records = await techExcelAPICall(
            "entry/client_bank_detail_multiple",
            {
                "Client_id": clientCode
            }
        );

        if (!Array.isArray(records)) {
            logger.error("Bank Details API did not return a valid array");
            return {
                data: [],
                updatedAt: new Date().toISOString()
            };
        }

        logger.info(`Bank Details API returned ${records.length} records for ${clientCode}`);

        const data: DataWithTimestamp<BankDetailsRecord> = {
            data: records || [],
            updatedAt: new Date().toISOString(),
        };

        if (storeRedis) {
            const ttl = getTodayRemainingTime();
            await CacheService.set(redisClient as any, redisKey, data, ttl);
        }

        return data;

    } catch (error) {
        const err = error as Error & { message: string; stack?: string };
        logger.error(`Error in getBankDetails: ${err.message}`);
        throw error instanceof ApiError
            ? error
            : new ApiError(
                500,
                "Internal Server Error",
                [err?.message],
                err?.stack
            );
    }
}

export const getPaymentRequestStatus = async ({
    clientCode
}: GetPaymentRequestStatusParams): Promise<DataWithTimestamp<PaymentRequestStatusRecord>> => {
    try {
        logger.info(`Calling Payment Request Status API for ${clientCode}`);

        const records = await techExcelAPICall(
            "entry/payment_request_status_view_f",
            {
                "Client_code": clientCode
            }
        );

        if (!Array.isArray(records)) {
            logger.error("Payment Request Status API did not return a valid array");
            return {
                data: [],
                updatedAt: new Date().toISOString()
            };
        }

        logger.info(`Payment Request Status API returned ${records.length} records for ${clientCode}`);

        const data: DataWithTimestamp<PaymentRequestStatusRecord> = {
            data: records || [],
            updatedAt: new Date().toISOString(),
        };

        return data;
    } catch (error) {
        const err = error as Error & { message: string; stack?: string };
        logger.error(`Error in getPaymentRequestStatus: ${err.message}`);
        throw error instanceof ApiError
            ? error
            : new ApiError(
                500,
                "Internal Server Error",
                [err?.message],
                err?.stack
            );
    }
}
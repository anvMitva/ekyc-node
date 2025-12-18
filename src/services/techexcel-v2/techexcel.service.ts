
import axios, { AxiosError } from 'axios';
import logger from '../../logger/winston.logger.js';
import { convertObjectKeysToLowerCase } from '../../utils/utils.js';
import { redisClient } from '../../utils/dbConnection.js';
import { CacheService } from '../cache.service.js';
import type { 
    TechExcelTokenData, 
    TechExcelErrorResponse, 
    TechExcelSuccessResponse 
} from '../../types/techexcel.js';

const TECHEXCEL_USERNAME = process.env.TECH_EXCEL_USERNAME as string;
// Redis key and TTL for Tech Excel token
const TOKEN_REDIS_KEY = `techexcel:${TECHEXCEL_USERNAME}:token`;
const TOKEN_TTL_SECONDS = 3600 * 24; // 24 hours



// Function to call login API and get new token
const loginAndGetToken = async (): Promise<string> => {
    try {
        logger.info('Logging in to Tech Excel API to obtain new token');
        const loginUrl = process.env.TECH_EXCEL_LOGIN_URL as string;
        const loginData = {
            name: TECHEXCEL_USERNAME,
            password: process.env.TECH_EXCEL_PASSWORD as string
        };

        const response = await axios.post(loginUrl, loginData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const token = response.data as string;
        const data: TechExcelTokenData = {
            token: token,
            updatedAt: new Date().toISOString()
        }

        await CacheService.set(redisClient as any, TOKEN_REDIS_KEY, data, TOKEN_TTL_SECONDS);
        logger.info('New token obtained and stored');
        return token;
    } catch (error) {
        const axiosError = error as AxiosError;
        logger.error('Login failed:', axiosError.response?.data || axiosError.message);
        throw new Error('Failed to login and get token');
    }
};

// Function to check if error is token related
const isTokenError = (error: AxiosError<TechExcelErrorResponse>): boolean => {
    const errorCode = error?.response?.data?.['Error Code'];
    const errorDesc = error?.response?.data?.['Error Description'];
    return ['Invalid Token', 'Token Missing', 'Token Expired'].includes(errorCode || '') || ['Token is missing, expired, or invalid.'].includes(errorDesc || '');
};


// Function to check if error is token related
const noDataFoundError = (error: AxiosError<TechExcelErrorResponse>): boolean => {
    const errDesc = (
        error?.response?.data?.['Error Description'] ||
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        ''
    ).toString().toLowerCase();
    return errDesc.includes('data not found') || errDesc.includes('no data found');
};


// Main API call function with token management
const techExcelAPICall = async (endpoint: string, body: Record<string, any>, retryCount: number = 0): Promise<any[]> => {
    const MAX_RETRIES = 3;

    try {
        // Get token from file or environment
        let tokenData = await CacheService.get<TechExcelTokenData>(redisClient as any, TOKEN_REDIS_KEY);
        let token: string | null = null;

        if (!tokenData) {
            token = await loginAndGetToken();
        }
        const updatedAt = tokenData?.updatedAt ? new Date(tokenData.updatedAt) : null;

        // true when tokenData.updatedAt is within the last 24 hours
        if (updatedAt && updatedAt.getTime() > Date.now() - TOKEN_TTL_SECONDS * 1000) {
            token = tokenData.token;
        } else {
            token = await loginAndGetToken();
        }

        const url = `${process.env.TECH_EXCEL_API_URL}/${endpoint}`;

        const response = await axios.post<TechExcelSuccessResponse>(url, body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        // Convert all keys in array of objects to lower case
        if (response.status === 200) {
            return convertObjectKeysToLowerCase(response.data['Success Description'] || []);
        }
        return [];
    } catch (error) {
        const axiosError = error as AxiosError<TechExcelErrorResponse>;

        if (noDataFoundError(axiosError)) {
            logger.warn(`No data found for endpoint: ${endpoint} with body: ${JSON.stringify(body)}`);
            return [];
        }

        // Check if it's a token-related error
        if (isTokenError(axiosError) && retryCount < MAX_RETRIES) {
            logger.warn(`Token error detected. Retry attempt: ${retryCount + 1}/${MAX_RETRIES}`);

            try {
                // Get new token
                await loginAndGetToken();

                // Retry the API call
                return await techExcelAPICall(endpoint, body, retryCount + 1);

            } catch (loginError) {
                const loginErr = loginError as Error;
                logger.error('Failed to refresh token:', loginErr.message);
            }
        }

        // Log error and throw if max retries reached or non-token error
        const logMessage = `${endpoint} || ${axiosError?.response?.status || "NO_STATUS"} || ${axiosError.message} || ${JSON.stringify(body)}`;
        logger.error(logMessage);

        if (retryCount >= MAX_RETRIES) {
            throw new Error(`Tech Excel API call failed after ${MAX_RETRIES} retries`);
        } else {
            throw new Error(axiosError?.response?.data?.['Error Description']);
        }
    }
};

// Export the main function
export { techExcelAPICall };
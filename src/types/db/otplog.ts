/**
 * Type definitions for OTPLog DB service
 */

/**
 * Query options for finding OTP logs
 */
export interface OtpLogQueryOptions {
  includeRelations?: boolean;
  limit?: number;
  offset?: number;
  order?: Array<[string, string]>;
}

/**
 * OTP log data for creation
 */
export interface OtpLogData {
  otpId?: number;
  uid?: string;
  mobile?: string;
  email?: string;
  mobileOtpStatus?: string;
  emailOtpStatus?: string;
  mobileOtpAction?: string;
  emailOtpAction?: string;
  [key: string]: any;
}

/**
 * OTP log filters
 */
export interface OtpLogFilters {
  otpId?: number;
  uid?: string;
  mobile?: string;
  email?: string;
  mobileOtpStatus?: string;
  emailOtpStatus?: string;
  mobileOtpAction?: string;
  emailOtpAction?: string;
  [key: string]: any;
}

/**
 * Find and count result
 */
export interface OtpLogFindAndCountResult {
  rows: any[];
  count: number;
}

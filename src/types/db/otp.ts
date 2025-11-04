/**
 * Type definitions for OTP DB service
 */

/**
 * Query options for finding OTPs
 */
export interface OtpQueryOptions {
  includeRelations?: boolean;
  limit?: number;
  offset?: number;
  order?: Array<[string, string]>;
}

/**
 * OTP data for creation/update
 */
export interface OtpData {
  uid?: string;
  mobile?: string;
  email?: string;
  mobileOtp?: string;
  emailOtp?: string;
  mobileOtpExpiry?: Date;
  emailOtpExpiry?: Date;
  mobileOtpVerified?: boolean;
  emailOtpVerified?: boolean;
  mobileOtpVerifiedAt?: Date | null;
  emailOtpVerifiedAt?: Date | null;
  mobileOtpAttempts?: number;
  emailOtpAttempts?: number;
  mobileOtpResendAttempts?: number;
  emailOtpResendAttempts?: number;
  isBlocked?: boolean;
  blockedUntil?: Date | null;
  [key: string]: any;
}

/**
 * OTP filters
 */
export interface OtpFilters {
  uid?: string;
  mobile?: string;
  email?: string;
  mobileOtpVerified?: boolean;
  emailOtpVerified?: boolean;
  isBlocked?: boolean;
  [key: string]: any;
}

/**
 * OTP with log result
 */
export interface OtpWithLogResult {
  otp: any;
  log: any;
}

/**
 * Find and count result
 */
export interface OtpFindAndCountResult {
  rows: any[];
  count: number;
}

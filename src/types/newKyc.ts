/**
 * Type definitions for newKyc controller
 */

/**
 * Request body for sending OTP
 */
export interface SendOtpRequestBody {
  mobileNo: string;
  otp: string;
  [key: string]: string | undefined;
}

/**
 * Request query parameters for sending OTP
 */
export interface SendOtpRequestQuery {
  pan?: string;
  [key: string]: string | undefined;
}

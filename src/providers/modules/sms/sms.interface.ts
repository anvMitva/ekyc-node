/**
 * SMS Module Types and Interfaces
 * Defines the common request/response structure for all SMS providers
 */
import type { BaseProviderRequest, BaseProviderResponse } from "../../../types/provider.js";

// ==================== SMS Types ====================

/**
 * SMS Type - determines the template to use
 */
export type SmsType =
  | "signup"
  | "mobile"
  | "bankUpdate"
  | "password"
  | "edis"
  | "ipvLink"
  | "default";

// ==================== SMS Request Types ====================

/**
 * SMS Send Request
 * Universal request format - each provider adapter transforms this to their format
 */
export interface SmsSendRequest extends BaseProviderRequest {
  mobileNumber: string;
  message: string;
  templateId?: string;
  smsType?: SmsType;
  variables?: Record<string, string>; // For template variables
}

/**
 * SMS OTP Request (convenience wrapper)
 */
export interface SmsOtpRequest extends BaseProviderRequest {
  mobileNumber: string;
  otp: string;
  smsType: SmsType;
}

/**
 * SMS Delivery Status Request
 */
export interface SmsStatusRequest extends BaseProviderRequest {
  messageId: string;
}

// ==================== SMS Response Types ====================

/**
 * SMS Delivery Status Enum
 */
export enum SmsDeliveryStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

/**
 * SMS Send Response Data
 */
export interface SmsSendData {
  messageId: string;
  status: SmsDeliveryStatus;
  mobileNumber: string;
  creditsUsed?: number;
  rawResponse?: unknown;
}

/**
 * SMS Send Response
 * Universal response format - each provider adapter transforms their response to this
 */
export type SmsSendResponse = BaseProviderResponse<SmsSendData>;

/**
 * SMS Status Data
 */
export interface SmsStatusData {
  messageId: string;
  status: SmsDeliveryStatus;
  deliveredAt?: Date;
  error?: string;
}

/**
 * SMS Status Response
 */
export type SmsStatusResponse = BaseProviderResponse<SmsStatusData>;

// ==================== SMS Provider Interface ====================

/**
 * Interface that all SMS providers must implement
 */
export interface ISmsProvider {
  /**
   * Send an SMS
   * @param request - SMS send request
   * @returns SMS send response
   */
  send(request: SmsSendRequest): Promise<SmsSendResponse>;

  /**
   * Send OTP SMS using predefined templates
   * @param request - OTP request
   * @returns SMS send response
   */
  sendOtp(request: SmsOtpRequest): Promise<SmsSendResponse>;

  /**
   * Check delivery status
   * @param request - Status check request
   * @returns Status response
   */
  checkStatus?(request: SmsStatusRequest): Promise<SmsStatusResponse>;

  /**
   * Get provider name
   */
  getName(): string;

  /**
   * Get provider code
   */
  getCode(): string;
}

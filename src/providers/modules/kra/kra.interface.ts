/**
 * KRA Module Types and Interfaces
 * Defines the common request/response structure for all KRA providers
 */
import type { BaseProviderRequest, BaseProviderResponse } from "../../../types/provider.js";

// ==================== KRA Request Types ====================

/**
 * KRA Verification Request
 * Universal request format - each provider adapter transforms this to their format
 */
export interface KraVerifyRequest extends BaseProviderRequest {
  panNumber: string;
  fullName?: string;
  dateOfBirth?: string; // Format: YYYY-MM-DD
}

/**
 * KRA Status Check Request
 */
export interface KraStatusRequest extends BaseProviderRequest {
  panNumber: string;
  referenceId?: string;
}

// ==================== KRA Response Types ====================

/**
 * KRA Status Enum
 */
export enum KraStatus {
  REGISTERED = "REGISTERED",
  NOT_REGISTERED = "NOT_REGISTERED",
  PENDING = "PENDING",
  INVALID = "INVALID",
  ERROR = "ERROR",
}

/**
 * KRA Details from provider
 */
export interface KraDetails {
  panNumber: string;
  name: string;
  fatherName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  email?: string;
  mobile?: string;
  kraRegistrationDate?: string;
  kraAgency?: string; // CAMS, CVL, etc.
}

/**
 * KRA Verification Response Data
 */
export interface KraVerifyData {
  status: KraStatus;
  isRegistered: boolean;
  details: KraDetails | null;
  referenceId?: string;
  rawResponse?: unknown; // Original provider response (for debugging)
}

/**
 * KRA Verification Response
 * Universal response format - each provider adapter transforms their response to this
 */
export type KraVerifyResponse = BaseProviderResponse<KraVerifyData>;

/**
 * KRA Status Data
 */
export interface KraStatusData {
  status: KraStatus;
  message: string;
  referenceId?: string;
}

/**
 * KRA Status Response
 */
export type KraStatusResponse = BaseProviderResponse<KraStatusData>;

// ==================== KRA Provider Interface ====================

/**
 * Interface that all KRA providers must implement
 * This ensures consistent behavior across different KRA providers
 */
export interface IKraProvider {
  /**
   * Verify KRA registration status
   * @param request - KRA verification request
   * @returns KRA verification response
   */
  verify(request: KraVerifyRequest): Promise<KraVerifyResponse>;

  /**
   * Check status of a previous verification
   * @param request - Status check request
   * @returns KRA status response
   */
  checkStatus?(request: KraStatusRequest): Promise<KraStatusResponse>;

  /**
   * Get provider name
   */
  getName(): string;

  /**
   * Get provider code
   */
  getCode(): string;
}

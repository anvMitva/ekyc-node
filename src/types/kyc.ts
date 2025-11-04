/**
 * KYC Service Type Definitions
 */

// ==================== Utility Types ====================

export type Nullable<T> = T | null;

// ==================== Database Record Types ====================

export interface KycRecord {
  [key: string]: any;
}

export interface ClientKycResult extends Record<string, any> {
  clientId?: string;
}

// ==================== API Response Types ====================

export interface ApiResponseData<T = any> {
  statusCode: number;
  message?: string;
  data?: T;
}


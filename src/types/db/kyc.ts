/**
 * Type definitions for KYC DB service
 */

/**
 * Query options for finding KYC records
 */
export interface KycQueryOptions {
  includeRelations?: boolean;
  limit?: number;
  offset?: number;
  order?: Array<[string, string]>;
}

/**
 * KYC data for creation/update
 */
export interface KycData {
  uid?: string;
  kycId?: string;
  panNo?: string;
  clientCode?: string;
  kycStatus?: string;
  kraStatus?: string;
  panStatus?: string;
  isKra?: boolean;
  kycCompletedAt?: Date;
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
  mobile?: string;
  email?: string;
  [key: string]: any;
}

/**
 * KYC filters
 */
export interface KycFilters {
  uid?: string;
  kycId?: string;
  panNo?: string;
  clientCode?: string;
  kycStatus?: string;
  kraStatus?: string;
  panStatus?: string;
  isKra?: boolean;
  [key: string]: any;
}

/**
 * KYC with activity result
 */
export interface KycWithActivityData {
  kyc: any;
  activity: any;
}

/**
 * Upsert result
 */
export interface KycUpsertResult {
  kyc: any;
  created: boolean;
}

/**
 * Find and count result
 */
export interface KycFindAndCountResult {
  rows: any[];
  count: number;
}

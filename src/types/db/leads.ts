/**
 * Type definitions for Leads DB service
 */
import type { Transaction } from "sequelize";

/**
 * Query options for finding leads
 */
export interface LeadsQueryOptions {
  includeRelations?: boolean;
  limit?: number;
  offset?: number;
  order?: Array<[string, string]>;
}

/**
 * Lead data for creation/update
 */
export interface LeadData {
  uid?: string;
  mobile?: string;
  email?: string;
  panNo?: string;
  rmCode?: string;
  apCode?: string;
  schemeCode?: string;
  referralCode?: string;
  source?: string;
  panStatus?: string;
  otpStatus?: string;
  deletedAt?: Date | null;
  [key: string]: any;
}

/**
 * Lead filters
 */
export interface LeadFilters {
  uid?: string;
  mobile?: string;
  email?: string;
  panNo?: string;
  rmCode?: string;
  apCode?: string;
  panStatus?: string;
  otpStatus?: string;
  [key: string]: any;
}

/**
 * Lead with OTP result
 */
export interface LeadWithOtpResult {
  lead: any;
  otp: any;
}

/**
 * Upsert result
 */
export interface LeadUpsertResult {
  lead: any;
  created: boolean;
}

/**
 * Upsert with transaction result
 */
export interface LeadUpsertWithTransactionResult {
  lead: any;
  created: boolean;
  updated: boolean;
}

/**
 * Find and count result
 */
export interface LeadFindAndCountResult {
  rows: any[];
  count: number;
}

/**
 * Transaction type re-export for convenience
 */
export type { Transaction };

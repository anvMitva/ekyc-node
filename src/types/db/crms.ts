/**
 * Type definitions for CRMS DB service
 */

/**
 * Client match result from CRMS
 */
export interface CrmsClientMatch {
  matchtype?: string;
  [key: string]: any;
}

/**
 * Categorized client results
 */
export interface CrmsClientResult {
  mobileMatches: CrmsClientMatch[];
  emailMatches: CrmsClientMatch[];
}

/**
 * CRMS query result with metadata
 */
export interface CrmsQueryResult {
  success: boolean;
  error?: string;
  data: CrmsClientResult;
  totalRecords: number;
}

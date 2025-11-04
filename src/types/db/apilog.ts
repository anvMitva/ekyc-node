/**
 * Type definitions for ApiLog DB service
 */

/**
 * Query options for finding API logs
 */
export interface ApiLogQueryOptions {
  limit?: number;
  offset?: number;
  order?: Array<[string, string]>;
}

/**
 * API log data for creation
 */
export interface ApiLogData {
  service?: string;
  provider?: string;
  api_endpoint?: string;
  mobile?: string | null;
  email?: string | null;
  type?: string;
  request_payload?: any;
  response_data?: any;
  error_data?: any;
  status?: "success" | "failed" | "pending";
  status_code?: number;
  duration?: number;
  ip_address?: string | null;
  user_agent?: string | null;
  uid?: string | null;
  kyc_id?: string | null;
  reference_id?: string | null;
  retry_count?: number;
  [key: string]: any;
}

/**
 * API log filters
 */
export interface ApiLogFilters {
  service?: string;
  provider?: string;
  mobile?: string;
  email?: string;
  uid?: string;
  status?: "success" | "failed" | "pending";
  [key: string]: any;
}

/**
 * API statistics result
 */
export interface ApiStatistics {
  total: number;
  successful: number;
  failed: number;
  successRate: number;
  avgDuration: number;
}

/**
 * Find and count result
 */
export interface ApiLogFindAndCountResult {
  rows: any[];
  count: number;
}

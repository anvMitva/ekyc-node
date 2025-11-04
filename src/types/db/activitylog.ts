/**
 * Type definitions for ActivityLog DB service
 */

/**
 * Query options for finding activity logs
 */
export interface ActivityLogQueryOptions {
  includeRelations?: boolean;
  limit?: number;
  offset?: number;
  order?: Array<[string, string]>;
}

/**
 * Activity log data for creation
 */
export interface ActivityLogData {
  uid?: string;
  kycId?: string;
  clientCode?: string;
  activityName?: string;
  activityType?: string;
  status?: string;
  sessionId?: string;
  activity_time?: Date;
  [key: string]: any;
}

/**
 * Activity log filters
 */
export interface ActivityLogFilters {
  uid?: string;
  kycId?: string;
  clientCode?: string;
  activityName?: string;
  activityType?: string;
  status?: string;
  sessionId?: string;
  [key: string]: any;
}

/**
 * Activity statistics result
 */
export interface ActivityStats {
  total: number;
  latest: any;
  byType: Array<{
    activityType: string;
    count: number;
  }>;
}

/**
 * Find and count result
 */
export interface ActivityLogFindAndCountResult {
  rows: any[];
  count: number;
}

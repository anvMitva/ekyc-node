/**
 * Type definitions for LastActivity DB service
 */

/**
 * Query options for finding last activities
 */
export interface LastActivityQueryOptions {
  includeRelations?: boolean;
  limit?: number;
  offset?: number;
  order?: Array<[string, string]>;
}

/**
 * Last activity data for creation/update
 */
export interface LastActivityData {
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
 * Last activity filters
 */
export interface LastActivityFilters {
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
 * Upsert result
 */
export interface LastActivityUpsertResult {
  activity: any;
  created: boolean;
}

/**
 * Find and count result
 */
export interface LastActivityFindAndCountResult {
  rows: any[];
  count: number;
}

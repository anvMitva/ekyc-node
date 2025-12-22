/**
 * Provider System Types
 * Core types for the multi-provider fallback system
 */

// ==================== Provider Configuration Types ====================

/**
 * Rate limit configuration for a provider
 */
export interface RateLimitConfig {
  maxRequests: number;
  perMilliseconds: number;
}

/**
 * Retry configuration for a provider
 */
export interface RetryConfig {
  maxRetries: number;
  retryableStatusCodes: number[];
}

/**
 * Individual provider configuration
 */
export interface ProviderConfig {
  name: string;
  code: string;
  enabled: boolean;
  priority: number;
  timeout: number;
  baseUrl: string;
  apiKey: string;
  apiSecret?: string;
  rateLimit?: RateLimitConfig;
  retryConfig?: RetryConfig;
  headers?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

/**
 * Provider health status
 */
export interface ProviderHealth {
  isHealthy: boolean;
  lastChecked: Date;
  failureCount: number;
  lastFailure: Date | null;
  lastSuccess: Date | null;
  circuitBreakerOpen: boolean;
  cooldownUntil: Date | null;
}

/**
 * Module configuration containing all providers for a module
 */
export interface ModuleProvidersConfig {
  [providerCode: string]: ProviderConfig;
}

/**
 * Complete provider configuration structure (cached in memory/redis)
 */
export interface ProviderConfigCache {
  [moduleName: string]: ModuleProvidersConfig;
}

// ==================== Provider Execution Types ====================

/**
 * Status codes that indicate provider failure (not our code's fault)
 */
export const PROVIDER_ERROR_CODES = [408, 429, 500, 502, 503, 504, 0] as const;

/**
 * Result of a provider call
 */
export interface ProviderResult<T = unknown> {
  success: boolean;
  data: T | null;
  error: ProviderError | null;
  provider: string;
  module: string;
  duration: number;
  timestamp: Date;
}

/**
 * Provider error details
 */
export interface ProviderError {
  code: string;
  message: string;
  statusCode: number;
  isProviderFailure: boolean;
  originalError?: unknown;
}

/**
 * Provider execution context (for logging)
 */
export interface ProviderContext {
  correlationId: string;
  module: string;
  operation: string;
  startTime: Date;
  attempts: ProviderAttempt[];
}

/**
 * Single attempt record
 */
export interface ProviderAttempt {
  provider: string;
  attemptNumber: number;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  success: boolean;
  statusCode: number | null;
  error: string | null;
  isProviderFailure: boolean;
}

// ==================== Database Model Types ====================

/**
 * Provider database record
 */
export interface ProviderDbRecord {
  id: number;
  moduleName: string;
  providerCode: string;
  providerName: string;
  enabled: boolean;
  priority: number;
  timeout: number;
  baseUrl: string;
  apiKey: string;
  apiSecret: string | null;
  rateLimit: RateLimitConfig | null;
  retryConfig: RetryConfig | null;
  headers: Record<string, string> | null;
  metadata: Record<string, unknown> | null;
  isHealthy: boolean;
  failureCount: number;
  lastFailure: Date | null;
  lastSuccess: Date | null;
  circuitBreakerOpen: boolean;
  cooldownUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Provider log record for tracking all API calls
 */
export interface ProviderLogRecord {
  id: number;
  correlationId: string;
  moduleName: string;
  operation: string;
  providerCode: string;
  attemptNumber: number;
  requestPayload: Record<string, unknown>;
  responseData: Record<string, unknown> | null;
  statusCode: number | null;
  success: boolean;
  isProviderFailure: boolean;
  errorMessage: string | null;
  duration: number;
  ip: string | null;
  userAgent: string | null;
  uid: string | null;
  createdAt: Date;
}

// ==================== Alert Types ====================

/**
 * Alert configuration
 */
export interface AlertConfig {
  enabled: boolean;
  recipients: string[];
  thresholds: {
    consecutiveFailures: number;
    allProvidersDown: boolean;
  };
}

/**
 * Alert payload
 */
export interface ProviderAlert {
  type: 'PROVIDER_DOWN' | 'PROVIDER_RECOVERED' | 'ALL_PROVIDERS_DOWN' | 'HIGH_FAILURE_RATE';
  module: string;
  provider?: string;
  message: string;
  details: Record<string, unknown>;
  timestamp: Date;
}

// ==================== Module Interface Types ====================

/**
 * Base request type - all module requests extend this
 */
export interface BaseProviderRequest {
  correlationId?: string;
  uid?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: unknown; // Allow additional properties
}

/**
 * Base response type - all module responses extend this
 */
export interface BaseProviderResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// ==================== Provider Manager Types ====================

/**
 * Options for provider execution
 */
export interface ExecutionOptions {
  skipProviders?: string[];
  maxAttempts?: number;
  timeout?: number;
  correlationId?: string;
}

/**
 * Provider manager configuration
 */
export interface ProviderManagerConfig {
  circuitBreakerThreshold: number;
  circuitBreakerCooldown: number; // in milliseconds
  cacheRefreshInterval: number; // in milliseconds
  enableLogging: boolean;
  enableAlerts: boolean;
}

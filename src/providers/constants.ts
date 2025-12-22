/**
 * Provider Constants
 * Central place for all provider-related constants
 */

// Module names - add new modules here
export const MODULES = {
  KRA: "KRA",
  SMS: "SMS",
  EMAIL: "EMAIL",
  PAN: "PAN",
  BANK: "BANK",
} as const;

export type ModuleName = (typeof MODULES)[keyof typeof MODULES];

// Provider codes for each module
export const PROVIDERS = {
  KRA: {
    CAMS: "CAMS",
    ONGRID: "ONGRID",
    CVL: "CVL",
  },
  SMS: {
    ONLYSMS: "ONLYSMS",
    TWOFACTOR: "TWOFACTOR",
  },
  EMAIL: {
    SMTP: "SMTP",
    SENDGRID: "SENDGRID",
  },
  PAN: {
    NSDL: "NSDL",
    KARZA: "KARZA",
  },
  BANK: {
    RAZORPAY: "RAZORPAY",
    CASHFREE: "CASHFREE",
  },
} as const;

// Circuit breaker defaults
export const CIRCUIT_BREAKER = {
  THRESHOLD: 3, // Number of failures before opening circuit
  COOLDOWN_MS: 60000, // 1 minute cooldown
  HALF_OPEN_REQUESTS: 1, // Number of requests to try in half-open state
} as const;

// Cache settings
export const CACHE = {
  REDIS_KEY_PREFIX: "provider:",
  CONFIG_KEY: "provider:config",
  HEALTH_KEY_PREFIX: "provider:health:",
  REFRESH_INTERVAL_MS: 2 * 60 * 1000, // 2 minutes (configurable via env)
  TTL_SECONDS: 5 * 60, // 5 minutes TTL
} as const;

// Provider error status codes (indicates provider issue, not our code)
export const PROVIDER_ERROR_CODES = [
  0, // Network error
  408, // Request Timeout
  429, // Too Many Requests
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
] as const;

// Log levels for provider operations
export const LOG_LEVELS = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
} as const;

// Alert types
export const ALERT_TYPES = {
  PROVIDER_DOWN: "PROVIDER_DOWN",
  PROVIDER_RECOVERED: "PROVIDER_RECOVERED",
  ALL_PROVIDERS_DOWN: "ALL_PROVIDERS_DOWN",
  HIGH_FAILURE_RATE: "HIGH_FAILURE_RATE",
} as const;

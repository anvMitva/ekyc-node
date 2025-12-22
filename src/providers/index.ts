/**
 * Provider System Index
 * Main entry point for the multi-provider fallback system
 */

// Core Components
export { ProviderManager } from "./manager.js";
export { ProviderCacheService } from "./cache.service.js";
export { ProviderCronService } from "./cron.service.js";
export { AlertService } from "./alert.service.js";
export { BaseProvider } from "./base.provider.js";

// Constants
export { MODULES, PROVIDERS, CIRCUIT_BREAKER, CACHE } from "./constants.js";
export type { ModuleName } from "./constants.js";

// Modules
export * from "./modules/kra/index.js";
export * from "./modules/sms/index.js";

// Types (re-export from types folder)
export type {
  ProviderConfig,
  ProviderHealth,
  ProviderConfigCache,
  ProviderResult,
  ProviderError,
  ProviderContext,
  ProviderAttempt,
  ProviderAlert,
  ExecutionOptions,
  BaseProviderRequest,
  BaseProviderResponse,
} from "../types/provider.js";

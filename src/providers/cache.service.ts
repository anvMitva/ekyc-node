/**
 * Provider Cache Service
 * Manages in-memory and Redis caching of provider configurations
 */
import { Provider } from "../models/provider/index.js";
import { redisClient } from "../utils/dbConnection.js";
import logger from "../logger/winston.logger.js";
import { CACHE, MODULES } from "./constants.js";
import type {
  ProviderConfig,
  ProviderConfigCache,
  ProviderHealth,
} from "../types/provider.js";

/**
 * In-memory cache for fast access
 */
let inMemoryCache: ProviderConfigCache = {};
let lastCacheUpdate: Date | null = null;

/**
 * In-memory health status tracking
 */
const healthStatus: Map<string, ProviderHealth> = new Map();

/**
 * Provider Cache Service
 * Handles loading, caching, and refreshing provider configurations
 */
export class ProviderCacheService {
  /**
   * Get the cache key for health status
   */
  private static getHealthKey(moduleName: string, providerCode: string): string {
    return `${moduleName}:${providerCode}`;
  }

  /**
   * Load all providers from database and build cache structure
   */
  static async loadFromDatabase(): Promise<ProviderConfigCache> {
    try {
      logger.info("Loading provider configurations from database");

      const providers = await Provider.findAll({
        where: { enabled: true },
        order: [["moduleName", "ASC"], ["priority", "ASC"]],
      });

      const config: ProviderConfigCache = {};

      for (const provider of providers) {
        const moduleName = provider.moduleName;
        const providerCode = provider.providerCode;

        // Initialize module if not exists
        if (!config[moduleName]) {
          config[moduleName] = {};
        }

        // Resolve API key from environment if it's a placeholder
        const resolvedApiKey = this.resolveEnvVariable(provider.apiKey);
        const resolvedApiSecret = provider.apiSecret
          ? this.resolveEnvVariable(provider.apiSecret)
          : undefined;

        // Build provider config
        config[moduleName][providerCode] = {
          name: provider.providerName,
          code: providerCode,
          enabled: provider.enabled,
          priority: provider.priority,
          timeout: provider.timeout,
          baseUrl: provider.baseUrl,
          apiKey: resolvedApiKey,
          apiSecret: resolvedApiSecret,
          rateLimit: provider.rateLimit || undefined,
          retryConfig: provider.retryConfig || undefined,
          headers: provider.headers || undefined,
          metadata: provider.metadata || undefined,
        };

        // Initialize health status
        const healthKey = this.getHealthKey(moduleName, providerCode);
        if (!healthStatus.has(healthKey)) {
          healthStatus.set(healthKey, {
            isHealthy: provider.isHealthy,
            lastChecked: new Date(),
            failureCount: provider.failureCount,
            lastFailure: provider.lastFailure,
            lastSuccess: provider.lastSuccess,
            circuitBreakerOpen: provider.circuitBreakerOpen,
            cooldownUntil: provider.cooldownUntil,
          });
        }
      }

      logger.info("Provider configurations loaded", {
        modules: Object.keys(config),
        totalProviders: providers.length,
      });

      return config;
    } catch (error) {
      logger.error("Failed to load provider configurations", {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Resolve environment variable placeholders like {{API_KEY}}
   */
  private static resolveEnvVariable(value: string): string {
    const envPattern = /\{\{(\w+)\}\}/g;
    return value.replace(envPattern, (match, envVar) => {
      return process.env[envVar] || match;
    });
  }

  /**
   * Refresh the cache from database
   */
  static async refreshCache(): Promise<void> {
    try {
      const config = await this.loadFromDatabase();

      // Update in-memory cache
      inMemoryCache = config;
      lastCacheUpdate = new Date();

      // Update Redis cache
      try {
        await redisClient.set(CACHE.CONFIG_KEY, JSON.stringify(config), {
          EX: CACHE.TTL_SECONDS,
        });
      } catch (redisError) {
        logger.warn("Failed to update Redis cache, using in-memory only", {
          error: (redisError as Error).message,
        });
      }

      logger.info("Provider cache refreshed successfully", {
        timestamp: lastCacheUpdate.toISOString(),
      });
    } catch (error) {
      logger.error("Failed to refresh provider cache", {
        error: (error as Error).message,
      });
      // Don't throw - keep using stale cache if available
    }
  }

  /**
   * Get all providers configuration
   */
  static async getConfig(): Promise<ProviderConfigCache> {
    // Return in-memory cache if available
    if (Object.keys(inMemoryCache).length > 0) {
      return inMemoryCache;
    }

    // Try Redis cache
    try {
      const redisData = await redisClient.get(CACHE.CONFIG_KEY);
      if (redisData && typeof redisData === 'string') {
        inMemoryCache = JSON.parse(redisData);
        return inMemoryCache;
      }
    } catch (redisError) {
      logger.warn("Failed to read from Redis cache", {
        error: (redisError as Error).message,
      });
    }

    // Fallback to database
    inMemoryCache = await this.loadFromDatabase();
    return inMemoryCache;
  }

  /**
   * Get providers for a specific module, sorted by priority
   */
  static async getModuleProviders(moduleName: string): Promise<ProviderConfig[]> {
    const config = await this.getConfig();
    const moduleConfig = config[moduleName];

    if (!moduleConfig) {
      return [];
    }

    // Convert to array and sort by priority
    return Object.values(moduleConfig)
      .filter((p) => p.enabled)
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get a specific provider config
   */
  static async getProvider(
    moduleName: string,
    providerCode: string
  ): Promise<ProviderConfig | null> {
    const config = await this.getConfig();
    return config[moduleName]?.[providerCode] || null;
  }

  /**
   * Get health status for a provider
   */
  static getHealthStatus(
    moduleName: string,
    providerCode: string
  ): ProviderHealth | null {
    const key = this.getHealthKey(moduleName, providerCode);
    return healthStatus.get(key) || null;
  }

  /**
   * Update health status for a provider
   */
  static async updateHealthStatus(
    moduleName: string,
    providerCode: string,
    updates: Partial<ProviderHealth>
  ): Promise<void> {
    const key = this.getHealthKey(moduleName, providerCode);
    const current = healthStatus.get(key) || {
      isHealthy: true,
      lastChecked: new Date(),
      failureCount: 0,
      lastFailure: null,
      lastSuccess: null,
      circuitBreakerOpen: false,
      cooldownUntil: null,
    };

    const updated: ProviderHealth = {
      ...current,
      ...updates,
      lastChecked: new Date(),
    };

    healthStatus.set(key, updated);

    // Update database asynchronously (fire and forget)
    this.syncHealthToDatabase(moduleName, providerCode, updated).catch((err) => {
      logger.error("Failed to sync health status to database", {
        moduleName,
        providerCode,
        error: (err as Error).message,
      });
    });
  }

  /**
   * Sync health status to database
   */
  private static async syncHealthToDatabase(
    moduleName: string,
    providerCode: string,
    health: ProviderHealth
  ): Promise<void> {
    await Provider.update(
      {
        isHealthy: health.isHealthy,
        failureCount: health.failureCount,
        lastFailure: health.lastFailure,
        lastSuccess: health.lastSuccess,
        circuitBreakerOpen: health.circuitBreakerOpen,
        cooldownUntil: health.cooldownUntil,
      },
      {
        where: { moduleName, providerCode },
      }
    );
  }

  /**
   * Check if a provider is available (healthy and not in cooldown)
   */
  static isProviderAvailable(
    moduleName: string,
    providerCode: string
  ): boolean {
    const health = this.getHealthStatus(moduleName, providerCode);

    if (!health) {
      return true; // Assume available if no health data
    }

    // Check if circuit breaker is open and still in cooldown
    if (health.circuitBreakerOpen && health.cooldownUntil) {
      if (new Date() < health.cooldownUntil) {
        return false; // Still in cooldown
      }
      // Cooldown expired, allow half-open state
    }

    return true;
  }

  /**
   * Get available providers for a module (healthy and not in cooldown)
   */
  static async getAvailableProviders(
    moduleName: string
  ): Promise<ProviderConfig[]> {
    const providers = await this.getModuleProviders(moduleName);

    return providers.filter((provider) =>
      this.isProviderAvailable(moduleName, provider.code)
    );
  }

  /**
   * Get cache statistics
   */
  static getStats(): {
    lastUpdate: Date | null;
    moduleCount: number;
    providerCount: number;
    healthyCount: number;
    unhealthyCount: number;
  } {
    let providerCount = 0;
    let healthyCount = 0;
    let unhealthyCount = 0;

    for (const moduleConfig of Object.values(inMemoryCache)) {
      providerCount += Object.keys(moduleConfig).length;
    }

    for (const health of healthStatus.values()) {
      if (health.isHealthy) {
        healthyCount++;
      } else {
        unhealthyCount++;
      }
    }

    return {
      lastUpdate: lastCacheUpdate,
      moduleCount: Object.keys(inMemoryCache).length,
      providerCount,
      healthyCount,
      unhealthyCount,
    };
  }
}

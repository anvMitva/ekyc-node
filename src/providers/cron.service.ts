/**
 * Provider Cron Service
 * Handles periodic refresh of provider configurations from database
 */
import { ProviderCacheService } from "./cache.service.js";
import logger from "../logger/winston.logger.js";
import { CACHE } from "./constants.js";

// Get refresh interval from environment or use default (2 minutes)
const REFRESH_INTERVAL_MS = parseInt(
  process.env.PROVIDER_CACHE_REFRESH_INTERVAL || String(CACHE.REFRESH_INTERVAL_MS),
  10
);

let cronInterval: NodeJS.Timeout | null = null;
let isRunning = false;

/**
 * Provider Cron Service
 * Manages the periodic refresh of provider configurations
 */
export class ProviderCronService {
  /**
   * Start the cron job
   * Should be called once during application startup
   */
  static async start(): Promise<void> {
    if (cronInterval) {
      logger.warn("Provider cron already running, skipping start");
      return;
    }

    logger.info("Starting provider cache refresh cron", {
      intervalMs: REFRESH_INTERVAL_MS,
      intervalMinutes: REFRESH_INTERVAL_MS / 60000,
    });

    // Initial load
    await this.refreshProviders();

    // Set up periodic refresh
    cronInterval = setInterval(async () => {
      await this.refreshProviders();
    }, REFRESH_INTERVAL_MS);

    // Ensure interval doesn't prevent Node from exiting
    cronInterval.unref();
  }

  /**
   * Stop the cron job
   * Should be called during graceful shutdown
   */
  static stop(): void {
    if (cronInterval) {
      clearInterval(cronInterval);
      cronInterval = null;
      logger.info("Provider cache refresh cron stopped");
    }
  }

  /**
   * Manually trigger a refresh
   */
  static async refreshProviders(): Promise<void> {
    if (isRunning) {
      logger.debug("Provider refresh already in progress, skipping");
      return;
    }

    isRunning = true;

    try {
      logger.debug("Refreshing provider cache...");
      await ProviderCacheService.refreshCache();
      
      const stats = ProviderCacheService.getStats();
      logger.info("Provider cache refreshed", {
        modules: stats.moduleCount,
        providers: stats.providerCount,
        healthy: stats.healthyCount,
        unhealthy: stats.unhealthyCount,
      });
    } catch (error) {
      logger.error("Failed to refresh provider cache", {
        error: (error as Error).message,
      });
    } finally {
      isRunning = false;
    }
  }

  /**
   * Check if cron is running
   */
  static isRunning(): boolean {
    return cronInterval !== null;
  }

  /**
   * Get cron status
   */
  static getStatus(): {
    running: boolean;
    intervalMs: number;
    lastRefresh: Date | null;
  } {
    const stats = ProviderCacheService.getStats();
    return {
      running: cronInterval !== null,
      intervalMs: REFRESH_INTERVAL_MS,
      lastRefresh: stats.lastUpdate,
    };
  }
}

/**
 * KRA Service
 * High-level service that uses Provider Manager for KRA operations
 * This is what controllers should use
 */
import { ProviderManager } from "../../manager.js";
import { ProviderCacheService } from "../../cache.service.js";
import { MODULES, PROVIDERS } from "../../constants.js";
import { CamsKraProvider } from "./cams.provider.js";
import { OngridKraProvider } from "./ongrid.provider.js";
import logger from "../../../logger/winston.logger.js";
import type { ProviderConfig, ProviderResult } from "../../../types/provider.js";
import type {
  IKraProvider,
  KraVerifyRequest,
  KraVerifyResponse,
} from "./kra.interface.js";

// Provider factory - maps provider codes to their classes
const providerFactory: Record<string, new (config: ProviderConfig) => IKraProvider> = {
  [PROVIDERS.KRA.CAMS]: CamsKraProvider,
  [PROVIDERS.KRA.ONGRID]: OngridKraProvider,
  // Add new providers here: [PROVIDERS.KRA.CVL]: CvlKraProvider,
};

/**
 * Create provider instance based on config
 */
function createProvider(config: ProviderConfig): IKraProvider {
  const ProviderClass = providerFactory[config.code];

  if (!ProviderClass) {
    throw new Error(`Unknown KRA provider: ${config.code}`);
  }

  return new ProviderClass(config);
}

/**
 * KRA Service Class
 * Provides a simple interface for KRA operations with automatic fallback
 */
export class KraService {
  private providerManager: ProviderManager;

  constructor() {
    this.providerManager = new ProviderManager(MODULES.KRA);
  }

  /**
   * Verify KRA registration status
   * Automatically tries multiple providers if one fails
   *
   * @param request - Verification request
   * @returns Verification result
   */
  async verify(request: KraVerifyRequest): Promise<ProviderResult<KraVerifyResponse>> {
    return this.providerManager.execute<KraVerifyRequest, KraVerifyResponse>(
      "verify",
      request,
      async (config, req) => {
        // Create the appropriate provider instance
        const provider = createProvider(config);

        // Execute the verification
        return provider.verify(req);
      }
    );
  }

  /**
   * Verify using a specific provider (bypass fallback)
   * Use this when you need to use a specific provider
   *
   * @param providerCode - Provider code (e.g., 'CAMS')
   * @param request - Verification request
   * @returns Verification result
   */
  async verifyWithProvider(
    providerCode: string,
    request: KraVerifyRequest
  ): Promise<ProviderResult<KraVerifyResponse>> {
    return this.providerManager.execute<KraVerifyRequest, KraVerifyResponse>(
      "verify",
      request,
      async (config, req) => {
        const provider = createProvider(config);
        return provider.verify(req);
      },
      {
        skipProviders: Object.values(PROVIDERS.KRA).filter((p) => p !== providerCode),
        maxAttempts: 1,
      }
    );
  }

  /**
   * Get list of available KRA providers
   */
  async getAvailableProviders(): Promise<ProviderConfig[]> {
    return ProviderCacheService.getAvailableProviders(MODULES.KRA);
  }

  /**
   * Get health status of all KRA providers
   */
  async getProvidersHealth(): Promise<
    Array<{ code: string; name: string; isHealthy: boolean; failureCount: number }>
  > {
    const providers = await ProviderCacheService.getModuleProviders(MODULES.KRA);

    return providers.map((provider) => {
      const health = ProviderCacheService.getHealthStatus(MODULES.KRA, provider.code);
      return {
        code: provider.code,
        name: provider.name,
        isHealthy: health?.isHealthy ?? true,
        failureCount: health?.failureCount ?? 0,
      };
    });
  }
}

// Export singleton instance
export const kraService = new KraService();

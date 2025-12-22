/**
 * SMS Service
 * High-level service that uses Provider Manager for SMS operations
 */
import { ProviderManager } from "../../manager.js";
import { ProviderCacheService } from "../../cache.service.js";
import { MODULES, PROVIDERS } from "../../constants.js";
import { OnlySmsProvider } from "./onlysms.provider.js";
import { TwoFactorSmsProvider } from "./twofactor.provider.js";
import logger from "../../../logger/winston.logger.js";
import type { ProviderConfig, ProviderResult } from "../../../types/provider.js";
import type {
  ISmsProvider,
  SmsSendRequest,
  SmsSendResponse,
  SmsOtpRequest,
  SmsType,
} from "./sms.interface.js";

// Provider factory - maps provider codes to their classes
const providerFactory: Record<string, new (config: ProviderConfig) => ISmsProvider> = {
  [PROVIDERS.SMS.ONLYSMS]: OnlySmsProvider,
  [PROVIDERS.SMS.TWOFACTOR]: TwoFactorSmsProvider,
  // Add new providers here
};

/**
 * Create provider instance based on config
 */
function createProvider(config: ProviderConfig): ISmsProvider {
  const ProviderClass = providerFactory[config.code];

  if (!ProviderClass) {
    throw new Error(`Unknown SMS provider: ${config.code}`);
  }

  return new ProviderClass(config);
}

/**
 * SMS Service Class
 * Provides a simple interface for SMS operations with automatic fallback
 */
export class SmsService {
  private providerManager: ProviderManager;

  constructor() {
    this.providerManager = new ProviderManager(MODULES.SMS);
  }

  /**
   * Send SMS with automatic fallback
   *
   * @param request - SMS request
   * @returns Send result
   */
  async send(request: SmsSendRequest): Promise<ProviderResult<SmsSendResponse>> {
    return this.providerManager.execute<SmsSendRequest, SmsSendResponse>(
      "send",
      request,
      async (config, req) => {
        const provider = createProvider(config);
        return provider.send(req);
      }
    );
  }

  /**
   * Send OTP SMS with automatic fallback
   *
   * @param request - OTP request
   * @returns Send result
   */
  async sendOtp(request: SmsOtpRequest): Promise<ProviderResult<SmsSendResponse>> {
    return this.providerManager.execute<SmsOtpRequest, SmsSendResponse>(
      "sendOtp",
      request,
      async (config, req) => {
        const provider = createProvider(config);
        return provider.sendOtp(req);
      }
    );
  }

  /**
   * Convenience method: Send signup OTP
   */
  async sendSignupOtp(
    mobileNumber: string,
    otp: string,
    metadata?: { uid?: string; ip?: string; userAgent?: string; correlationId?: string }
  ): Promise<ProviderResult<SmsSendResponse>> {
    return this.sendOtp({
      mobileNumber,
      otp,
      smsType: "signup",
      ...metadata,
    });
  }

  /**
   * Convenience method: Send password reset OTP
   */
  async sendPasswordOtp(
    mobileNumber: string,
    otp: string,
    metadata?: { uid?: string; ip?: string; userAgent?: string; correlationId?: string }
  ): Promise<ProviderResult<SmsSendResponse>> {
    return this.sendOtp({
      mobileNumber,
      otp,
      smsType: "password",
      ...metadata,
    });
  }

  /**
   * Get list of available SMS providers
   */
  async getAvailableProviders(): Promise<ProviderConfig[]> {
    return ProviderCacheService.getAvailableProviders(MODULES.SMS);
  }

  /**
   * Get health status of all SMS providers
   */
  async getProvidersHealth(): Promise<
    Array<{ code: string; name: string; isHealthy: boolean; failureCount: number }>
  > {
    const providers = await ProviderCacheService.getModuleProviders(MODULES.SMS);

    return providers.map((provider) => {
      const health = ProviderCacheService.getHealthStatus(MODULES.SMS, provider.code);
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
export const smsService = new SmsService();

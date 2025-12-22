/**
 * Provider Manager
 * Core orchestrator that handles provider selection, execution, fallback, and circuit breaker logic
 */
import { v4 as uuidv4 } from "uuid";
import logger from "../logger/winston.logger.js";
import { ProviderCacheService } from "./cache.service.js";
import { ProviderLog } from "../models/provider/index.js";
import { CIRCUIT_BREAKER, PROVIDER_ERROR_CODES } from "./constants.js";
import type {
  ProviderConfig,
  ProviderResult,
  ProviderError,
  ProviderContext,
  ProviderAttempt,
  ExecutionOptions,
  BaseProviderRequest,
  BaseProviderResponse,
} from "../types/provider.js";
import { AlertService } from "./alert.service.js";

/**
 * Provider execution function type
 * Each provider adapter must implement this signature
 */
export type ProviderExecutor<TRequest, TResponse> = (
  config: ProviderConfig,
  request: TRequest
) => Promise<TResponse>;

/**
 * Provider Manager Class
 * Handles the complete provider execution lifecycle
 */
export class ProviderManager {
  private moduleName: string;

  constructor(moduleName: string) {
    this.moduleName = moduleName;
  }

  /**
   * Execute an operation with automatic fallback to next provider on failure
   *
   * @param operation - Name of the operation (for logging)
   * @param request - The request payload
   * @param executor - Function that executes the actual provider call
   * @param options - Execution options
   * @returns Provider result with success/failure details
   */
  async execute<TRequest extends BaseProviderRequest, TResponse extends BaseProviderResponse>(
    operation: string,
    request: TRequest,
    executor: ProviderExecutor<TRequest, TResponse>,
    options: ExecutionOptions = {}
  ): Promise<ProviderResult<TResponse>> {
    const correlationId = request.correlationId || options.correlationId || uuidv4();
    const startTime = new Date();

    // Create execution context
    const context: ProviderContext = {
      correlationId,
      module: this.moduleName,
      operation,
      startTime,
      attempts: [],
    };

    logger.info("Starting provider execution", {
      correlationId,
      module: this.moduleName,
      operation,
    });

    // Get available providers
    let providers = await ProviderCacheService.getAvailableProviders(this.moduleName);

    // Filter out skipped providers if specified
    if (options.skipProviders?.length) {
      providers = providers.filter(
        (p) => !options.skipProviders!.includes(p.code)
      );
    }

    // Limit attempts if specified
    const maxAttempts = options.maxAttempts || providers.length;
    const providersToTry = providers.slice(0, maxAttempts);

    if (providersToTry.length === 0) {
      logger.error("No available providers for module", {
        correlationId,
        module: this.moduleName,
      });

      return {
        success: false,
        data: null,
        error: {
          code: "NO_PROVIDERS",
          message: "No available providers for this module",
          statusCode: 503,
          isProviderFailure: false,
        },
        provider: "NONE",
        module: this.moduleName,
        duration: Date.now() - startTime.getTime(),
        timestamp: new Date(),
      };
    }

    // Try each provider in order
    let lastError: ProviderError | null = null;

    for (let i = 0; i < providersToTry.length; i++) {
      const provider = providersToTry[i];
      const attemptNumber = i + 1;

      logger.info("Attempting provider", {
        correlationId,
        module: this.moduleName,
        provider: provider.code,
        attemptNumber,
        totalProviders: providersToTry.length,
      });

      const result = await this.executeWithProvider(
        provider,
        operation,
        request,
        executor,
        context,
        attemptNumber
      );

      if (result.success) {
        // Success! Log and return
        logger.info("Provider execution successful", {
          correlationId,
          module: this.moduleName,
          provider: provider.code,
          attemptNumber,
          duration: result.duration,
        });

        return result;
      }

      // Failed - check if we should try next provider
      lastError = result.error;

      if (result.error?.isProviderFailure) {
        logger.warn("Provider failed, trying next", {
          correlationId,
          module: this.moduleName,
          provider: provider.code,
          error: result.error.message,
          isProviderFailure: true,
        });
        continue; // Try next provider
      } else {
        // Not a provider failure (our code issue or validation error)
        // Don't try other providers
        logger.error("Execution failed (not provider issue)", {
          correlationId,
          module: this.moduleName,
          provider: provider.code,
          error: result.error?.message,
        });

        return result;
      }
    }

    // All providers failed
    logger.error("All providers failed", {
      correlationId,
      module: this.moduleName,
      attempts: context.attempts.length,
    });

    // Send alert for all providers down
    await this.sendAllProvidersDownAlert(context);

    return {
      success: false,
      data: null,
      error: lastError || {
        code: "ALL_PROVIDERS_FAILED",
        message: "All providers failed to process the request",
        statusCode: 503,
        isProviderFailure: true,
      },
      provider: "ALL",
      module: this.moduleName,
      duration: Date.now() - startTime.getTime(),
      timestamp: new Date(),
    };
  }

  /**
   * Execute with a specific provider
   */
  private async executeWithProvider<TRequest extends BaseProviderRequest, TResponse extends BaseProviderResponse>(
    provider: ProviderConfig,
    operation: string,
    request: TRequest,
    executor: ProviderExecutor<TRequest, TResponse>,
    context: ProviderContext,
    attemptNumber: number
  ): Promise<ProviderResult<TResponse>> {
    const attemptStart = new Date();
    const timeout = provider.timeout || 30000;

    const attempt: ProviderAttempt = {
      provider: provider.code,
      attemptNumber,
      startTime: attemptStart,
      endTime: null,
      duration: null,
      success: false,
      statusCode: null,
      error: null,
      isProviderFailure: false,
    };

    try {
      // Execute with timeout
      const response = await Promise.race([
        executor(provider, request),
        this.createTimeout<TResponse>(timeout, provider.code),
      ]);

      // Success!
      const duration = Date.now() - attemptStart.getTime();
      attempt.endTime = new Date();
      attempt.duration = duration;
      attempt.success = true;
      attempt.statusCode = 200;

      context.attempts.push(attempt);

      // Update health status
      await this.recordSuccess(provider.code);

      // Log to database
      await this.logAttempt(context, attempt, request, response);

      return {
        success: true,
        data: response,
        error: null,
        provider: provider.code,
        module: this.moduleName,
        duration,
        timestamp: new Date(),
      };
    } catch (error) {
      const duration = Date.now() - attemptStart.getTime();
      const parsedError = this.parseError(error);

      attempt.endTime = new Date();
      attempt.duration = duration;
      attempt.success = false;
      attempt.statusCode = parsedError.statusCode;
      attempt.error = parsedError.message;
      attempt.isProviderFailure = parsedError.isProviderFailure;

      context.attempts.push(attempt);

      // Log to database
      await this.logAttempt(context, attempt, request, null, parsedError);

      // Update health status if provider failure
      if (parsedError.isProviderFailure) {
        await this.recordFailure(provider.code);
      }

      return {
        success: false,
        data: null,
        error: parsedError,
        provider: provider.code,
        module: this.moduleName,
        duration,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Create a timeout promise
   */
  private createTimeout<T>(ms: number, providerCode: string): Promise<T> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Provider ${providerCode} timed out after ${ms}ms`));
      }, ms);
    });
  }

  /**
   * Parse error and determine if it's a provider failure
   */
  private parseError(error: unknown): ProviderError {
    const err = error as Error & { response?: { status?: number; data?: unknown } };
    const statusCode = err.response?.status || 0;
    const isProviderFailure = PROVIDER_ERROR_CODES.includes(statusCode as typeof PROVIDER_ERROR_CODES[number]);

    return {
      code: `ERROR_${statusCode || "UNKNOWN"}`,
      message: err.message || "Unknown error occurred",
      statusCode,
      isProviderFailure,
      originalError: error,
    };
  }

  /**
   * Record a successful call
   */
  private async recordSuccess(providerCode: string): Promise<void> {
    await ProviderCacheService.updateHealthStatus(this.moduleName, providerCode, {
      isHealthy: true,
      failureCount: 0,
      lastSuccess: new Date(),
      circuitBreakerOpen: false,
      cooldownUntil: null,
    });
  }

  /**
   * Record a failed call and potentially open circuit breaker
   */
  private async recordFailure(providerCode: string): Promise<void> {
    const health = ProviderCacheService.getHealthStatus(this.moduleName, providerCode);
    const newFailureCount = (health?.failureCount || 0) + 1;

    const shouldOpenCircuit = newFailureCount >= CIRCUIT_BREAKER.THRESHOLD;

    const updates = {
      isHealthy: !shouldOpenCircuit,
      failureCount: newFailureCount,
      lastFailure: new Date(),
      circuitBreakerOpen: shouldOpenCircuit,
      cooldownUntil: shouldOpenCircuit
        ? new Date(Date.now() + CIRCUIT_BREAKER.COOLDOWN_MS)
        : null,
    };

    await ProviderCacheService.updateHealthStatus(this.moduleName, providerCode, updates);

    if (shouldOpenCircuit) {
      logger.warn("Circuit breaker opened for provider", {
        module: this.moduleName,
        provider: providerCode,
        failureCount: newFailureCount,
        cooldownUntil: updates.cooldownUntil,
      });

      // Send alert
      await this.sendProviderDownAlert(providerCode);
    }
  }

  /**
   * Log attempt to database
   */
  private async logAttempt(
    context: ProviderContext,
    attempt: ProviderAttempt,
    request: BaseProviderRequest,
    response: unknown,
    error?: ProviderError
  ): Promise<void> {
    try {
      await ProviderLog.create({
        correlationId: context.correlationId,
        moduleName: this.moduleName,
        operation: context.operation,
        providerCode: attempt.provider,
        attemptNumber: attempt.attemptNumber,
        requestPayload: this.maskSensitiveData(request),
        responseData: response ? this.maskSensitiveData(response) : null,
        statusCode: attempt.statusCode,
        success: attempt.success,
        isProviderFailure: attempt.isProviderFailure,
        errorMessage: error?.message || null,
        duration: attempt.duration || 0,
        ip: request.ip || null,
        userAgent: request.userAgent || null,
        uid: request.uid || null,
      });
    } catch (logError) {
      logger.error("Failed to log provider attempt", {
        correlationId: context.correlationId,
        error: (logError as Error).message,
      });
    }
  }

  /**
   * Mask sensitive data in logs
   */
  private maskSensitiveData(data: unknown): Record<string, unknown> {
    if (!data || typeof data !== "object") {
      return {};
    }

    const sensitiveKeys = ["password", "apiKey", "apiSecret", "otp", "pin", "token"];
    const masked = { ...data } as Record<string, unknown>;

    for (const key of Object.keys(masked)) {
      if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk.toLowerCase()))) {
        masked[key] = "******";
      }
    }

    return masked;
  }

  /**
   * Send alert when provider goes down
   */
  private async sendProviderDownAlert(providerCode: string): Promise<void> {
    logger.error("ALERT: Provider is DOWN", {
      module: this.moduleName,
      provider: providerCode,
      type: "PROVIDER_DOWN",
    });

    await AlertService.send({
      type: 'PROVIDER_DOWN',
      module: this.moduleName,
      provider: providerCode,
      message: `Provider ${providerCode} for module ${this.moduleName} is DOWN`,
      details: { failureCount: CIRCUIT_BREAKER.THRESHOLD },
      timestamp: new Date(),
    });
  }

  /**
   * Send alert when all providers are down
   */
  private async sendAllProvidersDownAlert(context: ProviderContext): Promise<void> {
    logger.error("ALERT: ALL providers are DOWN", {
      module: this.moduleName,
      correlationId: context.correlationId,
      type: "ALL_PROVIDERS_DOWN",
      attempts: context.attempts.map((a) => ({
        provider: a.provider,
        error: a.error,
      })),
    });

    await AlertService.send({
      type: 'ALL_PROVIDERS_DOWN',
      module: this.moduleName,
      message: `ALL providers for module ${this.moduleName} are DOWN`,
      details: { attempts: context.attempts },
      timestamp: new Date(),
    });
  }
}

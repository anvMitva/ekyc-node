/**
 * Base Provider Abstract Class
 * All provider implementations extend this class
 */
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import logger from "../logger/winston.logger.js";
import type { ProviderConfig } from "../types/provider.js";

/**
 * Abstract base class for all provider implementations
 * Provides common functionality like HTTP client setup, logging, error handling
 */
export abstract class BaseProvider {
  protected config: ProviderConfig;
  protected httpClient: AxiosInstance;
  protected providerName: string;
  protected moduleName: string;

  constructor(moduleName: string, config: ProviderConfig) {
    this.moduleName = moduleName;
    this.config = config;
    this.providerName = config.name;

    // Create configured axios instance
    this.httpClient = this.createHttpClient();
  }

  /**
   * Create HTTP client with provider-specific configuration
   */
  private createHttpClient(): AxiosInstance {
    const client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
        ...this.config.headers,
      },
    });

    // Add request interceptor for logging
    client.interceptors.request.use(
      (config) => {
        logger.debug("Provider request", {
          provider: this.providerName,
          module: this.moduleName,
          url: config.url,
          method: config.method,
        });
        return config;
      },
      (error) => {
        logger.error("Provider request error", {
          provider: this.providerName,
          module: this.moduleName,
          error: error.message,
        });
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    client.interceptors.response.use(
      (response) => {
        logger.debug("Provider response", {
          provider: this.providerName,
          module: this.moduleName,
          status: response.status,
        });
        return response;
      },
      (error) => {
        logger.error("Provider response error", {
          provider: this.providerName,
          module: this.moduleName,
          status: error.response?.status,
          error: error.message,
        });
        return Promise.reject(error);
      }
    );

    return client;
  }

  /**
   * Get the provider name
   */
  getName(): string {
    return this.providerName;
  }

  /**
   * Get the provider code
   */
  getCode(): string {
    return this.config.code;
  }

  /**
   * Get the module name
   */
  getModule(): string {
    return this.moduleName;
  }

  /**
   * Make a GET request
   */
  protected async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.httpClient.get<T>(endpoint, config);
    return response.data;
  }

  /**
   * Make a POST request
   */
  protected async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.httpClient.post<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  protected async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.httpClient.put<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  protected async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.httpClient.delete<T>(endpoint, config);
    return response.data;
  }

  /**
   * Get API key (resolved from config)
   */
  protected getApiKey(): string {
    return this.config.apiKey;
  }

  /**
   * Get API secret (if available)
   */
  protected getApiSecret(): string | undefined {
    return this.config.apiSecret;
  }
}

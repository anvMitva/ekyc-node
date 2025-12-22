/**
 * Provider Model
 * Stores provider configurations in the database
 */
import { DataTypes, Model, Optional } from "sequelize";
import { ekycSequelize } from "../../utils/dbConnection.js";
import type {
  ProviderDbRecord,
  RateLimitConfig,
  RetryConfig,
} from "../../types/provider.js";

// Attributes for creation (id is auto-generated)
interface ProviderCreationAttributes
  extends Optional<ProviderDbRecord, "id" | "createdAt" | "updatedAt"> {}

/**
 * Provider Model Class
 */
class Provider
  extends Model<ProviderDbRecord, ProviderCreationAttributes>
  implements ProviderDbRecord
{
  declare id: number;
  declare moduleName: string;
  declare providerCode: string;
  declare providerName: string;
  declare enabled: boolean;
  declare priority: number;
  declare timeout: number;
  declare baseUrl: string;
  declare apiKey: string;
  declare apiSecret: string | null;
  declare rateLimit: RateLimitConfig | null;
  declare retryConfig: RetryConfig | null;
  declare headers: Record<string, string> | null;
  declare metadata: Record<string, unknown> | null;
  declare isHealthy: boolean;
  declare failureCount: number;
  declare lastFailure: Date | null;
  declare lastSuccess: Date | null;
  declare circuitBreakerOpen: boolean;
  declare cooldownUntil: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Provider.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    moduleName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "module_name",
      comment: "Module name like KRA, SMS, EMAIL, PAN",
    },
    providerCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "provider_code",
      comment: "Unique provider code like CAMS, ONGRID",
    },
    providerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "provider_name",
      comment: "Display name of the provider",
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "Whether this provider is enabled",
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "Priority order (1 = highest)",
    },
    timeout: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30000,
      comment: "Request timeout in milliseconds",
    },
    baseUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "base_url",
      comment: "Base URL for the provider API",
    },
    apiKey: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "api_key",
      comment: "API key (can be env variable reference like {{API_KEY}})",
    },
    apiSecret: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "api_secret",
      comment: "API secret if required",
    },
    rateLimit: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "rate_limit",
      comment: "Rate limit config as JSON",
      get() {
        const value = this.getDataValue("rateLimit");
        return value ? JSON.parse(value as unknown as string) : null;
      },
      set(value: RateLimitConfig | null) {
        this.setDataValue(
          "rateLimit",
          value ? (JSON.stringify(value) as unknown as RateLimitConfig) : null
        );
      },
    },
    retryConfig: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "retry_config",
      comment: "Retry config as JSON",
      get() {
        const value = this.getDataValue("retryConfig");
        return value ? JSON.parse(value as unknown as string) : null;
      },
      set(value: RetryConfig | null) {
        this.setDataValue(
          "retryConfig",
          value ? (JSON.stringify(value) as unknown as RetryConfig) : null
        );
      },
    },
    headers: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Custom headers as JSON",
      get() {
        const value = this.getDataValue("headers");
        return value ? JSON.parse(value as unknown as string) : null;
      },
      set(value: Record<string, string> | null) {
        this.setDataValue(
          "headers",
          value
            ? (JSON.stringify(value) as unknown as Record<string, string>)
            : null
        );
      },
    },
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Additional metadata as JSON",
      get() {
        const value = this.getDataValue("metadata");
        return value ? JSON.parse(value as unknown as string) : null;
      },
      set(value: Record<string, unknown> | null) {
        this.setDataValue(
          "metadata",
          value
            ? (JSON.stringify(value) as unknown as Record<string, unknown>)
            : null
        );
      },
    },
    isHealthy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_healthy",
      comment: "Current health status",
    },
    failureCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "failure_count",
      comment: "Consecutive failure count",
    },
    lastFailure: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_failure",
      comment: "Timestamp of last failure",
    },
    lastSuccess: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_success",
      comment: "Timestamp of last success",
    },
    circuitBreakerOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "circuit_breaker_open",
      comment: "Whether circuit breaker is open",
    },
    cooldownUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "cooldown_until",
      comment: "Skip until this time if circuit breaker is open",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: ekycSequelize,
    tableName: "providers",
    modelName: "Provider",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["module_name", "provider_code"],
        name: "idx_module_provider",
      },
      {
        fields: ["module_name", "enabled", "priority"],
        name: "idx_module_enabled_priority",
      },
    ],
  }
);

export default Provider;

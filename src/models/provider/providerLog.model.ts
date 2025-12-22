/**
 * Provider Log Model
 * Stores all provider API call logs
 */
import { DataTypes, Model, Optional } from "sequelize";
import { ekycSequelize } from "../../utils/dbConnection.js";
import type { ProviderLogRecord } from "../../types/provider.js";

// Attributes for creation (id is auto-generated)
interface ProviderLogCreationAttributes
  extends Optional<ProviderLogRecord, "id" | "createdAt"> {}

/**
 * Provider Log Model Class
 */
class ProviderLog
  extends Model<ProviderLogRecord, ProviderLogCreationAttributes>
  implements ProviderLogRecord
{
  declare id: number;
  declare correlationId: string;
  declare moduleName: string;
  declare operation: string;
  declare providerCode: string;
  declare attemptNumber: number;
  declare requestPayload: Record<string, unknown>;
  declare responseData: Record<string, unknown> | null;
  declare statusCode: number | null;
  declare success: boolean;
  declare isProviderFailure: boolean;
  declare errorMessage: string | null;
  declare duration: number;
  declare ip: string | null;
  declare userAgent: string | null;
  declare uid: string | null;
  declare createdAt: Date;
}

ProviderLog.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    correlationId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "correlation_id",
      comment: "Unique ID to trace the complete flow",
    },
    moduleName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "module_name",
      comment: "Module name like KRA, SMS, EMAIL",
    },
    operation: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Operation name like verify, send, check",
    },
    providerCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "provider_code",
      comment: "Provider code used",
    },
    attemptNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "attempt_number",
      comment: "Which attempt number (1, 2, 3...)",
    },
    requestPayload: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "request_payload",
      comment: "Request payload as JSON (sensitive data masked)",
      get() {
        const value = this.getDataValue("requestPayload");
        return value ? JSON.parse(value as unknown as string) : {};
      },
      set(value: Record<string, unknown>) {
        this.setDataValue(
          "requestPayload",
          JSON.stringify(value) as unknown as Record<string, unknown>
        );
      },
    },
    responseData: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "response_data",
      comment: "Response data as JSON",
      get() {
        const value = this.getDataValue("responseData");
        return value ? JSON.parse(value as unknown as string) : null;
      },
      set(value: Record<string, unknown> | null) {
        this.setDataValue(
          "responseData",
          value
            ? (JSON.stringify(value) as unknown as Record<string, unknown>)
            : null
        );
      },
    },
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "status_code",
      comment: "HTTP status code",
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Whether the call was successful",
    },
    isProviderFailure: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_provider_failure",
      comment: "True if failure was due to provider issue",
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "error_message",
      comment: "Error message if failed",
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duration in milliseconds",
    },
    ip: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Client IP address",
    },
    userAgent: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "user_agent",
      comment: "Client user agent",
    },
    uid: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "User/Lead UID",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: ekycSequelize,
    tableName: "provider_logs",
    modelName: "ProviderLog",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ["correlation_id"],
        name: "idx_correlation_id",
      },
      {
        fields: ["module_name", "provider_code"],
        name: "idx_module_provider_log",
      },
      {
        fields: ["created_at"],
        name: "idx_created_at",
      },
      {
        fields: ["uid"],
        name: "idx_uid",
      },
    ],
  }
);

export default ProviderLog;

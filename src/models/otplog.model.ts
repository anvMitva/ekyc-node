// @ts-nocheck
import { DataTypes } from "sequelize";
import { ekycSequelize } from "../utils/dbConnection.js";

const OTPLog = ekycSequelize.define(
  "OTPLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    otpId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "otp_id",
    },
    uid: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    mobileOtp: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "mobile_otp",
    },
    mobileOtpStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "mobile_otp_status",
    },
    mobileOtpAction: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "mobile_otp_action",
    },
    mobileOtpResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "mobile_otp_response",
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    emailOtp: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "email_otp",
    },
    emailOtpStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "email_otp_status",
    },
    emailOtpAction: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "email_otp_action",
    },
    emailOtpResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "email_otp_response",
    },
    attemptNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "attempt_number",
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    device: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "user_agent",
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "error_message",
    },
    provider: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    providerId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "provider_id",
    },
  },
  {
    tableName: "tbl_otp_log",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      {
        name: "idx_otp_id",
        fields: ["otp_id"],
      },
      {
        name: "idx_uid",
        fields: ["uid"],
      },
      {
        name: "idx_mobile",
        fields: ["mobile"],
      },
      {
        name: "idx_email",
        fields: ["email"],
      },
      {
        name: "idx_mobile_status",
        fields: ["mobile_otp_status"],
      },
      {
        name: "idx_email_status",
        fields: ["email_otp_status"],
      },
      {
        name: "idx_created_at",
        fields: ["created_at"],
      },
    ],
  }
);

// Define associations
OTPLog.associate = (models) => {
  // OTPLog belongs to OTP
  OTPLog.belongsTo(models.OTP, {
    foreignKey: "otp_id",
    as: "otp",
  });

  // OTPLog belongs to a Lead
  OTPLog.belongsTo(models.Leads, {
    foreignKey: "uid",
    targetKey: "uid",
    as: "lead",
  });
};

export default OTPLog;

// @ts-nocheck
import { DataTypes } from "sequelize";
import { ekycSequelize } from "../utils/dbConnection.js";

const OTP = ekycSequelize.define(
  "OTP",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    mobileOtpReceived: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "mobile_otp_received",
    },
    mobileOtpExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "mobile_otp_expiry",
    },
    mobileOtpResendTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "mobile_otp_resend_time",
    },
    mobileOtpAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "mobile_otp_attempts",
    },
    mobileOtpResendAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "mobile_otp_resend_attempts",
    },
    mobileOtpVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "mobile_otp_verified",
    },
    mobileOtpVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "mobile_otp_verified_at",
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
    emailOtpReceived: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "email_otp_received",
    },
    emailOtpExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "email_otp_expiry",
    },
    emailOtpResendTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "email_otp_resend_time",
    },
    emailOtpAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "email_otp_attempts",
    },
    emailOtpResendAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "email_otp_resend_attempts",
    },
    emailOtpVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "email_otp_verified",
    },
    emailOtpVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "email_otp_verified_at",
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    mac: {
      type: DataTypes.STRING(100),
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
    isBlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_blocked",
    },
    blockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "blocked_until",
    }
  },
  {
    tableName: "tbl_otp",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
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
        name: "idx_status",
        fields: ["status"],
      },
      {
        name: "idx_mobile_verified",
        fields: ["mobile_otp_verified"],
      },
      {
        name: "idx_email_verified",
        fields: ["email_otp_verified"],
      },
    ],
  }
);

// Define associations
OTP.associate = (models) => {
  // OTP belongs to a Lead
  OTP.belongsTo(models.Leads, {
    foreignKey: "uid",
    targetKey: "uid",
    as: "lead",
  });

  // OTP has many logs
  OTP.hasMany(models.OTPLog, {
    foreignKey: "otp_id",
    as: "logs",
  });
};

export default OTP;

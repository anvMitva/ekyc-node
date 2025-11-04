// @ts-nocheck
import { DataTypes } from "sequelize";
import { ekycSequelize } from "../utils/dbConnection.js";

const Leads = ekycSequelize.define(
  "Leads",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uid: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    mobile: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        is: /^[0-9]{10,15}$/,
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    rmCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "rm_code",
    },
    apCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "ap_code",
    },
    schemeCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "scheme_code",
    },
    referralCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "referral_code",
    },
    source: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
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
    otpStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "pending",
      field: "otp_status",
    },
    panStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "pending",
      field: "pan_status",
    },
  },
  {
    tableName: "tbl_leads",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        name: "idx_mobile",
        fields: ["mobile"],
      },
      {
        name: "idx_email",
        fields: ["email"],
      },
      {
        name: "idx_uid",
        unique: true,
        fields: ["uid"],
      },
      {
        name: "idx_rm_code",
        fields: ["rm_code"],
      },
      {
        name: "idx_ap_code",
        fields: ["ap_code"],
      },
      {
        name: "idx_otp_status",
        fields: ["otp_status"],
      },
      {
        name: "idx_pan_status",
        fields: ["pan_status"],
      },
    ],
  }
);

// Define associations
Leads.associate = (models) => {
  // Leads has many OTP records
  Leads.hasMany(models.OTP, {
    foreignKey: "uid",
    sourceKey: "uid",
    as: "otps",
  });

  // Leads has many OTP logs
  Leads.hasMany(models.OTPLog, {
    foreignKey: "uid",
    sourceKey: "uid",
    as: "otpLogs",
  });

  // Leads has one KYC record
  Leads.hasOne(models.KYC, {
    foreignKey: "uid",
    sourceKey: "uid",
    as: "kyc",
  });

  // Leads has many last activities
  Leads.hasMany(models.LastActivity, {
    foreignKey: "uid",
    sourceKey: "uid",
    as: "lastActivities",
  });

  // Leads has many activity logs
  Leads.hasMany(models.ActivityLog, {
    foreignKey: "uid",
    sourceKey: "uid",
    as: "activityLogs",
  });
};

export default Leads;

// @ts-nocheck
import { DataTypes } from "sequelize";
import { ekycSequelize } from "../utils/dbConnection.js";

const KYC = ekycSequelize.define(
  "KYC",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kycId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "kyc_id",
    },
    uid: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    panNo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "pan_no",
      validate: {
        is: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i,
      },
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    panType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "pan_type",
    },
    nameAsPan: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "name_as_pan",
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "first_name",
    },
    middleName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "middle_name",
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "last_name",
    },
    fatherName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "father_name",
    },
    motherName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "mother_name",
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    kraStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "pending",
      field: "kra_status",
    },
    isKra: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_kra",
    },
    kraProvider: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "kra_provider",
    },
    kraTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "kra_time",
    },
    kraResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "kra_response",
    },
    kraReferenceNo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "kra_reference_no",
    },
    panStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "pending",
      field: "pan_status",
    },
    panProvider: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "pan_provider",
    },
    panTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "pan_time",
    },
    panResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "pan_response",
    },
    panReferenceNo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "pan_reference_no",
    },
    kycStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "pending",
      field: "kyc_status",
    },
    kycType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "kyc_type",
    },
    kycCompletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "kyc_completed_at",
    },
    clientCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "client_code",
    },
    accountStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "active",
      field: "account_status",
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "rejection_reason",
      comment: "Reason for KYC rejection if applicable",
    },
    verifiedBy: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "verified_by",
      comment: "Verified by (user/admin identifier)",
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "verified_at",
      comment: "Verification timestamp",
    },
    mobile: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "tbl_kyc",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        name: "idx_kyc_id",
        unique: true,
        fields: ["kyc_id"],
      },
      {
        name: "idx_uid",
        fields: ["uid"],
      },
      {
        name: "idx_pan_no",
        fields: ["pan_no"],
      },
      {
        name: "idx_client_code",
        fields: ["client_code"],
      },
      {
        name: "idx_kra_status",
        fields: ["kra_status"],
      },
      {
        name: "idx_pan_status",
        fields: ["pan_status"],
      },
      {
        name: "idx_kyc_status",
        fields: ["kyc_status"],
      },
      {
        name: "idx_is_kra",
        fields: ["is_kra"],
      },
    ],
  }
);

// Define associations
KYC.associate = (models) => {
  // KYC belongs to a Lead
  KYC.belongsTo(models.Leads, {
    foreignKey: "uid",
    targetKey: "uid",
    as: "lead",
  });

  // KYC has many last activities
  KYC.hasMany(models.LastActivity, {
    foreignKey: "kyc_id",
    sourceKey: "kycId",
    as: "lastActivities",
  });

  // KYC has many activity logs
  KYC.hasMany(models.ActivityLog, {
    foreignKey: "kyc_id",
    sourceKey: "kycId",
    as: "activityLogs",
  });
};

export default KYC;

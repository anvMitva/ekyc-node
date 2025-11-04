// @ts-nocheck
import { DataTypes } from "sequelize";
import { ekycSequelize } from "../utils/dbConnection.js";

const ActivityLog = ekycSequelize.define(
  "ActivityLog",
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
    kycId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "kyc_id",
    },
    clientCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "client_code",
    },
    activityName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "activity_name",
    },
    activityType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "activity_type",
    },
    activityTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "activity_time",
    },
    activityDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "activity_description",
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    sessionId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "session_id",
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "tbl_activity_log",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      {
        name: "idx_uid",
        fields: ["uid"],
      },
      {
        name: "idx_kyc_id",
        fields: ["kyc_id"],
      },
      {
        name: "idx_client_code",
        fields: ["client_code"],
      },
      {
        name: "idx_activity_name",
        fields: ["activity_name"],
      },
      {
        name: "idx_activity_time",
        fields: ["activity_time"],
      },
      {
        name: "idx_status",
        fields: ["status"],
      },
      {
        name: "idx_created_at",
        fields: ["created_at"],
      },
      {
        name: "idx_uid_activity_time",
        fields: ["uid", "activity_time"],
      },
    ],
  }
);

// Define associations
ActivityLog.associate = (models) => {
  // ActivityLog belongs to a Lead
  ActivityLog.belongsTo(models.Leads, {
    foreignKey: "uid",
    targetKey: "uid",
    as: "lead",
  });

  // ActivityLog belongs to KYC
  ActivityLog.belongsTo(models.KYC, {
    foreignKey: "kyc_id",
    targetKey: "kycId",
    as: "kyc",
  });
};

export default ActivityLog;

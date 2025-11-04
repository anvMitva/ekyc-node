// @ts-nocheck
import { DataTypes } from "sequelize";
import { ekycSequelize } from "../utils/dbConnection.js";

const LastActivity = ekycSequelize.define(
  "LastActivity",
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
    status: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    sessionId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "session_id",
    },
  },
  {
    tableName: "tbl_last_activity",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
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
        name: "idx_uid_activity",
        fields: ["uid", "activity_name"],
      },
    ],
  }
);

// Define associations
LastActivity.associate = (models) => {
  // LastActivity belongs to a Lead
  LastActivity.belongsTo(models.Leads, {
    foreignKey: "uid",
    targetKey: "uid",
    as: "lead",
  });

  // LastActivity belongs to KYC
  LastActivity.belongsTo(models.KYC, {
    foreignKey: "kyc_id",
    targetKey: "kycId",
    as: "kyc",
  });
};

export default LastActivity;

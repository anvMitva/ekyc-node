// @ts-nocheck
import { ekycSequelize } from "../utils/dbConnection.js";

// Import all models
import Leads from "./leads.model.js";
import OTP from "./otp.model.js";
import OTPLog from "./otplog.model.js";
import LastActivity from "./lastactivity.model.js";
import ActivityLog from "./activitylog.model.js";
import KYC from "./kyc.model.js";

// Create models object
const models = {
  Leads,
  OTP,
  OTPLog,
  LastActivity,
  ActivityLog,
  KYC,
};

// Setup associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export {
  Leads,
  OTP,
  OTPLog,
  LastActivity,
  ActivityLog,
  KYC,
  ekycSequelize,
};

export default models;

// @ts-nocheck
import dotenv from "dotenv";
import startApp from "./loader/index.loader.js";
import { ekycSequelize } from "./utils/dbConnection.js";
import Leads from "./models/leads.model.js";
import OTP from "./models/otp.model.js";
import OTPLog from "./models/otplog.model.js";
import LastActivity from "./models/lastactivity.model.js";
import ActivityLog from "./models/activitylog.model.js";
import KYC from "./models/kyc.model.js";
import ProviderLog from "./models/provider/providerLog.model.js";
import Provider from "./models/provider/provider.model.js";

dotenv.config({
  path: "./.env",
});

try {
  startApp();

  Provider.sync();
  ProviderLog.sync();
} catch (error) {
  throw error;
}

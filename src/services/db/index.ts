// @ts-nocheck
/**
 * Database operations index file
 * Exports all database operation classes for easy import
 */

import LeadsDB from "./leads.db.js";
import OtpDB from "./otp.db.js";
import OtpLogDB from "./otplog.db.js";
import KycDB from "./kyc.db.js";
import ActivityLogDB from "./activitylog.db.js";
import LastActivityDB from "./lastactivity.db.js";
import ApiLogDB from "./apilog.db.js";

// Export all database operation classes
export {
  LeadsDB,
  OtpDB,
  OtpLogDB,
  KycDB,
  ActivityLogDB,
  LastActivityDB,
  ApiLogDB,
};

// Default export for convenience
export default {
  LeadsDB,
  OtpDB,
  OtpLogDB,
  KycDB,
  ActivityLogDB,
  LastActivityDB,
  ApiLogDB,
};

// @ts-nocheck
/**
 * Configuration Index
 * Centralizes all application configuration
 */

// Application Constants
export const APP = "connect microservices";

// Authentication Error Messages
export const authErrorMessages = {
  // Authentication Errors
  LOGIN_INVALID_CREDENTIALS: "Invalid username or password.",
  USER_NOT_FOUND: "User account not found. Please contact support.",
  ACCOUNT_CLOSED:
    "This account has been closed. Please contact customer support.",

  // API and System Errors
  SYSTEM_ERROR:
    "We're experiencing technical difficulties. Please try again later.",
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",

  // Specific Service Errors
  CLIENT_DETAILS_NOT_FOUND:
    "Unable to retrieve client information. Please try again.",
  DORMANT_ACCOUNT_CHECK_FAILED:
    "Unable to verify account status. Please contact support.",

  // Validation Errors
  INVALID_INPUT: "Invalid input. Please check your information.",
  MISSING_CREDENTIALS: "Please provide both username and password.",
  INVALID_TOKEN: "Session has expired. Please login again.",
};

// Account Types
export const closedTypes = ["BO APLICATION RECIVEID-Close"];

export const individualTypes = ["INDIVIDUAL / Resident", "INDIVIDUAL"];

// Socket Events
export const NotificationEventEnum = Object.freeze({
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  SOCKET_ERROR_EVENT: "socketError",
});

// Authentication Events
export const AuthEventEnum = Object.freeze({
  USER_LOGGED_IN: "userLoggedIn",
  USER_LOGGED_OUT: "userLoggedOut",
  ALL_SESSIONS_LOGGED_OUT: "allSessionsLoggedOut",
  NEW_USER_SESSION: "newUserSession",
  USER_SESSION_ENDED: "userSessionEnded",
  USER_ALL_SESSIONS_ENDED: "userAllSessionsEnded",
  SESSION_EXPIRED: "sessionExpired",
  PASSWORD_UPDATED: "passwordUpdated",
  ACCOUNT_STATUS_CHANGED: "accountStatusChanged",
});

// OTP Action Types
export const OTP_ACTIONS = Object.freeze({
  SEND_OTP: "SEND_OTP",
  RESEND_OTP: "RESEND_OTP",
  VERIFY_OTP: "VERIFY_OTP",
});

// Company Code Mapping
export const COMPANY_CODE_MAP = {
  Group1: "NSE_CASH,BSE_CASH,NSE_FNO,BSE_FNO,NSE_SLBM,CD_NSE,CD_BSE,MF_BSE",
  cash: "NSE_CASH,BSE_CASH",
  Group2: "MCX,NCDEX,ICEX",
  Group3:
    "NSE_CASH,BSE_CASH,NSE_FNO,BSE_FNO,NSE_SLBM,CD_NSE,CD_BSE,MF_BSE,MCX,NCDEX,ICEX",
};

// Date Format Keys
export const KEY_FORMATS = {
  1: "YYYY-MM", // e.g. 2025-01
  2: "MMM YY", // e.g. Jan 25
};

// Market Holidays
export const HOLIDAYS = [
  "26/02/2025",
  "14/03/2025",
  "31/03/2025",
  "10/04/2025",
  "14/04/2025",
  "18/04/2025",
  "01/05/2025",
  "15/08/2025",
  "27/08/2025",
  "02/10/2025",
  "21/10/2025",
  "22/10/2025",
  "05/11/2025",
  "25/12/2025",
];

// Message Types
export const MESSAGE_TYPES = {
  CASH: 303,
  COLLATERAL: 330,
};

// ODIN API Configuration
export const ODIN_CONFIG = {
  ENDPOINTS: {
    LOGIN: "/Login",
    LOGOFF: "/LogOff",
    UPDATE_PG_LIMITS: "/UpdatePGLimits",
  },
  USER_ID: "RESERVEDPG",
  USERNAME: "ftodin1",
  HO_CODE: "HO",
  PRODUCT_ID: 1,
  IP_ADDRESS: "27.54.182.124",
};

// SMS Configuration
export const SMS_CONFIG = {
  PROVIDER: "OnlySMS",
  BASE_URL: process.env.SMS_URL || "https://onlysms.co.in/api/otp.aspx",
  CREDENTIALS: {
    USER_ID: process.env.USERID,
    USER_PASS: process.env.USERPASS,
    GSM_ID: process.env.GSMID,
    PE_ID: process.env.PEID,
  },
  UNICODE: "TEXT",
  TIMEOUT: 10000, // 10 seconds
};

// SMS Template IDs
export const SMS_TEMPLATE_IDS = {
  SIGNUP: process.env.TEMPID_SIGNUP,
  MOBILE_UPDATE: process.env.TEMPID_MOBILE,
  BANK_UPDATE: process.env.TEMPID_BANK,
  PASSWORD_RESET: process.env.TEMPID_PASSWORD,
  EDIS: process.env.TEMPID_EDIS,
  IPV_LINK: process.env.TEMPID_IPV,
  DEFAULT: process.env.TEMPID,
};

// SMS Message Templates
export const SMS_TEMPLATES = {
  SIGNUP: (otp) =>
    `Dear User, Kindly signup on ArhamShare using this OTP - ${otp}. For security reasons, ensure you don't share your OTP with anyone ARHAM SHARE.`,

  MOBILE_UPDATE: (otp) =>
    `Dear Customer, Kindly proceed to update your Mobile no by using this OTP - ${otp}. For security reasons, ensure you don't share your OTP with anyone. Arham Share`,

  BANK_UPDATE: (otp) =>
    `Dear Customer, Kindly proceed to update your Bank details by using this OTP - ${otp}. For security reasons, ensure you don't share your OTP with anyone. Arham Share`,

  PASSWORD_RESET: (otp) =>
    `Dear customer, Your OTP for password reset request is ${otp}. This code will be valid for 5 mins only. Kindly do not share this with anyone. ARHAM SHARE`,

  EDIS: (otp) =>
    `Dear Customer, Kindly proceed for EDIS facility by using this OTP - ${otp}. For security reasons, ensure you don't share your OTP with anyone. Arham Share`,

  IPV_LINK: (link) =>
    `Dear Customer,~You are required to complete the IPV (In Person Verification) process by using the following link in order to complete the account opening journey with us. Click here ${link}~Thank you~Arham Share`,

  DEFAULT: (otp) =>
    `Your OTP is ${otp}. Valid for 5 minutes. Do not share with anyone. Arham Share`,
};

// SMS Template Types
export const SMS_TYPES = Object.freeze({
  SIGNUP: "signup",
  MOBILE_UPDATE: "mobile",
  BANK_UPDATE: "bankUpdate",
  PASSWORD_RESET: "password",
  EDIS: "edis",
  IPV_LINK: "ipvLink",
  DEFAULT: "default",
});

// Email Configuration
export const EMAIL_CONFIG = {
  SMTP: {
    PROTOCOL: process.env.SMTP_PROTOCOL || "smtp",
    SERVER: process.env.SMTP_SERVER,
    PORT: parseInt(process.env.SMTP_PORT) || 587,
    USERNAME: process.env.SMTP_USERNAME,
    PASSWORD: process.env.SMTP_PASSWORD,
    MAIL_TYPE: process.env.SMTP_MAILTYPE || "html",
    CHARSET: process.env.SMTP_CHARSET || "iso-8859-1",
    WORDWRAP: process.env.SMTP_WORDWRAP === "TRUE",
  },
  SECURE: false,
  TIMEOUT: 10000,
};

// Database Configuration
export const DB_CONFIG = {
  EKYC: {
    NAME: process.env.DB_NAME,
    HOST: process.env.DB_HOST,
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    LOGGING: false,
  },
  CRMS: {
    NAME: process.env.CRMS_DB_NAME,
    HOST: process.env.CRMS_DB_HOST,
    USERNAME: process.env.CRMS_DB_USERNAME,
    PASSWORD: process.env.CRMS_DB_PASSWORD,
    LOGGING: false,
  },
};

// Redis Configuration
export const REDIS_CONFIG = {
  HOST: process.env.REDIS_HOST,
  PORT: parseInt(process.env.REDIS_PORT) || 6379,
  PASSWORD: process.env.REDIS_PASSWORD,
};

// External API URLs
export const API_URLS = {
  ERP_TOKEN: process.env.ERP_TOKEN_URL,
  AP_TOKEN: process.env.AP_TOKEN_URL,
  CRMS_TOKEN: process.env.CRMS_TOKEN_URL,
  ERP_V2_TOKEN: process.env.ERP_V2_TOKEN_URL,
  CONNECT_BACKEND: process.env.CONNECT_BACKEND_URL,
  CONNECT_MICROSERVICES: process.env.CONNECT_MICROSERVICES_URL,
  TECH_API: process.env.TECH_API_URL,
  TECHEXCEL: process.env.TECHEXCEL,
  XTS: process.env.XTS_URL,
  DIGIO: process.env.DIGIO,
  PAN: process.env.PAN,
  IFSC: process.env.IFSC,
  PAN_DATA: process.env.PAN_DATA,
  PENNY_API: process.env.PENNY_API,
  VERIFY_USER: process.env.VERIFY_USER,
  APB_TOKEN: process.env.apb_token,
  CONNECT_TOKEN: process.env.connect_token,
  ERP_TOKEN_VERIFY: process.env.erp_token,
  ESIGN_CONNECT: process.env.ESIGN_CONNECT_URL,
  ERP_KYC: process.env.ERP_KYC_URL,
  TECHEXCEL_AUTOMATION: process.env.TECHEXCEL_AUTOMATION_URL,
  TECHEXCEL_GLOBAL_DETAILS: process.env.TECHEXCEL_AUTOMATION_GLOBAL_DETAILS,
  SEGMENT_RESPONSE: process.env.SEGMENT_RESPONSE_URL,
};

// Server Configuration
export const SERVER_CONFIG = {
  PORT: parseInt(process.env.PORT) || 8999,
  HOST: process.env.SERVER || "0.0.0.0",
  NODE_ENV: process.env.NODE_ENV || "development",
  IP_ADDRESS: process.env.IP_ADDRESS,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};

// JWT Configuration
export const JWT_CONFIG = {
  SECRET_KEY: process.env.JWT_CONNECT_SECRET_KEY,
  ALGORITHM: process.env.JWT_ALGORITHM || "HS256",
  EXPIRY_TIME: parseInt(process.env.TOKEN_EXPIRY_TIME) || 900,
  WEB_ENCRYPTION_KEY: process.env.WEB_ENCRYPTION_KEY,
  WEB_TOKEN_EXPIRY_TIME: process.env.WEB_TOKEN_EXPIRY_TIME,
};

// Encryption Configuration
export const ENCRYPTION_CONFIG = {
  BASE64_16BYTES_KEY: process.env.BASE64_16BYTES_KEY,
  KEY: process.env.ENCRYPTION_KEY,
  ALGORITHM: "aes-256-cbc",
  IV_LENGTH: 16,
  CONNECT_ARHAM: process.env.CONNECT_ARHAM,
  OTP_SALT: process.env.OTP_SALT
};

// File Paths
export const FILE_PATHS = {
  GREEN_TICK: process.env.GREEN_TICK || "Documents/img/green.png",
  JAVA_EXE:
    process.env.JAVA_EXE_FILE ||
    "C://Program Files (x86)//Java//jdk1.8.0_261//bin//java.exe",
  ALIAS_KEY: process.env.ALIAS_KEY,
};

// TechExcel Database Configuration
export const TECHEXCEL_DATABASES = {
  2025: process.env.TECHEXCEL_DATABASE_25,
  2024: process.env.TECHEXCEL_DATABASE_24,
  2023: process.env.TECHEXCEL_DATABASE_23,
  2022: process.env.TECHEXCEL_DATABASE_19_22,
  2021: process.env.TECHEXCEL_DATABASE_19_22,
  2020: process.env.TECHEXCEL_DATABASE_19_22,
  2019: process.env.TECHEXCEL_DATABASE_19_22,
};

// Other Configuration
export const MISC_CONFIG = {
  UAT_USERCODE: process.env.UAT_USERCODE,
};

export const EMAIL_TEMPLATES = {
  SIGNUP: {
    subject: "Your KYC Verification OTP - ArhamShare",
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">KYC Verification OTP</h2>
        <p>Your verification OTP is:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          {{OTP}}
        </div>
        <p><strong>Important:</strong></p>
        <ul>
          <li>This OTP is valid for 10 minutes only</li>
          <li>Do not share this OTP with anyone</li>
          <li>Use this OTP to complete your KYC verification</li>
        </ul>
        <p>If you did not request this OTP, please ignore this email.</p>
      </div>
    `,
  },
};

export const RESPONSE_CONFIG = {
  // 1xx Informational Response
  CONTINUE: { statusCode: 100, message: "Continue" },
  SWITCHING_PROTOCOLS: { statusCode: 101, message: "Switching Protocols" },
  PROCESSING: { statusCode: 102, message: "Processing" },
  EARLY_HINTS: { statusCode: 103, message: "Early Hints" },

  // 2xx Success
  OK: { statusCode: 200, message: "OK" },
  CREATED: { statusCode: 201, message: "Created" },
  ACCEPTED: { statusCode: 202, message: "Accepted" },
  NON_AUTHORITATIVE_INFORMATION: {
    statusCode: 203,
    message: "Non-Authoritative Information",
  },
  NO_CONTENT: { statusCode: 204, message: "No Content" },
  RESET_CONTENT: { statusCode: 205, message: "Reset Content" },
  PARTIAL_CONTENT: { statusCode: 206, message: "Partial Content" },
  MULTI_STATUS: { statusCode: 207, message: "Multi-Status" },
  ALREADY_REPORTED: { statusCode: 208, message: "Already Reported" },
  IM_USED: { statusCode: 226, message: "IM Used" },

  // 3xx Redirection
  MULTIPLE_CHOICES: { statusCode: 300, message: "Multiple Choices" },
  MOVED_PERMANENTLY: { statusCode: 301, message: "Moved Permanently" },
  FOUND: { statusCode: 302, message: "Found" },
  SEE_OTHER: { statusCode: 303, message: "See Other" },
  NOT_MODIFIED: { statusCode: 304, message: "Not Modified" },
  USE_PROXY: { statusCode: 305, message: "Use Proxy" },
  TEMPORARY_REDIRECT: { statusCode: 307, message: "Temporary Redirect" },
  PERMANENT_REDIRECT: { statusCode: 308, message: "Permanent Redirect" },

  // 4xx Client Errors
  BAD_REQUEST: { statusCode: 400, message: "Bad Request" },
  UNAUTHORIZED: { statusCode: 401, message: "Unauthorized" },
  PAYMENT_REQUIRED: { statusCode: 402, message: "Payment Required" },
  FORBIDDEN: { statusCode: 403, message: "Forbidden" },
  CLIENT_NOT_FOUND: { statusCode: 400, message: "Client not found" },
  METHOD_NOT_ALLOWED: { statusCode: 405, message: "Method Not Allowed" },
  NOT_ACCEPTABLE: { statusCode: 406, message: "Not Acceptable" },
  PROXY_AUTHENTICATION_REQUIRED: {
    statusCode: 407,
    message: "Proxy Authentication Required",
  },
  REQUEST_TIMEOUT: { statusCode: 408, message: "Request Timeout" },
  CONFLICT: { statusCode: 409, message: "Conflict" },
  GONE: { statusCode: 410, message: "Gone" },
  LENGTH_REQUIRED: { statusCode: 411, message: "Length Required" },
  PRECONDITION_FAILED: { statusCode: 412, message: "Precondition Failed" },
  PAYLOAD_TOO_LARGE: { statusCode: 413, message: "Payload Too Large" },
  URI_TOO_LONG: { statusCode: 414, message: "URI Too Long" },
  UNSUPPORTED_MEDIA_TYPE: {
    statusCode: 415,
    message: "Unsupported Media Type",
  },
  RANGE_NOT_SATISFIABLE: { statusCode: 416, message: "Range Not Satisfiable" },
  EXPECTATION_FAILED: { statusCode: 417, message: "Expectation Failed" },
  I_AM_A_TEAPOT: { statusCode: 418, message: "I'm a teapot" },
  MISDIRECTED_REQUEST: { statusCode: 421, message: "Misdirected Request" },
  UNPROCESSABLE_ENTITY: { statusCode: 422, message: "Unprocessable Entity" },
  LOCKED: { statusCode: 423, message: "Locked" },
  FAILED_DEPENDENCY: { statusCode: 424, message: "Failed Dependency" },
  TOO_EARLY: { statusCode: 425, message: "Too Early" },
  UPGRADE_REQUIRED: { statusCode: 426, message: "Upgrade Required" },
  PRECONDITION_REQUIRED: { statusCode: 428, message: "Precondition Required" },
  TOO_MANY_REQUESTS: { statusCode: 429, message: "Too Many Requests" },
  REQUEST_HEADER_FIELDS_TOO_LARGE: {
    statusCode: 431,
    message: "Request Header Fields Too Large",
  },
  UNAVAILABLE_FOR_LEGAL_REASONS: {
    statusCode: 451,
    message: "Unavailable For Legal Reasons",
  },

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: { statusCode: 500, message: "Internal Server Error" },
  NOT_IMPLEMENTED: { statusCode: 501, message: "Not Implemented" },
  BAD_GATEWAY: { statusCode: 502, message: "Bad Gateway" },
  SERVICE_UNAVAILABLE: { statusCode: 503, message: "Service Unavailable" },
  GATEWAY_TIMEOUT: { statusCode: 504, message: "Gateway Timeout" },
  HTTP_VERSION_NOT_SUPPORTED: {
    statusCode: 505,
    message: "HTTP Version Not Supported",
  },
  VARIANT_ALSO_NEGOTIATES: {
    statusCode: 506,
    message: "Variant Also Negotiates",
  },
  INSUFFICIENT_STORAGE: { statusCode: 507, message: "Insufficient Storage" },
  LOOP_DETECTED: { statusCode: 508, message: "Loop Detected" },
  NOT_EXTENDED: { statusCode: 510, message: "Not Extended" },
  NETWORK_AUTHENTICATION_REQUIRED: {
    statusCode: 511,
    message: "Network Authentication Required",
  },

  // Custom Application Errors
  INVALID_SRC: {
    statusCode: 400,
    message: "Invalid Source, please enter valid source.",
  },
  TECHEXCEL_ISSUE: {
    statusCode: 503,
    message: "Service unavailable: Techexcel issue",
  },
  ESIGN_PROCESS_ERROR: { statusCode: 500, message: "E-sign process failed" },
  INVALID_OTP: { statusCode: 400, message: "Invalid OTP" },
  EXPIRED_OTP: { statusCode: 400, message: "OTP has expired" },
  INVALID_PROC: { statusCode: 400, message: "Invalid process type" },
  FILL_ALL_FILEDS: {
    statusCode: 400,
    message: "Please fill all the required fields.",
  },
  INVALID_ACC_NUM: { statusCode: 400, message: "Invalid Account Number." },
  INVALID_ACC_TYP: { statusCode: 400, message: "Invalid Account Type." },
  INVALID_IFSC: { statusCode: 400, message: "Invalid IFSC code." },
  DATA_NOT_FOUND: { statusCode: 400, message: "Data not found" },
  BANK_EXIST: {
    statusCode: 400,
    message: "Bank with the provided account number already exists.",
  },
  INVALID_BANK_ACC: {
    statusCode: 400,
    message: "The provided bank account number is invalid.",
  },
  PENNY_VERIFICATION_INVALID: {
    statusCode: 400,
    message:
      "Penny drop verification failed. Please check the account details and try again.",
  },

  // Additional Error Messages from config.util.js
  MISSING_REQUIRED_PARAMS: {
    statusCode: 400,
    message: "Missing required parameters",
  },
  INVALID_PAGINATION: {
    statusCode: 400,
    message: "Invalid pagination parameters",
  },
  ACCESS_DENIED: { statusCode: 403, message: "Access denied for this device" },
  EMAIL_EXISTS: { statusCode: 400, message: "Email already exist" },
  USERNAME_EXISTS: { statusCode: 400, message: "Username already exist" },
  USERNAME_LENGTH: {
    statusCode: 400,
    message: "Username must have 3 or more characters",
  },
  USERNAME_ALPHANUMERIC: {
    statusCode: 400,
    message: "Username must be alphanumeric",
  },
  VERIFY_EMAIL: { statusCode: 400, message: "Please verify email" },
  EMAIL_FORMAT: { statusCode: 400, message: "Incorrect email format" },
  PASSWORD_LENGTH: {
    statusCode: 400,
    message: "Password must be 8 or more characters",
  },
  PHONE_NO_LENGTH: {
    statusCode: 400,
    message: "Phone number must be 10 digits",
  },
  SERVER_ERROR: { statusCode: 500, message: "Internal server error" },
  TIMEOUT_ERROR: { statusCode: 408, message: "Request timeout error" },
  INVALID_CREDENTIAL: { statusCode: 400, message: "Invalid credentials" },
  TOKEN_EXPIRED: { statusCode: 401, message: "Token expired" },
  TOKEN_INVALID: { statusCode: 401, message: "Invalid token" },

  // Success Messages
  SUCCESS: { statusCode: 200, message: "Success" },
  ESIGN_REQUEST_SUCCESS: {
    statusCode: 200,
    message: "E-sign request generated",
  },
  FILE_UPLOAD_SUCCESS: {
    statusCode: 200,
    message: "File uploaded successfully",
  },
  LOGIN_SUCCESS: { statusCode: 200, message: "Login successful" },
  LOGOUT_SUCCESS: { statusCode: 200, message: "Logout successful" },
  PASSWORD_UPDATE_SUCCESS: {
    statusCode: 200,
    message: "Password updated successfully",
  },
  DATA_FETCHED_SUCCESS: {
    statusCode: 200,
    message: "Data fetched successfully",
  },
  KYC_LIST_SUCCESS: {
    statusCode: 200,
    message: "KYC modification data fetched successfully",
  },
  PDF_FETCHED_SUCCESS: {
    statusCode: 200,
    message: "PDF file fetched successfully",
  },
  MODIFICATION_SUCCESS: {
    statusCode: 200,
    message: "Modification request processed successfully",
  },
  ACC_CLOSED: { statusCode: 403, message: "Account is closed" },
  ALL_SSN_LOGOUT: {
    statusCode: 200,
    message: "All sessions logged out successfully",
  },
  KYC_APPR_FAIL: { statusCode: 500, message: "KYC approval process failed" },
};

// Export all configurations as default
export default {
  APP,
  authErrorMessages,
  closedTypes,
  individualTypes,
  NotificationEventEnum,
  AuthEventEnum,
  OTP_ACTIONS,
  COMPANY_CODE_MAP,
  KEY_FORMATS,
  HOLIDAYS,
  MESSAGE_TYPES,
  ODIN_CONFIG,
  SMS_CONFIG,
  SMS_TEMPLATE_IDS,
  SMS_TEMPLATES,
  SMS_TYPES,
  EMAIL_CONFIG,
  DB_CONFIG,
  REDIS_CONFIG,
  API_URLS,
  SERVER_CONFIG,
  JWT_CONFIG,
  ENCRYPTION_CONFIG,
  FILE_PATHS,
  TECHEXCEL_DATABASES,
  MISC_CONFIG,
  RESPONSE_CONFIG,
};

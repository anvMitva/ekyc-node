// @ts-nocheck
export const APP = "connect microservices";

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

export const closedTypes = [
  "BO APLICATION RECIVEID-Close"
]

export const individualTypes = [
  "INDIVIDUAL / Resident",
  "INDIVIDUAL"
]

export const NotificationEventEnum = Object.freeze({
  // ? once user is ready to go
  CONNECTED_EVENT: "connected",
  // ? when user gets disconnected
  DISCONNECT_EVENT: "disconnect",
  // ? when there is an error in socket
  SOCKET_ERROR_EVENT: "socketError",
});

export const AuthEventEnum = Object.freeze({
  // ? when user logs in successfully
  USER_LOGGED_IN: "userLoggedIn",
  // ? when user logs out
  USER_LOGGED_OUT: "userLoggedOut",
  // ? when all user sessions are logged out
  ALL_SESSIONS_LOGGED_OUT: "allSessionsLoggedOut",
  // ? when a new user session starts (for monitoring)
  NEW_USER_SESSION: "newUserSession",
  // ? when user session ends (for monitoring)
  USER_SESSION_ENDED: "userSessionEnded",
  // ? when all user sessions end (for monitoring)
  USER_ALL_SESSIONS_ENDED: "userAllSessionsEnded",
  // ? when session expires or is invalidated
  SESSION_EXPIRED: "sessionExpired",
  // ? when password is updated
  PASSWORD_UPDATED: "passwordUpdated",
  // ? when account status changes
  ACCOUNT_STATUS_CHANGED: "accountStatusChanged"
});

const SEND_OTP = 'SEND_OTP'
const RESEND_OTP = 'RESEND_OTP'
const VERIFY_OTP = 'VERIFY_OTP'

export const COMPANY_CODE_MAP = {
  Group1: "NSE_CASH,BSE_CASH,NSE_FNO,BSE_FNO,NSE_SLBM,CD_NSE,CD_BSE,MF_BSE",
  cash: "NSE_CASH,BSE_CASH",
  Group2: "MCX,NCDEX,ICEX",
  Group3: "NSE_CASH,BSE_CASH,NSE_FNO,BSE_FNO,NSE_SLBM,CD_NSE,CD_BSE,MF_BSE,MCX,NCDEX,ICEX",
};

export const KEY_FORMATS = {
  1: "YYYY-MM",  // e.g. 2025-01
  2: "MMM YY",   // e.g. Jan 25
};

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
  "25/12/2025"
];

export { SEND_OTP, RESEND_OTP, VERIFY_OTP };


// Message types
export const MESSAGE_TYPES = {
  CASH: 303,
  COLLATERAL: 330
};

// ODIN API endpoints
export const ENDPOINTS = {
  LOGIN: '/Login',
  LOGOFF: '/LogOff',
  UPDATE_PG_LIMITS: '/UpdatePGLimits'
};

// ODIN API configuration
export const ODIN_CONFIG = {
  USER_ID: 'RESERVEDPG',
  USERNAME: 'ftodin1',
  HO_CODE: 'HO',
  PRODUCT_ID: 1,
  IP_ADDRESS: '27.54.182.124'
};

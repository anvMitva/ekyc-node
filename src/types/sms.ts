/**
 * SMS Service Type Definitions
 */

// ==================== Configuration Types ====================

export interface SmsCredentials {
  USER_ID: string;
  USER_PASS: string;
  GSM_ID: string;
  PE_ID: string;
}

export interface SmsConfig {
  userId: string;
  userPass: string;
  gsmId: string;
  peId: string;
  baseUrl: string;
  unicode: string;
  timeout: number;
  provider: string;
}

// ==================== Template Types ====================

export type SmsTemplateFunction = (value: string) => string;

export interface SmsTemplates {
  [key: string]: SmsTemplateFunction;
}

export interface SmsTemplateIds {
  [key: string]: string;
}

// ==================== SMS Type Union ====================

export type SmsType = 
  | "signup" 
  | "mobile" 
  | "bankUpdate" 
  | "password" 
  | "edis" 
  | "ipvLink" 
  | "default" 
  | "custom";

// ==================== Response Types ====================

export interface SmsSendResult {
  success: boolean;
  data?: any;
  error?: string;
  statusCode?: number;
  duration: number;
}

export interface SmsHealthStatus {
  service: string;
  provider: string;
  status: string;
  config: {
    baseUrl: string;
    gsmId: string;
    peId: string;
  };
  templates: string[];
}

// ==================== Metadata & Logging Types ====================

export interface SmsMetadata {
  uid?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: unknown;
}

export interface SmsLogData {
  mobile: string;
  type: string;
  payload: {
    mobileNumber: string;
    otp: string;
    type: string;
    message?: string;
    tempId?: string;
    timestamp: string;
  };
  response: any;
  error: {
    message: string;
    stack?: string;
    code?: string;
    response?: any;
  } | null;
  status: "success" | "failed";
  statusCode: number;
  duration: number;
  ip: string | null;
  userAgent: string | null;
  uid: string | null;
}


/**
 * Email Service Type Definitions
 */

// ==================== Configuration Types ====================

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  protocol: string;
  mailType: string;
  charset: string;
  wordwrap: boolean;
}

export interface AuthConfig {
  user: string;
  pass: string;
}

export interface EmailConfig {
  smtp: SmtpConfig;
  auth: AuthConfig;
  from: string;
}

// ==================== Template Types ====================

export interface EmailTemplate {
  subject: string;
  template: string;
}

export interface EmailTemplates {
  [key: string]: EmailTemplate;
}

// ==================== Response Types ====================

export interface EmailSendResult {
  success: boolean;
  status: "success" | "error";
  message: string;
  data?: {
    messageId: string;
    accepted: string[];
    rejected: string[];
  };
  duration: number;
}

export interface EmailHealthStatus {
  service: string;
  provider: string;
  status: string;
  config: {
    host: string;
    port: number;
    secure: boolean;
    from: string;
  };
  templates: string[];
}

export interface EmailContentResult {
  subject: string;
  htmlContent: string;
}

// ==================== Metadata & Logging Types ====================

export interface EmailMetadata {
  uid?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: unknown;
}

export interface EmailLogData {
  toEmail: string;
  templateType: string;
  response?: {
    messageId?: string;
    response?: string;
    accepted?: string[];
    rejected?: string[];
  };
  error?: {
    message: string;
    stack?: string;
  };
  status: "success" | "failed";
  duration: number;
  [key: string]: unknown;
}

// ==================== Mail Options ====================

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename?: string;
    path?: string;
    content?: Buffer | string;
    contentType?: string;
  }>;
}


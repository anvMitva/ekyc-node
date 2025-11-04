import nodemailer from "nodemailer";
import type { Transporter, SentMessageInfo } from "nodemailer";
import logger from "../../logger/winston.logger.js";
import { EMAIL_CONFIG, EMAIL_TEMPLATES } from "../../config/index.js";
import type {
  EmailConfig,
  EmailTemplates,
  EmailSendResult,
  EmailHealthStatus,
  EmailContentResult,
  EmailMetadata,
  EmailLogData,
  MailOptions,
} from "../../types/email.js";

// ==================== Email Service Class ====================

/**
 * Email Service Class
 * Handles all email operations with API logging capabilities
 * Follows singleton pattern for consistent transporter usage
 */
class EmailService {
  private config: EmailConfig;
  private templates: EmailTemplates;
  private transporter: Transporter | null;

  constructor() {
    // Email Configuration from centralized config
    this.config = {
      smtp: {
        host: EMAIL_CONFIG.SMTP.SERVER,
        port: EMAIL_CONFIG.SMTP.PORT,
        secure: EMAIL_CONFIG.SECURE,
        protocol: EMAIL_CONFIG.SMTP.PROTOCOL,
        mailType: EMAIL_CONFIG.SMTP.MAIL_TYPE,
        charset: EMAIL_CONFIG.SMTP.CHARSET,
        wordwrap: EMAIL_CONFIG.SMTP.WORDWRAP,
      },
      auth: {
        user: EMAIL_CONFIG.SMTP.USERNAME,
        pass: EMAIL_CONFIG.SMTP.PASSWORD,
      },
      from: EMAIL_CONFIG.SMTP.USERNAME,
    };

    // Email Templates from centralized config
    this.templates = {
      SIGNUP: {
        subject: EMAIL_TEMPLATES.SIGNUP.subject,
        template: EMAIL_TEMPLATES.SIGNUP.template,
      },
    };

    // Initialize transporter (lazy loading)
    this.transporter = null;
  }

  /**
   * Get or create nodemailer transporter
   * @returns {Transporter} Nodemailer transporter
   * @private
   */
  private _getTransporter(): Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: this.config.smtp.host,
        port: this.config.smtp.port,
        secure: this.config.smtp.secure,
        auth: this.config.auth,
      });
    }
    return this.transporter;
  }

  /**
   * Build email HTML content from template
   * @param {string} templateType - Template type
   * @param {Record<string, any>} data - Replacement data
   * @returns {EmailContentResult} Subject and HTML content
   * @private
   */
  private _buildEmailContent(templateType: string, data: Record<string, any>): EmailContentResult {
    const template = this.templates[templateType];
    
    if (!template) {
      throw new Error(`Invalid template type: ${templateType}`);
    }

    let htmlContent = template.template;
    const subject = template.subject;

    // Replace placeholders with actual data
    if (data.otp) {
      htmlContent = htmlContent.replace(/\{\{OTP\}\}/g, data.otp);
    }

    return { subject, htmlContent };
  }

  /**
   * Log email API call
   * @param {EmailLogData} logData - Log data
   * @private
   */
  private async _logApiCall(logData: EmailLogData): Promise<void> {
    try {
      // TODO: Implement API logging to database using ApiLogDB
      logger.info("Email API Call Log", logData);
    } catch (error) {
      const err = error as Error;
      logger.error("Error logging email API call", { error: err.message });
    }
  }

  /**
   * Send email using specified template
   * @param {string} toEmail - Recipient email address
   * @param {string} templateType - Template type
   * @param {Record<string, any>} data - Template data
   * @param {EmailMetadata} metadata - Additional metadata for logging
   * @returns {Promise<EmailSendResult>} Result object
   */
  async sendEmail(
    toEmail: string,
    templateType: string,
    data: Record<string, any> = {},
    metadata: EmailMetadata = {}
  ): Promise<EmailSendResult> {
    const startTime = Date.now();

    try {
      if (!toEmail || !templateType) {
        throw new Error("Email address and template type are required");
      }

      if (!this.validateEmail(toEmail)) {
        throw new Error("Invalid email address format");
      }

      const { subject, htmlContent } = this._buildEmailContent(
        templateType,
        { ...data, email: toEmail }
      );

      logger.info("Sending email", { to: toEmail, templateType, subject });

      const transporter = this._getTransporter();
      const mailOptions: MailOptions = {
        from: this.config.from,
        to: toEmail,
        subject,
        html: htmlContent,
      };

      const info: SentMessageInfo = await transporter.sendMail(mailOptions);
      const duration = Date.now() - startTime;

      await this._logApiCall({
        toEmail,
        templateType,
        response: {
          messageId: info.messageId,
          response: info.response,
          accepted: info.accepted,
          rejected: info.rejected,
        },
        status: "success",
        duration,
        ...metadata,
      });

      logger.info("Email sent successfully", {
        to: toEmail,
        messageId: info.messageId,
        duration: `${duration}ms`,
      });

      return {
        success: true,
        status: "success",
        message: "Email sent successfully",
        data: {
          messageId: info.messageId,
          accepted: info.accepted,
          rejected: info.rejected,
        },
        duration,
      };
    } catch (err) {
      const error = err as Error;
      const duration = Date.now() - startTime;

      await this._logApiCall({
        toEmail,
        templateType,
        error: { message: error.message, stack: error.stack },
        status: "failed",
        duration,
        ...metadata,
      });

      logger.error("Error sending email", {
        to: toEmail,
        error: error.message,
      });

      return {
        success: false,
        status: "error",
        message: error.message,
        duration,
      };
    }
  }

  /**
   * Send signup/KYC verification OTP email
   */
  async sendSignupEmail(toEmail: string, otp: string, metadata: EmailMetadata = {}): Promise<EmailSendResult> {
    return await this.sendEmail(
      toEmail,
      "SIGNUP",
      { otp },
      metadata
    );
  }

  /**
   * Send custom email
   */
  async sendCustomEmail(
    toEmail: string,
    subject: string,
    htmlContent: string,
    attachments: Array<any> = [],
    metadata: EmailMetadata = {}
  ): Promise<EmailSendResult> {
    const startTime = Date.now();

    try {
      if (!toEmail || !subject || !htmlContent) {
        throw new Error("Email, subject, and content are required");
      }

      if (!this.validateEmail(toEmail)) {
        throw new Error("Invalid email address format");
      }

      logger.info("Sending custom email", { to: toEmail, subject });

      const transporter = this._getTransporter();
      const mailOptions: MailOptions = {
        from: this.config.from,
        to: toEmail,
        subject,
        html: htmlContent,
        attachments,
      };

      const info: SentMessageInfo = await transporter.sendMail(mailOptions);
      const duration = Date.now() - startTime;

      await this._logApiCall({
        toEmail,
        templateType: "CUSTOM",
        response: { messageId: info.messageId },
        status: "success",
        duration,
        ...metadata,
      });

      logger.info("Custom email sent successfully", {
        to: toEmail,
        duration: `${duration}ms`,
      });

      return {
        success: true,
        status: "success",
        message: "Custom email sent successfully",
        data: { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected },
        duration,
      };
    } catch (err) {
      const error = err as Error;
      const duration = Date.now() - startTime;

      await this._logApiCall({
        toEmail,
        templateType: "CUSTOM",
        error: { message: error.message, stack: error.stack },
        status: "failed",
        duration,
        ...metadata,
      });

      logger.error("Error sending custom email", {
        to: toEmail,
        error: error.message,
      });

      return {
        success: false,
        status: "error",
        message: error.message,
        duration,
      };
    }
  }

  /**
   * Validate email address format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection(): Promise<EmailSendResult> {
    try {
      const transporter = this._getTransporter();
      await transporter.verify();
      
      logger.info("SMTP connection verified successfully");
      
      return {
        success: true,
        status: "success",
        message: "SMTP connection verified successfully",
        duration: 0,
      };
    } catch (error) {
      const err = error as Error;
      logger.error("SMTP connection verification failed", {
        error: err.message,
      });
      
      return {
        success: false,
        status: "error",
        message: err.message,
        duration: 0,
      };
    }
  }

  /**
   * Get service health status
   */
  getHealthStatus(): EmailHealthStatus {
    return {
      service: "EMAIL",
      provider: "SMTP",
      status: "operational",
      config: {
        host: this.config.smtp.host,
        port: this.config.smtp.port,
        secure: this.config.smtp.secure,
        from: this.config.from,
      },
      templates: Object.keys(this.templates),
    };
  }

  /**
   * Get available email templates
   */
  getAvailableTemplates(): string[] {
    return Object.keys(this.templates);
  }

  /**
   * Close transporter connection
   */
  close(): void {
    if (this.transporter) {
      this.transporter.close();
      this.transporter = null;
      logger.info("Email transporter connection closed");
    }
  }
}

// Export singleton instance
export default new EmailService();

// Export class for testing or multiple instances
export { EmailService };

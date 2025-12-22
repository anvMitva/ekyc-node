/**
 * Provider Alert Service
 * Sends alerts when providers fail or recover
 */
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import logger from "../logger/winston.logger.js";
import { EMAIL_CONFIG } from "../config/index.js";
import { ALERT_TYPES } from "./constants.js";
import type { ProviderAlert } from "../types/provider.js";

// Alert configuration from environment
const ALERT_CONFIG = {
  enabled: process.env.PROVIDER_ALERTS_ENABLED === "true",
  recipients: (process.env.PROVIDER_ALERT_EMAILS || "").split(",").filter(Boolean),
  fromEmail: process.env.PROVIDER_ALERT_FROM || EMAIL_CONFIG.SMTP.USERNAME,
  consecutiveFailureThreshold: parseInt(process.env.PROVIDER_FAILURE_THRESHOLD || "3", 10),
};

/**
 * Provider Alert Service
 * Handles sending alerts for provider failures and recoveries
 */
export class AlertService {
  private static transporter: Transporter | null = null;

  /**
   * Get or create email transporter
   */
  private static getTransporter(): Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: EMAIL_CONFIG.SMTP.SERVER,
        port: EMAIL_CONFIG.SMTP.PORT,
        secure: EMAIL_CONFIG.SECURE,
        auth: {
          user: EMAIL_CONFIG.SMTP.USERNAME,
          pass: EMAIL_CONFIG.SMTP.PASSWORD,
        },
      });
    }
    return this.transporter;
  }

  /**
   * Send an alert
   */
  static async send(alert: ProviderAlert): Promise<void> {
    // Log the alert regardless of email config
    const logLevel = alert.type === ALERT_TYPES.PROVIDER_RECOVERED ? "info" : "error";
    logger[logLevel](`PROVIDER ALERT: ${alert.type}`, {
      module: alert.module,
      provider: alert.provider,
      message: alert.message,
      details: alert.details,
    });

    // Send email if enabled and recipients configured
    if (!ALERT_CONFIG.enabled || ALERT_CONFIG.recipients.length === 0) {
      logger.debug("Email alerts disabled or no recipients configured");
      return;
    }

    try {
      const emailContent = this.buildEmailContent(alert);
      
      await this.getTransporter().sendMail({
        from: ALERT_CONFIG.fromEmail,
        to: ALERT_CONFIG.recipients.join(","),
        subject: emailContent.subject,
        html: emailContent.html,
      });

      logger.info("Alert email sent successfully", {
        type: alert.type,
        recipients: ALERT_CONFIG.recipients.length,
      });
    } catch (error) {
      logger.error("Failed to send alert email", {
        error: (error as Error).message,
        alert: alert.type,
      });
    }
  }

  /**
   * Build email content based on alert type
   */
  private static buildEmailContent(alert: ProviderAlert): { subject: string; html: string } {
    const timestamp = alert.timestamp.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const baseStyles = `
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    `;

    let subject: string;
    let statusColor: string;
    let statusIcon: string;

    switch (alert.type) {
      case ALERT_TYPES.PROVIDER_DOWN:
        subject = `🔴 Provider DOWN: ${alert.provider} (${alert.module})`;
        statusColor = "#dc3545";
        statusIcon = "🔴";
        break;
      case ALERT_TYPES.PROVIDER_RECOVERED:
        subject = `🟢 Provider RECOVERED: ${alert.provider} (${alert.module})`;
        statusColor = "#28a745";
        statusIcon = "🟢";
        break;
      case ALERT_TYPES.ALL_PROVIDERS_DOWN:
        subject = `🚨 CRITICAL: All providers DOWN for ${alert.module}`;
        statusColor = "#dc3545";
        statusIcon = "🚨";
        break;
      case ALERT_TYPES.HIGH_FAILURE_RATE:
        subject = `⚠️ High Failure Rate: ${alert.provider} (${alert.module})`;
        statusColor = "#ffc107";
        statusIcon = "⚠️";
        break;
      default:
        subject = `Provider Alert: ${alert.module}`;
        statusColor = "#6c757d";
        statusIcon = "ℹ️";
    }

    const html = `
      <div style="${baseStyles}">
        <div style="background: ${statusColor}; color: white; padding: 15px; border-radius: 5px 5px 0 0;">
          <h2 style="margin: 0;">${statusIcon} ${alert.type.replace(/_/g, " ")}</h2>
        </div>
        
        <div style="border: 1px solid #ddd; border-top: none; padding: 20px; border-radius: 0 0 5px 5px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Module:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${alert.module}</td>
            </tr>
            ${alert.provider ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Provider:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${alert.provider}</td>
            </tr>
            ` : ""}
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Message:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${alert.message}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Time:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${timestamp}</td>
            </tr>
          </table>
          
          ${Object.keys(alert.details).length > 0 ? `
          <div style="margin-top: 20px;">
            <h3 style="margin-bottom: 10px;">Details:</h3>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;">
${JSON.stringify(alert.details, null, 2)}
            </pre>
          </div>
          ` : ""}
          
          <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
            <p style="margin: 0; color: #666; font-size: 12px;">
              This is an automated alert from the Provider Monitoring System.
              <br>Environment: ${process.env.NODE_ENV || "development"}
            </p>
          </div>
        </div>
      </div>
    `;

    return { subject, html };
  }

  /**
   * Send provider down alert
   */
  static async sendProviderDownAlert(
    module: string,
    provider: string,
    failureCount: number
  ): Promise<void> {
    await this.send({
      type: "PROVIDER_DOWN",
      module,
      provider,
      message: `Provider ${provider} for module ${module} is DOWN after ${failureCount} consecutive failures`,
      details: {
        failureCount,
        threshold: ALERT_CONFIG.consecutiveFailureThreshold,
      },
      timestamp: new Date(),
    });
  }

  /**
   * Send provider recovered alert
   */
  static async sendProviderRecoveredAlert(
    module: string,
    provider: string
  ): Promise<void> {
    await this.send({
      type: "PROVIDER_RECOVERED",
      module,
      provider,
      message: `Provider ${provider} for module ${module} has RECOVERED and is now healthy`,
      details: {},
      timestamp: new Date(),
    });
  }

  /**
   * Send all providers down alert
   */
  static async sendAllProvidersDownAlert(
    module: string,
    attempts: Array<{ provider: string; error: string | null }>
  ): Promise<void> {
    await this.send({
      type: "ALL_PROVIDERS_DOWN",
      module,
      message: `CRITICAL: All providers for module ${module} are DOWN`,
      details: { attempts },
      timestamp: new Date(),
    });
  }
}

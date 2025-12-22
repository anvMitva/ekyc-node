/**
 * OnlySMS Provider
 * Adapter for OnlySMS API (Primary SMS Provider)
 */
import { BaseProvider } from "../../base.provider.js";
import logger from "../../../logger/winston.logger.js";
import type { ProviderConfig } from "../../../types/provider.js";
import type {
  ISmsProvider,
  SmsSendRequest,
  SmsSendResponse,
  SmsOtpRequest,
  SmsDeliveryStatus,
  SmsType,
} from "./sms.interface.js";

// ==================== SMS Templates ====================

const SMS_TEMPLATES: Record<SmsType, (value: string) => string> = {
  signup: (otp) =>
    `Dear User, Kindly signup on ArhamShare using this OTP - ${otp}. For security reasons, ensure you don't share your OTP with anyone ARHAM SHARE.`,
  mobile: (otp) =>
    `Dear Customer, Kindly proceed to update your Mobile no by using this OTP - ${otp}. For security reasons, ensure you don't share your OTP with anyone. Arham Share`,
  bankUpdate: (otp) =>
    `Dear Customer, Kindly proceed to update your Bank details by using this OTP - ${otp}. For security reasons, ensure you don't share your OTP with anyone. Arham Share`,
  password: (otp) =>
    `Dear customer, Your OTP for password reset request is ${otp}. This code will be valid for 5 mins only. Kindly do not share this with anyone. ARHAM SHARE`,
  edis: (otp) =>
    `Dear Customer, Kindly proceed for EDIS facility by using this OTP - ${otp}. For security reasons, ensure you don't share your OTP with anyone. Arham Share`,
  ipvLink: (link) =>
    `Dear Customer,~You are required to complete the IPV (In Person Verification) process by using the following link in order to complete the account opening journey with us. Click here ${link}~Thank you~Arham Share`,
  default: (otp) =>
    `Your OTP is ${otp}. Valid for 5 minutes. Do not share with anyone. Arham Share`,
};

// Template IDs (from environment)
const getTemplateId = (type: SmsType): string => {
  const templateIds: Record<SmsType, string | undefined> = {
    signup: process.env.TEMPID_SIGNUP,
    mobile: process.env.TEMPID_MOBILE,
    bankUpdate: process.env.TEMPID_BANK,
    password: process.env.TEMPID_PASSWORD,
    edis: process.env.TEMPID_EDIS,
    ipvLink: process.env.TEMPID_IPV,
    default: process.env.TEMPID,
  };
  return templateIds[type] || templateIds.default || "";
};

/**
 * OnlySMS Provider Implementation
 */
export class OnlySmsProvider extends BaseProvider implements ISmsProvider {
  private gsmId: string;
  private peId: string;

  constructor(config: ProviderConfig) {
    super("SMS", config);
    // Additional OnlySMS-specific config from metadata
    this.gsmId = (config.metadata?.gsmId as string) || process.env.GSMID || "";
    this.peId = (config.metadata?.peId as string) || process.env.PEID || "";
  }

  /**
   * Send SMS via OnlySMS
   */
  async send(request: SmsSendRequest): Promise<SmsSendResponse> {
    try {
      const templateId = request.templateId || getTemplateId(request.smsType || "default");

      logger.info("OnlySMS sending message", {
        mobile: this.maskMobile(request.mobileNumber),
        provider: this.getCode(),
      });

      // Build URL parameters (OnlySMS uses GET request)
      const params = new URLSearchParams({
        UserID: this.getApiKey(),
        UserPass: this.getApiSecret() || "",
        MobileNo: request.mobileNumber,
        GSMID: this.gsmId,
        PEID: this.peId,
        Message: request.message,
        TEMPID: templateId,
        UNICODE: "TEXT",
      });

      const url = `?${params.toString()}`;
      const response = await this.get<string>(url);

      // OnlySMS returns simple text response
      const isSuccess = this.isSuccessResponse(response);

      return {
        success: isSuccess,
        message: isSuccess ? "SMS sent successfully" : "SMS sending failed",
        data: {
          messageId: this.extractMessageId(response),
          status: isSuccess ? "SENT" as SmsDeliveryStatus : "FAILED" as SmsDeliveryStatus,
          mobileNumber: request.mobileNumber,
          rawResponse: response,
        },
      };
    } catch (error) {
      logger.error("OnlySMS send failed", {
        error: (error as Error).message,
        provider: this.getCode(),
      });
      throw error;
    }
  }

  /**
   * Send OTP SMS using templates
   */
  async sendOtp(request: SmsOtpRequest): Promise<SmsSendResponse> {
    const template = SMS_TEMPLATES[request.smsType] || SMS_TEMPLATES.default;
    const message = template(request.otp);

    return this.send({
      mobileNumber: request.mobileNumber,
      message,
      smsType: request.smsType,
      correlationId: request.correlationId,
      uid: request.uid,
      ip: request.ip,
      userAgent: request.userAgent,
    });
  }

  /**
   * Check if response indicates success
   */
  private isSuccessResponse(response: string): boolean {
    // OnlySMS typically returns a message ID on success
    // or an error message on failure
    const successPatterns = [/^\d+$/, /sent/i, /success/i];
    return successPatterns.some((pattern) => pattern.test(response.trim()));
  }

  /**
   * Extract message ID from response
   */
  private extractMessageId(response: string): string {
    // Try to extract numeric ID from response
    const match = response.match(/\d+/);
    return match ? match[0] : `onlysms_${Date.now()}`;
  }

  /**
   * Mask mobile for logging
   */
  private maskMobile(mobile: string): string {
    if (mobile.length < 10) return "INVALID";
    return `${mobile.substring(0, 2)}****${mobile.substring(mobile.length - 2)}`;
  }
}

/**
 * TwoFactor SMS Provider
 * Adapter for 2Factor.in API (Secondary SMS Provider)
 */
import { BaseProvider } from "../../base.provider.js";
import logger from "../../../logger/winston.logger.js";
import type { ProviderConfig } from "../../../types/provider.js";
import type {
  ISmsProvider,
  SmsSendRequest,
  SmsSendResponse,
  SmsOtpRequest,
  SmsStatusRequest,
  SmsStatusResponse,
  SmsDeliveryStatus,
  SmsType,
} from "./sms.interface.js";

// ==================== TwoFactor-Specific Types ====================

/**
 * TwoFactor API Response format
 */
interface TwoFactorResponse {
  Status: string;
  Details: string;
}

/**
 * TwoFactor SMS Provider Implementation
 */
export class TwoFactorSmsProvider extends BaseProvider implements ISmsProvider {
  constructor(config: ProviderConfig) {
    super("SMS", config);
  }

  /**
   * Send SMS via 2Factor
   */
  async send(request: SmsSendRequest): Promise<SmsSendResponse> {
    try {
      logger.info("TwoFactor sending message", {
        mobile: this.maskMobile(request.mobileNumber),
        provider: this.getCode(),
      });

      // Build request for 2Factor transactional SMS
      const response = await this.get<TwoFactorResponse>(
        `/API/V1/${this.getApiKey()}/SMS/${request.mobileNumber}/${encodeURIComponent(request.message)}`
      );

      const isSuccess = response.Status === "Success";

      return {
        success: isSuccess,
        message: isSuccess ? "SMS sent successfully" : response.Details,
        data: {
          messageId: response.Details,
          status: isSuccess ? "SENT" as SmsDeliveryStatus : "FAILED" as SmsDeliveryStatus,
          mobileNumber: request.mobileNumber,
          rawResponse: response,
        },
      };
    } catch (error) {
      logger.error("TwoFactor send failed", {
        error: (error as Error).message,
        provider: this.getCode(),
      });
      throw error;
    }
  }

  /**
   * Send OTP SMS using 2Factor OTP API
   */
  async sendOtp(request: SmsOtpRequest): Promise<SmsSendResponse> {
    try {
      logger.info("TwoFactor sending OTP", {
        mobile: this.maskMobile(request.mobileNumber),
        type: request.smsType,
        provider: this.getCode(),
      });

      // 2Factor has a dedicated OTP endpoint
      const templateName = this.getTemplateName(request.smsType);
      
      const response = await this.get<TwoFactorResponse>(
        `/API/V1/${this.getApiKey()}/SMS/${request.mobileNumber}/${request.otp}/${templateName}`
      );

      const isSuccess = response.Status === "Success";

      return {
        success: isSuccess,
        message: isSuccess ? "OTP sent successfully" : response.Details,
        data: {
          messageId: response.Details,
          status: isSuccess ? "SENT" as SmsDeliveryStatus : "FAILED" as SmsDeliveryStatus,
          mobileNumber: request.mobileNumber,
          rawResponse: response,
        },
      };
    } catch (error) {
      logger.error("TwoFactor OTP send failed", {
        error: (error as Error).message,
        provider: this.getCode(),
      });
      throw error;
    }
  }

  /**
   * Check delivery status
   */
  async checkStatus(request: SmsStatusRequest): Promise<SmsStatusResponse> {
    try {
      const response = await this.get<TwoFactorResponse>(
        `/API/V1/${this.getApiKey()}/SMS/STATUS/${request.messageId}`
      );

      return {
        success: true,
        message: response.Details,
        data: {
          messageId: request.messageId,
          status: this.mapStatus(response.Status),
          error: response.Status !== "Success" ? response.Details : undefined,
        },
      };
    } catch (error) {
      logger.error("TwoFactor status check failed", {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Get template name for 2Factor
   */
  private getTemplateName(smsType: SmsType): string {
    const templateMap: Record<SmsType, string> = {
      signup: "OTP1",
      mobile: "OTP1",
      bankUpdate: "OTP1",
      password: "OTP1",
      edis: "OTP1",
      ipvLink: "LINK1",
      default: "OTP1",
    };
    return templateMap[smsType] || "OTP1";
  }

  /**
   * Map 2Factor status to universal status
   */
  private mapStatus(status: string): SmsDeliveryStatus {
    const statusMap: Record<string, SmsDeliveryStatus> = {
      Success: "DELIVERED" as SmsDeliveryStatus,
      Sent: "SENT" as SmsDeliveryStatus,
      Pending: "PENDING" as SmsDeliveryStatus,
      Failed: "FAILED" as SmsDeliveryStatus,
      Rejected: "REJECTED" as SmsDeliveryStatus,
    };
    return statusMap[status] || ("PENDING" as SmsDeliveryStatus);
  }

  /**
   * Mask mobile for logging
   */
  private maskMobile(mobile: string): string {
    if (mobile.length < 10) return "INVALID";
    return `${mobile.substring(0, 2)}****${mobile.substring(mobile.length - 2)}`;
  }
}

import axios from "axios";
import type { AxiosResponse } from "axios";
import logger from "../../logger/winston.logger.js";
import {
  SMS_CONFIG,
  SMS_TEMPLATES,
  SMS_TEMPLATE_IDS,
  SMS_TYPES,
} from "../../config/index.js";
import type {
  SmsConfig,
  SmsTemplates,
  SmsTemplateIds,
  SmsType,
  SmsSendResult,
  SmsHealthStatus,
  SmsMetadata,
  SmsLogData,
} from "../../types/sms.js";

// ==================== SMS Service Class ====================

/**
 * SMS Service Class
 * Handles SMS operations with API logging capabilities
 */
class SmsService {
  private config: SmsConfig;
  private messageTemplates: SmsTemplates;
  private templateIds: SmsTemplateIds;

  constructor() {
    // SMS Provider Configuration from centralized config
    this.config = {
      userId: SMS_CONFIG.CREDENTIALS.USER_ID,
      userPass: SMS_CONFIG.CREDENTIALS.USER_PASS,
      gsmId: SMS_CONFIG.CREDENTIALS.GSM_ID,
      peId: SMS_CONFIG.CREDENTIALS.PE_ID,
      baseUrl: SMS_CONFIG.BASE_URL,
      unicode: SMS_CONFIG.UNICODE,
      timeout: SMS_CONFIG.TIMEOUT,
      provider: SMS_CONFIG.PROVIDER,
    };

    // Message Templates from centralized config
    this.messageTemplates = {
      [SMS_TYPES.SIGNUP]: SMS_TEMPLATES.SIGNUP,
      [SMS_TYPES.MOBILE_UPDATE]: SMS_TEMPLATES.MOBILE_UPDATE,
      [SMS_TYPES.BANK_UPDATE]: SMS_TEMPLATES.BANK_UPDATE,
      [SMS_TYPES.PASSWORD_RESET]: SMS_TEMPLATES.PASSWORD_RESET,
      [SMS_TYPES.EDIS]: SMS_TEMPLATES.EDIS,
      [SMS_TYPES.IPV_LINK]: SMS_TEMPLATES.IPV_LINK,
      [SMS_TYPES.DEFAULT]: SMS_TEMPLATES.DEFAULT,
    };

    // Template IDs from centralized config
    this.templateIds = {
      [SMS_TYPES.SIGNUP]: SMS_TEMPLATE_IDS.SIGNUP,
      [SMS_TYPES.MOBILE_UPDATE]: SMS_TEMPLATE_IDS.MOBILE_UPDATE,
      [SMS_TYPES.BANK_UPDATE]: SMS_TEMPLATE_IDS.BANK_UPDATE,
      [SMS_TYPES.PASSWORD_RESET]: SMS_TEMPLATE_IDS.PASSWORD_RESET,
      [SMS_TYPES.EDIS]: SMS_TEMPLATE_IDS.EDIS,
      [SMS_TYPES.IPV_LINK]: SMS_TEMPLATE_IDS.IPV_LINK,
      [SMS_TYPES.DEFAULT]: SMS_TEMPLATE_IDS.DEFAULT,
    };
  }

  /**
   * Get message template by type
   * @param {SmsType} type - Template type (signup, mobile, bankUpdate, password, edis, ipvLink, default)
   * @param {string} value - OTP value or link for IPV
   * @returns {string} Formatted message
   * @private
   */
  private _getMessageTemplate(type: SmsType, value: string): string {
    const template = this.messageTemplates[type] || this.messageTemplates[SMS_TYPES.DEFAULT];
    return template(value);
  }

  /**
   * Get template ID by type
   * @param {SmsType} type - Template type
   * @returns {string} Template ID
   * @private
   */
  private _getTemplateId(type: SmsType): string {
    return this.templateIds[type] || this.templateIds.default;
  }

  /**
   * Build SMS API URL
   * @param {string} mobileNumber - Mobile number
   * @param {string} message - SMS message
   * @param {string} tempId - Template ID
   * @returns {string} Complete API URL
   * @private
   */
  private _buildApiUrl(mobileNumber: string, message: string, tempId: string): string {
    const params = new URLSearchParams({
      UserID: this.config.userId,
      UserPass: this.config.userPass,
      MobileNo: mobileNumber,
      GSMID: this.config.gsmId,
      PEID: this.config.peId,
      Message: message,
      TEMPID: tempId,
      UNICODE: this.config.unicode,
    });

    return `${this.config.baseUrl}?${params.toString()}`;
  }

  /**
   * Log API request and response
   * @param {SmsLogData} logData - Log data
   * @private
   */
  private async _logApiCall(logData: SmsLogData): Promise<void> {
    try {
      // TODO: Implement API logging to database
      // This will store payload, response, and errors
      // Example structure:
      // await ApiLogDB.create({
      //   service: 'SMS',
      //   provider: 'OnlySMS',
      //   mobile: logData.mobile,
      //   type: logData.type,
      //   request_payload: logData.payload,
      //   response_data: logData.response,
      //   error_data: logData.error,
      //   status: logData.status,
      //   status_code: logData.statusCode,
      //   duration: logData.duration,
      //   ip_address: logData.ip,
      //   user_agent: logData.userAgent,
      //   uid: logData.uid,
      // });

      // For now, just log to console/file
      logger.info("SMS API Call Log", logData);
    } catch (error) {
      const err = error as Error;
      logger.error("Error logging SMS API call", { error: err.message });
    }
  }

  /**
   * Send SMS via API
   * @param {string} mobileNumber - Mobile number
   * @param {string} otp - OTP value
   * @param {SmsType} type - SMS type (mobile, bankUpdate, password, default)
   * @param {SmsMetadata} metadata - Additional metadata for logging
   * @returns {Promise<SmsSendResult>} API response
   */
  async sendSms(
    mobileNumber: string,
    otp: string,
    type: SmsType = "default",
    metadata: SmsMetadata = {}
  ): Promise<SmsSendResult> {
    const startTime = Date.now();
    let apiResponse = null;
    let error = null;
    let statusCode = null;

    try {
      // Validate inputs
      if (!mobileNumber || !otp) {
        throw new Error("Mobile number and OTP are required");
      }

      // Get message and template ID
      const message = this._getMessageTemplate(type, otp);
      const tempId = this._getTemplateId(type);

      // Build API URL
      const apiUrl = this._buildApiUrl(mobileNumber, message, tempId);

      // Prepare payload for logging
      const payload = {
        mobileNumber,
        otp: "******", // Mask OTP in logs
        type,
        message: message.replace(otp, "******"), // Mask OTP in message
        tempId,
        timestamp: new Date().toISOString(),
      };

      // Make API call
      logger.info("Sending SMS", {
        mobile: mobileNumber,
        type,
        provider: this.config.provider,
      });

      const response: AxiosResponse = await axios.get(apiUrl, {
        timeout: this.config.timeout,
      });

      apiResponse = response.data;
      statusCode = response.status;

      // Log successful API call
      const duration = Date.now() - startTime;
      await this._logApiCall({
        mobile: mobileNumber,
        type,
        payload,
        response: apiResponse,
        error: null,
        status: "success",
        statusCode,
        duration,
        ip: metadata.ip || null,
        userAgent: metadata.userAgent || null,
        uid: metadata.uid || null,
      });

      logger.info("SMS sent successfully", {
        mobile: mobileNumber,
        type,
        duration: `${duration}ms`,
      });

      return {
        success: true,
        data: apiResponse,
        duration,
      };
    } catch (err) {
      const errObj = err as any;
      error = errObj;
      statusCode = errObj.response?.status || 500;
      const duration = Date.now() - startTime;

      // Log failed API call
      await this._logApiCall({
        mobile: mobileNumber,
        type,
        payload: {
          mobileNumber,
          otp: "******",
          type,
          timestamp: new Date().toISOString(),
        },
        response: errObj.response?.data || null,
        error: {
          message: errObj.message,
          stack: errObj.stack,
          code: errObj.code,
          response: errObj.response?.data,
        },
        status: "failed",
        statusCode,
        duration,
        ip: metadata.ip || null,
        userAgent: metadata.userAgent || null,
        uid: metadata.uid || null,
      });

      logger.error("Error sending SMS", {
        mobile: mobileNumber,
        type,
        error: errObj.message,
        duration: `${duration}ms`,
      });

      return {
        success: false,
        error: errObj.message,
        duration,
      };
    }
  }

  /**
   * Send OTP SMS (wrapper for backward compatibility)
   * @param {string} mobileNumber - Mobile number
   * @param {string} otp - OTP value
   * @param {SmsType} type - SMS type
   * @returns {Promise<SmsSendResult>} API response
   */
  async sendOtp(mobileNumber: string, otp: string, type: SmsType = SMS_TYPES.DEFAULT as SmsType): Promise<SmsSendResult> {
    return await this.sendSms(mobileNumber, otp, type);
  }

  /**
   * Send signup OTP
   * @param {string} mobileNumber - Mobile number
   * @param {string} otp - OTP value
   * @param {SmsMetadata} metadata - Additional metadata
   * @returns {Promise<SmsSendResult>} API response
   */
  async sendSignupOtp(mobileNumber: string, otp: string, metadata: SmsMetadata = {}): Promise<SmsSendResult> {
    return await this.sendSms(mobileNumber, otp, SMS_TYPES.SIGNUP as SmsType, metadata);
  }

  /**
   * Send mobile update OTP
   * @param {string} mobileNumber - Mobile number
   * @param {string} otp - OTP value
   * @param {SmsMetadata} metadata - Additional metadata
   * @returns {Promise<SmsSendResult>} API response
   */
  async sendMobileUpdateOtp(mobileNumber: string, otp: string, metadata: SmsMetadata = {}): Promise<SmsSendResult> {
    return await this.sendSms(mobileNumber, otp, SMS_TYPES.MOBILE_UPDATE as SmsType, metadata);
  }

  /**
   * Send bank update OTP
   * @param {string} mobileNumber - Mobile number
   * @param {string} otp - OTP value
   * @param {SmsMetadata} metadata - Additional metadata
   * @returns {Promise<SmsSendResult>} API response
   */
  async sendBankUpdateOtp(mobileNumber: string, otp: string, metadata: SmsMetadata = {}): Promise<SmsSendResult> {
    return await this.sendSms(mobileNumber, otp, SMS_TYPES.BANK_UPDATE as SmsType, metadata);
  }

  /**
   * Send password reset OTP
   * @param {string} mobileNumber - Mobile number
   * @param {string} otp - OTP value
   * @param {SmsMetadata} metadata - Additional metadata
   * @returns {Promise<SmsSendResult>} API response
   */
  async sendPasswordResetOtp(mobileNumber: string, otp: string, metadata: SmsMetadata = {}): Promise<SmsSendResult> {
    return await this.sendSms(mobileNumber, otp, SMS_TYPES.PASSWORD_RESET as SmsType, metadata);
  }

  /**
   * Send EDIS OTP
   * @param {string} mobileNumber - Mobile number
   * @param {string} otp - OTP value
   * @param {SmsMetadata} metadata - Additional metadata
   * @returns {Promise<SmsSendResult>} API response
   */
  async sendEdisOtp(mobileNumber: string, otp: string, metadata: SmsMetadata = {}): Promise<SmsSendResult> {
    return await this.sendSms(mobileNumber, otp, SMS_TYPES.EDIS as SmsType, metadata);
  }

  /**
   * Send IPV link via SMS
   * @param {string} mobileNumber - Mobile number
   * @param {string} link - IPV link
   * @param {SmsMetadata} metadata - Additional metadata
   * @returns {Promise<SmsSendResult>} API response
   */
  async sendIpvLink(mobileNumber: string, link: string, metadata: SmsMetadata = {}): Promise<SmsSendResult> {
    return await this.sendSms(mobileNumber, link, SMS_TYPES.IPV_LINK as SmsType, metadata);
  }

  /**
   * Send custom SMS with custom message
   * @param {string} mobileNumber - Mobile number
   * @param {string} message - Custom message
   * @param {string} tempId - Template ID
   * @param {SmsMetadata} metadata - Additional metadata
   * @returns {Promise<SmsSendResult>} API response
   */
  async sendCustomSms(
    mobileNumber: string,
    message: string,
    tempId: string,
    metadata: SmsMetadata = {}
  ): Promise<SmsSendResult> {
    const startTime = Date.now();
    let apiResponse = null;
    let error = null;
    let statusCode = null;

    try {
      if (!mobileNumber || !message || !tempId) {
        throw new Error("Mobile number, message, and template ID are required");
      }

      const apiUrl = this._buildApiUrl(mobileNumber, message, tempId);

      const payload = {
        mobileNumber,
        otp: "N/A",
        type: "custom",
        message,
        tempId,
        timestamp: new Date().toISOString(),
      };

      logger.info("Sending custom SMS", {
        mobile: mobileNumber,
        provider: this.config.provider,
      });

      const response: AxiosResponse = await axios.get(apiUrl, {
        timeout: this.config.timeout,
      });

      apiResponse = response.data;
      statusCode = response.status;

      const duration = Date.now() - startTime;
      await this._logApiCall({
        mobile: mobileNumber,
        type: "custom",
        payload,
        response: apiResponse,
        error: null,
        status: "success",
        statusCode,
        duration,
        ip: metadata.ip || null,
        userAgent: metadata.userAgent || null,
        uid: metadata.uid || null,
      });

      return {
        success: true,
        data: apiResponse,
        statusCode,
        duration,
      };
    } catch (err) {
      const errObj = err as any;
      error = errObj;
      statusCode = errObj.response?.status || 500;
      const duration = Date.now() - startTime;

      await this._logApiCall({
        mobile: mobileNumber,
        type: "custom",
        payload: {
          mobileNumber,
          otp: "N/A",
          type: "custom",
          message,
          tempId,
          timestamp: new Date().toISOString(),
        },
        response: errObj.response?.data || null,
        error: {
          message: errObj.message,
          stack: errObj.stack,
          code: errObj.code,
        },
        status: "failed",
        statusCode,
        duration,
        ip: metadata.ip || null,
        userAgent: metadata.userAgent || null,
        uid: metadata.uid || null,
      });

      logger.error("Error sending custom SMS", {
        mobile: mobileNumber,
        error: errObj.message,
      });

      return {
        success: false,
        error: errObj.message,
        statusCode,
        duration,
      };
    }
  }

  /**
   * Validate mobile number format
   * @param {string} mobileNumber - Mobile number
   * @returns {boolean} Is valid
   */
  validateMobileNumber(mobileNumber: string): boolean {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobileNumber);
  }

  /**
   * Get service health status
   * @returns {SmsHealthStatus} Health status
   */
  getHealthStatus(): SmsHealthStatus {
    return {
      service: "SMS",
      provider: this.config.provider,
      status: "operational",
      config: {
        baseUrl: this.config.baseUrl,
        gsmId: this.config.gsmId,
        peId: this.config.peId,
      },
      templates: Object.keys(this.messageTemplates),
    };
  }

  /**
   * Get available SMS types
   * @returns {Record<string, SmsType>} Available SMS types
   */
  getAvailableTypes(): Record<string, SmsType> {
    return SMS_TYPES as Record<string, SmsType>;
  }
}

// Export singleton instance
export default new SmsService();

// Export class for testing or multiple instances
export { SmsService };

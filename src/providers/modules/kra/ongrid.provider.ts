/**
 * Ongrid KRA Provider
 * Adapter for Ongrid KRA API
 */
import { BaseProvider } from "../../base.provider.js";
import logger from "../../../logger/winston.logger.js";
import type { ProviderConfig } from "../../../types/provider.js";
import type {
  IKraProvider,
  KraVerifyRequest,
  KraVerifyResponse,
  KraStatusRequest,
  KraStatusResponse,
  KraStatus,
  KraDetails,
} from "./kra.interface.js";

// ==================== Ongrid-Specific Types ====================

/**
 * Ongrid API Request format
 */
interface OngridRequest {
  panNumber: string;
  name?: string;
  dateOfBirth?: string; // YYYY-MM-DD format
}

/**
 * Ongrid API Response format
 */
interface OngridResponse {
  success: boolean;
  code: number;
  msg: string;
  result?: {
    kraStatus: string;
    panNumber: string;
    fullName: string;
    fatherName?: string;
    dob?: string;
    gender?: string;
    addressDetails?: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
    contactDetails?: {
      email?: string;
      mobileNumber?: string;
    };
    registrationInfo?: {
      kraAgency?: string;
      registrationDate?: string;
    };
  };
  transactionId?: string;
}

/**
 * Ongrid KRA Provider Implementation
 */
export class OngridKraProvider extends BaseProvider implements IKraProvider {
  constructor(config: ProviderConfig) {
    super("KRA", config);
  }

  /**
   * Verify KRA registration via Ongrid
   */
  async verify(request: KraVerifyRequest): Promise<KraVerifyResponse> {
    try {
      // Transform to Ongrid format
      const ongridRequest = this.transformRequest(request);

      logger.info("Ongrid KRA verification request", {
        pan: this.maskPan(request.panNumber),
        provider: this.getCode(),
      });

      // Make API call with Ongrid auth header
      const ongridResponse = await this.post<OngridResponse>(
        "/v2/kra/verify",
        ongridRequest,
        {
          headers: {
            Authorization: `Bearer ${this.getApiKey()}`,
            "X-Client-Id": this.getApiSecret() || "",
          },
        }
      );

      // Transform response to universal format
      return this.transformResponse(ongridResponse);
    } catch (error) {
      logger.error("Ongrid KRA verification failed", {
        error: (error as Error).message,
        provider: this.getCode(),
      });
      throw error;
    }
  }

  /**
   * Check status of previous verification
   */
  async checkStatus(request: KraStatusRequest): Promise<KraStatusResponse> {
    try {
      const response = await this.post<OngridResponse>(
        "/v2/kra/status",
        {
          panNumber: request.panNumber,
          transactionId: request.referenceId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.getApiKey()}`,
          },
        }
      );

      return {
        success: response.success,
        message: response.msg,
        data: {
          status: this.mapOngridStatus(response.result?.kraStatus || ""),
          message: response.msg,
          referenceId: response.transactionId,
        },
      };
    } catch (error) {
      logger.error("Ongrid status check failed", {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Transform universal request to Ongrid format
   */
  private transformRequest(request: KraVerifyRequest): OngridRequest {
    return {
      panNumber: request.panNumber.toUpperCase(),
      name: request.fullName,
      dateOfBirth: request.dateOfBirth, // Ongrid uses YYYY-MM-DD
    };
  }

  /**
   * Transform Ongrid response to universal format
   */
  private transformResponse(ongridResponse: OngridResponse): KraVerifyResponse {
    const isSuccess = ongridResponse.success && ongridResponse.code === 200;
    const isRegistered =
      ongridResponse.result?.kraStatus?.toUpperCase() === "REGISTERED";

    let details: KraDetails | null = null;

    if (ongridResponse.result) {
      const result = ongridResponse.result;
      details = {
        panNumber: result.panNumber || "",
        name: result.fullName || "",
        fatherName: result.fatherName,
        dateOfBirth: result.dob,
        gender: result.gender,
        address: result.addressDetails
          ? {
              line1: result.addressDetails.addressLine1,
              line2: result.addressDetails.addressLine2,
              city: result.addressDetails.city,
              state: result.addressDetails.state,
              pincode: result.addressDetails.postalCode,
              country: result.addressDetails.country || "India",
            }
          : undefined,
        email: result.contactDetails?.email,
        mobile: result.contactDetails?.mobileNumber,
        kraRegistrationDate: result.registrationInfo?.registrationDate,
        kraAgency: result.registrationInfo?.kraAgency || "Ongrid",
      };
    }

    return {
      success: isSuccess,
      message: ongridResponse.msg,
      data: {
        status: this.mapOngridStatus(ongridResponse.result?.kraStatus || ""),
        isRegistered,
        details,
        referenceId: ongridResponse.transactionId,
        rawResponse: ongridResponse,
      },
    };
  }

  /**
   * Map Ongrid status to universal KraStatus
   */
  private mapOngridStatus(ongridStatus: string): KraStatus {
    const statusMap: Record<string, KraStatus> = {
      REGISTERED: "REGISTERED" as KraStatus,
      NOT_REGISTERED: "NOT_REGISTERED" as KraStatus,
      "NOT FOUND": "NOT_REGISTERED" as KraStatus,
      PENDING: "PENDING" as KraStatus,
      INVALID_PAN: "INVALID" as KraStatus,
      INVALID: "INVALID" as KraStatus,
    };

    return statusMap[ongridStatus.toUpperCase()] || ("ERROR" as KraStatus);
  }

  /**
   * Mask PAN for logging
   */
  private maskPan(pan: string): string {
    if (pan.length < 10) return "INVALID";
    return `${pan.substring(0, 2)}****${pan.substring(8)}`;
  }
}

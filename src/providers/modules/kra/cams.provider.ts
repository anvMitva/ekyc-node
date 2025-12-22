/**
 * CAMS KRA Provider
 * Adapter for CAMS KRA API
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

// ==================== CAMS-Specific Types ====================

/**
 * CAMS API Request format
 */
interface CamsRequest {
  pan_no: string;
  name?: string;
  dob?: string; // DD-MM-YYYY format
  api_key: string;
}

/**
 * CAMS API Response format
 */
interface CamsResponse {
  status: string;
  status_code: number;
  message: string;
  data?: {
    pan_status: string;
    kra_status: string;
    name: string;
    father_name?: string;
    dob?: string;
    gender?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      pincode?: string;
    };
    email?: string;
    mobile?: string;
    registration_date?: string;
  };
  reference_id?: string;
}

/**
 * CAMS KRA Provider Implementation
 */
export class CamsKraProvider extends BaseProvider implements IKraProvider {
  constructor(config: ProviderConfig) {
    super("KRA", config);
  }

  /**
   * Verify KRA registration via CAMS
   */
  async verify(request: KraVerifyRequest): Promise<KraVerifyResponse> {
    try {
      // Transform to CAMS format
      const camsRequest = this.transformRequest(request);

      logger.info("CAMS KRA verification request", {
        pan: this.maskPan(request.panNumber),
        provider: this.getCode(),
      });

      // Make API call
      const camsResponse = await this.post<CamsResponse>(
        "/kra/verify",
        camsRequest
      );

      // Transform response to universal format
      return this.transformResponse(camsResponse);
    } catch (error) {
      logger.error("CAMS KRA verification failed", {
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
      const response = await this.post<CamsResponse>("/kra/status", {
        pan_no: request.panNumber,
        reference_id: request.referenceId,
        api_key: this.getApiKey(),
      });

      return {
        success: response.status_code === 200,
        message: response.message,
        data: {
          status: this.mapCamsStatus(response.data?.kra_status || ""),
          message: response.message,
          referenceId: response.reference_id,
        },
      };
    } catch (error) {
      logger.error("CAMS status check failed", {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  /**
   * Transform universal request to CAMS format
   */
  private transformRequest(request: KraVerifyRequest): CamsRequest {
    return {
      pan_no: request.panNumber.toUpperCase(),
      name: request.fullName,
      dob: request.dateOfBirth
        ? this.formatDateForCams(request.dateOfBirth)
        : undefined,
      api_key: this.getApiKey(),
    };
  }

  /**
   * Transform CAMS response to universal format
   */
  private transformResponse(camsResponse: CamsResponse): KraVerifyResponse {
    const isSuccess = camsResponse.status_code === 200;
    const isRegistered =
      camsResponse.data?.kra_status?.toUpperCase() === "REGISTERED";

    let details: KraDetails | null = null;

    if (camsResponse.data) {
      details = {
        panNumber: camsResponse.data.pan_status || "",
        name: camsResponse.data.name || "",
        fatherName: camsResponse.data.father_name,
        dateOfBirth: camsResponse.data.dob,
        gender: camsResponse.data.gender,
        address: camsResponse.data.address
          ? {
              line1: camsResponse.data.address.line1,
              line2: camsResponse.data.address.line2,
              city: camsResponse.data.address.city,
              state: camsResponse.data.address.state,
              pincode: camsResponse.data.address.pincode,
              country: "India",
            }
          : undefined,
        email: camsResponse.data.email,
        mobile: camsResponse.data.mobile,
        kraRegistrationDate: camsResponse.data.registration_date,
        kraAgency: "CAMS",
      };
    }

    return {
      success: isSuccess,
      message: camsResponse.message,
      data: {
        status: this.mapCamsStatus(camsResponse.data?.kra_status || ""),
        isRegistered,
        details,
        referenceId: camsResponse.reference_id,
        rawResponse: camsResponse,
      },
    };
  }

  /**
   * Map CAMS status to universal KraStatus
   */
  private mapCamsStatus(camsStatus: string): KraStatus {
    const statusMap: Record<string, KraStatus> = {
      REGISTERED: "REGISTERED" as KraStatus,
      "NOT REGISTERED": "NOT_REGISTERED" as KraStatus,
      NOT_REGISTERED: "NOT_REGISTERED" as KraStatus,
      PENDING: "PENDING" as KraStatus,
      INVALID: "INVALID" as KraStatus,
    };

    return statusMap[camsStatus.toUpperCase()] || ("ERROR" as KraStatus);
  }

  /**
   * Format date from YYYY-MM-DD to DD-MM-YYYY (CAMS format)
   */
  private formatDateForCams(isoDate: string): string {
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
  }

  /**
   * Mask PAN for logging
   */
  private maskPan(pan: string): string {
    if (pan.length < 10) return "INVALID";
    return `${pan.substring(0, 2)}****${pan.substring(8)}`;
  }
}

/**
 * TechExcel API Type Definitions
 * Created: 2025-11-12
 * Purpose: Type definitions for TechExcel API services
 */

// ============================================
// Common Types
// ============================================

export interface TechExcelTokenData {
  token: string;
  updatedAt: string;
}

export interface TechExcelErrorResponse {
  'Error Code'?: string;
  'Error Description'?: string;
  error?: string;
  message?: string;
}

export interface TechExcelSuccessResponse<T = any> {
  'Success Description': T;
}

// ============================================
// API Request Body Types
// ============================================

export interface ClientListRequestBody {
  CLIENT_ID: string;
  FROM_DATE: string;
  TO_DATE: string;
  BRANCH_CODE: string;
  MOBILE_NO: string;
  EMAIL_ID: string;
  PAN_VERIFICATION_DATE: string;
}

export interface RevenueRequestBody {
  CLIENT_ID: string;
  TO_DATE: string;
  FROM_DATE: string;
  COMPANY_CODE: string;
  BRANCH: string;
  SCRIP_SYMBOL: string;
  Remshire_Code: string;
  POLICY: string;
}

export interface DPHoldingRequestBody {
  Client_code: string;
  To_date: string;
}

export interface FADayBookRequestBody {
  CLIENT_CODE: string;
  FROM_DATE: string;
  TO_DATE: string;
  COMPANY_CODE: string;
  TRANS_TYPE: string;
}

export interface BankDetailsRequestBody {
  Client_id: string;
}

export interface PaymentRequestStatusRequestBody {
  Client_code: string;
}

// ============================================
// API Response Types (generic - actual structure depends on API)
// ============================================

export type ClientRecord = Record<string, any>;
export type RevenueRecord = Record<string, any>;
export type DPHoldingRecord = Record<string, any>;
export type FADayBookRecord = Record<string, any>;
export type BankDetailsRecord = Record<string, any>;
export type PaymentRequestStatusRecord = Record<string, any>;

// ============================================
// Function Parameter Types
// ============================================

export interface GetClientDataV2Params {
  clientId: string;
  fromDate?: string;
  toDate?: string;
  branchCode?: string;
  mobileNo?: string;
  emailId?: string;
  panVerificationDate?: string;
  isHardRefresh?: boolean;
}

export interface GetRevenueDataV2Params {
  clientId: string;
  fromDate?: string;
  toDate?: string;
  companyCode?: string;
  branch?: string;
  scripSymbol?: string;
  remshireCode?: string;
  policy?: string;
}

export interface GetDPHoldingDataV2Params {
  clientCode: string;
  toDate: string;
  finstyr?: number; // Financial year is a number from getFinancialYear()
  isHardRefresh?: boolean;
  showSummaryOnly?: boolean;
  persistPermanent?: boolean;
  storeRedis?: boolean;
}

export interface GetFadaybookV2Params {
  clientCode: string;
  fromDate: string;
  toDate: string;
  companyCode?: string;
  transType: string;
  finstyr?: number; // Financial year is a number from getFinancialYear()
  isHardRefresh?: boolean;
  persistPermanent?: boolean;
}

export interface GetBankDetailsParams {
  clientCode: string;
  isHardRefresh?: boolean;
  storeRedis?: boolean;
}

export interface GetPaymentRequestStatusParams {
  clientCode: string;
}

// ============================================
// Response Data Wrapper Types
// ============================================

export interface DataWithTimestamp<T = any> {
  data: T[];
  updatedAt: string;
}

export interface DPHoldingResponseData {
  data: DPHoldingRecord[];
  updatedAt: string;
  summaryData: HoldingSummary;
}

export interface HoldingSummary {
  totalValue: number;
  totalQuantity: number;
  scripCount: number;
}

// ============================================
// Cache-related Types
// ============================================

export interface CachedDPHoldingData {
  data: DPHoldingRecord[];
  updatedAt: string;
  summaryData?: HoldingSummary;
}

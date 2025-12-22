/**
 * KRA Module Index
 * Export all KRA-related components
 */

// Types and Interfaces
export type {
  KraVerifyRequest,
  KraVerifyResponse,
  KraStatusRequest,
  KraStatusResponse,
  KraDetails,
  IKraProvider,
} from "./kra.interface.js";

export { KraStatus } from "./kra.interface.js";

// Providers
export { CamsKraProvider } from "./cams.provider.js";
export { OngridKraProvider } from "./ongrid.provider.js";

// Service
export { KraService, kraService } from "./kra.service.js";

import type { Transaction } from "sequelize";

type Nullable<T> = T | null;

type MatchResult = {
  mobileMatches: unknown[];
  emailMatches: unknown[];
  [key: string]: unknown;
};

interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  platform: string;
  isMobile: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  isBot: boolean;
  source: string;
}

interface LocationInfo {
  ip: Nullable<string>;
  country: string;
  countryCode: string;
  region: string;
  state: string;
  stateCode: string;
  city: string;
  latitude: Nullable<number>;
  longitude: Nullable<number>;
  timezone: string;
  range: Nullable<[number, number]>;
  metro: Nullable<number>;
  area: Nullable<number>;
}

interface ClientDeviceData {
  device: DeviceInfo;
  location: LocationInfo;
  timestamp: string;
}

type DeviceDataInput = {
  device?: Partial<DeviceInfo>;
  location?: Partial<LocationInfo>;
  timestamp?: string;
};

interface CheckUniquenessParams {
  email: string;
  mobile: string;
  apCode?: string | null;
  deviceData?: DeviceDataInput;
}

interface CheckUniquenessResult {
  matchedData: MatchResult;
  emailMatches: boolean;
  mobileMatches: boolean;
}

interface CheckKycExistsParams {
  mobile: string;
  email: string;
  apCode?: string | null;
  rmCode?: string | null;
  schemeCode?: string | null;
  referralCode?: string | null;
  source?: string | null;
  deviceData?: DeviceDataInput;
  ip?: string | null;
  userAgent?: string | null;
  transaction?: Transaction | null;
}

interface PendingLead {
  uid?: string;
}

type LeadUpsertPayload = {
  mobile: string;
  email: string;
  rmCode: Nullable<string>;
  apCode: Nullable<string>;
  schemeCode: Nullable<string>;
  referralCode: Nullable<string>;
  source: Nullable<string>;
  ip: Nullable<string>;
  location: Nullable<string>;
  latitude: Nullable<number>;
  longitude: Nullable<number>;
  device: Nullable<string>;
  userAgent: Nullable<string>;
  otpStatus: string;
  panStatus: string;
};

interface GeoLookupResult {
  range?: [number, number];
  country?: string;
  region?: string;
  city?: string;
  ll?: [number, number];
  metro?: number;
  area?: number;
  timezone?: string;
  country_iso_code?: string;
  region_name?: string;
}

export type { Nullable, MatchResult, DeviceInfo, LocationInfo, ClientDeviceData, DeviceDataInput, CheckUniquenessParams, CheckUniquenessResult, CheckKycExistsParams, PendingLead, LeadUpsertPayload, GeoLookupResult };
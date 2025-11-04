import type { Model, Optional } from "sequelize";

interface LeadAttributes {
  id: number;
  uid: string | null;
  mobile: string;
  email: string;
  rmCode: string | null;
  apCode: string | null;
  schemeCode: string | null;
  referralCode: string | null;
  source: string | null;
  ip: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  device: string | null;
  userAgent: string | null;
  otpStatus: string | null;
  panStatus: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type LeadCreationAttributes = Optional<
  LeadAttributes,
  | "id"
  | "uid"
  | "rmCode"
  | "apCode"
  | "schemeCode"
  | "referralCode"
  | "source"
  | "ip"
  | "location"
  | "latitude"
  | "longitude"
  | "device"
  | "userAgent"
  | "otpStatus"
  | "panStatus"
  | "createdAt"
  | "updatedAt"
>;

interface LeadInstance
  extends Model<LeadAttributes, LeadCreationAttributes>,
    LeadAttributes {}

export type { LeadAttributes, LeadCreationAttributes, LeadInstance };

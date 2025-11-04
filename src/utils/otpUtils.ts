// @ts-nocheck
import crypto from 'crypto';
import { ENCRYPTION_CONFIG } from '../config';

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash OTP for secure storage
export const hashOTP = (otp: string): string => {
  return crypto.createHash('sha256').update(otp + ENCRYPTION_CONFIG.OTP_SALT).digest('hex');
};

// Verify hashed OTP
export const verifyOTPHash = (otp: string, hash: string): boolean => {
  const computedHash = hashOTP(otp);
  return computedHash === hash;
};

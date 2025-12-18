import logger from "../logger/winston.logger.js";
import { ApiError } from "../utils/ApiError.js";
import { generateOTP } from "../utils/otpUtils.js";
import SmsService from "./providers/sms.service.js";
import EmailService from "./providers/email.service.js";
import OtpDB from "./db/otp.db.js";
import OtpLogDB from "./db/otplog.db.js";
import ActivityLogDB from "./db/activitylog.db.js";
import LastActivityDB from "./db/lastactivity.db.js";
import type { Transaction } from "sequelize";

interface SendOtpParams {
    uid?: string;
    mobile: string;
    email: string;
    ip?: string;
    userAgent?: string;
    device?: string;
    location?: string;
    sessionId?: string;
    clientCode?: string;
    kycId?: string;
    transaction?: Transaction;
}

interface OtpSendResult {
    success: boolean;
    message: string;
    data?: {
        otpId: number;
        mobileOtpSent: boolean;
        emailOtpSent: boolean;
        expiryTime: Date;
    };
    error?: string;
}

/**
 * Send OTP via SMS and Email with complete database logging
 * @param {SendOtpParams} params - OTP send parameters
 * @returns {Promise<OtpSendResult>} Result of OTP send operation
 */
export async function sendOtpEmailMobile(params: SendOtpParams): Promise<OtpSendResult> {
    const { uid, mobile, email, ip, userAgent, device, location, sessionId, clientCode, kycId, transaction } = params;
    
    try {
        // Validate inputs
        if (!mobile || !email) {
            throw new ApiError(400, "Mobile and email are required");
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
        const otpResendTime = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes resend time

        logger.info("Generating and sending OTP", { uid, mobile, email });

        // Send SMS OTP
        const smsResult = await SmsService.sendSignupOtp(mobile, otp, {
            uid,
            ip,
            userAgent,
        });

        // Send Email OTP
        const emailResult = await EmailService.sendSignupEmail(email, otp, {
            uid,
            ip,
            userAgent,
        });

        // Check if at least one succeeded
        const mobileOtpSent = smsResult.success;
        const emailOtpSent = emailResult.success;

        if (!mobileOtpSent && !emailOtpSent) {
            throw new ApiError(500, "Failed to send OTP via both SMS and Email");
        }

        // Prepare OTP data for database
        const otpData = {
            uid: uid || null,
            mobile,
            mobileOtp: mobileOtpSent ? otp : null,
            mobileOtpExpiry: mobileOtpSent ? otpExpiry : null,
            mobileOtpResendTime: mobileOtpSent ? otpResendTime : null,
            mobileOtpAttempts: 0,
            mobileOtpResendAttempts: 0,
            mobileOtpVerified: false,
            email,
            emailOtp: emailOtpSent ? otp : null,
            emailOtpExpiry: emailOtpSent ? otpExpiry : null,
            emailOtpResendTime: emailOtpSent ? otpResendTime : null,
            emailOtpAttempts: 0,
            emailOtpResendAttempts: 0,
            emailOtpVerified: false,
            ip: ip || null,
            device: device || null,
            userAgent: userAgent || null,
            location: location || null,
            isBlocked: false,
        };

        // Save OTP to database (with transaction)
        const otpRecord: any = await OtpDB.create(otpData, transaction);

        // Log Mobile OTP send (with transaction)
        if (mobileOtpSent) {
            await OtpLogDB.create({
                otpId: otpRecord.id,
                uid: uid || null,
                mobile,
                mobileOtp: otp,
                mobileOtpStatus: "sent",
                mobileOtpAction: "send",
                mobileOtpResponse: JSON.stringify(smsResult.data || {}),
                attemptNumber: 1,
                ip: ip || null,
                device: device || null,
                userAgent: userAgent || null,
                location: location || null,
                provider: "SMS",
                providerId: null,
            }, transaction);
        } else {
            await OtpLogDB.create({
                otpId: otpRecord.id,
                uid: uid || null,
                mobile,
                mobileOtp: otp,
                mobileOtpStatus: "failed",
                mobileOtpAction: "send",
                mobileOtpResponse: JSON.stringify(smsResult.error || {}),
                attemptNumber: 1,
                ip: ip || null,
                device: device || null,
                userAgent: userAgent || null,
                location: location || null,
                errorMessage: smsResult.error || "Failed to send SMS",
                provider: "SMS",
            }, transaction);
        }

        // Log Email OTP send (with transaction)
        if (emailOtpSent) {
            await OtpLogDB.create({
                otpId: otpRecord.id,
                uid: uid || null,
                email,
                emailOtp: otp,
                emailOtpStatus: "sent",
                emailOtpAction: "send",
                emailOtpResponse: JSON.stringify(emailResult.data || {}),
                attemptNumber: 1,
                ip: ip || null,
                device: device || null,
                userAgent: userAgent || null,
                location: location || null,
                provider: "EMAIL",
                providerId: emailResult.data?.messageId || null,
            }, transaction);
        } else {
            await OtpLogDB.create({
                otpId: otpRecord.id,
                uid: uid || null,
                email,
                emailOtp: otp,
                emailOtpStatus: "failed",
                emailOtpAction: "send",
                emailOtpResponse: JSON.stringify(emailResult.message || {}),
                attemptNumber: 1,
                ip: ip || null,
                device: device || null,
                userAgent: userAgent || null,
                location: location || null,
                errorMessage: emailResult.message || "Failed to send email",
                provider: "EMAIL",
            }, transaction);
        }

        // Create Activity Log entry (with transaction)
        const activityLogData = {
            uid: uid || null,
            kycId: kycId || null,
            clientCode: clientCode || null,
            activityName: "OTP_SEND",
            activityType: "AUTHENTICATION",
            activityTime: new Date(),
            activityDescription: `OTP sent - Mobile: ${mobileOtpSent ? "Success" : "Failed"}, Email: ${emailOtpSent ? "Success" : "Failed"}`,
            status: (mobileOtpSent || emailOtpSent) ? "success" : "failed",
            sessionId: sessionId || null,
        };

        await ActivityLogDB.create(activityLogData, transaction);

        // Update Last Activity (this overwrites previous entry) (with transaction)
        const lastActivityData = {
            uid: uid || null,
            kycId: kycId || null,
            clientCode: clientCode || null,
            activityName: "OTP_SEND",
            activityType: "AUTHENTICATION",
            activityTime: new Date(),
            status: (mobileOtpSent || emailOtpSent) ? "success" : "failed",
            sessionId: sessionId || null,
        };

        // Use upsert to create or update last activity
        if (uid) {
            await LastActivityDB.upsertByUidAndActivity(uid, "OTP_SEND", lastActivityData, transaction);
        }

        logger.info("OTP sent successfully", {
            uid,
            mobile,
            email,
            otpId: otpRecord.id,
            mobileOtpSent,
            emailOtpSent,
        });

        return {
            success: true,
            message: mobileOtpSent && emailOtpSent
                ? "OTP sent successfully to both mobile and email"
                : mobileOtpSent
                ? "OTP sent to mobile, but email failed"
                : "OTP sent to email, but mobile SMS failed",
            data: {
                otpId: otpRecord.id,
                mobileOtpSent,
                emailOtpSent,
                expiryTime: otpExpiry,
            },
        };
    } catch (error) {
        const err = error as Error;
        logger.error("Error sending OTP via email and mobile", {
            error: err.message,
            uid,
            mobile,
            email,
        });

        // Log failed activity (with transaction)
        try {
            await ActivityLogDB.create({
                uid: uid || null,
                kycId: kycId || null,
                clientCode: clientCode || null,
                activityName: "OTP_SEND",
                activityType: "AUTHENTICATION",
                activityTime: new Date(),
                activityDescription: `Failed to send OTP: ${err.message}`,
                status: "failed",
                sessionId: sessionId || null,
            }, transaction);

            if (uid) {
                await LastActivityDB.upsertByUidAndActivity(uid, "OTP_SEND", {
                    uid,
                    kycId: kycId || null,
                    clientCode: clientCode || null,
                    activityName: "OTP_SEND",
                    activityType: "AUTHENTICATION",
                    activityTime: new Date(),
                    status: "failed",
                    sessionId: sessionId || null,
                }, transaction);
            }
        } catch (logError) {
            logger.error("Error logging failed OTP send", { error: logError });
        }

        throw error instanceof ApiError
            ? error
            : new ApiError(500, "Internal Server Error", [error], err.stack);
    }
}

/**
 * Resend OTP via SMS and Email
 * NOTE: This function is a placeholder for future implementation
 * @param {SendOtpParams} params - OTP resend parameters
 * @returns {Promise<OtpSendResult>} Result of OTP resend operation
 */
export async function resendOtpEmailMobile(params: SendOtpParams): Promise<OtpSendResult> {
    // TODO: Implement resend OTP logic
    // 1. Check if previous OTP exists
    // 2. Validate resend time constraints
    // 3. Check resend attempt limits
    // 4. Increment resend attempts
    // 5. Generate and send new OTP
    // 6. Update OTP table and log to OTP log table
    // 7. Log activity in activity log and last activity tables
    
    throw new ApiError(501, "Resend OTP functionality not implemented yet");
}

/**
 * Verify OTP for mobile and email
 * NOTE: This function is a placeholder for future implementation
 * @param {object} params - Verification parameters
 * @returns {Promise<object>} Result of OTP verification
 */
export async function verifyOtpEmailMobile(params: {
    uid?: string;
    mobile: string;
    email: string;
    mobileOtp: string;
    emailOtp: string;
    ip?: string;
    userAgent?: string;
    device?: string;
    sessionId?: string;
    clientCode?: string;
    kycId?: string;
}): Promise<{ success: boolean; message: string; data?: any }> {
    // TODO: Implement verify OTP logic
    // 1. Find active OTP record
    // 2. Check if OTP is blocked or expired
    // 3. Verify mobile OTP
    // 4. Verify email OTP
    // 5. Check attempt limits
    // 6. Update verification status
    // 7. Log to OTP log table (multiple entries for each attempt)
    // 8. Log activity in activity log and update last activity tables
    
    throw new ApiError(501, "Verify OTP functionality not implemented yet");
}
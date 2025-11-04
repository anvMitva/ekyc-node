// @ts-nocheck
import nodemailer from 'nodemailer';
import { MAIL_TEMPLATE, SEGMENT_MAIL_TEMPLATE, MAIL_TEMPLATE_OTP, MAIL_TEMPLATE_APPROVE_REJECT, MAIL_TEMPLATE_PDF } from '../utils/config.util.js';
import logger from '../logger/winston.logger.js';
import { EMAIL_CONFIG, API_URLS } from '../config/index.js';

export async function sendEmail(toEmail, userUid, sentOtp, templateType, segment = null) {
  try {
    let subject, htmlContent;

    switch (templateType) {
      case 'FORGOT_EMAIL':
        subject = MAIL_TEMPLATE.signup_subject;
        htmlContent = MAIL_TEMPLATE.signup_template
          .replace('{{ OTP }}', sentOtp)
          .replace('{{uid}}', userUid)
          .replace('{{ emailId }}', toEmail);
        break;

      case 'EMPLOYEE_CREATION':
        subject = MAIL_TEMPLATE.employee_creation_subject;
        htmlContent = MAIL_TEMPLATE.employee_creation_template
          .replace('{{ username }}', userUid)
          .replace('{{ password }}', sentOtp)
          .replace('{{ emailId }}', toEmail);
        break;

      case 'SEGMENT_EMAIL':
        subject = SEGMENT_MAIL_TEMPLATE.signup_subject;
        htmlContent = SEGMENT_MAIL_TEMPLATE.signup_tempelate
          .replace('{{ OTP }}', sentOtp)
          .replace('{{uid}}', userUid)
          .replace('{{ emailId }}', toEmail)
          .replace('{{encode_segment}}', segment)
          .replace('{{url}}', API_URLS.SEGMENT_RESPONSE);
        break;

      case 'EMAIL_MODIFICATION_MAIL':
        subject = MAIL_TEMPLATE_OTP.signup_subject;
        htmlContent = MAIL_TEMPLATE_OTP.signup_tempelate
          .replace('{{ OTP }}', sentOtp)
          .replace('{{uid}}', userUid)
          .replace('{{ emailId }}', toEmail);
        break;

      default:
        return { status: 'error', message: 'Invalid template type' };
    }

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.SMTP.SERVER,
      port: EMAIL_CONFIG.SMTP.PORT,
      secure: EMAIL_CONFIG.SECURE,
      auth: {
        user: EMAIL_CONFIG.SMTP.USERNAME,
        pass: EMAIL_CONFIG.SMTP.PASSWORD
      }
    });

    // Send the email
    await transporter.sendMail({
      from: EMAIL_CONFIG.SMTP.USERNAME,
      to: toEmail,
      subject,
      html: htmlContent
    });

    return { status: 'success', message: 'Mail sent successfully' };
  } catch (err) {
    logger.error(`Error in sendEmail: ${err.stack}`);
  }
}
export async function sendEmailApproveReject(to_email, message) {
  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.SMTP.SERVER,
      port: EMAIL_CONFIG.SMTP.PORT,
      secure: EMAIL_CONFIG.SECURE,
      auth: {
        user: EMAIL_CONFIG.SMTP.USERNAME,
        pass: EMAIL_CONFIG.SMTP.PASSWORD,
      },
    });

    const htmlContent = MAIL_TEMPLATE_APPROVE_REJECT.signup_template
      .replace('{{ emailId }}', to_email)
      .replace('{{ message }}', message);

    const mailOptions = {
      from: EMAIL_CONFIG.SMTP.USERNAME,
      to: to_email,
      subject: MAIL_TEMPLATE_APPROVE_REJECT.signup_subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return { status: 'success', message: 'Mail sent successfully' };
  } catch (error) {
    logger.error(`Error in sendEmailApproveReject: ${error}`)
  }
}
export async function sendEmailWithPdfAttachment(to_email, clientCode, pdfBuffer, message) {
  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.SMTP.SERVER,
      port: EMAIL_CONFIG.SMTP.PORT,
      secure: EMAIL_CONFIG.SECURE,
      auth: {
        user: EMAIL_CONFIG.SMTP.USERNAME,
        pass: EMAIL_CONFIG.SMTP.PASSWORD,
      },
    });

    const htmlContent = MAIL_TEMPLATE_PDF.signup_template
      .replace('{{ emailId }}', to_email)
      .replace('{{ message }}', message);

    const mailOptions = {
      from: EMAIL_CONFIG.SMTP.USERNAME,
      to: to_email,
      subject: MAIL_TEMPLATE_PDF.signup_subject,
      html: htmlContent,
      attachments: [
        {
          filename: `account_closing_${clientCode}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    return { status: 'success', message: 'Mail with PDF attachment sent successfully' };
  } catch (error) {
    logger.error(`Error in sendEmailWithPdfAttachment: ${error}`)
    throw error;
  }
}

// @ts-nocheck
import axios from "axios";
import logger from "../logger/winston.logger.js";

export async function sendSmsApi(mobileNumber, otp, type = null) {
  let message = "";
  let tempId = "";

  // Message templates
  const messages = {
    mobile: `Dear Customer, Kindly proceed to update your Mobile no by using this OTP - ${otp}. For security reasons, ensure you don't share your OTP with anyone. Arham Share`,
    bankUpdate: `Dear Customer, Kindly proceed to update your Bank details by using this OTP - ${otp}. For security reasons, ensure you don't share your OTP with anyone. Arham Share`,
    password: `Dear customer, Your OTP for password reset request is ${otp}. This code will be valid for 5 mins only. Kindly do not share this with anyone. ARHAM SHARE`,
  };

  const tempIds = {
    mobile: process.env.TEMPID_MOBILE,
    bankUpdate: process.env.TEMPID_BANK,
    password: process.env.TEMPID_PASSWORD,
  };

  message = messages[type]
  tempId = tempIds[type]

  const url = `https://onlysms.co.in/api/otp.aspx?UserID=${process.env.USERID}&UserPass=${process.env.USERPASS}&MobileNo=${mobileNumber}&GSMID=${process.env.GSMID}&PEID=${process.env.PEID}&Message=${encodeURIComponent(message)}&TEMPID=${tempId}&UNICODE=TEXT`;


  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    logger.error("Error sending SMS", { error });
  }
}

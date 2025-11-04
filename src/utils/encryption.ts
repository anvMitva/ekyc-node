// @ts-nocheck
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { JWT_CONFIG, ENCRYPTION_CONFIG } from "../config/index.js";

const CONNECT_SECRET_KEY = JWT_CONFIG.SECRET_KEY;
const ALGORITHM = JWT_CONFIG.ALGORITHM;
const ACCESS_TOKEN_EXPIRE_MINUTES = JWT_CONFIG.EXPIRY_TIME;
const KEY = ENCRYPTION_CONFIG.BASE64_16BYTES_KEY;

const WEB_ENCRYPTION_KEY = JWT_CONFIG.WEB_ENCRYPTION_KEY;
const WEB_TOKEN_EXPIRE_MINUTES = JWT_CONFIG.WEB_TOKEN_EXPIRY_TIME;

export function encryptWithJwt(data) {
  try {
    const expiresIn = ACCESS_TOKEN_EXPIRE_MINUTES * 60; // convert min to seconds
    const token = jwt.sign(data, CONNECT_SECRET_KEY, {
      algorithm: ALGORITHM,
      expiresIn,
    });
    return token;
  } catch (error) {
    console.error("Error while encrypting JWT:", error);
    throw new Error("Token generation failed");
  }
}

export function decryptWithJwt(token) {
  try {
    const payload = jwt.verify(token, CONNECT_SECRET_KEY, {
      algorithms: [ALGORITHM],
    });
    return payload; // Decoded data
  } catch (error) {
    console.error("Error while decrypting JWT:", error);
    throw new Error("Token verification failed");
  }
}

export function aesEncrypt(dataToEncrypt, keyHex = KEY) {
  try {
    // Convert hex key to Buffer (16 bytes for AES-128)
    const key = Buffer.from(keyHex, "hex");

    // Create IV (16 bytes of zeros, matching Python implementation)
    const iv = Buffer.alloc(16, 0);

    // Convert input data to Buffer
    const data = Buffer.from(String(dataToEncrypt), "utf-8");

    // Create cipher using AES-128-CBC to match key length
    const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);

    // Enable auto padding (PKCS7 is default in Node.js)
    cipher.setAutoPadding(true);

    // Encrypt data
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Convert to base64url and remove padding
    return encrypted
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
}

export function aesDecrypt(encryptedData, keyHex = KEY) {
  try {
    // Convert hex key to Buffer
    const key = Buffer.from(keyHex, "hex");

    // Create IV (16 bytes of zeros, matching Python implementation)
    const iv = Buffer.alloc(16, 0);

    // Add back base64 padding if needed
    const paddedData =
      encryptedData + "=".repeat((4 - (encryptedData.length % 4)) % 4);

    // Convert from base64url to base64 and then to Buffer
    const ciphertext = Buffer.from(
      paddedData.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    );

    // Create decipher using AES-128-CBC
    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);

    // Enable auto padding
    decipher.setAutoPadding(true);

    // Decrypt data
    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    // Convert to string
    return decrypted.toString("utf-8");
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
}

function pad(data) {
  const blockSize = 16;
  const padLength = blockSize - (data.length % blockSize);
  return Buffer.concat([
    Buffer.from(data, "utf-8"),
    Buffer.alloc(padLength, padLength),
  ]);
}

function unpad(data) {
  const padLength = data[data.length - 1];
  return data.slice(0, -padLength);
}

export function encryptPaymentData(data, key) {
  try {
    const secureKey = Buffer.from(key, "hex");
    const cipher = crypto.createCipheriv("aes-128-ecb", secureKey, null);
    cipher.setAutoPadding(false);
    const encrypted = Buffer.concat([cipher.update(pad(data)), cipher.final()]);
    return encrypted.toString("hex");
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
}

export function decryptPaymentData(encryptedData, key) {
  try {
    const secureKey = Buffer.from(key, "hex");
    const encryptedBuffer = Buffer.from(encryptedData, "hex");
    const decipher = crypto.createDecipheriv("aes-128-ecb", secureKey, null);
    decipher.setAutoPadding(false);
    const decrypted = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final(),
    ]);
    return unpad(decrypted).toString("utf-8");
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

export const getHashPwd = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPwd = async (plainPwd, hashedPwd) => {
  return await bcrypt.compare(plainPwd, hashedPwd);
};

export function encryptWebTokenWithJwt(data) {
  try {
    const expiresIn = WEB_TOKEN_EXPIRE_MINUTES * 60; // convert min to seconds
    const token = jwt.sign(data, WEB_ENCRYPTION_KEY, {
      algorithm: ALGORITHM,
      expiresIn,
    });
    return token;
  } catch (error) {
    console.error("Error while encrypting JWT:", error);
    throw new Error("Token generation failed");
  }
}

// @ts-nocheck
import sharp from 'sharp';
import levenshtein from 'fast-levenshtein';
import _ from "lodash";
import crypto from "crypto";
import fs from "fs"
import path from "path";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { format } from "date-fns";
import { ApiError } from "./ApiError.js";
import logger from "../logger/winston.logger.js";
import nodemailer from 'nodemailer';
import { BANK_ADDITION, BANK_ADDITION_OUTPUT_FILE_PATH, certificate, CWT, jarFile, MAIL_TEMPLATE_PDF, MOBILE, PROFILE_MODIFICATION, PROFILE_MODIFICATION_OUTPUT_FILE_PATH, RESEND_OTP, SEGMENT_ADDITION, SEGMENT_ADDITION_OUTPUT_FILE_PATH, SEND_OTP, SOURCE_MODIFICATION_BANK_PDF, SOURCE_MODIFICATION_EMAIL_PDF, SOURCE_MODIFICATION_MOBILE_PDF, SOURCE_MODIFICATION_SEGMENT_PDF, tick, YES } from '../utils/config.util.js'
import axios from "axios";
import { execFile } from "child_process";
import { promisify } from "util";
import { crmsSequelize } from './dbConnection.js';
import { Sequelize } from 'sequelize';
import { ENCRYPTION_CONFIG, EMAIL_CONFIG, API_URLS, FILE_PATHS, TECHEXCEL_DATABASES } from '../config/index.js';


const ENCRYPTION_KEY = ENCRYPTION_CONFIG.KEY;
const IV_LENGTH = ENCRYPTION_CONFIG.IV_LENGTH;
const ALGORITHM = ENCRYPTION_CONFIG.ALGORITHM;

export const getObjectFromData = (input) => {
  const { COLUMNS, DATA } = input;

  const records = DATA?.map((row) => {
    return COLUMNS?.reduce((acc, column, index) => {
      acc[column] = row[index] === "" ? 0 : row[index];
      return acc;
    }, {});
  });
  return records;
};

export const toLowercaseKeys = (record = {}) => {
  return Object?.keys(record)?.reduce((acc, key) => {
    acc[key?.toLowerCase()] = record[key];
    return acc;
  }, {});
};

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB").replace(/\//g, "-"); // Converts to DD-MM-YYYY format
}

export function getLargeRandomNumber() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

export const formatUptime = (seconds) => {
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export function encryptMessage(message) {
  if (!message) return null;

  try {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create cipher with key and IV
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      iv
    );

    // Encrypt the message
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Combine IV and encrypted message and return as base64 string
    // Format: iv:encrypted
    return Buffer.from(iv.toString('hex') + ':' + encrypted).toString('base64');
  } catch (error) {
    logger.error('Encryption error:', { error: { message: error.message, stack: error.stack } });
    throw new Error('Failed to encrypt message');
  }
}

export function decryptMessage(encryptedMessage) {
  if (!encryptedMessage) return null;

  try {
    // Decode the base64 string
    const buffer = Buffer.from(encryptedMessage, 'base64').toString();

    // Split into IV and encrypted components
    const parts = buffer.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted message format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];

    // Create decipher with key and IV
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      iv
    );

    // Decrypt the message
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    logger.error('Decryption error:', { error: { message: error.message, stack: error.stack } });
    throw new Error('Failed to decrypt message');
  }
}

export function generateOtp() {
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  return generatedOtp
}

export function getPath(configPath, ...directories) {
  let fileName = null;

  // Check if the last argument is a filename (string or object)
  if (typeof directories[directories.length - 1] === 'object' && directories[directories.length - 1]?.fileName) {
    fileName = directories.pop().fileName;
  } else if (typeof directories[directories.length - 1] === 'string' && directories[directories.length - 1].includes('.')) {
    fileName = directories.pop();
  }

  // Final directory path (without file)
  const dirPath = path.resolve(configPath, ...directories);

  // Make sure the directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Return full file path if fileName provided
  return fileName ? path.join(dirPath, fileName) : dirPath;
}

// Helper function to get the path from environment variables
export function getIniPath(pathKey, isAbsolute = true) {
  let directory = pathKey;
  if (isAbsolute) {
    directory = path.resolve(directory);
  }
  return directory;
}

function sanitizeText(text) {
  if (!text) return '';
  return String(text)
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII
    .replace(/\u0000/g, '')       // Remove null chars
    .trim();
}

// Helper function to modify PDF
export async function modifyPdf(page, coordinates, text, font, fontSize = 9) {
  if (typeof text !== 'string') {
    text = text !== undefined && text !== null ? String(text) : '';
  }
  const sanitizedText = sanitizeText(text);

  page.drawText(sanitizedText, {
    x: coordinates[0],
    y: 752 - coordinates[1],
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
}

function insertTb(page, coordinates, text, fontObj, fontSize = 7, color = [24, 27, 62]) {
  const colorFloat = color.map(c => c / 255.0);
  const { height } = page.getSize(); // Get actual PDF height

  page.drawText(text, {
    x: coordinates[0],
    y: height - coordinates[1], // Adjust with dynamic height
    size: fontSize,
    font: fontObj,
    color: rgb(...colorFloat),
  });
}

export async function compressPdf(filePath, targetSizeMB = 10) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new ApiError(404, `File not found: ${filePath}`);
    }

    const fileBuffer = fs.readFileSync(filePath);

    const originalSize = fileBuffer.length;
    const targetSizeBytes = targetSizeMB * 1024 * 1024;

    const isPdf = fileBuffer.slice(0, 4).toString() === '%PDF';
    if (!isPdf) {
      return fileBuffer;
    }

    if (originalSize < targetSizeBytes) {
      return fileBuffer;
    }

    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setProducer('');
    pdfDoc.setSubject('');
    pdfDoc.setCreator('');

    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });

    if (pdfBytes.length < targetSizeBytes) {
      fs.writeFileSync(filePath, pdfBytes);
      return pdfBytes;
    }

    return fileBuffer;

  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError(500, 'Internal Server Error', [error], error.stack);
  }
}

export function validateBankAccNumber(accountNumber) {
  const regex = /^\d{9,18}$/;
  return regex.test(accountNumber);
}

export function validateBankAccType(accountType) {
  const validTypes = ['Saving', 'Current', 'saving', 'current'];
  return validTypes.includes(accountType);
}

export function validateBankAccIfsc(ifscCode) {
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return regex.test(ifscCode);
}

export async function fetchIfscDetails(ifscCode) {
  try {
    const url = `${API_URLS.IFSC}/v1/bank-data?ifsc=${ifscCode}`;
    const response = await axios.get(url);

    if (response.status !== 200) {
      return false;
    }
    return response.data.data;
  } catch (error) {
    console.error('Error while fetching IFSC data:', error);
    return false;
  }
}

export const levenshteinRatio = async (str1, str2) => {
  const distance = levenshtein.get(str1, str2);
  const ratio = 1 - distance / Math.max(str1.length, str2.length);
  return (ratio * 100).toFixed(2); // percent similarity
};

export const preprocessImage = async (imageBuffer, options = {}) => {
  const {
    targetFormat = 'auto', // 'jpeg' | 'png' | 'auto' - auto preserves original format
    quality = 80,
    rotateByExif = true,
  } = options;

  try {
    // Validate input buffer
    if (!imageBuffer || !Buffer.isBuffer(imageBuffer) || imageBuffer.length === 0) {
      throw new ApiError(400, 'Invalid or empty image buffer provided');
    }

    // Check if it's a PDF file - Sharp cannot handle PDFs
    if (imageBuffer.subarray(0, 4).toString() === '%PDF') {
      throw new ApiError(400, 'PDF files are not supported in image preprocessing. Use PDF-specific functions instead.');
    }

    let image;
    try {
      image = sharp(imageBuffer, { failOnError: false });
    } catch (sharpError) {
      logger.error('Error initializing sharp in preprocessImage', {
        error: { message: sharpError.message, stack: sharpError.stack },
        bufferInfo: {
          size: imageBuffer.length,
          firstBytes: imageBuffer.subarray(0, 16).toString('hex')
        }
      });
      throw new ApiError(400, `Error initializing image processor: ${sharpError.message}`, [sharpError], sharpError.stack);
    }

    let metadata;
    try {
      metadata = await image.metadata();

      // Validate that Sharp actually recognized the format
      if (!metadata.format) {
        throw new ApiError(400, 'Unsupported image format - format not recognized by image processor');
      }

      logger.debug('Image metadata retrieved successfully', {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        channels: metadata.channels
      });

    } catch (metadataError) {
      logger.error('Error reading image metadata in preprocessImage', {
        error: { message: metadataError.message, stack: metadataError.stack },
        bufferInfo: {
          size: imageBuffer.length,
          firstBytes: imageBuffer.subarray(0, 16).toString('hex')
        }
      });

      // Check if it's an unsupported format error
      if (metadataError.message.includes('unsupported') || metadataError.message.includes('Input file')) {
        throw new ApiError(400, `Unsupported image format: ${metadataError.message}`);
      }

      throw new ApiError(400, `Error reading image metadata: ${metadataError.message}`, [metadataError], metadataError.stack);
    }

    // Auto-rotate based on EXIF orientation if requested
    if (rotateByExif && metadata.orientation) {
      image = image.rotate();
    }

    // Determine output format
    let outputFormat = targetFormat;
    if (targetFormat === 'auto') {
      outputFormat = metadata.format === 'png' ? 'png' : 'jpeg';
    }

    try {
      let processedImageBuffer;
      if (outputFormat === 'png') {
        processedImageBuffer = await image
          .png({ compressionLevel: 9, adaptiveFiltering: true })
          .toBuffer();
      } else {
        // Default to JPEG
        processedImageBuffer = await image
          .jpeg({ quality, chromaSubsampling: '4:4:4', mozjpeg: true })
          .toBuffer();
      }

      logger.debug('Image processed successfully', {
        originalFormat: metadata.format,
        targetFormat: outputFormat,
        originalSize: imageBuffer.length,
        processedSize: processedImageBuffer.length
      });

      return processedImageBuffer;
    } catch (processError) {
      logger.error('Error processing image buffer in preprocessImage', {
        targetFormat: outputFormat,
        originalFormat: metadata.format,
        error: { message: processError.message, stack: processError.stack }
      });
      throw new ApiError(400, `Error processing image buffer: ${processError.message}`, [processError], processError.stack);
    }

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Unexpected error in preprocessImage', {
      error: { message: error.message, stack: error.stack }
    });
    throw new ApiError(500, `Error processing image: ${error.message}`, [error], error.stack);
  }
};

// Helper function to automatically detect and embed file with correct format (images or PDFs)
export async function embedFileAuto(pdfDoc, fileBuffer) {
  try {
    if (!fileBuffer || !Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
      throw new ApiError(400, 'Invalid or empty file buffer provided');
    }

    // Detect file format by examining file headers (magic bytes)
    const fileType = detectFileType(fileBuffer);
    logger.info('Detected file type for embedding', { fileType, bufferSize: fileBuffer.length });

    // Handle PDF files - return special indicator
    if (fileType === 'pdf') {
      logger.info('PDF file detected, using dedicated PDF handler');
      return await handlePdfFile(pdfDoc, fileBuffer);
    }

    // Handle supported image formats directly
    if (fileType === 'png') {
      try {
        return await pdfDoc.embedPng(fileBuffer);
      } catch (pngError) {
        logger.warn('Direct PNG embed failed, preprocessing', { error: pngError.message });
        const processedBuffer = await preprocessImage(fileBuffer, { targetFormat: 'png' });
        return await pdfDoc.embedPng(processedBuffer);
      }
    }

    if (fileType === 'jpeg') {
      try {
        return await pdfDoc.embedJpg(fileBuffer);
      } catch (jpegError) {
        logger.warn('Direct JPEG embed failed, preprocessing', { error: jpegError.message });
        const processedBuffer = await preprocessImage(fileBuffer, { targetFormat: 'jpeg' });
        return await pdfDoc.embedJpg(processedBuffer);
      }
    }

    // For unsupported image formats, try to convert to JPEG using Sharp
    if (['gif', 'bmp', 'tiff', 'webp'].includes(fileType)) {
      logger.info(`Converting ${fileType} to JPEG for PDF embedding`);
      try {
        const convertedBuffer = await preprocessImage(fileBuffer, { targetFormat: 'jpeg' });
        return await pdfDoc.embedJpg(convertedBuffer);
      } catch (conversionError) {
        logger.error(`Failed to convert ${fileType} to JPEG`, { error: conversionError.message });
        throw new ApiError(400, `Cannot process ${fileType} image format: ${conversionError.message}`);
      }
    }

    // If format is unknown, it might be corrupted or not an image/PDF
    if (fileType === 'unknown') {
      // Log buffer details for debugging
      logger.warn('Unknown file format detected', {
        bufferSize: fileBuffer.length,
        firstBytes: fileBuffer.subarray(0, 16).toString('hex'),
        firstBytesAsText: fileBuffer.subarray(0, 50).toString('utf8').replace(/[^\x20-\x7E]/g, '?')
      });

      // Try to detect if it's text or other non-image content
      const textSample = fileBuffer.subarray(0, 100).toString('utf8', 0, 50);
      if (/^[\x20-\x7E\s]+$/.test(textSample)) { // Printable ASCII characters
        logger.error('File appears to be text content', {
          textSample: textSample.substring(0, 100),
          bufferSize: fileBuffer.length
        });
        throw new ApiError(400, `File appears to be text content, not an image or PDF. Content preview: "${textSample.substring(0, 50)}..."`);
      }

      // Last resort: try Sharp auto-detection with preprocessing, but only for potential images
      logger.warn('Unknown file format, attempting Sharp auto-detection');
      try {
        // First, try to validate if Sharp can handle this buffer at all
        await sharp(fileBuffer, { failOnError: false }).metadata();
        const convertedBuffer = await preprocessImage(fileBuffer, { targetFormat: 'jpeg' });
        return await pdfDoc.embedJpg(convertedBuffer);
      } catch (autoDetectError) {
        logger.error('Sharp auto-detection failed', {
          error: autoDetectError.message,
          bufferStart: fileBuffer.subarray(0, 16).toString('hex'),
          bufferSize: fileBuffer.length
        });
        throw new ApiError(400, 'Unsupported or corrupted file. Please provide a valid PNG, JPEG, GIF, BMP, TIFF, WebP image, or PDF file.');
      }
    }

    throw new ApiError(400, `Unsupported file format: ${fileType}`);

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Error in embedFileAuto', {
      error: { message: error.message, stack: error.stack },
      bufferInfo: fileBuffer ? {
        isBuffer: Buffer.isBuffer(fileBuffer),
        size: fileBuffer.length,
        firstBytes: fileBuffer.subarray(0, 16).toString('hex')
      } : 'null buffer'
    });
    throw new ApiError(400, `Failed to embed file: ${error.message}`, [error], error.stack);
  }
}

// Backward compatibility alias
export const embedImageAuto = embedFileAuto;

export async function insertCheckMark(page, coordinates, tickImageEmbed) {
  const [x, y, height, width] = coordinates; // only use x and y for top-left

  const pageHeight = page.getHeight();
  const drawY = pageHeight - y; // Convert top-left Y to bottom-left origin

  page.drawImage(tickImageEmbed, {
    x,
    y: drawY,
    width: width,
    height: height,
  });
}

/**
 * Generates a coordinate file based on the PDF pages.
 * @param {string} pdfPath - Path to the PDF file
 * @param {string} coordinatesPath - Path where to save the coordinates
 * @param {string|null} type - Optional type to adjust coordinates
 */
export async function generateCoordinatesFile(pdfPath, coordinatesPath, type = null) {
  try {
    // Read the PDF
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const numPages = pdfDoc.getPageCount();

    // Define base coordinates
    let base_x, base_y, base_height, base_width;
    if (type === CWT) {
      [base_x, base_y, base_height, base_width] = [50, 250, 35, 113];
    } else {
      [base_x, base_y, base_height, base_width] = [95, 50, 35, 113];
    }

    // Build the coordinates string
    let coordinatesContent = '';
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const coordinates = `${pageNum}-${base_x},${base_y},${base_height},${base_width};`;
      coordinatesContent += coordinates;
    }

    // Write to file (overwrite)
    fs.writeFileSync(coordinatesPath, coordinatesContent, 'utf8');

  } catch (error) {
    console.error(`Error generating coordinates:`, error);
  }
}

export async function pdfAppendV2(pdfDoc, binaryData) {
  try {
    const isPdf = binaryData.toString('utf8').startsWith('%PDF');

    if (isPdf) {
      const appendedPdf = await PDFDocument.load(binaryData);
      const pages = await pdfDoc.copyPages(appendedPdf, appendedPdf.getPageIndices());
      for (const page of pages) {
        pdfDoc.addPage(page);
      }
      return;
    }

    const A4_WIDTH = 8.27 * 72;
    const A4_HEIGHT = 11.69 * 72;

    const tempPdf = await PDFDocument.load(binaryData);
    const pages = await tempPdf.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();

      const subPdf = await PDFDocument.create();
      const subPage = subPdf.addPage([width, height]);
      subPage.drawPage(page);
      const subPdfBytes = await subPdf.save();

      const renderedImageBuffer = await sharp(subPdfBytes)
        .png()
        .resize({
          width: Math.floor(A4_WIDTH),
          height: Math.floor(A4_HEIGHT),
          fit: 'inside',
        })
        .toBuffer();

      const embeddedImage = await pdfDoc.embedPng(renderedImageBuffer);
      const imgDims = embeddedImage.scale(1);

      const scale = Math.min(A4_WIDTH / imgDims.width, A4_HEIGHT / imgDims.height);
      const newWidth = imgDims.width * scale;
      const newHeight = imgDims.height * scale;
      const xOffset = (A4_WIDTH - newWidth) / 2;
      const yOffset = (A4_HEIGHT - newHeight) / 2;

      const newPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      newPage.drawImage(embeddedImage, {
        x: xOffset,
        y: yOffset,
        width: newWidth,
        height: newHeight,
      });
    }
  } catch (error) {
    console.error('[pdfAppendV2] Error appending PDF:', error);
  }
}

/**
 * Executes a Java command for eSign generation and reads the response XML
 * @param {Object} params Configuration object containing all required parameters
 * @param {string} params.pdfPath Path to the PDF file to be signed
 * @param {string} params.xmlRequestPath Path where XML request will be saved
 * @param {string} params.userCode UAT user code from env
 * @param {string} params.esignUrl Complete eSign response URL including ID
 * @param {string} params.userName Client's name  
 * @param {string} params.userCity Client's city
 * @param {string} params.coordinatesPath Path to coordinates file
 * @param {Object} params.config Optional configuration overrides
 * @returns {Promise<string>} The XML response data
 */
export async function executeJavaCommand({
  pdfPath,
  xmlRequestPath,
  userCode,
  esignUrl,
  userName,
  userCity,
  coordinatesPath, // here we ahev to pass the coordinates file for the signature the whole path not the name only
  config = {}
}) {
  try {
    const defaultConfig = {
      javaPath: FILE_PATHS.JAVA_EXE,
      jarPath: jarFile,
      certPath: certificate,
      tickPath: tick,
      certPassword: '123456',
      tickSize: '15',
      aliasKey: FILE_PATHS.ALIAS_KEY
    };
    const finalConfig = { ...defaultConfig, ...config };
    const command = [
      '-jar',
      finalConfig.jarPath,
      '1',
      '',
      pdfPath,
      userCode,
      '1',
      esignUrl,
      finalConfig.certPath,
      finalConfig.certPassword,
      finalConfig.tickPath,
      finalConfig.tickSize,
      finalConfig.aliasKey,
      userName,
      userCity,
      '', // Empty strings for unused parameters
      '',
      '',
      coordinatesPath
    ];
    const execFileAsync = promisify(execFile);
    await execFileAsync(finalConfig.javaPath, command);
    const xmlData = await fs.promises.readFile(xmlRequestPath, 'utf-8');
    return xmlData;
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError(500, 'Internal Server Error', [error], error.stack);
  }
}

const toCamelCase = str => str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());

export const convertKeysToCamelCase = obj => {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toCamelCase(key),
        convertKeysToCamelCase(value),
      ])
    );
  }
  return obj;
};

export function buildPath(...args) {
  if (args.length < 2) throw new Error('At least one folder and one file name required');
  const fileName = args.pop();
  return fs.existsSync(args[0])
    ? path.join(...args, fileName)
    : path.join(process.cwd(), ...args, fileName);
}


export const clientExistInBranch = async (branchCode, clientCode) => {
  try {
    const results = await crmsSequelize.query(
      `SELECT DISTINCT client_id FROM [crms].dbo.TBL_SALES_KYC WHERE branch_code = ? AND client_id = ?`,
      {
        replacements: [branchCode, clientCode],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    return results && results.length > 0;
  } catch (error) {
    logger.error("Error while checking client exists in branch: ", error);
    throw new ApiError(500, "Internal server error");
  }
};


export function getClientCode(source, queryClientCode, token) {
  const { clientCode: tokenClientCode } = token;
  return source === 'ap' ? queryClientCode : tokenClientCode;
}

export function profModBuildPayload(values = {}) {
  const keys = [
    "Client_ID", "Mobile_No", "Email_ID", "Corr_Address1", "Corr_Address2", "Corr_Address3",
    "Corr_Pincode", "Corr_City", "Corr_State", "Corr_Country", "Reg_Address1", "Reg_Address2",
    "Reg_Address3", "Reg_Pincode", "Reg_City", "Reg_State", "Reg_Country", "Annual_Income",
    "GrossAnnualIncomeDate", "Portfolio_Mkt_value", "Net_Worth_Date", "Application_No",
    "Relationship_EmailId", "Relationship_Mobile", "AADHARCARD", "FATHER_HUSBAND_NAME",
    "SEX", "MARITAL_STATUS", "OCCUPATION", "BIRTH_DATE", "RESI_TEL_NO", "FATCA_DECLARATION",
    "STATMENT_OPTION", "MFT_INTEREST", "MFT_Max_Amount", "MTFCl", "MTFClAuto", "IBT_FLAG",
    "PAYMENT_REQUEST", "REMESHIRE_INTEREST_MTF", "MFT_Scrip_Max_Amount", "MTF_Form_Activation_Dt"
  ];

  return keys.reduce((obj, key) => {
    obj[key] = values[key] || "";
    return obj;
  }, {});
}

// Safe file type detection function
export function detectFileType(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 8) {
    return 'unknown';
  }

  // PDF signature
  if (buffer.subarray(0, 4).toString() === '%PDF') {
    return 'pdf';
  }

  // PNG signature
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))) {
    return 'png';
  }

  // JPEG signatures
  if (buffer.subarray(0, 3).equals(Buffer.from([0xFF, 0xD8, 0xFF]))) {
    return 'jpeg';
  }

  // GIF signatures
  if (buffer.subarray(0, 6).equals(Buffer.from('GIF87a')) ||
    buffer.subarray(0, 6).equals(Buffer.from('GIF89a'))) {
    return 'gif';
  }

  // BMP signature
  if (buffer.subarray(0, 2).equals(Buffer.from('BM'))) {
    return 'bmp';
  }

  // TIFF signatures
  if (buffer.subarray(0, 4).equals(Buffer.from([0x49, 0x49, 0x2A, 0x00])) || // Little endian
    buffer.subarray(0, 4).equals(Buffer.from([0x4D, 0x4D, 0x00, 0x2A]))) { // Big endian
    return 'tiff';
  }

  // WebP signature
  if (buffer.subarray(0, 4).equals(Buffer.from('RIFF')) &&
    buffer.subarray(8, 12).equals(Buffer.from('WEBP'))) {
    return 'webp';
  }

  return 'unknown';
}

// Validate if a file buffer is suitable for image processing
export function isImageBuffer(buffer) {
  const imageFormats = ['png', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'];
  const fileType = detectFileType(buffer);
  return imageFormats.includes(fileType);
}

// Validate if a file buffer is a PDF
export function isPdfBuffer(buffer) {
  return detectFileType(buffer) === 'pdf';
}

// Helper function specifically for handling PDF files
export async function handlePdfFile(pdfDoc, pdfBuffer) {
  try {
    if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
      throw new ApiError(400, 'Invalid or empty PDF buffer provided');
    }

    // Verify it's actually a PDF
    if (pdfBuffer.subarray(0, 4).toString() !== '%PDF') {
      throw new ApiError(400, 'Buffer does not contain a valid PDF file');
    }

    logger.info('Handling PDF file for embedding', {
      bufferSize: pdfBuffer.length
    });

    return {
      type: 'pdf',
      buffer: pdfBuffer,
      embed: async (targetPdfDoc) => {
        try {
          const pdfToAdd = await PDFDocument.load(pdfBuffer);
          const pages = await targetPdfDoc.copyPages(pdfToAdd, pdfToAdd.getPageIndices());
          for (const page of pages) {
            targetPdfDoc.addPage(page);
          }
          logger.info('PDF pages successfully appended', { pagesAdded: pages.length });
          return { type: 'pdf', pagesAdded: pages.length };
        } catch (embedError) {
          logger.error('Error embedding PDF pages', {
            error: { message: embedError.message, stack: embedError.stack }
          });
          throw new ApiError(400, `Failed to embed PDF pages: ${embedError.message}`);
        }
      }
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error('Unexpected error in handlePdfFile', {
      error: { message: error.message, stack: error.stack }
    });
    throw new ApiError(500, `Error handling PDF file: ${error.message}`, [error], error.stack);
  }
}


export const convertObjectKeysToLowerCase = (data) => {
  if (Array.isArray(data)) {
    return data.map(obj =>
      Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v])
      )
    );
  }
  if (typeof data === 'object' && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k.toLowerCase(), v])
    );
  }
  return data;
}

export const parseNumber = (val) => {
  if (val === null || val === undefined || val === "") return 0;
  const strVal = String(val);
  return strVal.includes('.') ? parseFloat(strVal) : parseInt(strVal, 10);
};

/**
 * Generate a unique identifier (UID)
 * @param {string} prefix - Optional prefix for the UID
 * @returns {string} Generated UID
 */
export function generateUid(prefix = 'UID') {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `${prefix}_${timestamp}_${random}`;
}

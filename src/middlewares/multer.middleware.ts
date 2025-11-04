import multer from 'multer';
import type { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request } from 'express';
import type { 
  AllowedMimeType, 
  DestinationCallback, 
  FileNameCallback,
  CustomFileFilter 
} from '../types/multer.js';

// Define storage configuration with dynamic destination
const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: DestinationCallback): void {
    // Define folder based on file type
    const isImage = file.mimetype.startsWith('image/');
    const dest = path.resolve(process.cwd(), 'public', isImage ? 'images' : 'files');

    // Ensure destination exists
    try {
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    } catch (err) {
      cb(err as Error, dest);
    }
  },
  filename: function (req: Request, file: Express.Multer.File, cb: FileNameCallback): void {
    // Get the file extension
    const fileExtension = path.extname(file.originalname);

    // Create a unique file name using Date.now and a random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    // Set the new file name with the original extension
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});

// File filter to allow specific file types
const fileFilter: CustomFileFilter = (req, file, cb) => {
  // Allow image, PDF, CSV and Excel files
  const allowedMimeTypes: readonly AllowedMimeType[] = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedMimeTypes.includes(file.mimetype as AllowedMimeType)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type. Only images, PDFs, and CSVs are allowed.")); // Reject the file
  }
};

// Multer configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // Limit file size to 10 MB
  }
});

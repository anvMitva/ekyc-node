/**
 * Type definitions for multer middleware
 */
import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';

/**
 * Allowed MIME types for file uploads
 */
export type AllowedMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/jpg'
  | 'application/pdf'
  | 'text/csv'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/**
 * File destination type
 */
export type FileDestination = 'images' | 'files';

/**
 * Multer storage callback types
 */
export type DestinationCallback = (error: Error | null, destination: string) => void;
export type FileNameCallback = (error: Error | null, filename: string) => void;

/**
 * File filter function type
 */
export type CustomFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => void;

/**
 * Multer configuration options
 */
export interface MulterConfig {
  fileSize: number; // in bytes
  allowedMimeTypes: readonly AllowedMimeType[];
}

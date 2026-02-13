import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export interface StorageService {
  getPresignedUrl(filename: string, mimeType: string): Promise<{ uploadUrl: string; key: string }>;
  finalizeUpload(key: string): Promise<{ size: number; path: string }>;
}

class LocalStorageService implements StorageService {
  async getPresignedUrl(filename: string, mimeType: string): Promise<{ uploadUrl: string; key: string }> {
    const key = `${uuidv4()}-${filename}`;
    // For local storage, we don't have a real presigned URL.
    // Instead, we return a URL that points to our own upload endpoint if we were doing direct upload,
    // but the spec says "presigned URL for direct upload".
    // Since we can't do direct upload to S3 without S3, we will simulate it.
    // The Client will PUT to this URL.
    // We can implement a generic /api/files/upload/:key endpoint that accepts the body.

    return {
      uploadUrl: `/api/files/upload/${key}`, // This is a relative URL to our own backend
      key: key
    };
  }

  async finalizeUpload(key: string): Promise<{ size: number; path: string }> {
    const filePath = path.join(UPLOADS_DIR, key);
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      path: filePath
    };
  }
}

export const storage = new LocalStorageService();

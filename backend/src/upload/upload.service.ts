import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class UploadService {
  getFileUrl(filename: string): string {
    const port = process.env.PORT || '3000';
    const baseUrl = `http://localhost:${port}`;
    return `${baseUrl}/uploads/${filename}`;
  }

  getFilePath(filename: string): string {
    return join(process.cwd(), 'uploads', filename);
  }
}


import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This is backend for Dreamory Event Apps - backed by NESTJS and Prisma + Supabase PostgreSQL';
  }
}

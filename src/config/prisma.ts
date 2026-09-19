import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

let prisma: PrismaClient;

if (!process.env.DATABASE_URL) {
  logger.warn('DATABASE_URL not set, Prisma disabled');
  prisma = new Proxy({} as PrismaClient, {
    get: () => {
      throw new Error('Database not configured (DATABASE_URL missing)');
    },
  });
} else {
  prisma = new PrismaClient();
}

export { prisma };

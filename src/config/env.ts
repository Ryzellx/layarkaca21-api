import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

export const config = {
  port: process.env.PORT || 3000,
  redisUrl: process.env.REDIS_URL || '',
  lk21BaseUrl: (process.env.LK21_BASE_URL || 'https://tv12.lk21official.cc').replace(/\/$/, ''),
  nodeEnv: process.env.NODE_ENV || 'development'
};

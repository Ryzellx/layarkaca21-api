import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';
import { logger } from '../config/logger';

export const cache = (durationInSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    if (!redis || redis.status === 'disabled') {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await redis.get(key);
      if (cachedResponse) {
        res.setHeader('Content-Type', 'application/json');
        return res.send(cachedResponse);
      } else {
        (res as any).sendResponse = res.send;
        res.send = ((body: any) => {
          redis.set(key, body, 'EX', durationInSeconds);
          return (res as any).sendResponse(body);
        }) as any;
        next();
      }
    } catch (error) {
      logger.error('Cache middleware error', error);
      next();
    }
  };
};

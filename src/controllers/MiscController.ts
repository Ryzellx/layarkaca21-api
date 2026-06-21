import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { redis } from '../config/redis';

export const getTopBoxOffice = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const getComingSoon = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const getNews = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const getTrailers = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const getRecommendations = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const getHealth = async (req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  let cacheStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (e) {}
  
  try {
    if (redis.status === 'ready') cacheStatus = 'connected';
  } catch (e) {}

  res.json({
    success: true,
    status: 'healthy',
    database: dbStatus,
    cache: cacheStatus,
    uptime: process.uptime()
  });
};

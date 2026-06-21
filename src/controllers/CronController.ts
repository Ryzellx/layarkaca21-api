import { Request, Response } from 'express';
import { HomeScraper } from '../scrapers/HomeScraper';
import { logger } from '../config/logger';

export const runCron = async (req: Request, res: Response) => {
  try {
    // Basic protection (optional but recommended in production)
    const authHeader = req.headers.authorization;
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const scraper = new HomeScraper();
    logger.info('Running background refresh for home metadata from Vercel Cron');
    
    await scraper.scrapeHome();
    
    // You can also add other scraping logic here if needed.

    res.status(200).json({ success: true, message: 'Cron job executed successfully' });
  } catch (error) {
    logger.error('Vercel Cron job error', error);
    res.status(500).json({ success: false, message: 'Cron job failed' });
  }
};

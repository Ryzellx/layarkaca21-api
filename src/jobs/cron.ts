import cron from 'node-cron';
import { logger } from '../config/logger';
import { HomeScraper } from '../scrapers/HomeScraper';

export const startCronJobs = () => {
  const scraper = new HomeScraper();

  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    logger.info('Running background refresh for home metadata');
    try {
      await scraper.scrapeHome();
      // Logic to upsert into Prisma DB would go here
    } catch (error) {
      logger.error('Cron job error', error);
    }
  });
  
  logger.info('Cron jobs initialized');
};

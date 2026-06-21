"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const logger_1 = require("../config/logger");
const HomeScraper_1 = require("../scrapers/HomeScraper");
const startCronJobs = () => {
    const scraper = new HomeScraper_1.HomeScraper();
    // Run every 30 minutes
    node_cron_1.default.schedule('*/30 * * * *', async () => {
        logger_1.logger.info('Running background refresh for home metadata');
        try {
            await scraper.scrapeHome();
            // Logic to upsert into Prisma DB would go here
        }
        catch (error) {
            logger_1.logger.error('Cron job error', error);
        }
    });
    logger_1.logger.info('Cron jobs initialized');
};
exports.startCronJobs = startCronJobs;

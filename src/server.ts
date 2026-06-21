import app from './app';
import { config } from './config/env';
import { logger } from './config/logger';
import { startCronJobs } from './jobs/cron';

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  logger.info(`Swagger docs available at http://localhost:${config.port}/api-docs`);
  
  startCronJobs();
});

export default server;

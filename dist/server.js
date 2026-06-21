"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const cron_1 = require("./jobs/cron");
const server = app_1.default.listen(env_1.config.port, () => {
    logger_1.logger.info(`Server running on port ${env_1.config.port} in ${env_1.config.nodeEnv} mode`);
    logger_1.logger.info(`Swagger docs available at http://localhost:${env_1.config.port}/api-docs`);
    (0, cron_1.startCronJobs)();
});
exports.default = server;

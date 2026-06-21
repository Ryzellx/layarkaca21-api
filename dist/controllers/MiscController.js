"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = exports.getRecommendations = exports.getTrailers = exports.getNews = exports.getComingSoon = exports.getTopBoxOffice = void 0;
const prisma_1 = require("../config/prisma");
const redis_1 = require("../config/redis");
const getTopBoxOffice = async (req, res) => {
    res.json({ success: true, data: [] });
};
exports.getTopBoxOffice = getTopBoxOffice;
const getComingSoon = async (req, res) => {
    res.json({ success: true, data: [] });
};
exports.getComingSoon = getComingSoon;
const getNews = async (req, res) => {
    res.json({ success: true, data: [] });
};
exports.getNews = getNews;
const getTrailers = async (req, res) => {
    res.json({ success: true, data: [] });
};
exports.getTrailers = getTrailers;
const getRecommendations = async (req, res) => {
    res.json({ success: true, data: [] });
};
exports.getRecommendations = getRecommendations;
const getHealth = async (req, res) => {
    let dbStatus = 'disconnected';
    let cacheStatus = 'disconnected';
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        dbStatus = 'connected';
    }
    catch (e) { }
    try {
        if (redis_1.redis.status === 'ready')
            cacheStatus = 'connected';
    }
    catch (e) { }
    res.json({
        success: true,
        status: 'healthy',
        database: dbStatus,
        cache: cacheStatus,
        uptime: process.uptime()
    });
};
exports.getHealth = getHealth;

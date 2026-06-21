"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeriesEpisodes = exports.getSeriesSeasons = exports.getSeries = void 0;
const SeriesScraper_1 = require("../scrapers/SeriesScraper");
const scraper = new SeriesScraper_1.SeriesScraper();
const getSeries = async (req, res, next) => {
    try {
        const data = await scraper.scrapeDetail(req.params.id);
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getSeries = getSeries;
const getSeriesSeasons = async (req, res, next) => {
    try {
        const data = await scraper.scrapeDetail(req.params.id);
        res.json({ success: true, data: data.seasons || [] });
    }
    catch (error) {
        next(error);
    }
};
exports.getSeriesSeasons = getSeriesSeasons;
const getSeriesEpisodes = async (req, res, next) => {
    try {
        const data = await scraper.scrapeDetail(req.params.id);
        const episodes = data.seasons ? data.seasons.flatMap((s) => s.episodes || []) : [];
        res.json({ success: true, data: episodes });
    }
    catch (error) {
        next(error);
    }
};
exports.getSeriesEpisodes = getSeriesEpisodes;

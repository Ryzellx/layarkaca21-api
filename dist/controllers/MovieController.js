"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieCast = exports.getMovie = void 0;
const MovieScraper_1 = require("../scrapers/MovieScraper");
const scraper = new MovieScraper_1.MovieScraper();
const getMovie = async (req, res, next) => {
    try {
        const data = await scraper.scrapeDetail(req.params.id);
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getMovie = getMovie;
const getMovieCast = async (req, res, next) => {
    try {
        const data = await scraper.scrapeDetail(req.params.id);
        res.json({ success: true, data: data.cast || [] });
    }
    catch (error) {
        next(error);
    }
};
exports.getMovieCast = getMovieCast;

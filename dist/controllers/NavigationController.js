"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllNavigation = exports.getPopularMenu = exports.getSeriesMenu = exports.getYears = exports.getCountries = exports.getGenres = void 0;
const NavigationScraper_1 = require("../scrapers/NavigationScraper");
const scraper = new NavigationScraper_1.NavigationScraper();
const getGenres = async (req, res, next) => {
    try {
        const data = await scraper.scrapeMenu('Genre');
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getGenres = getGenres;
const getCountries = async (req, res, next) => {
    try {
        const data = await scraper.scrapeMenu('Negara');
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getCountries = getCountries;
const getYears = async (req, res, next) => {
    try {
        const data = await scraper.scrapeMenu('Tahun');
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getYears = getYears;
const getSeriesMenu = async (req, res, next) => {
    try {
        const data = await scraper.scrapeMenu('Series');
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getSeriesMenu = getSeriesMenu;
const getPopularMenu = async (req, res, next) => {
    try {
        const data = await scraper.scrapeMenu('Populer');
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getPopularMenu = getPopularMenu;
const getAllNavigation = async (req, res, next) => {
    try {
        const [genres, countries, years, series, popular] = await Promise.all([
            scraper.scrapeMenu('Genre'),
            scraper.scrapeMenu('Negara'),
            scraper.scrapeMenu('Tahun'),
            scraper.scrapeMenu('Series'),
            scraper.scrapeMenu('Populer')
        ]);
        res.json({
            success: true,
            data: {
                genres,
                countries,
                years,
                series,
                popular
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllNavigation = getAllNavigation;

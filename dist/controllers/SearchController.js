"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const SearchScraper_1 = require("../scrapers/SearchScraper");
const scraper = new SearchScraper_1.SearchScraper();
const search = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ success: false, error: 'Query parameter q is required' });
        }
        const results = await scraper.search(q);
        res.json({
            success: true,
            query: q,
            page: 1,
            total: results.length,
            results
        });
    }
    catch (error) {
        next(error);
    }
};
exports.search = search;

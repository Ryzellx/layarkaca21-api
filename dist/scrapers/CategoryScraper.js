"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryScraper = void 0;
const BaseScraper_1 = require("./BaseScraper");
class CategoryScraper extends BaseScraper_1.BaseScraper {
    async scrapeCategory(path, page = 1) {
        // Determine the url to fetch based on the path. 
        // Examples of path: 'populer', 'komen-terbanyak', 'genre/action', 'country/indonesia', 'year/2023'
        const endpoint = page > 1 ? `/${path}/page/${page}/` : `/${path}/`;
        try {
            const $ = await this.fetchHtml(endpoint);
            const items = [];
            $('article, .item').each((_, el) => {
                const link = $(el).find('a').attr('href');
                const title = $(el).find('h2, .title, .poster-title').text().trim();
                if (link && title && link !== '#' && !title.includes('Kawanfilm')) {
                    const id = link.split('/').filter(Boolean).pop() || '';
                    const img = $(el).find('img');
                    const poster = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src') || img.attr('data-original') || '';
                    const ratingRaw = $(el).find('.rating, .imdb').text().trim();
                    const yearRaw = $(el).find('.year').text().trim();
                    const duration = $(el).find('.duration').text().trim() || null;
                    const genre = $(el).find('meta[itemprop="genre"]').attr('content') || $(el).find('.genre').text().trim() || null;
                    if (id) {
                        items.push({
                            id,
                            slug: id,
                            title,
                            year: parseInt(yearRaw, 10) || null,
                            poster,
                            rating: parseFloat(ratingRaw) || null,
                            duration,
                            genre,
                            type: link.includes('series') ? 'series' : 'movie'
                        });
                    }
                }
            });
            // Pagination info
            const pagination = $('.pagination');
            let totalPages = 1;
            if (pagination.length > 0) {
                const lastPageLink = pagination.find('a.last').attr('href') || pagination.find('a.page-numbers:not(.next)').last().attr('href');
                if (lastPageLink) {
                    const match = lastPageLink.match(/\/page\/(\d+)/);
                    if (match) {
                        totalPages = parseInt(match[1], 10);
                    }
                }
            }
            // Fetch extra details in chunks to avoid overwhelming the server
            const chunkSize = 6;
            for (let i = 0; i < items.length; i += chunkSize) {
                const chunk = items.slice(i, i + chunkSize);
                await Promise.all(chunk.map(async (item) => {
                    const extra = await this.fetchExtraDetails(item.id);
                    Object.assign(item, extra);
                }));
            }
            return {
                page,
                totalPages,
                items
            };
        }
        catch (error) {
            // If 404, it might mean no more pages
            return { page, totalPages: page, items: [] };
        }
    }
}
exports.CategoryScraper = CategoryScraper;

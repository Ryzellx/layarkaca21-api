"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationScraper = void 0;
const BaseScraper_1 = require("./BaseScraper");
class NavigationScraper extends BaseScraper_1.BaseScraper {
    async scrapeMenu(menuName) {
        const $ = await this.fetchHtml('/');
        const items = [];
        // Find the link in the top menu that contains the text
        const menuLink = $(`nav ul li a:contains("${menuName}")`).first();
        if (menuLink.length > 0) {
            menuLink.parent().find('ul li a').each((_, el) => {
                const link = $(el).attr('href');
                const title = $(el).text().trim();
                if (link && title) {
                    // Extract slug from link. Usually looks like 'https://tv11.lk21official.cc/genre/action/'
                    // or '/country/indonesia'
                    const parts = link.split('/').filter(Boolean);
                    const slug = parts[parts.length - 1];
                    items.push({
                        id: slug,
                        name: title,
                        slug: slug
                    });
                }
            });
        }
        return items;
    }
}
exports.NavigationScraper = NavigationScraper;

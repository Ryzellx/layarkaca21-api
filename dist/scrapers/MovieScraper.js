"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieScraper = void 0;
const BaseScraper_1 = require("./BaseScraper");
class MovieScraper extends BaseScraper_1.BaseScraper {
    async scrapeDetail(slug) {
        const $ = await this.fetchHtml(`/${slug}`);
        const title = this.extractText($, 'body', ['h1[itemprop="name"]', 'h1.title', '.movie-title h1', 'h1']);
        const extra = await this.fetchExtraDetails(slug);
        let jsonLdData = {};
        try {
            const scripts = $('script[type="application/ld+json"]').get();
            for (const script of scripts) {
                const json = JSON.parse($(script).text());
                if (json['@type'] === 'Movie' || json['@type'] === 'TVSeries') {
                    jsonLdData = json;
                    break;
                }
            }
        }
        catch (e) { }
        const runtime = this.extractText($, 'body', ['.duration', 'span[itemprop="duration"]']) || null;
        const isSeries = (jsonLdData['@type'] === 'TVSeries') || (runtime && (runtime.startsWith('S.') || runtime.toLowerCase().includes('episode')));
        if (isSeries) {
            const { SeriesScraper } = require('./SeriesScraper');
            const seriesScraper = new SeriesScraper();
            return seriesScraper.scrapeDetail(slug);
        }
        // Extract fields with JSON-LD prioritization
        const description = jsonLdData.description || this.extractText($, 'body', ['div[itemprop="description"]', '.synopsis', '.description p']) || extra.synopsis;
        const poster = jsonLdData.image || this.extractAttr($, 'body', ['.movie-info img', '.detail.hidden img', '.poster img', 'img[itemprop="image"]', '.movie-poster img'], 'src');
        const ratingRaw = this.extractText($, 'body', ['span[itemprop="ratingValue"]', '.imdb-rating', '.rating-value']);
        const rating = jsonLdData.aggregateRating?.ratingValue ? parseFloat(jsonLdData.aggregateRating.ratingValue) : (parseFloat(ratingRaw) || null);
        const yearRaw = this.extractText($, 'body', ['.year a', 'a[href*="/year/"]']);
        const year = jsonLdData.datePublished ? new Date(jsonLdData.datePublished).getFullYear() : (parseInt(yearRaw, 10) || null);
        let genres = [];
        if (jsonLdData.genre) {
            if (Array.isArray(jsonLdData.genre)) {
                genres = jsonLdData.genre;
            }
            else if (typeof jsonLdData.genre === 'string') {
                genres = jsonLdData.genre.split(',').map((s) => s.trim());
            }
        }
        else {
            $('div.content h2, div.detail.hidden p').each((_, el) => {
                if ($(el).text().includes('Genre')) {
                    $(el).parent().find('a[href*="/genre/"]').each((_, a) => { genres.push($(a).text().trim()); });
                }
            });
        }
        let countries = [];
        if (extra.negara) {
            countries.push(extra.negara);
        }
        else {
            $('div.content h2, div.detail.hidden p').each((_, el) => {
                if ($(el).text().includes('Negara')) {
                    $(el).parent().find('a[href*="/country/"], a[href*="/negara/"]').each((_, a) => { countries.push($(a).text().trim()); });
                }
            });
        }
        const cast = Array.isArray(jsonLdData.actor)
            ? jsonLdData.actor.map((a) => a.name)
            : (extra.bintangFilm ? extra.bintangFilm.split(',').map((s) => s.trim()).filter(Boolean) : []);
        const crew = Array.isArray(jsonLdData.director)
            ? jsonLdData.director.map((d) => ({ name: d.name, role: 'Director' }))
            : (extra.sutradara ? [{ name: extra.sutradara, role: 'Director' }] : []);
        const response = {
            id: slug,
            slug: slug,
            title,
            originalTitle: title,
            description,
            year,
            rating,
            runtime,
            status: 'released',
            poster,
            backdrop: poster,
            trailer: this.extractTrailer($),
            genres,
            countries,
            cast,
            crew
        };
        const finalVotes = jsonLdData.aggregateRating?.ratingCount ? String(jsonLdData.aggregateRating.ratingCount) : extra.votes;
        const finalRelease = jsonLdData.datePublished || extra.release;
        if (extra.subtitle)
            response.subtitle = extra.subtitle;
        if (finalVotes)
            response.votes = finalVotes;
        if (finalRelease)
            response.releaseDate = finalRelease;
        if (extra.updated)
            response.updatedAt = extra.updated;
        return response;
    }
}
exports.MovieScraper = MovieScraper;

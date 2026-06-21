"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesScraper = void 0;
const BaseScraper_1 = require("./BaseScraper");
class SeriesScraper extends BaseScraper_1.BaseScraper {
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
        // Delegate to MovieScraper if it's a Movie
        if (jsonLdData['@type'] === 'Movie') {
            const { MovieScraper } = require('./MovieScraper');
            const movieScraper = new MovieScraper();
            return movieScraper.scrapeDetail(slug);
        }
        // Extract fields with JSON-LD prioritization
        const description = jsonLdData.description || extra.synopsis;
        const poster = jsonLdData.image || this.extractAttr($, 'body', ['.movie-info img', '.detail.hidden img', '.poster img', 'img[itemprop="image"]', '.movie-poster img'], 'src');
        const ratingRaw = this.extractText($, 'body', ['span[itemprop="ratingValue"]', '.imdb-rating', '.rating-value']);
        const rating = jsonLdData.aggregateRating?.ratingValue ? parseFloat(jsonLdData.aggregateRating.ratingValue) : (parseFloat(ratingRaw) || null);
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
        const episodes = [];
        // 1. Try standard list elements (avoid matching '.slider' because that matches carousel sliders!)
        $('.episode-list .item, .episodes tr').each((i, el) => {
            episodes.push({
                id: `${slug}-ep-${i + 1}`,
                episodeNumber: i + 1,
                seasonNumber: 1,
                title: $(el).text().trim() || `Episode ${i + 1}`,
                rating: null,
                thumbnail: $(el).find('img').attr('src') || poster,
                airDate: null
            });
        });
        // 2. If no episodes found (redirected/mirror layout), parse latest episode from href links and generate list
        if (episodes.length === 0) {
            let maxEpisodeNumber = 0;
            let episodePrefix = '';
            let episodeSuffix = '';
            $('a').each((_, el) => {
                const href = $(el).attr('href') || '';
                const match = href.match(/^(.*-season-(\d+)-episode-)(\d+)(.*)$/i);
                if (match) {
                    const epNum = parseInt(match[3], 10);
                    if (epNum > maxEpisodeNumber) {
                        maxEpisodeNumber = epNum;
                        episodePrefix = match[1];
                        episodeSuffix = match[4];
                    }
                }
            });
            if (maxEpisodeNumber > 0) {
                for (let i = 1; i <= maxEpisodeNumber; i++) {
                    episodes.push({
                        id: `${slug}-ep-${i}`,
                        episodeNumber: i,
                        seasonNumber: 1,
                        title: `Episode ${i}`,
                        rating: null,
                        thumbnail: poster,
                        airDate: null
                    });
                }
            }
        }
        const response = {
            id: slug,
            slug: slug,
            title,
            description,
            rating,
            poster,
            backdrop: poster,
            trailer: this.extractTrailer($),
            genres,
            countries,
            cast,
            crew,
            totalSeasons: 1,
            totalEpisodes: episodes.length,
            seasons: [
                {
                    id: `season_1`,
                    seasonNumber: 1,
                    name: "Season 1",
                    episodeCount: episodes.length,
                    poster,
                    episodes
                }
            ]
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
exports.SeriesScraper = SeriesScraper;

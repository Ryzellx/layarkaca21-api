const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('home.html', 'utf8');
const $ = cheerio.load(html);

const sliderLists = $('.sliders');
const results = {
    latestMovies: [],
    latestSeries: [],
    popularMovies: [],
    recommendations: []
};

const extract = (ul) => {
    const items = [];
    $(ul).find('li').each((_, el) => {
        const link = $(el).find('a').attr('href');
        const title = $(el).find('.poster-title').text().trim() || $(el).find('h2, .title').text().trim();
        const poster = $(el).find('img').attr('src');
        const rating = $(el).find('.rating, .imdb').text().trim();
        if (link && title) {
            const slug = link.split('/').filter(Boolean).pop();
            items.push({ title, slug, poster, rating, link });
        }
    });
    return items;
};

results.latestMovies = extract(sliderLists.eq(2));     // "TERBARU" maps to index 2 
results.latestSeries = extract(sliderLists.eq(3));     // "SERIES UNGGULAN"
results.popularMovies = extract(sliderLists.eq(6));    // "TERPOPULER"
results.recommendations = extract(sliderLists.eq(11)); // "REKOMENDASI" maybe? We saw 17 sliders.

console.log("latestMovies:", results.latestMovies.length);
console.log("latestSeries:", results.latestSeries.length);
console.log("popularMovies:", results.popularMovies.length);
console.log("recommendations:", results.recommendations.length);

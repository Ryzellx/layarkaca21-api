const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-season-1-episode-1-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('Title:', $('h1').text().trim());
    console.log('IMDb rating or rating elements:');
    console.log('span[itemprop="ratingValue"]:', $('span[itemprop="ratingValue"]').text());
    console.log('.imdb-rating:', $('.imdb-rating').text());
    console.log('.rating-value:', $('.rating-value').text());
    
    console.log('JSON-LD:');
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const json = JSON.parse($(el).text());
            console.log(JSON.stringify(json, null, 2));
        } catch(e) {}
    });
}
test();

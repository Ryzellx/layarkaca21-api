const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://tv11.lk21official.cc/mortal-kombat-ii-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- rating elements ---');
    console.log('span[itemprop="ratingValue"]:', $('span[itemprop="ratingValue"]').text());
    console.log('.imdb-rating:', $('.imdb-rating').text());
    console.log('.rating-value:', $('.rating-value').text());
    console.log('div.rating:', $('div.rating').text());
    
    console.log('JSON-LD rating:');
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const json = JSON.parse($(el).text());
            if (json.aggregateRating) {
                console.log(json.aggregateRating);
            }
        } catch(e) {}
    });
}
test();

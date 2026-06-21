const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('JSON-LD:');
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const json = JSON.parse($(el).text());
            console.log(JSON.stringify(json, null, 2));
        } catch(e) {}
    });

    console.log('Meta rating tags:');
    console.log($('meta[itemprop="ratingValue"]').attr('content'));
    console.log($('span[itemprop="ratingValue"]').text());
    console.log($('.rating').text());
}
test();

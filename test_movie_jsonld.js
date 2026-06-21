const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://tv11.lk21official.cc/mortal-kombat-ii-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const json = JSON.parse($(el).text());
            console.log(JSON.stringify(json, null, 2));
        } catch(e) {}
    });
}
test();

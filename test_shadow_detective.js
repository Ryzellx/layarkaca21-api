const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/shadow-detective-2022', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- Links with episode ---');
    $('a').each((i, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr('href');
        if (href && href.includes('-episode-')) {
            console.log(text, '->', href);
        }
    });
}
test();

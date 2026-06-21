const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- Printing all links on the page ---');
    $('a').each((i, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr('href');
        if (text.toLowerCase().includes('episode') || (href && href.includes('episode')) || text.match(/^\d+$/)) {
            console.log(text, '->', href);
        }
    });
}
test();

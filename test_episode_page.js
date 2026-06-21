const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-season-1-episode-1-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- Links with episode on Episode 1 page ---');
    $('a').each((i, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr('href');
        if (href && href.includes('-episode-')) {
            console.log(text, '->', href);
        }
    });
}
test();

const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    // Find elements containing "Release"
    $('*').each((_, el) => {
        if ($(el).children().length === 0 && $(el).text().includes('Release')) {
            console.log('Found Release in:', el.tagName, $(el).parent().html().trim());
        }
    });
}
test();

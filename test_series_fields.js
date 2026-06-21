const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- Checking all paragraphs in div.detail ---');
    $('div.detail p').each((_, el) => {
        console.log($(el).text().trim());
    });
    console.log('--- Checking all h2 in div.content ---');
    $('div.content h2').each((_, el) => {
        console.log($(el).text().trim());
    });
}
test();

const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    // Find all links containing "/episode/"
    console.log('--- links with /episode/ ---');
    $('a[href*="/episode/"]').each((i, el) => {
        console.log($(el).text().trim(), '->', $(el).attr('href'));
    });
}
test();

const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- Checking select elements ---');
    $('select').each((i, el) => {
        console.log(`Select ${i + 1}: class=${$(el).attr('class')}, id=${$(el).attr('id')}`);
        $(el).find('option').each((j, opt) => {
            console.log(`  Option ${j + 1}: val=${$(opt).attr('value')}, text=${$(opt).text().trim()}`);
        });
    });
}
test();

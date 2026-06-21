const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- Checking episode list elements ---');
    console.log('Class count of .episode-list .item:', $('.episode-list .item').length);
    console.log('Class count of .episodes tr:', $('.episodes tr').length);
    console.log('Class count of .slider:', $('.slider').length);
    
    console.log('Printing first 3 elements of .episode-list .item:');
    $('.episode-list .item').slice(0, 3).each((i, el) => {
        console.log(`Element ${i + 1}:`, $(el).html().trim());
    });
    
    console.log('Printing first 3 elements of .episodes tr:');
    $('.episodes tr').slice(0, 3).each((i, el) => {
        console.log(`Element ${i + 1}:`, $(el).html().trim());
    });
}
test();

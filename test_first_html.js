const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://tv11.lk21official.cc/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- HTML of first 3 slider-wrapper structures ---');
    $('.slider-wrapper').slice(0, 3).each((i, el) => {
        console.log(`Index ${i}:`);
        console.log($(el).parent().html().substring(0, 300));
        console.log('---');
    });
}
test();

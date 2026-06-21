const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://tv11.lk21official.cc/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- Checking first 3 slider-wrappers ---');
    $('.slider-wrapper').slice(0, 4).each((i, el) => {
        const prev = $(el).prev();
        console.log(`Index ${i}: prevTag=${prev.prop('tagName')} prevClass=${prev.attr('class')} prevText="${prev.text().trim()}"`);
    });
}
test();

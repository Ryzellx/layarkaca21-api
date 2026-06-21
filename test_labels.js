const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://tv11.lk21official.cc/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- Printing all slider-wrapper aria-labels and IDs ---');
    $('.slider-wrapper').each((i, el) => {
        const label = $(el).attr('aria-label');
        const id = $(el).find('.sliders').attr('id');
        const headerText = $(el).prev('.header').text().trim();
        console.log(`Index ${i}: label="${label}" id="${id}" headerText="${headerText}"`);
    });
}
test();

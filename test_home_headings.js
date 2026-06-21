const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://tv11.lk21official.cc/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- Sliders Headings ---');
    $('.sliders').each((i, el) => {
        const heading = $(el).parent().find('h1, h2, h3, h4, .title-section, .section-title').text().trim();
        console.log(`Index ${i}: heading="${heading}"`);
    });
}
test();

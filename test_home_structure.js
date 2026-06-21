const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://tv11.lk21official.cc/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- Checking parent elements of .sliders ---');
    $('.sliders').each((i, el) => {
        // Find previous header or element before the slider container
        const prevH2 = $(el).prev('h2').text().trim() || $(el).parent().find('h2').first().text().trim();
        const prevH3 = $(el).prev('h3').text().trim();
        console.log(`Index ${i}: prevH2="${prevH2}" prevH3="${prevH3}" parentTag=${el.parent.tagName} parentClass=${$(el).parent().attr('class')}`);
    });
}
test();

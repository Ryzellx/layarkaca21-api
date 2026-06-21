const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- Printing all classes of the matched .slider elements ---');
    $('.slider').each((i, el) => {
        console.log(`Element ${i + 1}: tagName=${el.tagName}, class=${$(el).attr('class')}, id=${$(el).attr('id')}`);
        // print parent class
        console.log(`  parent: tagName=${$(el).parent()[0]?.tagName}, class=${$(el).parent().attr('class')}`);
    });
}
test();

const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    // Find all images containing "teach-you-lesson" in their src or data-src
    $('img').each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src') || '';
        if (src.includes('teach-you-lesson')) {
            console.log('Found main image tag:', el.tagName);
            console.log('parent class:', $(el).parent().attr('class'));
            console.log('grandparent class:', $(el).parent().parent().attr('class'));
            console.log('all attributes:', el.attribs);
        }
    });
}
test();

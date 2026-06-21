const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    const selectors = ['.movie-info img', '.detail.hidden img', '.poster img', 'img[itemprop="image"]'];
    for (const sel of selectors) {
        const el = $('body').find(sel).first();
        let val = el.attr('src');
        if (!val) {
            val = el.attr('data-src') || el.attr('data-lazy-src') || el.attr('data-original');
        }
        console.log(sel, '->', val);
    }
}
test();

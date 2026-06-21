const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- IMAGES ---');
    $('img').each((_, el) => {
        console.log({
            src: $(el).attr('src'),
            'data-src': $(el).attr('data-src'),
            class: $(el).attr('class'),
            alt: $(el).attr('alt'),
            parentClass: $(el).parent().attr('class'),
            grandParentClass: $(el).parent().parent().attr('class')
        });
    });

    console.log('--- rating elements ---');
    $('*').each((_, el) => {
        const text = $(el).text().trim();
        if (text.includes('Rating') || text.includes('IMDb') || $(el).attr('class')?.includes('rating') || $(el).attr('class')?.includes('imdb')) {
            if ($(el).children().length === 0) {
                console.log(el.tagName, $(el).attr('class'), text);
            }
        }
    });
}
test();

const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    console.log('--- Finding wrapper for episode links ---');
    $('a').each((i, el) => {
        const href = $(el).attr('href') || '';
        if (href.includes('-episode-')) {
            console.log('Link:', $(el).text().trim(), '->', href);
            let parent = $(el).parent();
            let path = [];
            while (parent.length > 0) {
                path.push(parent[0].tagName + (parent.attr('class') ? '.' + parent.attr('class').split(' ').join('.') : '') + (parent.attr('id') ? '#' + parent.attr('id') : ''));
                parent = parent.parent();
            }
            console.log('Ancestry:', path.reverse().join(' > '));
        }
    });
}
test();

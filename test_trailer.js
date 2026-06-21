const axios = require('axios');
const cheerio = require('cheerio');

async function checkTrailer(url) {
    try {
        const r = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(r.data);
        
        console.log(`\n--- Trailer Check for ${url} ---`);
        
        // Look for buttons or links with 'trailer'
        $('a, button').each((i, el) => {
            const text = $(el).text().toLowerCase();
            const href = $(el).attr('href');
            if (text.includes('trailer') || (href && href.includes('trailer'))) {
                console.log(`Found Trailer Link: text="${text}" href="${href}" class="${$(el).attr('class')}" id="${$(el).attr('id')}"`);
            }
        });

        // Look for iframes with youtube
        $('iframe').each((i, el) => {
            const src = $(el).attr('src');
            if (src && (src.includes('youtube') || src.includes('youtu.be'))) {
                console.log(`Found YouTube iframe: src="${src}" class="${$(el).attr('class')}" id="${$(el).attr('id')}"`);
            }
        });
        
        // Look for any elements with id or class containing trailer
        $('[id*="trailer"], [class*="trailer"]').each((i, el) => {
            console.log(`Found Element by ID/Class: tagName=${el.tagName} id="${$(el).attr('id')}" class="${$(el).attr('class')}" html=${$(el).html().substring(0, 100)}`);
        });

    } catch (e) {
        console.log('Error:', e.message);
    }
}

async function run() {
    await checkTrailer('https://tv11.lk21official.cc/mortal-kombat-ii-2026');
    await checkTrailer('https://tv11.lk21official.cc/teach-you-lesson-2026'); // Redirects to series domain
    await checkTrailer('https://series.lk21.de/teach-you-lesson-2026');
}
run();

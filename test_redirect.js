const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    // Top series are usually on the series-terbaru endpoint, but let's just fetch popular
    const r1 = await axios.get('https://tv11.lk21official.cc/populer', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $1 = cheerio.load(r1.data);
    let seriesUrl = null;
    $1('article a').each((_, el) => {
        const href = $1(el).attr('href');
        if (href && href.includes('series')) {
            seriesUrl = href;
        }
    });

    if (!seriesUrl) {
        console.log('No series found');
        return;
    }

    console.log('Fetching series:', seriesUrl);
    const r2 = await axios.get(seriesUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $2 = cheerio.load(r2.data);
    
    // Check if it's a redirect page
    const btn = $2('a:contains("Buka Sekarang"), a:contains("Nontondrama")');
    if (btn.length > 0) {
        console.log('Redirect button found:', btn.attr('href'));
        
        // Fetch target
        const r3 = await axios.get(btn.attr('href'), { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $3 = cheerio.load(r3.data);
        console.log('Target title:', $3('h1').text());
        console.log('Target synopsis:', $3('div.synopsis.collapsed').text().trim());
    } else {
        console.log('No redirect button found, maybe it is direct?');
        console.log('Title:', $2('h1').text());
    }
}
test();

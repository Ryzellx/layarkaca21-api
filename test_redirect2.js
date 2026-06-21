const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://tv11.lk21official.cc/drakor/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    let href = $('article a').first().attr('href');
    if (!href) return;
    
    if (href.startsWith('/')) href = 'https://tv11.lk21official.cc' + href;
    
    console.log('Fetching:', href);
    const r2 = await axios.get(href, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $2 = cheerio.load(r2.data);
    
    const btn = $2('a.button, a:contains("Buka Sekarang"), a:contains("Nontondrama")');
    if (btn.length) {
        console.log('Redirect:', btn.attr('href'));
        try {
            const r3 = await axios.get(btn.attr('href'), { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const $3 = cheerio.load(r3.data);
            console.log('Target title:', $3('h1').text());
            console.log('Target HTML length:', r3.data.length);
            console.log('Target Content test:', $3('.synopsis').text().trim());
        } catch (e) {
            console.log('Error fetching target:', e.message);
        }
    } else {
        console.log('Direct title:', $2('h1').text());
    }
}
test();

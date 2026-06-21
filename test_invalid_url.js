const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    try {
        const r = await axios.get('https://tv11.lk21official.cc/shadow-detective', { 
            headers: { 'User-Agent': 'Mozilla/5.0' },
            maxRedirects: 5
        });
        console.log('Status Code:', r.status);
        console.log('Final URL:', r.request.res.responseUrl);
        const $ = cheerio.load(r.data);
        console.log('Title:', $('title').text().trim());
        console.log('H1:', $('h1').text().trim());
    } catch(e) {
        console.log('Error:', e.message);
    }
}
test();

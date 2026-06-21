const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://tv11.lk21official.cc/drakor/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    const links = [];
    $('article, .item').each((_, el) => {
        links.push($(el).find('a').attr('href'));
    });
    console.log(links.slice(0, 5));
}
test();

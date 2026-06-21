const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://series.lk21.de/teach-you-lesson-2026', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = cheerio.load(r.data)('body').text();
    console.log('Includes Release:', text.includes('Release'));
    console.log('Includes Updated:', text.includes('Updated'));
    console.log('Includes Subtitle:', text.includes('Subtitle'));
    console.log('Includes Votes:', text.includes('Votes'));
    
    // Check if there are other metadata containers
    const $ = cheerio.load(r.data);
    console.log('--- checking .info ---');
    console.log($('.info').text().trim());
}
test();

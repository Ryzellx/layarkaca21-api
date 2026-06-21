const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('home.html', 'utf8');
const $ = cheerio.load(html);

const sliderLists = $('.sliders');
const map = [];

sliderLists.each((i, ul) => {
    // Look for the nearest preceding heading
    let prev = $(ul).parent().prev();
    let title = '';
    
    // Sometimes it's wrapped in something else, try to find text
    if (prev.length) {
        title = prev.text().trim();
    }
    
    if (!title) {
        // Try to find a header sibling or parent header
        title = $(ul).closest('.row, .section').find('h2, h3, .title').first().text().trim();
    }
    
    map.push({ index: i, title: title.replace(/\n/g, '').substring(0, 50) });
});

console.log(map);

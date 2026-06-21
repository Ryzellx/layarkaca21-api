const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('home.html', 'utf8');
const $ = cheerio.load(html);

const sliderLists = $('.sliders');
console.log("Total sliders lists:", sliderLists.length);

sliderLists.each((i, ul) => {
    const firstLi = $(ul).find('li').first();
    const title = firstLi.find('.poster-title, h2, .title').text().trim();
    console.log(`Slider ${i} first item:`, title);
});

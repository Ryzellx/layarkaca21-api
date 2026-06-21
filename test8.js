const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('home.html', 'utf8'));
const el = $('.sliders').eq(2).find('li').first();
console.log('HTML:', $.html(el));
console.log('Year text:', el.find('.year, a[href*="/year/"]').text().trim());

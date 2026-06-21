const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('detail.html', 'utf8');
const $ = cheerio.load(html);

$('div.detail.hidden p').each((_,el) => console.log($(el).text()));
console.log('---');
console.log('Genre:', $('meta[itemprop="genre"]').attr('content') || $('.genre').text().trim());
console.log('Duration:', $('span[itemprop="duration"]').text() || $('.duration').text().trim());

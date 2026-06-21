const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('detail.html', 'utf8');
const $ = cheerio.load(html);

console.log($('h1').text());
console.log($('.content h2').map((_, el) => $(el).text()).get());
console.log($('blockquote').text());
console.log($('div[itemprop="description"]').text());

const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('populer.html', 'utf8');
const $ = cheerio.load(html);
fs.writeFileSync('test_article.html', $('article').first().html());

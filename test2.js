const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('home.html', 'utf8');
const $ = cheerio.load(html);
const result = [];
$('article, .item, .post, .movie, .grid, .poster, li').slice(0, 5).each((i, el) => {
    result.push({
        class: $(el).attr('class'),
        id: $(el).attr('id'),
        html: $.html(el).substring(0, 150)
    });
});
console.log(JSON.stringify(result, null, 2));

const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('home.html', 'utf8');
const $ = cheerio.load(html);

const getMenu = (selector) => {
    const items = [];
    $(selector).parent().find('ul.sub-menu li a, ul.dropdown-menu li a').each((_, el) => {
        items.push({
            title: $(el).text().trim(),
            link: $(el).attr('href')
        });
    });
    return items;
};

console.log("=== GENRE ===");
console.log($('a:contains("Genre")').parent().find('ul li a').map((_, el) => $(el).text().trim()).get());

console.log("=== SERIES ===");
console.log($('a:contains("Series")').parent().find('ul li a').map((_, el) => $(el).text().trim()).get());

console.log("=== POPULER ===");
console.log($('a:contains("Populer")').parent().find('ul li a').map((_, el) => $(el).text().trim()).get());

console.log("=== NEGARA ===");
console.log($('a:contains("Negara")').parent().find('ul li a').map((_, el) => $(el).text().trim()).get());

console.log("=== TAHUN ===");
console.log($('a:contains("Tahun")').parent().find('ul li a').map((_, el) => $(el).text().trim()).get());

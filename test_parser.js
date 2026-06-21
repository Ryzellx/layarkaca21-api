const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('detail.html', 'utf8');
const $ = cheerio.load(html);

const genres = [];
$('div.content h2').each((_, el) => {
    if ($(el).text().includes('Genre')) {
        $(el).parent().find('a').each((_, a) => genres.push($(a).text().trim()));
    }
});

const countries = [];
$('div.content h2').each((_, el) => {
    if ($(el).text().includes('Negara')) {
        $(el).parent().find('a').each((_, a) => countries.push($(a).text().trim()));
    }
});

console.log('Genres:', genres);
console.log('Countries:', countries);

// Let's also check for schema.org JSON-LD
const scripts = $('script[type="application/ld+json"]').get();
for (let script of scripts) {
    try {
        const json = JSON.parse($(script).text());
        if (json['@type'] === 'Movie') {
            console.log('JSON-LD Genre:', json.genre);
            console.log('JSON-LD Country:', json.countryOfOrigin);
        }
    } catch (e) {}
}


const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('home.html', 'utf8');
const $ = cheerio.load(html);

const link = $('a[href*="blades-guardians"]');
if (link.length) {
    const parent1 = link.parent();
    const parent2 = parent1.parent();
    const parent3 = parent2.parent();
    console.log("PARENT 1 HTML:", $.html(parent1));
    console.log("PARENT 1 CLASS:", parent1.attr('class'));
    console.log("PARENT 2 CLASS:", parent2.attr('class'));
    console.log("PARENT 3 CLASS:", parent3.attr('class'));
} else {
    console.log("NOT FOUND");
}

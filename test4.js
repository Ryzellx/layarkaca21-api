const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('home.html', 'utf8');
const $ = cheerio.load(html);

console.log("Analyzing movie elements...");
const elements = [];
$('a[href*="/blades-guardians"]').each((i, el) => {
    let parent = $(el).parent();
    while (parent.length && !['body', 'html'].includes(parent.prop('tagName').toLowerCase())) {
        elements.push({
            tagName: parent.prop('tagName'),
            class: parent.attr('class'),
            id: parent.attr('id')
        });
        parent = parent.parent();
    }
});

console.log("PARENT CHAIN FOR Blades of Guardians:");
console.log(elements);

// Let's print out what the nearest container that holds multiple movies looks like.
console.log("Looking for grids...");
$('.grid, .grid-container, .row, ul, #grid-wrapper').each((i, el) => {
    const cls = $(el).attr('class');
    const id = $(el).attr('id');
    const kids = $(el).children().length;
    if (kids > 5) {
         console.log(`FOUND CONTAINER: <${$(el).prop('tagName')} class="${cls}" id="${id}"> with ${kids} children`);
         console.log(`First child class: ${$(el).children().first().attr('class')} tag: ${$(el).children().first().prop('tagName')}`);
    }
});

const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('detail.html', 'utf8');
const $ = cheerio.load(html);

const synopsis = $('div.synopsis.collapsed').text().trim();
const detailHidden = $('div.detail.hidden').text().trim();

// To recreate the exact text block:
let combined = synopsis + '\n';
$('div.detail.hidden p').each((_, el) => {
  combined += $(el).text() + '\n\n';
});

console.log(combined.trim());

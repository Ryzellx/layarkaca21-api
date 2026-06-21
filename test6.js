const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('home.html', 'utf8');
const $ = cheerio.load(html);

const items = [];
$('li').each((i, el) => {
   const link = $(el).find('a').attr('href');
   if (link && !link.includes('/genre') && !link.includes('/country') && !link.includes('/year') && !link.includes('page=') && link.length > 5) {
       const title = $(el).find('.poster-title, h2, .title, strong').text().trim();
       const poster = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
       const slug = link.split('/').filter(Boolean).pop();
       if (title && slug && !title.includes('LAINNYA')) {
           items.push({ title, slug, poster });
       }
   }
});
console.log("Total extracted items:", items.length);
console.log(items.slice(0, 3));

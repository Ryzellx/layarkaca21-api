const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://tv11.lk21official.cc/', { headers: { 'User-Agent': 'Mozilla/5.0' } })
  .then(r => {
    const $ = cheerio.load(r.data);
    const items = [];
    $('*').each((i, el) => {
      const cls = $(el).attr('class');
      if (cls && (cls.includes('item') || cls.includes('movie') || cls.includes('post') || cls.includes('grid'))) {
         items.push({
           class: cls,
           id: $(el).attr('id'),
           html: $(el).html().substring(0, 100).replace(/\n/g, '')
         });
      }
    });
    console.log(JSON.stringify(items.slice(0, 20), null, 2));
    
    // Also try to find actual links
    const links = [];
    $('a[href*="lk21official.cc"]').each((i, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr('href');
        if (text && href && !href.includes('/genre') && !href.includes('/country') && !href.includes('/year')) {
            links.push({ text, href, parentClass: $(el).parent().attr('class') });
        }
    });
    console.log("LINKS", links.slice(0, 20));
  })
  .catch(console.error);

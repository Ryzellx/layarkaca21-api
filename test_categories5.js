const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeCategory(url) {
  const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }});
  const $ = cheerio.load(data);
  const items = [];
  
  $('.item').each((_, el) => {
    const title = $(el).find('h2, .title').text().trim() || $(el).find('.poster-title').text().trim() || $(el).find('img').attr('alt');
    const link = $(el).find('a').attr('href');
    const poster = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
    const ratingRaw = $(el).find('.rating').text().trim();
    const id = link ? link.split('/').filter(Boolean).pop() : '';
    
    if (id) {
      items.push({ id, title, link, poster, ratingRaw });
    }
  });

  console.log(`Found ${items.length} items from ${url}`);
  if (items.length > 0) console.log(items[0]);
}

async function test() {
  await scrapeCategory('https://tv11.lk21official.cc/populer/');
  await scrapeCategory('https://tv11.lk21official.cc/genre/action/');
  await scrapeCategory('https://tv11.lk21official.cc/country/indonesia/');
}

test();

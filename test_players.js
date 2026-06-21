const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
  const { data } = await axios.get('https://tv11.lk21official.cc/the-avengers-2012/');
  const $ = cheerio.load(data);
  
  const providers = [];
  $('ul li a').each((i, el) => {
    const text = $(el).text().trim().toUpperCase();
    if(text === 'P2P' || text === 'TURBOVIP' || text === 'CAST' || text === 'HYDRAX') {
      providers.push({
        provider: text,
        href: $(el).attr('href'),
      });
    }
  });

  console.log('Providers:', providers);
}
test().catch(console.error);

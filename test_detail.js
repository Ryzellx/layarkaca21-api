const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeDetails(url) {
  const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }});
  const $ = cheerio.load(data);
  
  const synopsis = $('blockquote').text().trim();
  let sutradara = '';
  let bintangFilm = '';
  let negara = '';
  let votes = '';
  let release = '';
  let updated = '';
  let subtitle = '';

  $('h2').each((_, el) => {
    const text = $(el).text();
    if (text.includes('Sutradara:')) sutradara = text.replace('Sutradara:', '').trim();
    if (text.includes('Bintang Film:')) bintangFilm = text.replace('Bintang Film:', '').trim();
    if (text.includes('Negara:')) negara = text.replace('Negara:', '').trim();
    if (text.includes('Release:')) release = text.replace('Release:', '').trim();
    if (text.includes('Updated:')) updated = text.replace('Updated:', '').trim();
  });
  
  const ratingDiv = $('.imdb-rating, .rating-value, span[itemprop="aggregateRating"]');
  votes = ratingDiv.find('meta[itemprop="ratingCount"]').attr('content') || '';

  console.log({
    synopsis, sutradara, bintangFilm, negara, release, updated, votes
  });
}

scrapeDetails('https://tv11.lk21official.cc/mortal-kombat-ii-2026');

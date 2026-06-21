const axios = require('axios');
const cheerio = require('cheerio');

async function checkStreams() {
  const { data } = await axios.get('https://tv11.lk21official.cc/the-avengers-2012/');
  const $ = cheerio.load(data);
  
  const gantiPlayerDiv = $('ul.muvipro_player_content_nav');
  console.log('Ganti Player Nav:', gantiPlayerDiv.html());

  const playerContainer = $('#player-area');
  console.log('Player Area:', playerContainer.html());
  
  const muviproPlayer = $('#muvipro_player_content_id');
  console.log('muvipro_player_content_id:', muviproPlayer.html());
}

checkStreams().catch(console.error);

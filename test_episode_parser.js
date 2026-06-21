const axios = require('axios');
const cheerio = require('cheerio');

async function test(slug) {
    const r = await axios.get(`https://series.lk21.de/${slug}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    const episodes = [];
    
    // 1. Try standard list elements
    $('.episode-list .item, .episodes tr').each((i, el) => {
      episodes.push({
        id: `${slug}-ep-${i + 1}`,
        episodeNumber: i + 1,
        seasonNumber: 1,
        title: $(el).text().trim() || `Episode ${i + 1}`,
        rating: null,
        thumbnail: '',
        airDate: null
      });
    });

    // 2. If no episodes found (redirected/mirror layout), try parsing latest episode url and generating list
    if (episodes.length === 0) {
      let maxEpisodeNumber = 0;
      let episodePrefix = '';
      let episodeSuffix = '';

      $('a').each((_, el) => {
        const href = $(el).attr('href') || '';
        const match = href.match(/^(.*-season-(\d+)-episode-)(\d+)(.*)$/i);
        if (match) {
          const epNum = parseInt(match[3], 10);
          if (epNum > maxEpisodeNumber) {
            maxEpisodeNumber = epNum;
            episodePrefix = match[1];
            episodeSuffix = match[4];
          }
        }
      });

      if (maxEpisodeNumber > 0) {
        for (let i = 1; i <= maxEpisodeNumber; i++) {
          episodes.push({
            id: `${slug}-ep-${i}`,
            episodeNumber: i,
            seasonNumber: 1,
            title: `Episode ${i}`,
            rating: null,
            thumbnail: '',
            airDate: null
          });
        }
      }
    }
    
    console.log(slug, '-> Total Episodes:', episodes.length);
    console.log('Episodes list:', episodes);
}

async function run() {
    await test('teach-you-lesson-2026');
    await test('shadow-detective-2022');
}
run();

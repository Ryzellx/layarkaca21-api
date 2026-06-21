const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
    const r = await axios.get('https://tv11.lk21official.cc/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(r.data);
    
    const sections = {};
    $('.slider-wrapper').each((i, el) => {
        const headerText = $(el).prev('.header').text().trim().toLowerCase();
        const sliders = $(el).find('.sliders');
        
        if (headerText.includes('film unggulan')) sections.filmUnggulan = sliders;
        else if (headerText.includes('latest movies')) sections.latestMovies = sliders;
        else if (headerText.includes('series unggulan')) sections.latestSeries = sliders;
        else if (headerText.includes('series update')) sections.seriesUpdate = sliders;
        else if (headerText.includes('top bulan ini')) sections.topMonth = sliders;
        else if (headerText.includes('rekomendasi')) sections.recommendations = sliders;
        else if (headerText.includes('keluarga')) sections.family = sliders;
        else if (headerText.includes('action')) sections.action = sliders;
        else if (headerText.includes('drakor')) sections.drakor = sliders;
        else if (headerText.includes('horror')) sections.horror = sliders;
        else if (headerText.includes('romance')) sections.romance = sliders;
        else if (headerText.includes('comedy')) sections.comedy = sliders;
        else if (headerText.includes('korea')) sections.korea = sliders;
        else if (headerText.includes('thailand')) sections.thailand = sliders;
        else if (headerText.includes('india')) sections.india = sliders;
    });

    console.log('--- Matches ---');
    for (const [key, val] of Object.entries(sections)) {
        console.log(`${key}: found=${!!val} length=${val ? val.find('li').length : 0}`);
    }
}
test();

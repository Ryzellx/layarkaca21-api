const fs=require('fs');
const cheerio=require('cheerio');
const $=cheerio.load(fs.readFileSync('home.html', 'utf8'));
$('.sliders').each((i, el)=>{
    let h2 = $(el).closest('.box, .module').find('h2, h3, h4').first().text().trim();
    if (!h2) {
        h2 = $(el).prevAll('h2, h3').first().text().trim();
    }
    console.log('Index', i, '=>', h2);
});

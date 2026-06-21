const fs=require('fs');
const cheerio=require('cheerio');
const $=cheerio.load(fs.readFileSync('home.html', 'utf8'));
$('.sliders').each((i, el)=>{
    let parentBox = $(el).closest('.box, .module');
    let title = parentBox.find('h2, h3, h4').first().text().replace(/\s+/g, ' ').trim();
    if (!title) {
        title = $(el).parent().prev('h2, h3').text().replace(/\s+/g, ' ').trim();
    }
    if (!title) {
        title = $(el).parent().parent().prev('h2, h3').text().replace(/\s+/g, ' ').trim();
    }
    
    // Some headers might be in previous siblings of the container
    if (!title) {
       title = $(el).closest('.row').prev('.row').find('h2, h3, h4').first().text().replace(/\s+/g, ' ').trim();
    }
    
    const itemsCount = $(el).find('li').length;
    console.log(`Index ${i} => Title: "${title}", Items: ${itemsCount}`);
});

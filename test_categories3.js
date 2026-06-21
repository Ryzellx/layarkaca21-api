const fs=require('fs');
const cheerio=require('cheerio');
const $=cheerio.load(fs.readFileSync('home.html', 'utf8'));
$('.sliders').each((i, el)=>{
    let heading = '';
    // Look at previous siblings of the container
    let prev = $(el).parent().prev();
    while(prev.length > 0) {
        if (prev.is('h2') || prev.is('h3') || prev.is('.title') || prev.is('.block-title')) {
            heading = prev.text().trim();
            break;
        }
        prev = prev.prev();
    }
    
    // Look inside a parent div that might contain a title
    if (!heading) {
        heading = $(el).closest('.module, .box, .section, .block').find('h2, h3, .title, .block-title, .heading').first().text().trim();
    }
    
    console.log(`Index ${i} =>`, heading.replace(/\s+/g, ' '));
});

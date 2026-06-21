const fs = require('fs');
const html = fs.readFileSync('home.html', 'utf8');
const parts = html.split('class="sliders"');
parts.forEach((p, i) => {
    if(i === 0) return;
    const pre = parts[i-1].slice(-300);
    console.log('Index', i-1, 'PREV HTML:', pre.replace(/\n/g, ' '));
});

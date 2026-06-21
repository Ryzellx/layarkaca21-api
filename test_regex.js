const hrefs = [
    '/teach-you-lesson-season-1-episode-10-2026',
    '/shadow-detective-season-1-episode-6-2022',
    '/teach-you-lesson-season-1-episode-1-2026'
];

for (const href of hrefs) {
    const match = href.match(/season-(\d+)-episode-(\d+)/i);
    if (match) {
        console.log(href, '-> Season:', match[1], 'Episode:', match[2]);
    }
}

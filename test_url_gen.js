const hrefs = [
    '/teach-you-lesson-season-1-episode-10-2026',
    '/shadow-detective-season-1-episode-6-2022',
    '/teach-you-lesson-season-1-episode-1-2026'
];

for (const href of hrefs) {
    const match = href.match(/^(.*-season-\d+-episode-)(\d+)(.*)$/i);
    if (match) {
        const prefix = match[1];
        const maxEp = parseInt(match[2], 10);
        const suffix = match[3];
        console.log('Original:', href);
        console.log('Prefix:', prefix, 'MaxEp:', maxEp, 'Suffix:', suffix);
        console.log('Generated Ep 2:', prefix + '2' + suffix);
        console.log('---');
    }
}

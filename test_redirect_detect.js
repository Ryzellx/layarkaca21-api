const axios = require('axios');

async function test(endpoint) {
    const baseUrl = 'https://tv11.lk21official.cc';
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            },
            timeout: 10000
        });
        const finalUrl = response.request?.res?.responseUrl || '';
        const finalPath = new URL(finalUrl).pathname;
        const requestedPath = endpoint.startsWith('http') ? new URL(endpoint).pathname : endpoint;
        
        console.log('Endpoint:', endpoint);
        console.log('Final URL:', finalUrl);
        console.log('Final Path:', finalPath);
        console.log('Requested Path:', requestedPath);
        
        const isRedirectedToHome = finalPath === '/' && requestedPath !== '/' && requestedPath !== '';
        console.log('Is Redirected to Home:', isRedirectedToHome);
        console.log('---');
    } catch (e) {
        console.log('Error:', e.message);
    }
}

async function run() {
    await test('/shadow-detective'); // Invalid
    await test('/teach-you-lesson-2026'); // Valid
}
run();

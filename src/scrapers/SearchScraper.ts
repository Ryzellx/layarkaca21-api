import { BaseScraper } from './BaseScraper';

export class SearchScraper extends BaseScraper {
  async search(query: string) {
    const $ = await this.fetchHtml(`/?s=${encodeURIComponent(query)}`);
    
    const results: any[] = [];
    $('.search-item, .item, .result-item, .sliders li').each((_, el) => {
      const link = $(el).find('a').attr('href');
      const title = $(el).find('h2, .title, .poster-title').text().trim();
      const img = $(el).find('img');
      const poster = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src') || img.attr('data-original') || '';
      const ratingRaw = $(el).find('.rating, .imdb').text().trim();
      
      if (title && link) {
        const id = link.split('/').filter(Boolean).pop() || '';
        const yearRaw = $(el).find('.year').text().trim();
        results.push({
          id,
          slug: id,
          type: link.includes('/series/') ? 'series' : 'movie',
          title,
          year: parseInt(yearRaw, 10) || null,
          poster,
          rating: parseFloat(ratingRaw) || null
        });
      }
    });
    
    return results;
  }
}

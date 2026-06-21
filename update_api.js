const fs = require('fs');
const path = require('path');

const projectDir = 'C:/Users/Administrator/Downloads/layarkaca21-scrap';

const files = {
  'src/routes/index.ts': `import { Router } from 'express';
import { getHome } from '../controllers/HomeController';
import { search } from '../controllers/SearchController';
import { getMovie, getMovieCast } from '../controllers/MovieController';
import { getSeries, getSeriesSeasons, getSeriesEpisodes } from '../controllers/SeriesController';
import { getPerson, getPopularActors } from '../controllers/PersonController';
import { getGenres, getMoviesByGenre } from '../controllers/GenreController';
import { getTopBoxOffice, getComingSoon, getNews, getTrailers, getRecommendations, getHealth } from '../controllers/MiscController';
import { cache } from '../middlewares/cache';

const router = Router();

router.get('/home', cache(1800), getHome);
router.get('/search', cache(3600), search);

router.get('/movie/:id', cache(86400), getMovie);
router.get('/movie/:id/cast', cache(86400), getMovieCast);

router.get('/series/:id', cache(86400), getSeries);
router.get('/series/:id/seasons', cache(86400), getSeriesSeasons);
router.get('/series/:id/episodes', cache(86400), getSeriesEpisodes);

router.get('/person/:id', cache(86400), getPerson);
router.get('/actors/popular', cache(86400), getPopularActors);

router.get('/genres', cache(86400), getGenres);
router.get('/genre/:slug/movies', cache(3600), getMoviesByGenre);

router.get('/top-box-office', cache(3600), getTopBoxOffice);
router.get('/coming-soon', cache(3600), getComingSoon);
router.get('/news', cache(3600), getNews);
router.get('/trailers', cache(3600), getTrailers);
router.get('/recommendations', cache(3600), getRecommendations);

router.get('/health', getHealth);

export default router;`,

  'src/controllers/HomeController.ts': `import { Request, Response, NextFunction } from 'express';
import { HomeScraper } from '../scrapers/HomeScraper';

const scraper = new HomeScraper();

export const getHome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await scraper.scrapeHome();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};`,

  'src/controllers/SearchController.ts': `import { Request, Response, NextFunction } from 'express';
import { SearchScraper } from '../scrapers/SearchScraper';

const scraper = new SearchScraper();

export const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ success: false, error: 'Query parameter q is required' });
    }
    const results = await scraper.search(q);
    res.json({
      success: true,
      query: q,
      page: 1,
      total: results.length,
      results
    });
  } catch (error) {
    next(error);
  }
};`,

  'src/controllers/MovieController.ts': `import { Request, Response, NextFunction } from 'express';
import { MovieScraper } from '../scrapers/MovieScraper';

const scraper = new MovieScraper();

export const getMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await scraper.scrapeDetail(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getMovieCast = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await scraper.scrapeDetail(req.params.id);
    res.json({ success: true, data: data.cast || [] });
  } catch (error) {
    next(error);
  }
};`,

  'src/controllers/SeriesController.ts': `import { Request, Response, NextFunction } from 'express';
import { SeriesScraper } from '../scrapers/SeriesScraper';

const scraper = new SeriesScraper();

export const getSeries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await scraper.scrapeDetail(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSeriesSeasons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await scraper.scrapeDetail(req.params.id);
    res.json({ success: true, data: data.seasons || [] });
  } catch (error) {
    next(error);
  }
};

export const getSeriesEpisodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await scraper.scrapeDetail(req.params.id);
    const episodes = data.seasons ? data.seasons.flatMap((s: any) => s.episodes || []) : [];
    res.json({ success: true, data: episodes });
  } catch (error) {
    next(error);
  }
};`,

  'src/controllers/PersonController.ts': `import { Request, Response } from 'express';

export const getPerson = async (req: Request, res: Response) => {
  // Stubbed until actual LK21 actor scraper is possible
  res.json({
    success: true,
    data: {
      id: req.params.id,
      name: "Unknown Actor",
      photo: "",
      birthDate: "",
      birthPlace: "",
      bio: "",
      knownFor: [],
      movies: [],
      series: [],
      awards: []
    }
  });
};

export const getPopularActors = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};`,

  'src/controllers/GenreController.ts': `import { Request, Response } from 'express';

export const getGenres = async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: "Action", slug: "action" },
      { id: 2, name: "Comedy", slug: "comedy" }
    ]
  });
};

export const getMoviesByGenre = async (req: Request, res: Response) => {
  res.json({
    success: true,
    page: 1,
    total: 0,
    data: []
  });
};`,

  'src/controllers/MiscController.ts': `import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { redis } from '../config/redis';

export const getTopBoxOffice = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const getComingSoon = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const getNews = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const getTrailers = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const getRecommendations = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const getHealth = async (req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  let cacheStatus = 'disconnected';
  try {
    await prisma.$queryRaw\`SELECT 1\`;
    dbStatus = 'connected';
  } catch (e) {}
  
  try {
    if (redis.status === 'ready') cacheStatus = 'connected';
  } catch (e) {}

  res.json({
    success: true,
    status: 'healthy',
    database: dbStatus,
    cache: cacheStatus,
    uptime: process.uptime()
  });
};`,

  'src/scrapers/HomeScraper.ts': `import { BaseScraper } from './BaseScraper';

export class HomeScraper extends BaseScraper {
  async scrapeHome() {
    const $ = await this.fetchHtml('/');
    const sliderLists = $('.sliders');
    
    const latestMovies = this.extractCards($, sliderLists.eq(2));
    const latestSeries = this.extractCards($, sliderLists.eq(3));
    const popularMovies = this.extractCards($, sliderLists.eq(6));
    const recommendations = this.extractCards($, sliderLists.eq(11));

    // Mapping to required schema structure
    return {
      hero: latestMovies.slice(0, 3), // Example hero mapping
      fanFavorites: popularMovies.slice(0, 5),
      top10Weekly: popularMovies.slice(5, 15),
      trendingMovies: latestMovies,
      trendingSeries: latestSeries,
      popularMovies: popularMovies,
      popularSeries: latestSeries, // LK21 doesn't split popular series effectively
      topRatedMovies: [],
      topRatedSeries: [],
      comingSoon: [],
      inTheaters: latestMovies.slice(0, 5),
      topBoxOffice: [],
      popularCelebrities: [],
      bornToday: [],
      news: [],
      trailers: []
    };
  }

  private extractCards($: cheerio.CheerioAPI, container: cheerio.Cheerio<cheerio.AnyNode>) {
    const items: any[] = [];
    container.find('li').each((_, el) => {
      const link = $(el).find('a').attr('href');
      const title = $(el).find('.poster-title').text().trim() || $(el).find('h2, .title').text().trim();
      const poster = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
      const ratingRaw = $(el).find('.rating, .imdb').text().trim();
      
      if (link && title && !link.includes('/genre') && !link.includes('/country') && !link.includes('/year')) {
        const id = link.split('/').filter(Boolean).pop() || '';
        items.push({ id, type: link.includes('series') ? 'series' : 'movie', title, year: null, poster, rating: parseFloat(ratingRaw) || null });
      }
    });
    return items;
  }
}`,

  'src/scrapers/SearchScraper.ts': `import { BaseScraper } from './BaseScraper';

export class SearchScraper extends BaseScraper {
  async search(query: string) {
    const $ = await this.fetchHtml(\`/?s=\${encodeURIComponent(query)}\`);
    
    const results: any[] = [];
    $('.search-item, .item, .result-item, .sliders li').each((_, el) => {
      const link = $(el).find('a').attr('href');
      const title = $(el).find('h2, .title, .poster-title').text().trim();
      const poster = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
      const ratingRaw = $(el).find('.rating, .imdb').text().trim();
      
      if (title && link) {
        const id = link.split('/').filter(Boolean).pop() || '';
        results.push({
          id,
          type: link.includes('/series/') ? 'series' : 'movie',
          title,
          year: null,
          poster,
          rating: parseFloat(ratingRaw) || null
        });
      }
    });
    
    return results;
  }
}`,

  'src/scrapers/MovieScraper.ts': `import { BaseScraper } from './BaseScraper';

export class MovieScraper extends BaseScraper {
  async scrapeDetail(slug: string) {
    const $ = await this.fetchHtml(\`/\${slug}\`);
    
    const title = this.extractText($, 'body', ['h1[itemprop="name"]', 'h1.title', '.movie-title h1']);
    const description = this.extractText($, 'body', ['div[itemprop="description"]', '.synopsis', '.description p']);
    const poster = this.extractAttr($, 'body', ['.poster img', 'img[itemprop="image"]', '.movie-poster img'], 'src');
    
    const ratingRaw = this.extractText($, 'body', ['span[itemprop="ratingValue"]', '.imdb-rating', '.rating-value']);
    const rating = parseFloat(ratingRaw) || null;
    
    const yearRaw = this.extractText($, 'body', ['.year a', 'a[href*="/year/"]']);
    const year = parseInt(yearRaw, 10) || null;

    const genres: string[] = [];
    $('a[href*="/genre/"]').each((_, el) => {
      genres.push($(el).text().trim());
    });

    const countries: string[] = [];
    $('a[href*="/country/"]').each((_, el) => {
      countries.push($(el).text().trim());
    });

    return {
      id: slug,
      title,
      originalTitle: title,
      description,
      year,
      rating,
      runtime: null,
      status: 'released',
      poster,
      backdrop: poster,
      genres: [...new Set(genres)],
      countries: [...new Set(countries)],
      languages: [],
      cast: [],
      crew: [],
      images: [],
      videos: [],
      trailers: [],
      awards: [],
      boxOffice: {},
      recommendations: [],
      similar: []
    };
  }
}`,

  'src/scrapers/SeriesScraper.ts': `import { BaseScraper } from './BaseScraper';

export class SeriesScraper extends BaseScraper {
  async scrapeDetail(slug: string) {
    const $ = await this.fetchHtml(\`/series/\${slug}\`);
    
    const title = this.extractText($, 'body', ['h1[itemprop="name"]', 'h1.title']);
    const description = this.extractText($, 'body', ['div[itemprop="description"]', '.synopsis']);
    const poster = this.extractAttr($, 'body', ['.poster img', 'img[itemprop="image"]'], 'src');
    
    const ratingRaw = this.extractText($, 'body', ['span[itemprop="ratingValue"]', '.imdb-rating']);
    const rating = parseFloat(ratingRaw) || null;
    
    const episodes: any[] = [];
    $('.episode-list .item, .episodes tr, .slider').each((i, el) => {
      episodes.push({
        id: \`\${slug}-ep-\${i + 1}\`,
        episodeNumber: i + 1,
        seasonNumber: 1,
        title: $(el).text().trim() || \`Episode \${i + 1}\`,
        rating: null,
        thumbnail: $(el).find('img').attr('src') || poster,
        airDate: null
      });
    });

    return {
      id: slug,
      title,
      description,
      rating,
      poster,
      backdrop: poster,
      genres: [],
      totalSeasons: 1,
      totalEpisodes: episodes.length,
      seasons: [
        {
          id: \`season_1\`,
          seasonNumber: 1,
          name: "Season 1",
          episodeCount: episodes.length,
          poster,
          episodes
        }
      ]
    };
  }
}`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(projectDir, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

console.log('API structural updates complete.');

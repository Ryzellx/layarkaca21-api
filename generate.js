const fs = require('fs');
const path = require('path');

const projectDir = 'C:/Users/Administrator/Downloads/layarkaca21-scrap';

const files = {
  'package.json': `{
  "name": "lk21-catalog-api",
  "version": "1.0.0",
  "description": "Production-ready Movie & TV Catalog REST API",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "lint": "eslint src/**/*.ts",
    "test": "jest",
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "axios": "^1.4.0",
    "cheerio": "1.0.0-rc.12",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "helmet": "^7.0.0",
    "ioredis": "^5.3.2",
    "node-cron": "^3.0.2",
    "playwright": "^1.36.1",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "winston": "^3.10.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.3",
    "@types/node": "^20.4.5",
    "@types/node-cron": "^3.0.8",
    "@types/supertest": "^2.0.12",
    "@types/swagger-jsdoc": "^6.0.1",
    "@types/swagger-ui-express": "^4.1.3",
    "jest": "^29.6.2",
    "prisma": "^5.0.0",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.1.6"
  }
}`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}`,

  'docker-compose.yml': `version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/lk21?schema=public
      - REDIS_URL=redis://redis:6379
      - PORT=3000
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=lk21
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data
    restart: unless-stopped

volumes:
  pgdata:
  redisdata:
`,

  'Dockerfile': `FROM node:20-alpine

WORKDIR /app

# Install native dependencies for Playwright if needed in future
# RUN apk add --no-cache chromium

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
`,

  '.env.example': `DATABASE_URL="postgresql://postgres:password@localhost:5432/lk21?schema=public"
REDIS_URL="redis://localhost:6379"
PORT=3000
NODE_ENV=development
`,

  'ecosystem.config.js': `module.exports = {
  apps: [{
    name: 'lk21-api',
    script: './dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};`,

  'jest.config.js': `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  clearMocks: true,
};`,

  'prisma/schema.prisma': `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Movie {
  id             String    @id @default(uuid())
  title          String
  original_title String?
  slug           String    @unique
  poster         String?
  backdrop       String?
  description    String?
  language       String?
  release_date   DateTime?
  year           Int?
  runtime        Int?
  rating         Float?
  status         String?
  thumbnail      String?
  last_updated   DateTime  @updatedAt

  genres    Genre[]
  countries Country[]
  directors Person[]  @relation("MovieDirectors")
  writers   Person[]  @relation("MovieWriters")
  cast      Person[]  @relation("MovieCast")
  studios   Studio[]
  tags      Tag[]

  @@index([slug])
  @@index([year])
  @@index([rating])
}

model Series {
  id             String    @id @default(uuid())
  title          String
  slug           String    @unique
  poster         String?
  description    String?
  rating         Float?
  year           Int?
  status         String?
  total_episodes Int?
  last_updated   DateTime  @updatedAt

  genres    Genre[]
  countries Country[]
  studios   Studio[]
  episodes  Episode[]

  @@index([slug])
  @@index([year])
}

model Episode {
  id             String    @id @default(uuid())
  title          String
  slug           String    @unique
  episode_number Int
  season_number  Int
  thumbnail      String?
  release_date   DateTime?

  seriesId String
  series   Series @relation(fields: [seriesId], references: [id])

  @@index([seriesId])
}

model Genre {
  id     String   @id @default(uuid())
  name   String   @unique
  slug   String   @unique
  movies Movie[]
  series Series[]
}

model Country {
  id     String   @id @default(uuid())
  name   String   @unique
  slug   String   @unique
  movies Movie[]
  series Series[]
}

model Person {
  id     String  @id @default(uuid())
  name   String  @unique
  slug   String  @unique

  directedMovies Movie[] @relation("MovieDirectors")
  writtenMovies  Movie[] @relation("MovieWriters")
  actedInMovies  Movie[] @relation("MovieCast")
}

model Studio {
  id     String   @id @default(uuid())
  name   String   @unique
  slug   String   @unique
  movies Movie[]
  series Series[]
}

model Tag {
  id     String  @id @default(uuid())
  name   String  @unique
  movies Movie[]
}
`,

  'src/config/env.ts': `import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  nodeEnv: process.env.NODE_ENV || 'development'
};`,

  'src/config/logger.ts': `import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});`,

  'src/config/redis.ts': `import Redis from 'ioredis';
import { config } from './env';
import { logger } from './logger';

export const redis = new Redis(config.redisUrl);

redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

redis.on('error', (err) => {
  logger.error('Redis connection error', err);
});`,

  'src/config/prisma.ts': `import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();`,

  'src/config/swagger.ts': `import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie & TV Catalog API',
      version: '1.0.0',
      description: 'API documentation for LK21 metadata catalog',
    },
    servers: [
      {
        url: '/api',
        description: 'Current Environment'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);`,

  'src/middlewares/cache.ts': `import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';
import { logger } from '../config/logger';

export const cache = (durationInSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = \`__express__\${req.originalUrl || req.url}\`;

    try {
      const cachedResponse = await redis.get(key);
      if (cachedResponse) {
        res.setHeader('Content-Type', 'application/json');
        return res.send(cachedResponse);
      } else {
        res.sendResponse = res.send;
        res.send = (body: any) => {
          redis.set(key, body, 'EX', durationInSeconds);
          res.sendResponse(body);
        };
        next();
      }
    } catch (error) {
      logger.error('Cache middleware error', error);
      next();
    }
  };
};`,

  'src/middlewares/error.ts': `import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled Exception', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    error: {
      message,
      status
    }
  });
};`,

  'src/scrapers/BaseScraper.ts': `import axios from 'axios';
import * as cheerio from 'cheerio';
import { logger } from '../config/logger';

export class BaseScraper {
  protected baseUrl = 'https://tv11.lk21official.cc';
  
  protected async fetchHtml(endpoint: string): Promise<cheerio.CheerioAPI> {
    try {
      const url = endpoint.startsWith('http') ? endpoint : \`\${this.baseUrl}\${endpoint}\`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        },
        timeout: 10000
      });
      return cheerio.load(response.data);
    } catch (error) {
      logger.error(\`Failed to fetch \${endpoint}\`, error);
      throw error;
    }
  }

  protected extractText($: cheerio.CheerioAPI, context: any, selectors: string[]): string {
    for (const sel of selectors) {
      const text = $(context).find(sel).first().text().trim();
      if (text) return text;
    }
    return '';
  }

  protected extractAttr($: cheerio.CheerioAPI, context: any, selectors: string[], attr: string): string {
    for (const sel of selectors) {
      const val = $(context).find(sel).first().attr(attr);
      if (val) return val.trim();
    }
    return '';
  }
}`,

  'src/scrapers/HomeScraper.ts': `import { BaseScraper } from './BaseScraper';

export class HomeScraper extends BaseScraper {
  async scrapeHome() {
    const $ = await this.fetchHtml('/');
    
    return {
      latestMovies: this.extractCards($, '.latest-movie .item, #grid-wrapper .item'),
      latestSeries: this.extractCards($, '.latest-series .item, #series-wrapper .item'),
      popularMovies: this.extractCards($, '.popular-movie .item, .populer .item'),
      recommendations: this.extractCards($, '.recommendations .item, .rekomendasi .item')
    };
  }

  private extractCards($: cheerio.CheerioAPI, selector: string) {
    const items: any[] = [];
    $(selector).each((_, el) => {
      const title = $(el).find('.title, h2, h3').text().trim();
      const link = $(el).find('a').attr('href');
      const slug = link ? link.split('/').filter(Boolean).pop() : '';
      const poster = $(el).find('img').attr('src');
      const rating = $(el).find('.rating, .imdb').text().trim();
      
      if (title && slug) {
        items.push({ title, slug, poster, rating });
      }
    });
    return items;
  }
}`,

  'src/scrapers/MovieScraper.ts': `import { BaseScraper } from './BaseScraper';

export class MovieScraper extends BaseScraper {
  async scrapeDetail(slug: string) {
    const $ = await this.fetchHtml(\`/\${slug}\`);
    
    // Fallback selectors for robust scraping
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
      title,
      slug,
      poster,
      description,
      rating,
      year,
      genres: [...new Set(genres)],
      countries: [...new Set(countries)],
      status: 'Released'
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
    $('.episode-list .item, .episodes tr').each((i, el) => {
      episodes.push({
        episode_number: i + 1,
        season_number: 1, // Defaulting to 1 unless parsed
        title: $(el).text().trim(),
        slug: \`\${slug}-ep-\${i + 1}\`
      });
    });

    return {
      title,
      slug,
      poster,
      description,
      rating,
      total_episodes: episodes.length,
      episodes
    };
  }
}`,

  'src/scrapers/SearchScraper.ts': `import { BaseScraper } from './BaseScraper';

export class SearchScraper extends BaseScraper {
  async search(query: string) {
    const $ = await this.fetchHtml(\`/?s=\${encodeURIComponent(query)}\`);
    
    const results: any[] = [];
    $('.search-item, .item, .result-item').each((_, el) => {
      const title = $(el).find('h2, .title').text().trim();
      const link = $(el).find('a').attr('href');
      const slug = link ? link.split('/').filter(Boolean).pop() : '';
      
      if (title && slug) {
        results.push({ title, slug, type: link?.includes('/series/') ? 'series' : 'movie' });
      }
    });
    
    return results;
  }
}`,

  'src/controllers/HomeController.ts': `import { Request, Response, NextFunction } from 'express';
import { HomeScraper } from '../scrapers/HomeScraper';

const scraper = new HomeScraper();

export const getHome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await scraper.scrapeHome();
    res.json(data);
  } catch (error) {
    next(error);
  }
};`,

  'src/controllers/MovieController.ts': `import { Request, Response, NextFunction } from 'express';
import { MovieScraper } from '../scrapers/MovieScraper';

const scraper = new MovieScraper();

export const getMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const data = await scraper.scrapeDetail(slug);
    res.json(data);
  } catch (error) {
    next(error);
  }
};`,

  'src/controllers/SeriesController.ts': `import { Request, Response, NextFunction } from 'express';
import { SeriesScraper } from '../scrapers/SeriesScraper';

const scraper = new SeriesScraper();

export const getSeries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const data = await scraper.scrapeDetail(slug);
    res.json(data);
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
      return res.status(400).json({ error: 'Query parameter q is required' });
    }
    const data = await scraper.search(q);
    res.json(data);
  } catch (error) {
    next(error);
  }
};`,

  'src/routes/index.ts': `import { Router } from 'express';
import { getHome } from '../controllers/HomeController';
import { getMovie } from '../controllers/MovieController';
import { getSeries } from '../controllers/SeriesController';
import { search } from '../controllers/SearchController';
import { cache } from '../middlewares/cache';

const router = Router();

/**
 * @swagger
 * /home:
 *   get:
 *     summary: Get home page catalog
 *     responses:
 *       200:
 *         description: Home page data
 */
router.get('/home', cache(1800), getHome);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for movies or series
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', cache(3600), search);

/**
 * @swagger
 * /movie/{slug}:
 *   get:
 *     summary: Get movie details
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie metadata
 */
router.get('/movie/:slug', cache(86400), getMovie);

/**
 * @swagger
 * /series/{slug}:
 *   get:
 *     summary: Get series details
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Series metadata
 */
router.get('/series/:slug', cache(86400), getSeries);

export default router;`,

  'src/jobs/cron.ts': `import cron from 'node-cron';
import { logger } from '../config/logger';
import { HomeScraper } from '../scrapers/HomeScraper';

export const startCronJobs = () => {
  const scraper = new HomeScraper();

  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    logger.info('Running background refresh for home metadata');
    try {
      await scraper.scrapeHome();
      // Logic to upsert into Prisma DB would go here
    } catch (error) {
      logger.error('Cron job error', error);
    }
  });
  
  logger.info('Cron jobs initialized');
};`,

  'src/app.ts': `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import routes from './routes';
import { errorHandler } from './middlewares/error';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.use(errorHandler);

export default app;`,

  'src/server.ts': `import app from './app';
import { config } from './config/env';
import { logger } from './config/logger';
import { startCronJobs } from './jobs/cron';

const server = app.listen(config.port, () => {
  logger.info(\`Server running on port \${config.port} in \${config.nodeEnv} mode\`);
  logger.info(\`Swagger docs available at http://localhost:\${config.port}/api-docs\`);
  
  startCronJobs();
});

export default server;`,

  'tests/api.test.ts': `import request from 'supertest';
import app from '../src/app';

describe('API Endpoints', () => {
  it('GET /api/home - should return 200', async () => {
    const res = await request(app).get('/api/home');
    expect(res.status).toBe(200);
  });
  
  it('GET /api/search without query - should return 400', async () => {
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(400);
  });
});`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(projectDir, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

console.log('Project generation complete.');

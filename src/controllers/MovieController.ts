import { Request, Response, NextFunction } from 'express';
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
};

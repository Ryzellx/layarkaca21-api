import { Request, Response, NextFunction } from 'express';
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
};

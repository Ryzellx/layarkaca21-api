import { Request, Response, NextFunction } from 'express';
import { NavigationScraper } from '../scrapers/NavigationScraper';

const scraper = new NavigationScraper();

export const getGenres = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await scraper.scrapeMenu('Genre');
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCountries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await scraper.scrapeMenu('Negara');
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getYears = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await scraper.scrapeMenu('Tahun');
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSeriesMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await scraper.scrapeMenu('Series');
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getPopularMenu = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await scraper.scrapeMenu('Populer');
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getAllNavigation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [genres, countries, years, series, popular] = await Promise.all([
      scraper.scrapeMenu('Genre'),
      scraper.scrapeMenu('Negara'),
      scraper.scrapeMenu('Tahun'),
      scraper.scrapeMenu('Series'),
      scraper.scrapeMenu('Populer')
    ]);

    res.json({
      success: true,
      data: {
        genres,
        countries,
        years,
        series,
        popular
      }
    });
  } catch (error) {
    next(error);
  }
};

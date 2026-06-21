import { Request, Response, NextFunction } from 'express';
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
};

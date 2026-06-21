import { Request, Response, NextFunction } from 'express';
import { CategoryScraper } from '../scrapers/CategoryScraper';

const scraper = new CategoryScraper();

// Handles genre, country, year
export const getCategoryMovies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { category, slug } = req.params; // category can be 'genre', 'country', 'years'
    const page = parseInt(req.query.page as string) || 1;
    
    // LK21 uses 'year' not 'years'
    if (category === 'years') category = 'year';
    
    // Construct path for LK21. e.g., 'genre/action' or 'country/indonesia'
    const path = `${category}/${slug}`;
    
    const data = await scraper.scrapeCategory(path, page);
    res.json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};

// Handles root categories like popular, rating, release, etc.
export const getRootCategoryMovies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params; // e.g., 'populer', 'rating', 'komen-terbanyak'
    const page = parseInt(req.query.page as string) || 1;
    
    const data = await scraper.scrapeCategory(slug, page);
    res.json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};

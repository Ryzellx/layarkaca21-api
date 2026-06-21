import { Request, Response } from 'express';

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
};

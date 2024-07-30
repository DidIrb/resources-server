import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
const data = fs.readFileSync('./db.enum.json', 'utf8');
const parsedData = JSON.parse(data);

// PREVENT SITEMAP GENERATION BEYOND 3 DAYS
export const checkSitemapGeneration = (req: Request, res: Response, next: NextFunction) => {
  const currentDate = new Date();
  const lastGeneratedDate = new Date(parsedData.sitemap.lastGenerated);
  const timeDifference = currentDate.getTime() - lastGeneratedDate.getTime();
  const millisecondsInDay = 24 * 60 * 60 * 1000;

  if (!lastGeneratedDate || timeDifference >= 3 * millisecondsInDay) {
    parsedData.sitemap.lastGenerated = currentDate.toISOString();
    next();
  } else {
    res.status(403).json({ error: 'Sitemap generation limit reached. Please try again later.' });
  }
};
import { Request, Response } from 'express';
import { getDataFromJson } from '../utils/api';
import { Resources } from '../types/data.types';
import { site } from '../config/auth.config';

const generateXML = (req: Request, res: Response) => {
    try {
        const data = getDataFromJson();
        const sitemapXml = generateSitemapXml(data);
        res.header('Content-Type', 'application/xml');
        res.header('Content-Disposition', 'attachment; filename="sitemap.xml"');
        res.send(sitemapXml);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const generateSitemapXml = (data: any) => {
    const sitemapXml = `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>${site}</loc>
            <lastmod>2024-07-30</lastmod>
        </url>
        <url>
            <loc>${site}/home</loc>
            <lastmod>2024-07-30</lastmod>
        </url>
        ${data.map((item: Resources) => `
          <url>
            <loc>${site}/resource/${item.title}</loc>
            <lastmod>${item.updatedAt}</lastmod>
          </url>
        `).join('\n')}
      </urlset>
    `;
    return sitemapXml;
};

export default { generateXML }
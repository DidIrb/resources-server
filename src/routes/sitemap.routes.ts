import express from 'express';
import ctrl from '../controllers/sitemap.controller';
import validateToken from '../middleware/validate.token';
const sitemapRouter = express.Router();

sitemapRouter.get('/', validateToken, ctrl.generateXML);

export default sitemapRouter;
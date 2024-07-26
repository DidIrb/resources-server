import express from 'express';
import ctrl from '../controllers/search.controller';
const searchRouter = express.Router()

searchRouter.get('/', ctrl.searchResource);

export default searchRouter;
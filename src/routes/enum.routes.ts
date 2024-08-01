import express from 'express';
import ctrl from '../controllers/enum.controller';
import validateToken from '../middleware/validate.token';
const enumRouter = express.Router()

enumRouter.get('/',  ctrl.getEnums);
enumRouter.post('/tags', validateToken, ctrl.createTags);
enumRouter.post('/types', validateToken, ctrl.createTypes);
enumRouter.post('/topics', validateToken, ctrl.createTopics);

export default enumRouter;
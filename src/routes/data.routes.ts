import express from 'express';
import ctrl from '../controllers/resources.controller';
import validateToken from '../middleware/validate.token';
import { checkSecretPassword } from '../middleware/app.middleware';
const dataRouter = express.Router()

dataRouter.get('/', ctrl.getData);
// dataRouter.get('/search', ctrl.searchResource); 
dataRouter.post('/', validateToken, checkSecretPassword, ctrl.create);
dataRouter.put('/:uuid', validateToken, checkSecretPassword, ctrl.update);
dataRouter.delete('/:uuid', validateToken, checkSecretPassword, ctrl.deleteResource);

export default dataRouter;
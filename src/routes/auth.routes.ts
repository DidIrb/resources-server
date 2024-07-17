import express from 'express';
import ctrl from '../controllers/auth.controllers';
const authRouter = express.Router()

authRouter.post('/signin', ctrl.signin);
authRouter.post('/signout', ctrl.signout);

export default authRouter;
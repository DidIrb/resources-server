import express from 'express'
import dotenv from 'dotenv';
const router = express.Router();
dotenv.config();
import userRouter from './user.routes';
import authRouter from './auth.routes';
import dataRouter from './data.routes';
import enumRouter from './enum.routes';
const base = process.env.BASE;

router.use(`/${base}/users`, userRouter);
router.use(`/${base}/auth`, authRouter);
router.use(`/${base}/resources`, dataRouter);
router.use(`/${base}/enum`, enumRouter);


export default router
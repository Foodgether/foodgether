import express from 'express';
import menuRouter from './menu';
import userRouter from './user';
import authRouter from './auth';

const router = express.Router();

router.use('/menu', menuRouter);
router.use('/user', userRouter);
router.use('/auth', authRouter);

export default router;

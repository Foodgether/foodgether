import express from 'express';
import menuRouter from './menu';
import userRouter from './user';

const router = express.Router();

router.use('/menu', menuRouter);
router.use('/user', userRouter);

export default router;

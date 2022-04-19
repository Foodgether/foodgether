import express from 'express';
import menuRouter from './menu';

const router = express.Router();

router.use('/menu', menuRouter);

export default router;

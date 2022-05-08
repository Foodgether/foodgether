import express from 'express';
import { getMenuController } from '../controllers/menu';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/', authenticate, getMenuController);

export default router;

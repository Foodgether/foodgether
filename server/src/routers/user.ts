import express from 'express';
import { getMenuController } from '../controllers/menu';

const router = express.Router();

router.post('/', getMenuController);

export default router;

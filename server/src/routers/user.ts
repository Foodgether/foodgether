import express from 'express';
import { createUserController, getCurrentUserController } from '../controllers/user';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/', createUserController);
router.get('/me', authenticate, getCurrentUserController);

export default router;

import express from 'express';
import { loginControler, logoutController } from '../controllers/auth';

const router = express.Router();

router.post('/login', loginControler);
router.post('/logout', logoutController);

export default router;

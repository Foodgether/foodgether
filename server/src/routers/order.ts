import express from 'express';
import { createInviteController, getInviteController } from '../controllers/order';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/', authenticate, getInviteController); // Order
router.get('/invite/:inviteId', authenticate, getInviteController); // Get invite info
router.post('/invite', authenticate, createInviteController) // Create invite

export default router;

import express from 'express';
import { createInviteController, createOrderController, getInviteController } from '../controllers/order';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/:inviteId/order', authenticate, createOrderController); // Order
router.get('/invite/:inviteId', authenticate, getInviteController); // Get invite info
router.post('/invite', authenticate, createInviteController) // Create invite
router.post('/:inviteId/confirm', authenticate) // Confirm order
router.put('/:userOrderId', authenticate) // Edit order

export default router;

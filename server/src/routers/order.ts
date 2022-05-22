import express from "express";
import {
  confirmOrderController,
  createInviteController,
  createOrderController,
  getInviteController,
  updateOrderController,
} from "../controllers/order";
import authenticate from "../middlewares/authenticate";
import softAuthenticate from '../middlewares/softAuthenticate';

const router = express.Router();

router.post("/:inviteId/submit", authenticate, createOrderController); // Order
router.get("/invite/:inviteId", softAuthenticate, getInviteController); // Get invite info
router.post("/invite", authenticate, createInviteController); // Create invite
router.post("/:inviteId/confirm", authenticate, confirmOrderController); // Confirm order
router.put("/userOrder/:userOrderId", authenticate, updateOrderController); // Edit order

export default router;

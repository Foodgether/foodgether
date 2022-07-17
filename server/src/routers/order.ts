import express from "express";
import {
  cancelOrderController,
  confirmOrderController,
  createInviteController,
  createOrderController,
  getInviteController,
  getOrdersController,
  updateOrderController,
} from "../controllers/order";
import authenticate from "../middlewares/authenticate";
import softAuthenticate from "../middlewares/softAuthenticate";

const router = express.Router();

router.get("/invite/:inviteId", softAuthenticate, getInviteController); // Get invite info
router.get("/:inviteId/orders", authenticate, getOrdersController);
router.post("/:inviteId/submit", authenticate, createOrderController); // Order
router.post("/invite", authenticate, createInviteController); // Create invite
router.post("/:inviteId/confirm", authenticate, confirmOrderController); // Confirm order
router.post("/:inviteId/cancel", authenticate, cancelOrderController); // Cancel order
router.put("/userOrder/:userOrderId", authenticate, updateOrderController); // Edit order

export default router;

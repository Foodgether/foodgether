import express from "express";
import {
  confirmOrderController,
  createInviteController,
  createOrderController,
  getInviteController,
} from "../controllers/order";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

router.post("/:inviteId/submit", authenticate, createOrderController); // Order
router.get("/invite/:inviteId", getInviteController); // Get invite info
router.post("/invite", authenticate, createInviteController); // Create invite
router.post("/:inviteId/confirm", authenticate, confirmOrderController); // Confirm order
router.put("/:userOrderId", authenticate); // Edit order

export default router;

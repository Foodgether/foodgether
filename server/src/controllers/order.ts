import {
  IAuthenticatedRequest,
  ISoftAuthenticatedRequest,
} from "../middlewares/interface/authenticate";
import { Response } from "express";
import {
  ConfirmOrderSchema,
  CreateInviteSchema,
  CreateOrderSchema,
  GetInviteSchema,
  UpdateOrderSchema,
} from "./validators/order";
import { nanoid } from "nanoid/async";
import {
  cacheOrder,
  calculateFinalOrder,
  canOrderBeConfirmed,
  confirmOrder,
  createOrder,
  createUserOrder,
  doesInviteIdExist,
  getCachedOrder,
  getInviteOrder,
  updateUserOrder,
} from "../services/order";
import { getRestaurantInfo } from "../services/restaurant";
import logger from "../utils/logger";
import {
  getOrdersOfInvitation,
  getUserOrderByOrderId,
} from "../services/userOrder";
import { GetInviteResponse } from "./interface/order";

export const createInviteController = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  try {
    const { restaurantId } = await CreateInviteSchema.validate(req.body);
    let isInviteIdUnique = false;
    let inviteId: string;
    while (!isInviteIdUnique) {
      inviteId = await nanoid(10);
      isInviteIdUnique = !(await doesInviteIdExist(inviteId));
    }
    const restaurant = await getRestaurantInfo(restaurantId);
    if (!restaurant) {
      return res.status(400).json({ message: "Restaurant not found" });
    }
    const user = req.user;
    const { menu, ...orderRestaurant } = restaurant;
    const inviteOrder = await createOrder(
      inviteId,
      restaurantId,
      user.id,
      orderRestaurant,
      restaurant.menu
    );
    await cacheOrder(inviteId, inviteOrder);
    return res.status(200).json(inviteOrder);
  } catch (err) {
    logger.log("error", `Failed at getting menu: ${err}\n${err.stack}`);
    return res.status(500).json({ message: err.message });
  }
};

export const getInviteController = async (
  req: ISoftAuthenticatedRequest,
  res: Response
) => {
  try {
    const { inviteId } = await GetInviteSchema.validate(req.params);
    let inviteOrder: GetInviteResponse = {};
    inviteOrder.order = await getCachedOrder(inviteId);
    if (!inviteOrder) {
      logger.log(
        "info",
        `Getting order invite from database for id: ${inviteId}`
      );
      inviteOrder.order = await getInviteOrder(inviteId);
      logger.log("info", `Caching for id: ${inviteId}`);
      await cacheOrder(inviteId, inviteOrder.order);
      if (!inviteOrder) {
        return res.status(400).json({ message: "Invite not found" });
      }
    }
    if (!req.user) {
      return res.status(200).json(inviteOrder);
    }
    const userOrder = await getUserOrderByOrderId(
      inviteOrder.order.id,
      req.user.id
    );
    if (userOrder) {
      inviteOrder.myOrder = userOrder;
    }
    return res.status(200).json(inviteOrder);
  } catch (err) {
    logger.log("error", `Failed at getting menu: ${err}\n${err.stack}`);
    return res.status(500).json({ message: err.message });
  }
};

export const createOrderController = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  try {
    const { inviteId, detail } = await CreateOrderSchema.validate({
      ...req.params,
      ...req.body,
    });
    let inviteOrder = await getCachedOrder(inviteId);
    if (!inviteOrder) {
      logger.log(
        "info",
        `Getting order invite from database for id: ${inviteId}`
      );
      inviteOrder = await getInviteOrder(inviteId);
      logger.log("info", `Caching for id: ${inviteId}`);
      await cacheOrder(inviteId, inviteOrder);
      if (!inviteOrder) {
        return res.status(400).json({ message: "Invite not found" });
      }
    }
    const dishTypes = inviteOrder.menu.dishTypes;
    try {
      detail.forEach((item) => {
        const dishTypeIndex = dishTypes.findIndex(
          (dishType) => dishType.id === item.dishTypeId
        );
        if (dishTypeIndex === -1) {
          throw new Error("Invalid dish type");
        }
        if (
          dishTypes[dishTypeIndex].dishes.findIndex(
            (dish) => dish.id === item.dishId
          ) === -1
        ) {
          throw new Error("Invalid dish");
        }
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
    const user = req.user;
    const userOrder = await createUserOrder(inviteOrder.id, user.id, detail);
    return res.status(200).json(userOrder);
  } catch (err) {
    logger.log("error", `Failed at getting menu: ${err}\n${err.stack}`);
    return res.status(500).json({ message: err.message });
  }
};

export const updateOrderController = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  try {
    const { userOrderId, detail, inviteId } = await UpdateOrderSchema.validate({
      ...req.params,
      ...req.body,
    });
    let inviteOrder = await getCachedOrder(inviteId);
    if (!inviteOrder) {
      logger.log(
        "info",
        `Getting order invite from database for id: ${inviteId}`
      );
      inviteOrder = await getInviteOrder(inviteId);
      logger.log("info", `Caching for id: ${inviteId}`);
      await cacheOrder(inviteId, inviteOrder);
      if (!inviteOrder) {
        return res.status(400).json({ message: "Invite not found" });
      }
    }
    const dishTypes = inviteOrder.menu.dishTypes;
    try {
      detail.forEach((item) => {
        const dishTypeIndex = dishTypes.findIndex(
          (dishType) => dishType.id === item.dishTypeId
        );
        if (dishTypeIndex === -1) {
          throw new Error("Invalid dish type");
        }
        if (
          dishTypes[dishTypeIndex].dishes.findIndex(
            (dish) => dish.id === item.dishId
          ) === -1
        ) {
          throw new Error("Invalid dish");
        }
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
    const newUserOrder = await updateUserOrder(userOrderId, detail);
    return res.status(200).json(newUserOrder);
  } catch (err) {
    logger.log("error", `Failed at getting menu: ${err}\n${err.stack}`);
    return res.status(500).json({ message: err.message });
  }
};

export const getOrdersController = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  try {
    const { inviteId } = await ConfirmOrderSchema.validate(req.params);
    let inviteOrder = await getCachedOrder(inviteId);
    if (!inviteOrder) {
      logger.log(
        "info",
        `Getting order invite from database for id: ${inviteId}`
      );
      inviteOrder = await getInviteOrder(inviteId);
      logger.log("info", `Caching for id: ${inviteId}`);
      await cacheOrder(inviteId, inviteOrder);
      if (!inviteOrder) {
        return res.status(400).json({ message: "Invite not found" });
      }
    }
    if (inviteOrder.createdUserId !== req.user.id) {
      return res.status(401).json({ message: "Not allowed to get orders" });
    }
    const orders = await getOrdersOfInvitation(inviteOrder.id);
    console.log(orders);
    return res.status(200).json(orders);
  } catch (err) {
    logger.log("error", `Failed at getting menu: ${err}\n${err.stack}`);
    return res.status(500).json({ message: err.message });
  }
};

export const confirmOrderController = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  try {
    const { inviteId } = await ConfirmOrderSchema.validate(req.params);
    // TODO: verify privilege
    const canConfirm = await canOrderBeConfirmed(inviteId);
    if (!canConfirm) {
      throw new Error("Order can't be confirmed");
    }
    const confirmedOrder = await confirmOrder(inviteId);
    const finalOrder = calculateFinalOrder(confirmedOrder);
    return res.status(200).json({ ...confirmedOrder, finalOrder });
  } catch (err) {
    logger.log("error", `Failed at getting menu: ${err}\n${err.stack}`);
    return res.status(500).json({ message: err.message });
  }
};

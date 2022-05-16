import { IAuthenticatedRequest } from "../middlewares/interface/authenticate";
import { Response } from "express";
import { CreateInviteSchema, GetInviteSchema } from "./validators/order";
import { nanoid } from 'nanoid/async'
import { cacheOrder, createOrder, doesInviteIdExist, getCachedOrder, getInviteOrder } from "../services/order";
import { getRestaurantInfo } from "../services/restaurant";
import logger from "../utils/logger";
import { getUser } from "../services/user";

export const createInviteController = async (req: IAuthenticatedRequest, res: Response) => {
  try {  
    const {restaurantId} = await CreateInviteSchema.validate(req.body);
    let isInviteIdUnique = false;
    let inviteId: string;
    while (!isInviteIdUnique) {
      inviteId = await nanoid(10);
      isInviteIdUnique = !(await doesInviteIdExist(inviteId));
    }
    const restaurant = await getRestaurantInfo(restaurantId);
    if (!restaurant) {
      return res.status(400).json({message: 'Restaurant not found'});
    }
    const user = await getUser(req.phoneNumber);
    const {menu, ...orderRestaurant} = restaurant;
    const inviteOrder = await createOrder(inviteId, restaurantId, user.id, orderRestaurant, restaurant.menu);
    await cacheOrder(inviteId, inviteOrder);
    return res.status(200).json(inviteOrder);
  } catch (err) {
    logger.log('error', `Failed at getting menu: ${err}\n${err.stack}`);
    return res.status(500).json({ message: err.message });
  }
}

export const getInviteController = async (req: IAuthenticatedRequest, res: Response) => {
  try {
    const {inviteId} = await GetInviteSchema.validate(req.params);
    let inviteOrder = await getCachedOrder(inviteId);
    if (!inviteOrder) {
      logger.log('info', `Getting order invite from database for id: ${inviteId}`);
      inviteOrder = await getInviteOrder(inviteId);
      logger.log('info', `Caching for id: ${inviteId}`);
      await cacheOrder(inviteId, inviteOrder);

      if (!inviteOrder) {
        return res.status(400).json({message: 'Invite not found'});
      }
    }
    return res.status(200).json(inviteOrder);
  } catch (err) {
    logger.log('error', `Failed at getting menu: ${err}\n${err.stack}`);
    return res.status(500).json({ message: err.message });
  }
};
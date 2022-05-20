import { Order, OrderDetail, OrderMenu, OrderRestaurant } from "@prisma/client";
import { getPrismaClient } from "../prisma";
import { getRedisClient } from "../redis";

export const doesInviteIdExist = async (inviteId: string) => {
  const prisma = getPrismaClient();
  const order = await prisma.order.findUnique({
    where: {
      inviteId
    }
  })
  return !!order;
};

export const createOrder = async (inviteId: string, restaurantId: number, userId: string, restaurant: OrderRestaurant, menu: OrderMenu) => {
  const prisma = getPrismaClient();
  return prisma.order.create({
    data: {
      inviteId,
      restaurantId,
      restaurant,
      menu,
      createdBy: {
        connect: {
          id: userId
        }
      }
    }
  })
}

export const getInviteOrder = async (inviteId: string) => {
  const prismaClient = getPrismaClient();
  return prismaClient.order.findUnique({
    where: {
      inviteId
    }
  })
}

export const cacheOrder = async (inviteId: string, order: Order) => {
  const redisClient = getRedisClient()
  return redisClient.set(inviteId, JSON.stringify(order), 'EX', 60 * 60 * 24);
}

export const getCachedOrder = async (inviteId: string): Promise<Order> => {
  const redisClient = getRedisClient()
  const order = await redisClient.get(inviteId)
  return JSON.parse(order);
}

export const createUserOrder = async (orderId: string, userId: string, detail: OrderDetail[]) => {
  const prisma = getPrismaClient();
  return prisma.userOrder.create({
    data: {
      user: {
        connect: {
          id: userId
        }
      },
      order: {
        connect: {
          id: orderId
        }
      },
      detail
    }
  })
}
import {
  Order,
  OrderDetail,
  OrderMenu,
  OrderRestaurant,
  OrderStatus,
  User,
  UserOrder,
} from "@prisma/client";
import { getPrismaClient } from "../prisma";
import { getRedisClient } from "../redis";

export const doesInviteIdExist = async (inviteId: string) => {
  const prisma = getPrismaClient();
  const order = await prisma.order.findUnique({
    where: {
      inviteId,
    },
  });
  return !!order;
};

export const createOrder = async (
  inviteId: string,
  restaurantId: number,
  userId: string,
  restaurant: OrderRestaurant,
  menu: OrderMenu
) => {
  const prisma = getPrismaClient();
  return prisma.order.create({
    data: {
      inviteId,
      restaurantId,
      restaurant,
      menu,
      createdBy: {
        connect: {
          id: userId,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

export const getInviteOrder = async (inviteId: string) => {
  const prismaClient = getPrismaClient();
  return prismaClient.order.findUnique({
    where: {
      inviteId,
    },
  });
};

export const cacheOrder = async (inviteId: string, order: Order) => {
  const redisClient = getRedisClient();
  return redisClient.set(inviteId, JSON.stringify(order), "EX", 60 * 60 * 24);
};

export const getCachedOrder = async (inviteId: string): Promise<Order> => {
  const redisClient = getRedisClient();
  const order = await redisClient.get(inviteId);
  return JSON.parse(order);
};

export const createUserOrder = async (
  orderId: string,
  userId: string,
  detail: OrderDetail[]
) => {
  const prisma = getPrismaClient();
  return prisma.userOrder.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      order: {
        connect: {
          id: orderId,
        },
      },
      detail,
    },
  });
};

export const changeOrderStatus = async (
  inviteId: string,
  status: OrderStatus
) => {
  const prisma = getPrismaClient();
  return prisma.order.update({
    where: {
      inviteId,
    },
    data: {
      status,
    },
    include: {
      orders: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phoneNumber: true,
            },
          },
        },
      },
    },
  });
};

export const isOrderInStatus = async (
  inviteId: string,
  validation: (status: OrderStatus) => boolean
) => {
  const prisma = getPrismaClient();
  const orderStatus = await prisma.order.findUnique({
    where: {
      inviteId,
    },
    select: {
      status: true,
    },
  });
  return validation(orderStatus.status);
};

type ConfirmedOrder = Order & {
  orders: (UserOrder & {
    user: {};
  })[];
};

export const calculateFinalOrder = (confirmedOrder: ConfirmedOrder) =>
  confirmedOrder.orders.reduce((finalOrder, order) => {
    order.detail.forEach((item) => {
      if (finalOrder[item.dishId]) {
        finalOrder[item.dishId] += item.quantity;
        return;
      }
      finalOrder[item.dishId] = item.quantity;
    });
    return finalOrder;
  }, {});

export const updateUserOrder = (userOrderId: string, detail: OrderDetail[]) => {
  const prisma = getPrismaClient();
  return prisma.userOrder.update({
    where: {
      id: userOrderId,
    },
    data: {
      detail,
    },
  });
};

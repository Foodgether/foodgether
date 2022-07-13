import { getPrismaClient } from "../prisma";

export const getUserOrderByOrderId = async (
  orderId: string,
  userId: string
) => {
  const prisma = getPrismaClient();
  return prisma.userOrder.findFirst({
    where: {
      orderId,
      userId,
    },
  });
};

export const getOrdersOfInvitation = async (orderId: string) => {
  const prisma = getPrismaClient();
  return prisma.userOrder.findMany({
    where: {
      orderId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          phoneNumber: true,
        },
      },
    },
  });
};

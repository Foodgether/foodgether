import { getPrismaClient } from "../prisma";

export const getUserOrderByOrderId = async (orderId: string, userId: string) => {
  const prisma = getPrismaClient();
  return prisma.userOrder.findFirst({
    where: {
      orderId,
      userId
    }
  })
}
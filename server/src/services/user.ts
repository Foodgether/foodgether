import { getPrismaClient } from '../prisma';
import { ICreateUserBody } from '../controllers/interface/user';
import { hashPin } from './auth';

export const createUser = async (newUser: ICreateUserBody) => {
  const prisma = getPrismaClient();
  const hashedPin = await hashPin(newUser.pin);
  return prisma.user.create({
    data: { ...newUser, pin: hashedPin },
  });
};

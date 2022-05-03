import { PrismaClient } from '@prisma/client'
import logger from './utils/logger'

const prisma = new PrismaClient()

export const initPrismaClient = async () => {
  await prisma.$connect()
  logger.log("info", "Successfully connected to Prisma")
}

export const getPrismaClient = () => {
  return prisma
}

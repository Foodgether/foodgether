import Redis from 'ioredis'
import logger from './utils/logger';

const redisPort = parseInt(process.env.FOODGETHER_REDIS_PORT) || 6379
const redisHost = process.env.FOODGETHER_REDIS_HOST || 'localhost'

let redisClient : Redis;

export const initRedis = async () => {
  redisClient = new Redis(redisPort, redisHost, {
    password: process.env.FOODGETHER_REDIS_PASSWORD || ""
  });
  const status = await redisClient.ping()
  if (status !== "PONG") {
    throw "Redis connection failed"
  }
  logger.log("info", "Successfully connected to Redis")
}
export const getRedisClient = (): Redis => redisClient
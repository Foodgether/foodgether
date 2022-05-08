import Redis from 'ioredis';
import logger from './utils/logger';

let redisClient : Redis;

export const initRedis = async () => {
  const redisPort = parseInt(process.env.FOODGETHER_REDIS_PORT, 10) || 6379;
  const redisHost = process.env.FOODGETHER_REDIS_HOST || 'localhost';
  const FOODGETHER_REDIS_PASSWORD = process.env.FOODGETHER_REDIS_PASSWORD || '12345';

  redisClient = new Redis(redisPort, redisHost, {
    password: FOODGETHER_REDIS_PASSWORD,
  });
  const status = await redisClient.ping();
  if (status !== 'PONG') {
    throw new Error('Redis connection failed');
  }
  logger.log('info', 'Successfully connected to Redis');
};
export const getRedisClient = (): Redis => redisClient;

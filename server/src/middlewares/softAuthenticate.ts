import { User } from "@prisma/client";
import { NextFunction, Response } from "express";
import { getRedisClient } from "../redis";
import { verifyToken } from "../services/auth";
import { getUser } from "../services/user";
import logger from "../utils/logger";
import { IAuthenticatedRequest } from "./interface/authenticate";

// eslint-disable-next-line consistent-return
export default async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;
  if (!token) {
    next();
    return;
  }
  try {
    const phoneNumber = verifyToken(token);
    if (!phoneNumber) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.phoneNumber = phoneNumber;
    const redisClient = getRedisClient();
    let user: User;
    let userString = await redisClient.get(`user-${phoneNumber}`);
    if (!userString) {
      user = await getUser(phoneNumber);
      if (!user) {
        next();
        return;
      }
      logger.log("info", `Caching user ${phoneNumber} to Redis`);
      await redisClient.set(
        `user-${phoneNumber}`,
        JSON.stringify(user),
        "EX",
        5 * 60
      );
    } else {
      logger.log("info", `Found user ${phoneNumber} in Redis`);
      user = JSON.parse(userString) as User;
    }
    req.user = user;
    next();
  } catch (err) {
    logger.log("err", `${err} \n ${err.stack}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

import { Request, Response } from 'express';
import { CreateUserSchema } from './validators/user';
import { createUser } from '../services/user';
import logger from '../utils/logger';
import { ICreateUserBody } from './interface/user';

export const createUserController = async (req: Request, res: Response) => {
  let createUserRequest: ICreateUserBody;
  try {
    createUserRequest = await CreateUserSchema.validate(req.body);
  } catch (err) {
    logger.log('info', `Failed user creation validator: ${err}`);
    return res.status(400).json({ ...err });
  }
  try {
    const { pin, ...user } = await createUser(createUserRequest);
    return res.status(200).json({ ...user });
  } catch (err) {
    logger.log('error', `Failed at creating user: ${err}`);
    return res.status(500).json({ message: err.message });
  }
};

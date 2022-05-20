import { Request, Response } from 'express';
import { CreateUserSchema } from './validators/user';
import { createUser, getUser } from '../services/user';
import logger from '../utils/logger';
import { ICreateUserBody } from './interface/user';
import { generateToken } from '../services/auth';
import { IAuthenticatedRequest } from '../middlewares/interface/authenticate';

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
    const token = generateToken(user.phoneNumber);
    return res.status(200).cookie('token', token, { maxAge: 24 * 60 * 60 * 1000, secure: true, httpOnly: true, path: '/' }).json({ user, token });
  } catch (err) {
    logger.log('error', `Failed at creating user: ${err}`);
    return res.status(500).json({ message: err.message });
  }
};

export const getCurrentUserController = async (req: IAuthenticatedRequest, res: Response) => {
  try {
    const user = await getUser(req.phoneNumber);
    return res.status(200).json({ user, token: req.cookies.token });
  } catch (err) {
    logger.log('error', `Failed at getting current user: ${err}`);
    return res.status(500).json({ message: err.message });
  }
};

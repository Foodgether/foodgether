import { Response } from 'express';
import { IAuthenticatedRequest } from '../middlewares/interface/authenticate';
import { compareHash, generateToken } from '../services/auth';
import { getUser } from '../services/user';
import logger from '../utils/logger';
import { LoginSchema } from './validators/auth';

export const loginControler = async (req: IAuthenticatedRequest, res: Response) => {
  try {
    if (req.cookies.token) {
      return res.status(400).json({ message: 'You are already logged in' });
    }
    const loginInfo = await LoginSchema.validate(req.body);
    const user = await getUser(loginInfo.phoneNumber);
    if (!user) {
      return res.status(401).json({ message: 'Wrong phone number or password' });
    }
    const verifyPinResult = await compareHash(loginInfo.pin, user.pin);
    if (!verifyPinResult) {
      return res.status(401).json({ message: 'Wrong phone number or password' });
    }
    const { pin, ...userInfo } = user;
    const token = generateToken(loginInfo.phoneNumber);
    return res.status(200).cookie('token', token, { maxAge: 24 * 60 * 60 * 1000 }).json({ token, user: userInfo });
  } catch (err) {
    logger.log('error', `Failed at creating user: ${err}`);
    return res.status(500).json({ message: err.message });
  }
};

export const logoutController = (req: IAuthenticatedRequest, res: Response) => {
  try {
    if (!req.cookies.token) {
      return res.status(400).json({ message: 'you are not logged in' });
    }
    return res.status(200).clearCookie('token').json({ message: 'Logout successfully' });
  } catch (err) {
    logger.log('error', `Failed at creating user: ${err}`);
    return res.status(500).json({ message: err.message });
  }
};

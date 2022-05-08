import { NextFunction, Response } from 'express';
import { verifyToken } from '../services/auth';
import { IAuthenticatedRequest } from './interface/authenticate';

// eslint-disable-next-line consistent-return
export default async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const phoneNumber = verifyToken(token);
    if (!phoneNumber) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.phoneNumber = phoneNumber;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from './interface/auth';

const JWT_SECRET = process.env.JWT_SECRET || '12345';

export const hashPin = async (pin: string) => bcrypt.hash(pin, 10);

export const compareHash =
  async (pin: string, hash: string): Promise<boolean> => bcrypt.compare(pin, hash);

export const generateToken = (phoneNumber: string): string => jwt.sign({ data: { phoneNumber } }, JWT_SECRET, { expiresIn: '24h' });

export const verifyToken = (token: string) => {
  const payload = jwt.verify(token, JWT_SECRET) as IJwtPayload;
  return payload.data.phoneNumber;
};

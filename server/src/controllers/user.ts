import { Request, Response } from 'express';

export const createUserController = async (req: Request, res: Response) => {
  return res.status(200).json({});
}
import { Request } from 'express';

export interface IAuthenticatedRequest extends Request {
  phoneNumber?: string;
}

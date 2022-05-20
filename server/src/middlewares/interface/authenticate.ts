import { User } from "@prisma/client";
import { Request } from "express";

export interface IAuthenticatedRequest extends Request {
  phoneNumber: string;
  user: User;
}

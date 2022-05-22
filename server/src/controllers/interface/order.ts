import { Order, UserOrder } from "@prisma/client";

export interface GetInviteResponse {
  order?: Order;
  myOrder?: UserOrder
}
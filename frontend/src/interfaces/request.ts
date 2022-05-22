import { Restaurant } from './restaurant';
import { Menu } from './menu';
import { OrderStatus } from '../enums';

export interface GetMenuResult {
  menu: Menu;
  restaurant: Restaurant;
}

export interface Order extends GetMenuResult {
  id: string;
  createdUserId: string;
  inviteId: string;
  status: OrderStatus;
}

export interface GetInviteResult {
  order: Order;
  myOrder: any;
}

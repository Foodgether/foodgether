import { Restaurant } from './restaurant'
import { Menu } from './menu'
import { OrderStatus } from '../enums'

export interface GetMenuResult {
  menu: Menu
  restaurant: Restaurant
}

export interface Invitation extends GetMenuResult {
  id: string
  createdUserId: string
  inviteId: string
  status: OrderStatus
}

export interface GetInviteResult {
  order: Invitation
  myOrder: any
}

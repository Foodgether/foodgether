import { Restaurant } from "./restaurant";
import { Menu } from "./menu";

export interface GetMenuResult {
  menu: Menu;
  restaurant: Restaurant;
}

export interface GetInviteResult extends GetMenuResult {
  id: string;
  createdUserId: string;
  inviteId: string;
}

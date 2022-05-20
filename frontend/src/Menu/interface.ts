import { Restaurant } from "../interfaces/restaurant";
import { Photo } from "../interfaces/shared";

export type GetMenuResult = {
  menu: {
    dishTypes: DishType[];
    id: string;
    restaurantId: number;
  };
  restaurant: Restaurant;
};

export type DishType = {
  dishes: Dish[];
  id: number;
  name: string;
};

export type Dish = {
  id: number;
  name: string;
  description?: string;
  price: {
    text: string;
    unit: string;
    value: number;
  };
  discountPrice?: {
    text: string;
    unit: string;
    value: number;
  };
  isAvailable: boolean;
  isActive: boolean;
  photos: Photo[];
};

import { Photo } from "./shared";

export interface Menu {
  dishTypes: DishType[];
  id: string;
  restaurantId: number;
}

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

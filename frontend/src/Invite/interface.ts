import { GetMenuResult } from '../Menu/interface';

export interface GetInviteResult extends GetMenuResult {
  id: string;
  createdUserId: string;
  inviteId: string;
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

export type Photo = {
  width: number;
  height: number;
  value: string;
};

export type Restaurant = {
  id: string;
  restaurantId: number;
  deliveryId: number;
  name: string;
  url: string;
  address: string;
  position: {
    latitude: number;
    longitude: number;
  };
  priceRange: {
    minPrice: number;
    maxPrice: number;
  };
  isQualityMerchant: boolean;
};

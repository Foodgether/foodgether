export type MenuState = {
  menu: DishType[];
};

export type DishType = {
  dishes: Dish[];
  dish_type_id: number;
  dish_type_name: string;
};

export type Dish = {
  name: string;
  price: {
    text: string;
    unit: string;
    value: number;
  };
  photos: Photo[];
  is_available: boolean;
  id: number;
  description?: string;
  discount_price?: {
    text: string;
    unit: string;
    value: number;
  };
};

export type Photo = {
  width: number;
  height: number;
  value: string;
};

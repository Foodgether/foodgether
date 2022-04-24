export type MenuState = {
  menu: DishType[];
}

export type DishType = {
  dishes: Dish[];
}

export type Dish = {
  name: string;
  price: {
    text: string;
    unit: string;
    value: number;
  };
  photos: Photo[];
  is_available: boolean;
}

export type Photo = {
  width: number;
  height: number;
  value: string;
}

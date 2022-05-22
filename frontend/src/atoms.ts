import { atom } from 'jotai';

export const userAtom = atom<UserAtom | UserAtomAuthenticated>({
  fetching: true,
  loggedIn: false,
});
export const tokenAtom = atom<TokenAtom>('');
export const cartAtom = atom<DishInOrder[]>([]);
export const currentStateAtom = atom<CurrentStateAtom>({
  currentMenu: '',
  currentRestaurant: 0,
});

export const initialOrderAtomValue = {
  isSubmitted: false,
  orderId: '',
};
export const orderAtom = atom<OrderAtom>(initialOrderAtomValue);

type TokenAtom = string;

interface UserAtom {
  fetching: boolean;
  loggedIn: boolean;
}

interface UserAtomAuthenticated extends UserAtom {
  id: string;
  name: string;
  phoneNumber: string;
  pin: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CartAtom = DishInOrder[];

export interface DishInOrder {
  dishId: number;
  dishTypeId: number;
  quantity: number;
}

interface CurrentStateAtom {
  currentRestaurant: number;
  currentMenu: string;
}

export interface OrderAtom {
  isSubmitted: boolean;
  orderId: string;
}

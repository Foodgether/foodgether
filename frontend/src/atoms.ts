import { atom } from 'jotai';

export const userAtom = atom<UserAtom | UserAtomAuthenticated>({
  fetching: true,
  loggedIn: false,
});
export const tokenAtom = atom<TokenAtom>('');
export const cartAtom = atom<CartAtom>({});
export const currentStateAtom = atom<CurrentStateAtom>({
  currentMenu: '',
  currentRestaurant: 0,
});

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

interface CartAtom {
  [key: string]: DishInOrder[];
}

interface DishInOrder {
  dishId: number;
  dishTypeId: number;
  quantity: number;
}

interface CurrentStateAtom {
  currentMenu: string;
  currentRestaurant: number;
}

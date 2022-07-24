import { atom } from 'jotai'
import { cartAtom, DishInOrder } from '../atoms'

export const setCartDetailAtom = atom(null, (get, set, detail) => {
  const cartDetail = detail as DishInOrder[]
  set(cartAtom, { ...get(cartAtom), detail: cartDetail })
})

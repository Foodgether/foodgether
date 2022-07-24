import { Photo } from './shared'

export interface Menu {
  dishTypes: DishType[]
  id: string
  restaurantId: number
}

export type DishType = {
  dishes: Dish[]
  id: number
  name: string
}

export type Dish = {
  id: number
  name: string
  description?: string
  price: Price
  discountPrice?: Price
  isAvailable: boolean
  isActive: boolean
  photos: Photo[]
}

export type Price = {
  text: string
  unit: string
  value: number
}

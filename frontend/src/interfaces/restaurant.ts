import { Photo } from './shared'

export interface Restaurant {
  id: string
  restaurantId: number
  deliveryId: number
  name: string
  url: string
  address: string
  position: {
    latitude: number
    longitude: number
  }
  priceRange: {
    minPrice: number
    maxPrice: number
  }
  isQualityMerchant: boolean
  photos: Photo[]
}

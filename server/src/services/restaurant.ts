import { getPrismaClient } from "../prisma";
import { Restaurant } from "../scraper/menu/shopeeMenuIdentifier";

export const upsertRestaurant = async (restaurant: Restaurant) => {
  const prisma = getPrismaClient();
  const parsedRestaurant = {
    restaurantId: restaurant.restaurant_id,
    deliveryId: restaurant.delivery_id,
    name: restaurant.name,
    url: restaurant.url,
    address: restaurant.address,
    position: {
      latitude: restaurant.position.latitude,
      longitude: restaurant.position.longitude,
    },
    priceRange: {
      minPrice: restaurant.price_range.min_price,
      maxPrice: restaurant.price_range.max_price,
    },
    isQualityMerchant: restaurant.is_quality_merchant,
    photos: restaurant.photos,
  };
  return prisma.restaurant.upsert({
    where: {
      restaurantId: restaurant.restaurant_id,
    },
    update: parsedRestaurant,
    create: parsedRestaurant,
  });
};

export const setMenuIdToRestaurant = (restaurantId: number, menuId: string) => {
  const prisma = getPrismaClient();
  return prisma.restaurant.update({
    where: {
      restaurantId,
    },
    data: {
      menu: {
        connect: {
          id: menuId,
        },
      },
    },
  });
};

export const getRestaurantInfo = (restaurantId: number) => {
  const prisma = getPrismaClient();
  return prisma.restaurant.findUnique({
    where: {
      restaurantId,
    },
    include: {
      menu: true,
    },
  });
};

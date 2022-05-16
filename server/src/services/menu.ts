import { getPrismaClient } from "../prisma"
import { Menu } from "../scraper/menu/shopeeMenuIdentifier";

export const upsertMenu = (menu: Menu[], restaurantId: string, menuId?: string) => {
  const prisma = getPrismaClient();
  const dishTypes = menu.map(dishType => {
    return {
      id: dishType.dish_type_id,
      name: dishType.dish_type_name,
      dishes: dishType.dishes.map(dish => {
        return {
          id: dish.id,
          name: dish.name,
          description: dish.description,
          price: dish.price,
          discountPrice: dish.discount_price,
          isAvailable: dish.is_available,
          isActive: dish.is_active,
        }
      })
    }
  })
  if (menuId) {
    return prisma.menu.update({
      where: {
        id: menuId
      },
      data: {dishTypes}
    })
  }
  return prisma.menu.create({
    data: {
      restaurant: {
        connect: {
          id: restaurantId
        }
      },
      dishTypes
    }
  })
}

export const doesMenuExist = async (restaurantId: string) => {
  const prisma = getPrismaClient();
  const menu = await prisma.menu.findUnique({
    where: {
      restaurantId
    }
  })
  return menu ? menu.id : null
}
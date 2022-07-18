import { getPrismaClient } from "../prisma";
import { Menu } from "../scraper/menu/shopeeMenuIdentifier";

export const upsertMenu = (
  menu: Menu[],
  restaurantId: string,
  menuId?: string
) => {
  const prisma = getPrismaClient();
  const dishTypes = menu.map((dishType) => {
    return {
      id: dishType.dish_type_id,
      name: dishType.dish_type_name,
      dishes: dishType.dishes.map((dish) => {
        return {
          id: dish.id,
          name: dish.name,
          description: dish.description,
          price: dish.price,
          discountPrice: dish.discount_price,
          isAvailable: dish.is_available,
          isActive: dish.is_active,
          photos: dish.photos,
          options: dish.options.map((option) => {
            return {
              ntop: option.ntop,
              mandatory: option.mandatory,
              id: option.id,
              name: option.name,
              optionItems: {
                minSelect: option.option_items.min_select,
                maxSelect: option.option_items.max_select,
                items: option.option_items.items.map((item) => {
                  return {
                    id: item.id,
                    name: item.name,
                    weight: item.weight,
                    ntopPrice: item.ntop_price,
                    maxQuantity: item.max_quantity,
                    isDefault: item.is_default,
                    topOrder: item.top_order,
                    price: item.price,
                  };
                }),
              },
            };
          }),
        };
      }),
    };
  });
  if (menuId) {
    return prisma.menu.update({
      where: {
        id: menuId,
      },
      data: { dishTypes, updatedAt: new Date() },
    });
  }
  return prisma.menu.create({
    data: {
      restaurant: {
        connect: {
          id: restaurantId,
        },
      },
      dishTypes,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

export const doesMenuExist = async (restaurantId: string) => {
  const prisma = getPrismaClient();
  const menu = await prisma.menu.findUnique({
    where: {
      restaurantId,
    },
  });
  return menu ? menu.id : null;
};

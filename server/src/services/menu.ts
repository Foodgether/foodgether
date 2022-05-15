import { getPrismaClient } from "../prisma"
import { Menu } from "../scraper/menu/shopeeMenuIdentifier";

export const upsertMenu = (menu: Menu[], restaurantId: string, menuId?: string) => {
  const prisma = getPrismaClient();
  const dishTypes = menu
  if (menuId) {
    prisma.menu.update({
      where: {
        id: menuId
      },
      data: {

      }
    })
  }
}
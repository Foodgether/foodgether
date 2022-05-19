import { Button, Text } from "@nextui-org/react";
import React from "react";
import { CartAtom, DishInOrder } from "../atoms";
import CartItem from "./CartItem";
import { DishType } from "./interface";
import { DishRenderItem } from "./Invite";

interface CartContentProps {
  dishes: DishRenderItem[];
  cart: CartAtom;
  currentCart: DishInOrder[];
  menu: {
    dishTypes: DishType[];
    id: string;
    restaurantId: number;
  };
}

const CartContent = ({ dishes, cart, currentCart, menu }: CartContentProps) => {
  const handleConfirmOrder = async () => {};

  const totalPrice = currentCart.reduce((total, item) => {
    const orderDishType = menu.dishTypes.find(
      (dishType) => dishType.id === item.dishTypeId
    );
    if (!orderDishType) {
      return total;
    }
    const dish = orderDishType.dishes.find((dish) => dish.id === item.dishId);
    if (!dish) {
      return total;
    }
    const price =
      item.quantity *
      (dish.discountPrice ? dish.discountPrice.value : dish.price.value);
    return total + price;
  }, 0);

  return (
    <div style={{ width: "20em" }}>
      {dishes.reduce((acc: any[], dish: DishRenderItem) => {
        const isDish = "price" in dish;
        if (!isDish) {
          return acc;
        }
        const order = cart[dish.orderId];
        if (!order) {
          return acc;
        }
        const targetDish = order.find((item) => item.dishId === dish.id);
        if (!targetDish || targetDish.quantity === 0) {
          return acc;
        }
        return acc.concat(
          <CartItem
            key={dish.id}
            {...dish}
            price={dish.discountPrice ? dish.discountPrice : dish.price}
          />
        );
      }, [])}
      <Text>{totalPrice}</Text>
      <Button auto flat onClick={handleConfirmOrder} css={{ m: "auto" }}>
        Confirm
      </Button>
    </div>
  );
};

export default CartContent;

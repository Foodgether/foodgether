import React from "react";
import { Button, Text } from "@nextui-org/react";
import { CartAtom, DishInOrder } from "../atoms";
import CartItem from "./CartItem";
import { DishType, Price } from "../interfaces/menu";
import { DishRenderItem } from "./Invite";

interface CartContentProps {
  dishes: DishRenderItem[];
  cart: CartAtom;
  currentCart: DishInOrder[];
  prices: {
    [key: string]: Price;
  };
}

const CartContent = ({
  dishes,
  cart,
  currentCart,
  prices,
}: CartContentProps) => {
  const handleConfirmOrder = async () => {};

  const totalPrice = currentCart.reduce((total, item) => {
    return total + item.quantity * prices[item.dishId].value;
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

import React from 'react';
import { Button, Text } from '@nextui-org/react';
import { CartAtom, DishInOrder } from '../atoms';
import CartItem from './CartItem';
import { Price } from '../interfaces/menu';
import { DishRenderItem } from './Invite';
import { BACKEND_URL } from '../config';
import Swal from 'sweetalert2';

interface CartContentProps {
  inviteId: string;
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
  inviteId,
}: CartContentProps) => {
  const handleSendOrder = async () => {
    const rawSendOrderResponse = await fetch(
      `${BACKEND_URL}/order/${inviteId}/order`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ detail: currentCart }),
      }
    );
    if (!rawSendOrderResponse.ok) {
      const { message } = await rawSendOrderResponse.json();
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
    const SendOrderResponse = await rawSendOrderResponse.json();
    await Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Send order successfully',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const totalPrice = currentCart.reduce((total, item) => {
    return total + item.quantity * prices[item.dishId].value;
  }, 0);

  return (
    <div style={{ width: '20em' }}>
      {dishes.reduce((acc: any[], dish: DishRenderItem) => {
        const isDish = 'price' in dish;
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
      <Button auto flat onClick={handleSendOrder} css={{ m: 'auto' }}>
        Confirm
      </Button>
    </div>
  );
};

export default CartContent;

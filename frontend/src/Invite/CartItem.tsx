import React from "react";
import {
  Button,
  Card as NextCard,
  Grid,
  Spacer,
  Text,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import { cartAtom } from "../atoms";

interface CardMenuProps {
  id: number;
  name: string;
  photos: Photo[];
  price: {
    text: string;
    unit: string;
    value: number;
  };
  description?: string;
  dishTypeId: number;
  orderId: string;
}

type Photo = {
  width: number;
  height: number;
  value: string;
};

const CartItem = (props: CardMenuProps) => {
  const [cart, setCart] = useAtom(cartAtom);
  let quantity = 0;
  const order = cart[props.orderId];
  if (order) {
    const dish = order.find((item) => item.dishId === props.id);
    if (dish) {
      quantity = dish.quantity;
    }
  }

  const { name, price, photos } = props;
  const photo = photos[0];
  const handleIncrement = () => {
    handleOrder(quantity + 1);
  };
  const handleDecrement = () => {
    handleOrder(quantity - 1);
  };
  const handleOrder = (quantity: number) => {
    let newCart;
    if (!cart[props.orderId]) {
      const newOrderId = [
        { dishId: props.id, dishTypeId: props.dishTypeId, quantity },
      ];
      newCart = { ...cart, [props.orderId]: newOrderId };
    } else {
      const order = cart[props.orderId];
      const itemIndex = order.findIndex((item) => item.dishId === props.id);
      if (itemIndex === -1) {
        const newDish = [
          ...order,
          { dishId: props.id, dishTypeId: props.dishTypeId, quantity },
        ];
        newCart = { ...cart, [props.orderId]: newDish };
      } else {
        let newOrder = cart[props.orderId].splice(itemIndex, 1);
        newOrder = [
          ...cart[props.orderId],
          { dishId: props.id, dishTypeId: props.dishTypeId, quantity },
        ];
        newCart = { ...cart, [props.orderId]: newOrder };
      }
    }
    setCart(newCart);
  };

  return (
    <NextCard hoverable animated>
      <NextCard.Body css={{ p: 0 }}>
        <Grid.Container justify="center">
          <Grid xs={12} md={6}>
            <NextCard.Image
              objectFit="scale-down"
              src={photo.value}
              alt={name}
            />
          </Grid>
          <Grid xs={12} md={6} direction={"column"}>
            <Text h5>{name}</Text>
            <Text h6 css={{ color: "$red500", fontWeight: "$semibold" }}>
              {price.text}
            </Text>
            <Spacer y={0.5} />
            {quantity !== 0 && (
              <>
                <Button.Group>
                  <Button
                    onClick={handleDecrement}
                    color="gradient"
                    auto
                    ghost
                    css={{ width: "1em", height: "2em" }}
                    size="sm"
                  >
                    -
                  </Button>
                  <Text h6 css={{ color: "$red500", fontWeight: "$semibold" }}>
                    {quantity}
                  </Text>
                  <Button
                    onClick={handleIncrement}
                    color="gradient"
                    auto
                    ghost
                    css={{ width: "1em", height: "2em" }}
                    size="sm"
                  >
                    +
                  </Button>
                </Button.Group>
                <Text margin="auto">Total: {quantity * price.value}</Text>
              </>
            )}
          </Grid>
        </Grid.Container>
      </NextCard.Body>
    </NextCard>
  );
};

export default CartItem;

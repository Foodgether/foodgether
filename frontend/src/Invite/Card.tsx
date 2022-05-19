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

const Card = (props: CardMenuProps) => {
  const [cart, setCart] = useAtom(cartAtom);
  let quantity = 0;
  const order = cart[props.orderId];
  if (order) {
    const dishIndex = order.findIndex((item) => item.dishId === props.id);
    if (dishIndex !== -1) {
      quantity = order[dishIndex].quantity;
    }
  }

  const { name, price, photos } = props;
  const photoLastIndex = photos.length - 2;
  const photo = photos[photoLastIndex];
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
    if (quantity === 0) {
      const newOrder = cart[props.orderId].filter(
        (dish) => dish.quantity !== 0
      );
      if (newOrder.length === 0) {
        newCart = { ...cart };
        delete newCart[props.orderId];
      } else {
        newCart = { ...cart, [props.orderId]: newOrder };
      }
    }
    setCart(newCart);
  };

  return (
    <NextCard hoverable animated>
      <NextCard.Body css={{ p: 0 }}>
        <Grid.Container justify="center">
          <Grid xs={12} md={2}>
            <NextCard.Image
              objectFit="scale-down"
              src={photo.value}
              alt={name}
            />
          </Grid>
          <Grid xs={1} md={0.5} />
          <Grid xs={12} md direction={"column"}>
            <Text h2>{name}</Text>
            <Text h3 css={{ color: "$red500", fontWeight: "$semibold" }}>
              {price.text}
            </Text>
            {props.description && <Spacer y={0.5} />}
            {props.description && (
              <Text css={{ color: "$accents7", fontWeight: "$semibold" }}>
                {props.description}
              </Text>
            )}
            <Spacer y={0.5} />
            {quantity !== 0 && (
              <Button.Group>
                <Button
                  onPress={handleDecrement}
                  color="gradient"
                  auto
                  ghost
                  css={{ width: "3em", height: "3em" }}
                >
                  -
                </Button>
                <Text h3 css={{ color: "$red500", fontWeight: "$semibold" }}>
                  {quantity}
                </Text>
                <Button
                  onPress={handleIncrement}
                  color="gradient"
                  auto
                  ghost
                  css={{ width: "3em", height: "3em" }}
                >
                  +
                </Button>
              </Button.Group>
            )}

            {quantity === 0 && (
              <Button
                onPress={handleIncrement}
                color="gradient"
                auto
                ghost
                css={{ width: "10em" }}
              >
                <Text h5>Order</Text>
              </Button>
            )}
          </Grid>
        </Grid.Container>
      </NextCard.Body>
    </NextCard>
  );
};

export default Card;

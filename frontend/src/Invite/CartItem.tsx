import React from "react";
import {
  Button,
  Card as NextCard,
  Grid,
  Spacer,
  Text,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import { cartAtom, orderAtom } from "../atoms";

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
  const [currentCart, setCart] = useAtom(cartAtom);
  const [order, setOrder] = useAtom(orderAtom);

  let quantity = 0;
  if (currentCart) {
    const dish = currentCart.find((item) => item.dishId === props.id);
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
    if (!currentCart) {
      setCart([{ dishId: props.id, dishTypeId: props.dishTypeId, quantity }]);
      return;
    }
    const item = currentCart.find((item) => item.dishId === props.id);
    if (!item) {
      setCart(
        currentCart.concat([
          { dishId: props.id, dishTypeId: props.dishTypeId, quantity },
        ])
      );
      return;
    }
    item.quantity = quantity;
    const newCart = currentCart.concat([]);
    setCart(newCart.filter((dish) => dish.quantity !== 0));
    setOrder({ ...order, isSubmitted: false });
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

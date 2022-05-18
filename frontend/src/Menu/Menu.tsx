import React from 'react';
import { useLocation } from 'react-router';
import Card from './Card';
import { Dish, DishType, GetMenuResult } from './interface';
import {
  Button,
  Container,
  Input,
  Popover,
  Spacer,
  Text,
} from '@nextui-org/react';
import { Virtuoso } from 'react-virtuoso';
import { useAtom } from 'jotai';
import { cartAtom } from '../atoms';
import CartItem from './CartItem';

interface DishItem extends Dish {
  dishTypeId: number;
  orderId: string;
}
type dishItem = DishItem | DishType;

const Menu = () => {
  const location = useLocation();
  const [cart, _] = useAtom(cartAtom);
  const { menu: {dishTypes} } = location.state as GetMenuResult;
  const dishes = dishTypes.reduce((acc: dishItem[], dishType) => {
    return [
      ...acc,
      dishType,
      ...dishType.dishes.map((dish) => {
        return { ...dish, dishTypeId: dishType.id, orderId: '12' };
      }),
    ];
  }, []);

  return (
    <Container
      fluid
      justify="center"
      alignItems="center"
      css={{ p: 50, height: '800px' }}
    >
      {dishTypes.length > 0 && (
        <>
          <Virtuoso
            useWindowScroll
            style={{ height: '100%' }}
            data={dishes}
            overscan={400}
            itemContent={(index, dish) => {
              const isDish = "price" in dish
              if (!isDish) {
                return (
                  <>
                    {index !== 0 && <Spacer y={5} />}
                    <Text h2>{dish.name}</Text>
                  </>
                );
              }
              if (!dish.isAvailable) {
                <></>;
              }
              return (
                <>
                  <Card
                    key={dish.id}
                    price={
                      dish.discountPrice ? dish.discountPrice : dish.price
                    }
                    name={dish.name}
                    photos={dish.photos}
                    description={dish.description}
                    id={dish.id}
                    dishTypeId={dish.dishTypeId}
                    orderId={dish.orderId}
                  />
                  <Spacer y={1} key={`spacer-${dish.id}`} />
                </>
              );
            }}
          />
        </>
      )}
      <div style={{ position: 'fixed', right: '3em', bottom: '3em' }}>
        <Popover placement="left-bottom">
          <Popover.Trigger>
            <Button auto flat>
              Open Popover
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <div style={{ width: '20em' }}>
              {dishes.reduce((acc: any[], dish: dishItem) => {
                const isDish = 'price' in dish
                if (!isDish) {
                  return acc;
                }
                const order = cart[dish.orderId];
                if (!order) {
                  return acc;
                }
                const dishIndex = order.findIndex(
                  (item) => item.dishId === dish.id
                );
                if (dishIndex === -1 || order[dishIndex].quantity === 0) {
                  return acc;
                }
                return [
                  ...acc,
                  <CartItem
                    key={dish.id}
                    price={
                      dish.discountPrice ? dish.discountPrice : dish.price
                    }
                    name={dish.name}
                    photos={dish.photos}
                    description={dish.description}
                    id={dish.id}
                    dishTypeId={dish.dishTypeId}
                    orderId={dish.orderId}
                  />,
                ];
              }, [])}
              <Button auto flat onClick={() => {}} css={{ m: 'auto' }}>
                Confirm
              </Button>
            </div>
          </Popover.Content>
        </Popover>
      </div>
    </Container>
  );
};

export default Menu;

import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import Card from './Card';
import { Dish, DishType, GetInviteResult } from './interface';
import {
  Button,
  Container,
  FormElement,
  Grid,
  Input,
  Popover,
  Spacer,
  Text,
} from '@nextui-org/react';
import { Virtuoso } from 'react-virtuoso';
import { useAtom } from 'jotai';
import { cartAtom, currentStateAtom } from '../atoms';
import CartItem from './CartItem';
import { BACKEND_URL } from '../config';
import Swal from 'sweetalert2';
import Loader from '../components/Loader';
import RestaurantInfo from '../components/RestaurantInfo';

interface DishItem extends Dish {
  dishTypeId: number;
  orderId: string;
}
type dishItem = DishItem | DishType;

const Invite = () => {
  const location = useLocation();
  const { inviteId } = useParams();
  const [cart, _] = useAtom(cartAtom);
  const [filterText, setFilterText] = useState('');
  const [inviteInfo, setInviteInfo] = useState<GetInviteResult>();

  useEffect(() => {
    const pushedInviteInfo = location.state as GetInviteResult;
    if (!pushedInviteInfo) {
      fetch(`${BACKEND_URL}/order/invite/${inviteId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then(async (rawResponse) => {
          if (!rawResponse.ok) {
            const { message } = await rawResponse.json();
            await Swal.fire({
              position: 'center',
              icon: 'error',
              title: message,
              showConfirmButton: false,
              timer: 1500,
            });
          }
          return rawResponse.json();
        })
        .then((inviteInfoResult) => {
          setInviteInfo(inviteInfoResult);
        });
    } else {
      setInviteInfo(location.state as GetInviteResult);
    }
  }, []);

  const handleChangeFilterText = (e: React.ChangeEvent<FormElement>) => {
    setFilterText(e.target.value);
  };

  const handleConfirmOrder = async () => {};

  if (!inviteInfo) {
    return <Loader isShowingLoader={!inviteInfo} loadingMessage="" />;
  }

  const dishes = inviteInfo.menu.dishTypes.reduce(
    (acc: dishItem[], dishType) => {
      const processedDishes = dishType.dishes.reduce(
        (acc: DishItem[], dish: Dish) => {
          const loweredName = dish.name.toLowerCase();
          if (loweredName.includes(filterText.toLowerCase())) {
            return [
              ...acc,
              {
                ...dish,
                dishTypeId: dishType.id,
                orderId: inviteInfo.inviteId,
              },
            ];
          }
          return acc;
        },
        []
      );
      if (processedDishes.length == 0) {
        return acc;
      }
      return [...acc, dishType, ...processedDishes];
    },
    []
  );

  7;

  return (
    <Container
      fluid
      justify="center"
      alignItems="center"
      css={{ p: 50, height: '800px', mt: '$16' }}
    >
      <RestaurantInfo />
      <Grid.Container>
        <Grid xs justify="flex-start">
          <Input
            onChange={handleChangeFilterText}
            fullWidth
            placeholder="Find your fave"
            contentLeft={
              <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"
                />
              </svg>
            }
            clearable
            aria-label="Search dish"
          />
        </Grid>
        <Grid xs justify="flex-end"></Grid>
      </Grid.Container>

      {inviteInfo.menu.dishTypes.length > 0 && (
        <>
          <Virtuoso
            useWindowScroll
            style={{ height: '100%' }}
            data={dishes}
            overscan={400}
            itemContent={(index, dish) => {
              const isDish = 'price' in dish;
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
                    price={dish.discountPrice ? dish.discountPrice : dish.price}
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
      {cart[inviteInfo.inviteId] && cart[inviteInfo.inviteId].length !== 0 && (
        <div style={{ position: 'fixed', right: '3em', bottom: '3em' }}>
          <Popover placement="top">
            <Popover.Trigger>
              <Button auto flat>
                <svg
                  className="icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                >
                  <path d="M18.936 5.564c-.144-.175-.35-.207-.55-.207h-.003L6.774 4.286c-.272 0-.417.089-.491.18-.079.096-.16.263-.094.585l2.016 5.705c.163.407.642.673 1.068.673h8.401c.433 0 .854-.285.941-.725l.484-4.571c.045-.221-.015-.388-.163-.567z" />
                  <path d="M17.107 12.5H7.659L4.98 4.117l-.362-1.059c-.138-.401-.292-.559-.695-.559H.924c-.411 0-.748.303-.748.714s.337.714.748.714h2.413l3.002 9.48c.126.38.295.52.942.52h9.825c.411 0 .748-.303.748-.714s-.336-.714-.748-.714zm-6.683 3.73a1.498 1.498 0 1 1-2.997 0 1.498 1.498 0 0 1 2.997 0zm6.429 0a1.498 1.498 0 1 1-2.997 0 1.498 1.498 0 0 1 2.997 0z" />
                </svg>
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <div style={{ width: '20em' }}>
                {dishes.reduce((acc: any[], dish: dishItem) => {
                  const isDish = 'price' in dish;
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
                <Button
                  auto
                  flat
                  onClick={handleConfirmOrder}
                  css={{ m: 'auto' }}
                >
                  Confirm
                </Button>
              </div>
            </Popover.Content>
          </Popover>
        </div>
      )}
    </Container>
  );
};

export default Invite;

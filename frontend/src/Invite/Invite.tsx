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
import { cartAtom } from '../atoms';
import { BACKEND_URL, BASE_PATH } from '../config';
import Swal from 'sweetalert2';
import Loader from '../components/Loader';
import RestaurantInfo from '../components/RestaurantInfo';
import SearchIcon from '../components/SearchIcon';
import CartIcon from '../components/CartIcon';
import CartContent from './CartContent';
import DishFilter from '../components/DishFilter';

interface DishItem extends Dish {
  dishTypeId: number;
  orderId: string;
}

export type DishRenderItem = DishItem | DishType;

const Invite = () => {
  const location = useLocation();
  const { inviteId } = useParams();
  if (!inviteId) {
    window.location.replace(BASE_PATH ? BASE_PATH : '/');
    return <></>;
  }

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

  if (!inviteInfo) {
    return <Loader isShowingLoader={!inviteInfo} loadingMessage="" />;
  }
  const { menu, restaurant } = inviteInfo;

  const dishes = menu.dishTypes.reduce((acc: DishRenderItem[], dishType) => {
    const processedDishes = dishType.dishes.reduce(
      (acc: DishItem[], dish: Dish) => {
        const loweredName = dish.name.toLowerCase();
        if (loweredName.includes(filterText.toLowerCase())) {
          return acc.concat({
            ...dish,
            dishTypeId: dishType.id,
            orderId: inviteInfo.inviteId,
          });
        }
        return acc;
      },
      []
    );
    if (processedDishes.length == 0) {
      return acc;
    }
    return acc.concat(dishType).concat(processedDishes);
  }, []);
  const currentCart = cart[inviteId];
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
          <DishFilter onChange={handleChangeFilterText} />
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
                    {...dish}
                    price={dish.discountPrice ? dish.discountPrice : dish.price}
                  />
                  <Spacer y={1} key={`spacer-${dish.id}`} />
                </>
              );
            }}
          />
        </>
      )}
      {currentCart && currentCart.length !== 0 && (
        <div style={{ position: 'fixed', right: '3em', bottom: '3em' }}>
          <Popover placement="top">
            <Popover.Trigger>
              <Button auto flat>
                <SearchIcon />
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <CartContent
                dishes={dishes}
                cart={cart}
                currentCart={currentCart}
                menu={menu}
              />
            </Popover.Content>
          </Popover>
        </div>
      )}
    </Container>
  );
};

export default Invite;

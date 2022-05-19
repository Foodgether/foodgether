import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Card from './Card';
import { Dish, DishType, GetMenuResult } from './interface';
import {
  Button,
  Container,
  FormElement,
  Grid,
  Input,
  Spacer,
  Text,
} from '@nextui-org/react';
import { Virtuoso } from 'react-virtuoso';
import { useAtom } from 'jotai';
import { cartAtom, currentStateAtom } from '../atoms';
import { BACKEND_URL, BASE_PATH } from '../config';
import Swal from 'sweetalert2';
import { GetInviteResult } from '../Invite/interface';
import RestaurantInfo from '../components/RestaurantInfo';

interface DishItem extends Dish {
  dishTypeId: number;
  orderId: string;
}
type dishItem = DishItem | DishType;

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentState, _] = useAtom(currentStateAtom);
  const [filterText, setFilterText] = useState('');
  const handleChangeFilterText = (e: React.ChangeEvent<FormElement>) => {
    setFilterText(e.target.value);
  };
  const {
    menu: { dishTypes },
  } = location.state as GetMenuResult;
  const dishes = dishTypes.reduce((acc: dishItem[], dishType) => {
    const processedDishes = dishType.dishes.reduce(
      (acc: DishItem[], dish: Dish) => {
        const loweredName = dish.name.toLowerCase();
        if (loweredName.includes(filterText.toLowerCase())) {
          return [...acc, { ...dish, dishTypeId: dishType.id, orderId: '12' }];
        }
        return acc;
      },
      []
    );
    if (processedDishes.length == 0) {
      return acc;
    }
    return [...acc, dishType, ...processedDishes];
  }, []);

  7;

  const copyToClipboard = (content: string) => {
    const el = document.createElement('textarea');
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const handleCreateInvitation = async () => {
    const createRawResponse = await fetch(`${BACKEND_URL}/order/invite`, {
      method: 'POST',
      body: JSON.stringify({
        restaurantId: currentState.currentRestaurant,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!createRawResponse.ok) {
      const { message } = await createRawResponse.json();
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const createInvitationResponse =
      (await createRawResponse.json()) as GetInviteResult;
    copyToClipboard(
      `${window.location.origin}/invite/${createInvitationResponse.inviteId}`
    );
    await Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Invitation link copied to clipboard',
      showConfirmButton: false,
      timer: 1500,
    });
    navigate(`${BASE_PATH}/invite/${createInvitationResponse.inviteId}`, {
      state: { ...createInvitationResponse },
    });
  };

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
            aria-label="Search Dish"
          />
        </Grid>
        <Grid xs justify="flex-end">
          <Button ghost onPress={handleCreateInvitation}>
            Create an invitation
          </Button>
        </Grid>
      </Grid.Container>
      {dishTypes.length > 0 && (
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
    </Container>
  );
};

export default Menu;

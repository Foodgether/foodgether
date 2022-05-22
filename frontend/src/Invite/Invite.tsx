import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { Dish, DishType } from '../interfaces/menu';
import { GetInviteResult } from '../interfaces/request';
import { Container, FormElement, Spacer } from '@nextui-org/react';
import { useAtom } from 'jotai';
import { cartAtom, userAtom } from '../atoms';
import { BACKEND_URL, BASE_PATH } from '../config';
import Swal from 'sweetalert2';
import Loader from '../components/Loader';
import InviteCommon from './InviteCommon';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import RestaurantInfo from '../components/RestaurantInfo';
import OrderInfo from './OrderInfo';

interface DishItem extends Dish {
  dishTypeId: number;
  orderId: string;
}

export type DishRenderItem = DishItem | DishType;

enum InviteTab {
  MENU = 0,
  ORDERS = 1,
}

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
  const [user, __] = useAtom(userAtom);

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

  if (!inviteInfo || user.fetching) {
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

  const prices = menu.dishTypes.reduce((priceDict, dishType) => {
    return Object.assign(
      priceDict,
      dishType.dishes.reduce((acc, dish) => {
        if (dish.discountPrice) {
          return Object.assign(acc, { [dish.id]: dish.discountPrice });
        }
        return Object.assign(acc, { [dish.id]: dish.price });
      }, {})
    );
  }, {});
  return (
    <Container>
      <RestaurantInfo {...restaurant} />
      <Spacer y={1} />
      {'id' in user && user.id === inviteInfo.createdUserId ? (
        <Tabs defaultIndex={InviteTab.MENU}>
          <TabList>
            <Tab className="react-tabs__tab text-xl font-bold text-pink-900">
              Menu
            </Tab>
            <Tab className="react-tabs__tab text-xl font-bold text-pink-900">
              Orders
            </Tab>
          </TabList>
          <TabPanel>
            <Spacer y={1} />
            <InviteCommon
              inviteInfo={inviteInfo}
              cart={cart}
              currentCart={currentCart}
              dishes={dishes}
              prices={prices}
              handleChangeFilterText={handleChangeFilterText}
            />
          </TabPanel>
          <TabPanel>
            <OrderInfo inviteId={inviteInfo.inviteId} />
          </TabPanel>
        </Tabs>
      ) : (
        <InviteCommon
          inviteInfo={inviteInfo}
          cart={cart}
          currentCart={currentCart}
          dishes={dishes}
          prices={prices}
          handleChangeFilterText={handleChangeFilterText}
        />
      )}
    </Container>
  );
};

export default Invite;

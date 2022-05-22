import React from 'react';
import Card from './Card';
import { Price } from '../interfaces/menu';
import { GetInviteResult } from '../interfaces/request';
import {
  Button,
  Container,
  FormElement,
  Grid,
  Popover,
  Spacer,
  Text,
} from '@nextui-org/react';
import { Virtuoso } from 'react-virtuoso';
import SearchIcon from '../components/SearchIcon';
import CartContent from './CartContent';
import DishFilter from '../components/DishFilter';
import { DishInOrder, orderAtom, userAtom } from '../atoms';
import { DishRenderItem } from './Invite';
import { useAtom } from 'jotai';
import { OrderStatus } from '../enums';

interface InviteCommonProps {
  inviteInfo: GetInviteResult;
  currentCart: DishInOrder[];
  dishes: DishRenderItem[];
  prices: {
    [key: string]: Price;
  };
  handleChangeFilterText: (e: React.ChangeEvent<FormElement>) => void;
}

const InviteCommon = ({
  inviteInfo,
  currentCart,
  dishes,
  prices,
  handleChangeFilterText,
}: InviteCommonProps) => {
  const [user, _] = useAtom(userAtom);
  const isLoggedIn = !user.fetching && user.loggedIn;
  const [order, __] = useAtom(orderAtom);

  return (
    <Container
      fluid
      justify="center"
      alignItems="center"
      css={{ height: '800px', mt: '$16' }}
    >
      <Grid.Container>
        <Grid xs justify="flex-start">
          <DishFilter onChange={handleChangeFilterText} />
        </Grid>
        <Grid xs justify="flex-end"></Grid>
      </Grid.Container>

      {inviteInfo.order.menu.dishTypes.length > 0 && (
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
                  isLoggedIn={isLoggedIn}
                  canEdit={inviteInfo.order.status === OrderStatus.INPROGRESS}
                />
                <Spacer y={1} key={`spacer-${dish.id}`} />
              </>
            );
          }}
        />
      )}
      {currentCart && currentCart.length !== 0 && !order.isSubmitted && (
        <div style={{ position: 'fixed', right: '3em', bottom: '3em' }}>
          <Popover placement="top">
            <Popover.Trigger>
              <Button auto flat>
                <SearchIcon />
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <CartContent
                prices={prices}
                dishes={dishes}
                currentCart={currentCart}
                inviteId={inviteInfo.order.inviteId}
              />
            </Popover.Content>
          </Popover>
        </div>
      )}
    </Container>
  );
};

export default InviteCommon;

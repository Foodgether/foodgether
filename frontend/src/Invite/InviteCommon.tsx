import React from "react";
import Card from "./Card";
import { Price } from "../interfaces/menu";
import { GetInviteResult } from "../interfaces/request";
import {
  Button,
  Container,
  FormElement,
  Grid,
  Popover,
  Spacer,
  Text,
} from "@nextui-org/react";
import { Virtuoso } from "react-virtuoso";
import SearchIcon from "../components/SearchIcon";
import CartContent from "./CartContent";
import DishFilter from "../components/DishFilter";
import { Restaurant } from "../interfaces/restaurant";
import { CartAtom, DishInOrder, userAtom } from "../atoms";
import { DishRenderItem } from "./Invite";
import { useAtom } from "jotai";

interface InviteCommonProps {
  inviteInfo: GetInviteResult;
  cart: CartAtom;
  currentCart: DishInOrder[];
  dishes: DishRenderItem[];
  prices: {
    [key: string]: Price;
  };
  handleChangeFilterText: (e: React.ChangeEvent<FormElement>) => void;
}

const InviteCommon = ({
  inviteInfo,
  cart,
  currentCart,
  dishes,
  prices,
  handleChangeFilterText,
}: InviteCommonProps) => {
  const [user, _] = useAtom(userAtom);
  const isLoggedIn = !user.fetching && user.loggedIn;

  return (
    <Container
      fluid
      justify="center"
      alignItems="center"
      css={{ height: "800px", mt: "$16" }}
    >
      <Grid.Container>
        <Grid xs justify="flex-start">
          <DishFilter onChange={handleChangeFilterText} />
        </Grid>
        <Grid xs justify="flex-end"></Grid>
      </Grid.Container>

      {inviteInfo.menu.dishTypes.length > 0 && (
        <Virtuoso
          useWindowScroll
          style={{ height: "100%" }}
          data={dishes}
          overscan={400}
          itemContent={(index, dish) => {
            const isDish = "price" in dish;
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
                />
                <Spacer y={1} key={`spacer-${dish.id}`} />
              </>
            );
          }}
        />
      )}
      {currentCart && currentCart.length !== 0 && (
        <div style={{ position: "fixed", right: "3em", bottom: "3em" }}>
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
                cart={cart}
                currentCart={currentCart}
              />
            </Popover.Content>
          </Popover>
        </div>
      )}
    </Container>
  );
};

export default InviteCommon;

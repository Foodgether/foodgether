import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Card from "./Card";
import { Dish, DishType } from "../interfaces/menu";
import { GetMenuResult, Invitation } from "../interfaces/request";
import {
  Button,
  Container,
  FormElement,
  Grid,
  Spacer,
  Text,
} from "@nextui-org/react";
import { Virtuoso } from "react-virtuoso";
import { useAtom } from "jotai";
import { currentStateAtom } from "../atoms";
import { BACKEND_URL, BASE_PATH } from "../config";
import Swal from "sweetalert2";
import RestaurantInfo from "../components/RestaurantInfo";
import DishFilter from "../components/DishFilter";

type dishItem = Dish | DishType;

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentState, _] = useAtom(currentStateAtom);
  const [filterText, setFilterText] = useState("");
  const handleChangeFilterText = (e: React.ChangeEvent<FormElement>) => {
    setFilterText(e.target.value);
  };
  const {
    menu: { dishTypes },
    restaurant,
  } = location.state as GetMenuResult;
  const dishes = dishTypes.reduce((acc: dishItem[], dishType) => {
    if (filterText === "") {
      return acc.concat(dishType).concat(dishType.dishes);
    }
    const processedDishes = dishType.dishes.reduce(
      (acc: dishItem[], dish: Dish) => {
        const loweredName = dish.name.toLowerCase();
        if (loweredName.includes(filterText.toLowerCase())) {
          return acc.concat(dish);
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

  const copyToClipboard = (content: string) => {
    const el = document.createElement("textarea");
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  const handleCreateInvitation = async () => {
    const createRawResponse = await fetch(`${BACKEND_URL}/order/invite`, {
      method: "POST",
      body: JSON.stringify({
        restaurantId: currentState.currentRestaurant,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!createRawResponse.ok) {
      const { message } = await createRawResponse.json();
      await Swal.fire({
        position: "center",
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const createInvitationResponse =
      (await createRawResponse.json()) as Invitation;
    console.log(createInvitationResponse);
    copyToClipboard(
      `${window.location.origin}${BASE_PATH}/invite/${createInvitationResponse.inviteId}`
    );
    await Swal.fire({
      position: "center",
      icon: "success",
      title: "Invitation link copied to clipboard",
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
      css={{ p: 50, height: "900px", mt: "$16" }}
    >
      <RestaurantInfo {...restaurant} />
      <Spacer y={2} />
      <Grid.Container>
        <Grid xs justify="flex-start">
          <DishFilter onChange={handleChangeFilterText} />
        </Grid>
        <Grid xs justify="flex-end">
          <Button ghost onClick={handleCreateInvitation}>
            Create an invitation
          </Button>
        </Grid>
      </Grid.Container>
      {dishTypes.length > 0 && (
        <Virtuoso
          useWindowScroll
          style={{ height: "100%" }}
          data={dishes}
          overscan={400}
          itemContent={(index: number, dish: dishItem) => {
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
                />
                <Spacer y={1} key={`spacer-${dish.id}`} />
              </>
            );
          }}
        />
      )}
    </Container>
  );
};

export default Menu;

import { useMemo } from "react";
import { Button, Container, Grid } from "@nextui-org/react";
import Swal from "sweetalert2";
import { BACKEND_URL } from "../config";
import { FetchOrderResponse } from "../pb/orders";
import { Virtuoso } from "react-virtuoso";
import OrderDetail from "./OrderInfo/OrderDetail";
import { Dish } from "../interfaces/menu";
import { Collapse } from "@nextui-org/react";
import { Dictionary } from "lodash";

interface OrderInfoProps {
  inviteId: string;
  orderList: FetchOrderResponse["userOrder"][];
  menu: Dictionary<Dish>;
}

const OrderInfo = ({ inviteId, orderList, menu }: OrderInfoProps) => {
  const handleConfirmOrder = async () => {
    const rawConfirmOrderResponse = await fetch(
      `${BACKEND_URL}/order/${inviteId}/confirm`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!rawConfirmOrderResponse.ok) {
      const { message } = await rawConfirmOrderResponse.json();
      await Swal.fire({
        position: "center",
        icon: "error",
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const ConfirmOrderResponse = await rawConfirmOrderResponse.json();
    await Swal.fire({
      position: "center",
      icon: "success",
      title: "Confirm order successfully",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <Container>
      <Grid.Container>
        <Grid>
          <Button onClick={handleConfirmOrder} ghost bordered>
            Confirm Order
          </Button>
        </Grid>
      </Grid.Container>
      <Collapse.Group bordered>
        <Virtuoso
          useWindowScroll
          overscan={500}
          data={orderList}
          itemContent={(index, order) => {
            if (!order) {
              return;
            }
            return <OrderDetail menu={menu} {...order} key={order.id} />;
          }}
        />
      </Collapse.Group>
    </Container>
  );
};

export default OrderInfo;

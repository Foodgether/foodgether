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
import { OrderStatus } from "../enums";
import { useAtom, useSetAtom } from "jotai";
import { orderAtom } from "../atoms";

interface OrderInfoProps {
  inviteId: string;
  orderList: FetchOrderResponse["userOrder"][];
  menu: Dictionary<Dish>;
  orderStatus: OrderStatus;
}

const OrderInfo = ({
  inviteId,
  orderList,
  menu,
  orderStatus,
}: OrderInfoProps) => {
  const setOrder = useSetAtom(orderAtom);

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
    setOrder((order) => ({ ...order, status: OrderStatus.CONFIRMED }));
  };

  return (
    <Container>
      <Grid.Container>
        <Grid>
          {orderStatus === OrderStatus.INPROGRESS && (
            <Button onClick={handleConfirmOrder} ghost bordered>
              Confirm Order
            </Button>
          )}
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

import { useMemo } from "react";
import { Button, Container, Grid } from "@nextui-org/react";
import Swal from "sweetalert2";
import { BACKEND_URL, fetchConfigs } from "../config";
import { FetchOrderResponse } from "../pb/orders";
import { Virtuoso } from "react-virtuoso";
import OrderDetail from "./OrderInfo/OrderDetail";
import { Dish } from "../interfaces/menu";
import { Collapse } from "@nextui-org/react";
import { Dictionary } from "lodash";
import { OrderStatus } from "../enums";
import { useSetAtom } from "jotai";
import { orderAtom } from "../atoms";
import { errorAlertOptions, successAlertOptions } from "../alertOptions";

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
        ...fetchConfigs,
      }
    );
    if (!rawConfirmOrderResponse.ok) {
      const { message } = await rawConfirmOrderResponse.json();
      await Swal.fire({ ...errorAlertOptions, title: message });
      return;
    }
    await rawConfirmOrderResponse.json();
    await Swal.fire({
      ...successAlertOptions,
      title: "Confirm order successfully",
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
          {orderStatus !== OrderStatus.CANCELLED && (
            <Button onClick={handleConfirmOrder} ghost bordered>
              Cancle Order
            </Button>
          )}
        </Grid>
      </Grid.Container>
      <Collapse.Group bordered>
        <Virtuoso
          useWindowScroll
          overscan={500}
          data={orderList}
          itemContent={(_, order) => {
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

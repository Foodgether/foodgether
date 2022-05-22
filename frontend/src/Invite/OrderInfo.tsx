import React from 'react';
import { Button, Container, Grid } from '@nextui-org/react';
import Swal from 'sweetalert2';
import { BACKEND_URL } from '../config';

interface OrderInfoProps {
  inviteId: string;
}

const OrderInfo = ({ inviteId }: OrderInfoProps) => {
  const handleConfirmOrder = async () => {
    console.log(inviteId);
    const rawConfirmOrderResponse = await fetch(
      `${BACKEND_URL}/order/${inviteId}/confirm`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    if (!rawConfirmOrderResponse.ok) {
      const { message } = await rawConfirmOrderResponse.json();
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const ConfirmOrderResponse = await rawConfirmOrderResponse.json();
    await Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Confirm order successfully',
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
    </Container>
  );
};

export default OrderInfo;

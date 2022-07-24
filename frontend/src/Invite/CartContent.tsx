import React, { useMemo } from 'react'
import { Button, Input, Text } from '@nextui-org/react'
import { DishInOrder, orderAtom } from '../atoms'
import CartItem from './CartItem'
import { Price } from '../interfaces/menu'
import { DishRenderItem } from './Invite'
import { BACKEND_URL, fetchConfigs } from '../config'
import Swal from 'sweetalert2'
import { useAtom } from 'jotai'
import { errorAlertOptions, successAlertOptions } from '../alertOptions'

interface CartContentProps {
  inviteId: string
  dishes: DishRenderItem[]
  currentCart: DishInOrder[]
  prices: {
    [key: string]: Price
  }
  canEdit: boolean
}

const CartContent = ({ dishes, currentCart, prices, inviteId, canEdit }: CartContentProps) => {
  const [order, setOrder] = useAtom(orderAtom)

  const submitNewOrder = async () => {
    const rawSendOrderResponse = await fetch(`${BACKEND_URL}/order/${inviteId}/submit`, {
      ...fetchConfigs,
      method: 'POST',
      body: JSON.stringify({ detail: currentCart }),
    })
    if (!rawSendOrderResponse.ok) {
      const { message } = await rawSendOrderResponse.json()
      await Swal.fire({
        ...errorAlertOptions,
        title: message,
      })
    }
    const SendOrderResponse = await rawSendOrderResponse.json()
    await Swal.fire({
      ...successAlertOptions,
      title: 'Send order successfully',
    })
    setOrder({ ...order, isSubmitted: true, orderId: SendOrderResponse.id })
  }

  const updateNewOrder = async () => {
    const rawSendOrderResponse = await fetch(`${BACKEND_URL}/order/userOrder/${order.orderId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ detail: currentCart, inviteId }),
    })
    if (!rawSendOrderResponse.ok) {
      const { message } = await rawSendOrderResponse.json()
      await Swal.fire({
        ...errorAlertOptions,
        title: message,
      })
    }
    const SendOrderResponse = await rawSendOrderResponse.json()
    await Swal.fire({
      ...successAlertOptions,
      title: 'Send order successfully',
    })
    setOrder({ ...order, isSubmitted: true, orderId: SendOrderResponse.id })
  }

  const handleSendOrder = async () => {
    if (!order.isSubmitted && !order.orderId) {
      await submitNewOrder()
      return
    }
    await updateNewOrder()
  }

  const totalPrice = useMemo(
    () =>
      currentCart.reduce((total, item) => {
        return total + item.quantity * prices[item.dishId].value
      }, 0),
    [currentCart],
  )
  const uniqueDishes = useMemo(
    () => [...new Map(dishes.map((item) => [item.id, item])).values()],
    [dishes],
  )
  return (
    <div style={{ width: '20em' }}>
      {uniqueDishes.reduce((acc: any[], dish: DishRenderItem) => {
        const isDish = 'price' in dish
        if (!isDish) {
          return acc
        }
        if (!currentCart) {
          return acc
        }
        const targetDish = currentCart.find((item) => item.dishId === dish.id)
        if (!targetDish || targetDish.quantity === 0) {
          return acc
        }
        return acc.concat(
          <CartItem
            key={dish.id}
            {...dish}
            price={dish.discountPrice ? dish.discountPrice : dish.price}
            canEdit={canEdit}
          />,
        )
      }, [])}
      <Text h3 css={{ color: '$red500', fontWeight: '$semibold' }}>
        Final total: {totalPrice}
      </Text>
      <Input placeholder='Add your lovely message here' css={{ width: '100%' }} />
      {canEdit && (
        <Button auto flat onClick={handleSendOrder} css={{ m: 'auto' }}>
          Confirm
        </Button>
      )}
    </div>
  )
}

export default CartContent

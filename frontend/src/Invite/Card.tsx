import React, { useMemo } from 'react'
import { Button, Card as NextCard, Grid, Spacer, Text } from '@nextui-org/react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { cartAtom, orderAtom } from '../atoms'
import Swal from 'sweetalert2'
import { setCartDetailAtom } from './inviteAtoms'

interface CardMenuProps {
  id: number
  name: string
  photos: Photo[]
  price: {
    text: string
    unit: string
    value: number
  }
  description?: string
  dishTypeId: number
  orderId: string
  isLoggedIn: boolean
  canEdit: boolean
}

type Photo = {
  width: number
  height: number
  value: string
}

const Card = (props: CardMenuProps) => {
  const currentCart = useAtomValue(cartAtom).detail
  const [order, setOrder] = useAtom(orderAtom)
  const setCartDetail = useSetAtom(setCartDetailAtom)

  const quantity = useMemo(() => {
    if (currentCart) {
      const dish = currentCart.find((item) => item.dishId === props.id)
      if (dish) {
        return dish.quantity
      }
    }
    return 0
  }, [currentCart])

  const { name, price, photos } = props
  const photoLastIndex = photos.length - 2
  const photo = photos[photoLastIndex]

  const handleIncrement = () => {
    handleOrder(quantity + 1)
  }
  const handleDecrement = () => {
    handleOrder(quantity - 1)
  }
  const handleOrder = async (quantity: number) => {
    setOrder({ ...order, isSubmitted: false })
    if (!props.isLoggedIn) {
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please login to order',
        showConfirmButton: false,
        timer: 1500,
      })
      return
    }

    if (!currentCart) {
      setCartDetail([{ dishId: props.id, dishTypeId: props.dishTypeId, quantity }])
      // setCart([{ dishId: props.id, dishTypeId: props.dishTypeId, quantity }]);
      return
    }
    const item = currentCart.find((item) => item.dishId === props.id)
    if (!item) {
      setCartDetail(
        currentCart.concat([{ dishId: props.id, dishTypeId: props.dishTypeId, quantity }]),
      )
      return
    }
    item.quantity = quantity
    const newCart = currentCart.concat([])
    setCartDetail(newCart.filter((dish) => dish.quantity !== 0))
  }

  return (
    <NextCard isHoverable={true}>
      <NextCard.Body css={{ p: 0 }}>
        <Grid.Container justify='center'>
          <Grid xs={12} md={2}>
            <NextCard.Image objectFit='scale-down' src={photo.value} alt={name} />
          </Grid>
          <Grid xs={1} md={0.5} />
          <Grid xs={12} md direction={'column'}>
            <Text h2>{name}</Text>
            <Text h3 css={{ color: '$red500', fontWeight: '$semibold' }}>
              {price.text}
            </Text>
            {props.description && <Spacer y={0.5} />}
            {props.description && (
              <Text css={{ color: '$accents7', fontWeight: '$semibold' }}>{props.description}</Text>
            )}
            <Spacer y={0.5} />
            {props.canEdit && quantity !== 0 && (
              <Button.Group>
                <Button
                  onPress={handleDecrement}
                  color='gradient'
                  auto
                  ghost
                  css={{ width: '3em', height: '3em' }}
                >
                  -
                </Button>
                <Text h3 css={{ color: '$red500', fontWeight: '$semibold' }}>
                  {quantity}
                </Text>
                <Button
                  onPress={handleIncrement}
                  color='gradient'
                  auto
                  ghost
                  css={{ width: '3em', height: '3em' }}
                >
                  +
                </Button>
              </Button.Group>
            )}

            {quantity === 0 && props.canEdit && (
              <Button onPress={handleIncrement} color='gradient' auto ghost css={{ width: '10em' }}>
                <Text h5>Order</Text>
              </Button>
            )}
          </Grid>
        </Grid.Container>
      </NextCard.Body>
    </NextCard>
  )
}

export default Card

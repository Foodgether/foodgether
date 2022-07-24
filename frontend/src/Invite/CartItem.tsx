import React, { useMemo } from 'react'
import { Button, Card as NextCard, Grid, Spacer, Text } from '@nextui-org/react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { cartAtom, orderAtom } from '../atoms'
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
  canEdit: boolean
}

type Photo = {
  width: number
  height: number
  value: string
}

const CartItem = ({ id, name, price, photos, dishTypeId, canEdit }: CardMenuProps) => {
  const currentCart = useAtomValue(cartAtom).detail
  const [order, setOrder] = useAtom(orderAtom)
  const setCartDetail = useSetAtom(setCartDetailAtom)

  const quantity = useMemo(() => {
    if (currentCart) {
      const dish = currentCart.find((item) => item.dishId === id)
      if (dish) {
        return dish.quantity
      }
    }
    return 0
  }, [currentCart])

  const photo = photos[0]
  const handleIncrement = () => {
    handleOrder(quantity + 1)
  }
  const handleDecrement = () => {
    handleOrder(quantity - 1)
  }
  const handleOrder = (quantity: number) => {
    if (!currentCart) {
      setCartDetail([{ dishId: id, dishTypeId: dishTypeId, quantity }])
      return
    }
    const item = currentCart.find((item) => item.dishId === id)
    if (!item) {
      setCartDetail(currentCart.concat([{ dishId: id, dishTypeId: dishTypeId, quantity }]))
      return
    }
    item.quantity = quantity
    const newCart = currentCart.concat([])
    setCartDetail(newCart.filter((dish) => dish.quantity !== 0))
    setOrder({ ...order, isSubmitted: false })
  }

  return (
    <NextCard isHoverable={true}>
      <NextCard.Body css={{ p: 0 }}>
        <Grid.Container justify='center'>
          <Grid xs={12} md={6}>
            <NextCard.Image objectFit='scale-down' src={photo.value} alt={name} />
          </Grid>
          <Grid xs={12} md={6} direction={'column'}>
            <Text h5>{name}</Text>
            <Text h6 css={{ color: '$red500', fontWeight: '$semibold' }}>
              {price.text}
            </Text>
            <Spacer y={0.5} />
            {quantity !== 0 && (
              <>
                <Button.Group>
                  {canEdit && (
                    <Button
                      onClick={handleDecrement}
                      color='gradient'
                      auto
                      ghost
                      css={{ width: '1em', height: '2em' }}
                      size='sm'
                    >
                      -
                    </Button>
                  )}
                  <Text h6 css={{ color: '$red500', fontWeight: '$semibold' }}>
                    {quantity}
                  </Text>
                  {canEdit && (
                    <Button
                      onClick={handleIncrement}
                      color='gradient'
                      auto
                      ghost
                      css={{ width: '1em', height: '2em' }}
                      size='sm'
                    >
                      +
                    </Button>
                  )}
                </Button.Group>
                <Text margin='auto'>Item total: {quantity * price.value}</Text>
              </>
            )}
          </Grid>
        </Grid.Container>
      </NextCard.Body>
    </NextCard>
  )
}

export default CartItem

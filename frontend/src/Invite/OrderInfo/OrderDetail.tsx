import { DishInOrder } from '../../atoms'
import { Dish } from '../../interfaces/menu'
import { Collapse, Table } from '@nextui-org/react'
import { Dictionary } from 'lodash'
import { useCallback, useMemo } from 'react'

interface OrderDetailProps {
  id: string
  orderId: string
  user?: {
    id: string
    name: string
    phoneNumber: string
  }
  detail: DishInOrder[]
  menu: Dictionary<Dish>
}

const OrderDetail = ({ user, menu, detail }: OrderDetailProps) => {
  const userOrder = `${user?.name} - ${user?.phoneNumber}`
  const totalAmount = useMemo(
    () =>
      detail.reduce((sum, dish) => {
        const dishDetail = menu[dish.dishId]
        const price = dishDetail.discountPrice
          ? dishDetail.discountPrice.value
          : dishDetail.price.value
        return sum + price * dish.quantity
      }, 0),
    [detail],
  )

  const totalItems = useMemo(
    () =>
      detail.reduce((sum, dish) => {
        return sum + dish.quantity
      }, 0),
    [detail],
  )

  const renderRows = useCallback(() => {
    const rows = detail.map((dish) => {
      const dishDetail = menu[dish.dishId]
      const price = dishDetail.discountPrice
        ? dishDetail.discountPrice.value
        : dishDetail.price.value
      return (
        <Table.Row key={dish.dishId}>
          <Table.Cell>{dishDetail.name}</Table.Cell>
          <Table.Cell>{dish.quantity}</Table.Cell>
          <Table.Cell>{price}</Table.Cell>
          <Table.Cell>
            {dish.quantity * price} {dishDetail.price.unit}
          </Table.Cell>
        </Table.Row>
      )
    })
    rows.push(
      <Table.Row key='total'>
        <Table.Cell>Total</Table.Cell>
        <Table.Cell>{totalItems}</Table.Cell>
        <Table.Cell> </Table.Cell>
        <Table.Cell>
          {totalAmount} {menu[detail[0].dishId].price.unit}
        </Table.Cell>
      </Table.Row>,
    )
    return rows
  }, [detail, menu])

  return (
    <Collapse title={userOrder}>
      <Table
        aria-label='Example table with static content'
        css={{
          height: 'auto',
          minWidth: '100%',
        }}
        bordered
        shadow={false}
        headerLined
        striped
      >
        <Table.Header>
          <Table.Column>Dish name</Table.Column>
          <Table.Column>Quantity</Table.Column>
          <Table.Column>Price</Table.Column>
          <Table.Column>Total</Table.Column>
        </Table.Header>
        <Table.Body>{renderRows()}</Table.Body>
      </Table>
    </Collapse>
  )
}

export default OrderDetail

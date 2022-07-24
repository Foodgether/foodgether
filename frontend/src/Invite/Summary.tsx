import { Table } from '@nextui-org/react'
import { Dictionary } from 'lodash'
import { useCallback, useMemo } from 'react'
import { Dish } from '../interfaces/menu'
import { FetchOrderResponse, OrderDetail } from '../pb/orders'

interface SummaryProps {
  menu: Dictionary<Dish>
  orderList: FetchOrderResponse['userOrder'][]
}

interface MergedOrder {
  [key: string]: OrderDetail
}

const Summary = ({ orderList, menu }: SummaryProps) => {
  const mergedOrderList = useMemo(
    () =>
      orderList.reduce((merged, order) => {
        order?.detail.forEach((dish) => {
          if (!merged[dish.dishId]) {
            merged[dish.dishId] = dish
          } else {
            merged[dish.dishId].quantity = dish.quantity
          }
        })
        return merged
      }, {} as MergedOrder),
    [orderList, menu],
  )

  const unit = menu[Object.keys(menu)[0]].price.unit

  const { totalItems, totalAmount } = useMemo(() => {
    return Object.keys(mergedOrderList).reduce(
      (acc, key) => {
        let price: number
        const discountPrice = menu[key].discountPrice?.value
        if (discountPrice) {
          price = discountPrice
        } else {
          price = menu[key].price.value
        }
        return {
          totalItems: acc.totalItems + mergedOrderList[key].quantity,
          totalAmount: acc.totalAmount + mergedOrderList[key].quantity * price,
        }
      },
      { totalItems: 0, totalAmount: 0 },
    )
  }, [mergedOrderList])

  const renderRows = useCallback(() => {
    const rows = Object.keys(mergedOrderList).map((dishKey) => {
      const dish = mergedOrderList[dishKey]
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
            {dish.quantity * price} {unit}
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
          {totalAmount} {unit}
        </Table.Cell>
      </Table.Row>,
    )
    return rows
  }, [mergedOrderList])

  return (
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
  )
}

export default Summary

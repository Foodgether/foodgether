import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { Dish, DishType } from '../interfaces/menu'
import { GetInviteResult, Invitation } from '../interfaces/request'
import { Container, FormElement, Spacer } from '@nextui-org/react'
import { useAtom, useAtomValue } from 'jotai'
import { cartAtom, orderAtom, tokenAtom, userAtom } from '../atoms'
import { BACKEND_URL, BASE_PATH, fetchConfigs, GRPC_URL } from '../config'
import Swal from 'sweetalert2'
import Loader from '../components/Loader'
import InviteCommon from './InviteCommon'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import RestaurantInfo from '../components/RestaurantInfo'
import OrderInfo from './OrderInfo'
import Summary from './Summary'
import { FetchOrderRequest, FetchOrderResponse, UserOrder } from '../pb/orders'
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import { OrderStreamClient } from '../pb/orders.client'
import { keyBy } from 'lodash'
import { OrderStatus } from '../enums'

interface DishItem extends Dish {
  dishTypeId: number
  orderId: string
}

export type DishRenderItem = DishItem | DishType

enum InviteTab {
  MENU = 0,
  ORDERS = 1,
}

const getOrders = async (inviteId: string) => {
  return fetch(`${BACKEND_URL}/order/${inviteId}/orders`, {
    method: 'GET',
    ...fetchConfigs,
  }).then((result) => {
    if (!result.ok) {
      return []
    }
    return result.json().then((data) => {
      return data
    })
  })
}

const getGrpcStream = (orderId: string, token: string) => {
  const transport = new GrpcWebFetchTransport({
    baseUrl: GRPC_URL,
  })
  const client = new OrderStreamClient(transport)
  const fetchOrderRequest: FetchOrderRequest = {
    orderId,
    token,
  }
  return client.fetchOrder(fetchOrderRequest)
}

const Invite = () => {
  const location = useLocation()
  const { inviteId } = useParams()

  if (!inviteId) {
    window.location.replace(BASE_PATH ? BASE_PATH : '/')
    return <>Not Found</>
  }

  const [currentCart, setCart] = useAtom(cartAtom)
  const [filterText, setFilterText] = useState('')
  const [inviteInfo, setInviteInfo] = useState<GetInviteResult>()
  const [orderList, setOrderList] = useState<FetchOrderResponse['userOrder'][]>([])
  const [removeGrpcStream, setRemoveGrpcStream] = useState<(() => void) | null>(null)

  const user = useAtomValue(userAtom)
  const token = useAtomValue(tokenAtom)
  const [order, setOrder] = useAtom(orderAtom)

  const handleGetInviteInfo = async () => {
    const pushedInviteInfo = location.state as Invitation
    if (!pushedInviteInfo) {
      fetch(`${BACKEND_URL}/order/invite/${inviteId}`, {
        method: 'GET',
        ...fetchConfigs,
      })
        .then(async (rawResponse) => {
          if (!rawResponse.ok) {
            const { message } = await rawResponse.json()
            await Swal.fire({
              position: 'center',
              icon: 'error',
              title: message,
              showConfirmButton: false,
              timer: 1500,
            })
          }
          return rawResponse.json()
        })
        .then((inviteInfoResult) => {
          setInviteInfo({ ...inviteInfoResult })
          if (inviteInfoResult.myOrder) {
            setOrder({
              isSubmitted: true,
              orderId: inviteInfoResult.myOrder.id,
              status: inviteInfoResult.order.status,
            })
            setCart(inviteInfoResult.myOrder.detail)
          }
        })
    } else {
      const getInviteResult = location.state as Invitation
      setInviteInfo({ order: getInviteResult, myOrder: null })
      setOrder({
        isSubmitted: true,
        orderId: '',
        status: getInviteResult.status,
      })
    }
  }

  const handleChangeFilterText = (e: React.ChangeEvent<FormElement>) => {
    setFilterText(e.target.value)
  }

  const handleUpdateOrderList = (userOrder: UserOrder) => {
    setOrderList((lastOrderList) => {
      return lastOrderList.reduce((acc, cur) => {
        if (!cur || !userOrder) {
          return acc
        }
        if (cur.id === userOrder.id) {
          return [...acc, userOrder]
        }
        return acc.concat([cur])
      }, [] as UserOrder[])
    })
  }

  useEffect(() => {
    handleGetInviteInfo()
  }, [user])

  useEffect(() => {
    if ('id' in user && user.id === inviteInfo?.order.createdUserId && orderList.length === 0) {
      getOrders(inviteId).then((result) => {
        setOrderList([...result])
      })
      if (inviteInfo.order.status !== OrderStatus.INPROGRESS) {
        return
      }

      const grpcStream = getGrpcStream(inviteId, token)
      const removeListener = grpcStream.responses.onMessage((response) => {
        if (response.operationType === 'keepalive') {
          return
        }
        if (!response.userOrder) {
          return
        }
        if (response.operationType == 'insert') {
          setOrderList((lastOrderList) => [...lastOrderList, response.userOrder])
        } else {
          handleUpdateOrderList(response.userOrder)
        }
      })
      setRemoveGrpcStream(removeListener)
      return () => {
        if (removeGrpcStream) {
          // probably not listener register yet
          removeGrpcStream()
        }
      }
    }
  }, [user, inviteInfo])

  useEffect(() => {
    if (order.status !== OrderStatus.INPROGRESS && removeGrpcStream) {
      removeGrpcStream()
    }
  }, [order.status])

  const menu = inviteInfo?.order.menu
  const restaurant = inviteInfo?.order.restaurant

  const dishes = useMemo(() => {
    if (!inviteInfo || !menu) {
      return []
    }
    return menu.dishTypes.reduce((acc: DishRenderItem[], dishType) => {
      const processedDishes = dishType.dishes.reduce((acc: DishItem[], dish: Dish) => {
        const loweredName = dish.name.toLowerCase()
        if (loweredName.includes(filterText.toLowerCase())) {
          return acc.concat({
            ...dish,
            dishTypeId: dishType.id,
            orderId: inviteInfo.order.inviteId,
          })
        }
        return acc
      }, [])
      if (processedDishes.length == 0) {
        return acc
      }
      return acc.concat(dishType).concat(processedDishes)
    }, [])
  }, [menu, inviteInfo])

  const prices = useMemo(() => {
    if (!menu) {
      return {}
    }
    return menu.dishTypes.reduce((priceDict, dishType) => {
      return Object.assign(
        priceDict,
        dishType.dishes.reduce((acc, dish) => {
          if (dish.discountPrice) {
            return Object.assign(acc, { [dish.id]: dish.discountPrice })
          }
          return Object.assign(acc, { [dish.id]: dish.price })
        }, {}),
      )
    }, {})
  }, [menu, inviteInfo])

  const keyedMenu = useMemo(() => {
    if (!menu) {
      return {}
    }
    return keyBy(
      menu.dishTypes.reduce((acc, dishType) => {
        return acc.concat(dishType.dishes)
      }, [] as Dish[]),
      'id',
    )
  }, [menu])

  if (!inviteInfo || user.fetching) {
    return <Loader isShowingLoader={!inviteInfo} loadingMessage='' />
  }

  return (
    <Container>
      {restaurant && <RestaurantInfo {...restaurant} />}
      <Spacer y={1} />
      {'id' in user && user.id === inviteInfo.order.createdUserId ? (
        <Tabs defaultIndex={InviteTab.MENU}>
          <TabList>
            <Tab className='react-tabs__tab text-xl font-bold text-pink-900'>Menu</Tab>
            <Tab className='react-tabs__tab text-xl font-bold text-pink-900'>Orders</Tab>
            <Tab className='react-tabs__tab text-xl font-bold text-pink-900'>Summary</Tab>
          </TabList>
          <TabPanel>
            <Spacer y={1} />
            <InviteCommon
              inviteInfo={inviteInfo}
              currentCart={currentCart.detail}
              dishes={dishes}
              prices={prices}
              handleChangeFilterText={handleChangeFilterText}
              canEdit={order.status === OrderStatus.INPROGRESS}
            />
          </TabPanel>
          <TabPanel>
            <OrderInfo
              inviteId={inviteInfo.order.inviteId}
              menu={keyedMenu}
              orderList={orderList}
              orderStatus={order.status}
            />
          </TabPanel>
          <TabPanel>
            <Summary orderList={orderList} menu={keyedMenu} />
          </TabPanel>
        </Tabs>
      ) : (
        <InviteCommon
          inviteInfo={inviteInfo}
          currentCart={currentCart.detail}
          dishes={dishes}
          prices={prices}
          handleChangeFilterText={handleChangeFilterText}
          canEdit={inviteInfo.order.status === OrderStatus.INPROGRESS}
        />
      )}
    </Container>
  )
}

export default Invite

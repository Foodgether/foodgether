package main

import (
	"fmt"
	"log"
	"realtime/pb"

	"github.com/gookit/event"
	"github.com/mitchellh/mapstructure"
)

var eventBus *event.Manager

func makeOrderListenter(srv pb.OrderStream_FetchOrderServer, order *OrderDocument) event.ListenerFunc {
	return func(e event.Event) error {
		log.Printf("RECEIVED EVENT")
		var userOrder *UserOrderChange
		err := mapstructure.Decode(e.Get("userOrder"), &userOrder)
		log.Printf("%v", userOrder)
		if err != nil {
			return err
		}
		log.Printf("Key: %v", userOrder.DocumentKey)
		if userOrder.FullDocument.OrderId == order.Id {
			fmt.Printf("handle order: %v\n", userOrder)
			orderDetail := make([]*pb.OrderDetail, len(userOrder.FullDocument.Detail))
			for i, detail := range userOrder.FullDocument.Detail {
				orderDetail[i] = &pb.OrderDetail{
					DishId:     int32(detail.DishId),
					DishTypeId: int32(detail.DishTypeId),
					Quantity:   int32(detail.Quantity),
				}
			}
			userId := userOrder.FullDocument.UserId
			user, err := GetUserFromId(userId)
			if err != nil {
				return err
			}
			resp := pb.FetchOrderResponse{
				UserOrder: &pb.UserOrder{
					Id: userOrder.DocumentKey["_id"].Hex(),
					User: &pb.User{
						Id:          user.Id.Hex(),
						Name:        user.Name,
						PhoneNumber: user.PhoneNumber,
					},
					OrderId: order.Id.Hex(),
					Detail:  orderDetail,
				},
				OperationType: userOrder.OperationType,
			}
			if err := srv.Send(&resp); err != nil {
				log.Printf("send error %v", err)
			}
		}
		return nil
	}
}

func initEventBus() {
	eventBus = event.NewManager("")
}

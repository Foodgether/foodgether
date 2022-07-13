package main

import (
	"errors"
	"github.com/gookit/event"
	"log"
	"realtime/pb"
	"time"
)

func (s *server) FetchOrder(req *pb.FetchOrderRequest, srv pb.OrderStream_FetchOrderServer) error {
	log.Printf(req.Token)
	claims := Authenticate(req.Token)
	if claims == nil {
		return errors.New("not authenticated")
	}
	phoneNumber := claims.Data.PhoneNumber
	user, err := GetUserFromPhoneNumber(phoneNumber)
	if err != nil {
		return errors.New("user not found")
	}
	order, err := IsOwnerOfRunningOrder(user.Id, req.OrderId) // orderId is inviteId
	if err != nil {
		return err
	}
	log.Printf("Subscribing to UserOrder event")

	listenerFunc := makeOrderListenter(srv, order)
	listener := new(event.ListenerFunc)
	*listener = listenerFunc
	eventBus.On("UserOrder", listener, event.Normal)
	timer := time.After(15 * time.Second)
	isDone := false
	for {
		select {
		case <-srv.Context().Done():
			isDone = true
			log.Printf("Deregistering listener")
			err = srv.Context().Err()
			if err != nil {
				return err
			}
			eventBus.RemoveListener("UserOrder", listener)
			if !eventBus.HasListeners("UserOrder") {
				log.Printf("No listener")
			}
			return nil
		case <-timer:
			if isDone {
				return nil
			}
			resp := pb.FetchOrderResponse{
				OperationType: "keepalive",
			}
			if err := srv.Send(&resp); err != nil {
				log.Printf("send error %v", err)
			}
			timer = time.After(15 * time.Second)
		}
	}
}

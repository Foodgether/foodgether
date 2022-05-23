package main

import (
	"fmt"
	"log"
	"net"
	"realtime/pb"
	"strconv"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/keepalive"
)

type server struct {
	pb.UnimplementedOrderStreamServer
}

func (s *server) FetchOrder(req *pb.FetchOrderRequest, srv pb.OrderStream_FetchOrderServer) error {
	log.Printf("fetch order for token : %s", req.GetToken())

	for i := 0; i < 5; i++ {
		//time sleep to simulate server process time
		time.Sleep(time.Duration(1) * time.Second)
		orderDetail := make([]*pb.OrderDetail, 2)

		orderDetail[0] = &pb.OrderDetail{
			DishId:     int32(i),
			DishTypeId: int32(i),
			Quantity:   int32(i),
		}

		orderDetail[1] = &pb.OrderDetail{
			DishId:     int32(i + 1),
			DishTypeId: int32(i + 1),
			Quantity:   int32(i + 1),
		}

		resp := pb.FetchOrderResponse{
			UserOrder: &pb.UserOrder{
				Id: strconv.Itoa(i),
				User: &pb.User{
					Id:          strconv.Itoa(i),
					Name:        "It's Lammmmm",
					PhoneNumber: strconv.Itoa(i),
				},
				OrderId: strconv.Itoa(i),
				Detail:  orderDetail,
			},
		}
		if err := srv.Send(&resp); err != nil {
			log.Printf("send error %v", err)
		}
	}
	return nil
}

func main() {
	port := 3000
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer(
		grpc.ConnectionTimeout(time.Second),
		grpc.KeepaliveParams(keepalive.ServerParameters{
			MaxConnectionIdle: time.Second * 10,
			Timeout:           time.Second * 20,
		}),
		grpc.KeepaliveEnforcementPolicy(
			keepalive.EnforcementPolicy{
				MinTime:             time.Second,
				PermitWithoutStream: true,
			}),
		grpc.MaxConcurrentStreams(5),
	)
	log.Printf("listening on port %d", port)
	pb.RegisterOrderStreamServer(s, &server{})
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

package main

import (
	"fmt"
	"log"
	"net"
	"os"
	"realtime/pb"
	"time"

	"github.com/joho/godotenv"
	"google.golang.org/grpc/reflection"

	"google.golang.org/grpc"
	"google.golang.org/grpc/keepalive"
)

var JwtKey = []byte("12345")

type server struct {
	pb.UnimplementedOrderStreamServer
}

func main() {
	var err error
	if isProduction := os.Getenv("PRODUCTION"); isProduction == "" {
		err = godotenv.Load()
	}
	if secret := os.Getenv("JWT_SECRET"); secret != "" {
		JwtKey = []byte(secret)
	}
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	InitMongo()
	InitRedis()
	initEventBus()

	go WatchUserOrder()
	StartGrpcServer()
}

func StartGrpcServer() {
	port := 4000
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
	pb.RegisterOrderStreamServer(s, &server{})
	reflection.Register(s)
	log.Printf("listening on port %d", port)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

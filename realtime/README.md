# Foodgether realtime service

## Tech stack:

- Framework/Library: gin-gonic
- Code: Golang
- Driver: Mongodb Driver
- Database: MongoDB
- Cache: Redis

## Getting started

1. Install `go`
2. `go install` to get all the packages
3. Run these commands to compile protobuf
```bash
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest
cd realtime && protoc -I=../proto --go_out=./ ../proto/orders.proto --go-grpc_out=./ --grpc-gateway_out=./
```
4. Start Redis and Envoy (with config `envoy.yaml` in `envoy` folder) in Docker
5. Use command `air` or build to run (`air` on windows acting weird tho)

## Environment Variable

- FOODGETHER_REDIS_HOST: Hostname to connect to redis server
- FOODGETHER_REDIS_PORT: Port to connect to redis server
- FOODGETHER_REDIS_PASSWORD: Password to autheticate with redis server
- DATABASE_URL: Mongodb uri string
- DATABASE_NAME: Mongodb database name
- JWT_SECRET: Secret to encrypt JWT
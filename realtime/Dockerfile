FROM golang:alpine

WORKDIR /usr/src/app

RUN apk update && apk add --no-cache make protobuf-dev=3.18.1-r1
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

COPY . .
RUN protoc -I=./proto --go_out=./ ./proto/orders.proto --go-grpc_out=./


RUN go install
RUN go build
RUN ["chmod", "+x", "/usr/src/app/entrypoint.sh"]

EXPOSE 3000

ENTRYPOINT ["/usr/src/app/entrypoint.sh"] 
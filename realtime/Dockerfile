FROM golang as realtime-dependencies
WORKDIR /usr/src/app
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
RUN go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest
RUN apt update && apt upgrade -y && apt install protobuf-compiler -y
ADD ./proto ./proto
RUN protoc -I=./proto --go_out=./ ./proto/orders.proto --go-grpc_out=./ --grpc-gateway_out=./

FROM golang as realtime-builder
WORKDIR /usr/src/app
COPY --from=realtime-dependencies /usr/src/app/ .
COPY . .
RUN echo $(ls -1 .)
RUN go build

FROM golang as realtime-runner
WORKDIR /usr/src/app
COPY --from=realtime-builder /usr/src/app .
RUN ["chmod", "+x", "/usr/src/app/entrypoint.sh"]
EXPOSE 3000

ENTRYPOINT ["/usr/src/app/entrypoint.sh"] 
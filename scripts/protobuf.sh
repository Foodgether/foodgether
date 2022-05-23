echo "Checking Protoc Version"
export GOPATH=/var/lib/jenkins/go
export PATH=$PATH:$GOPATH/bin
protoc --version | grep "libprotoc" &> /dev/null
if [ $? == 0 ]; then
 echo "Protoc Installed"
else
 echo "Protoc not installed"
 sudo apt install -y protobuf-compiler
 protoc --version
fi
echo "Protoc Version Check Complete"
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
cd realtime && protoc -I=../proto --go_out=./ ../proto/orders.proto --go-grpc_out=./
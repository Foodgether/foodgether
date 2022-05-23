echo "Checking Golang Version"
go version | grep "go1" &> /dev/null
if [ $? == 0 ]; then
 echo "Go Installed"
else
 echo "Go not installed"
 sudo snap install go --classic
 go version
fi
echo "Golang Version Check Complete"

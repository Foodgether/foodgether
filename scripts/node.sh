echo "Checking Node Version"
node --version | grep "v17" &> /dev/null
if [ $? == 0 ]; then
 echo "Node Installed"
else
 echo "Node not installed"
 curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh
 sudo bash /tmp/nodesource_setup.sh
 sudo apt install nodejs -y
fi
echo "Node Version Check Complete"

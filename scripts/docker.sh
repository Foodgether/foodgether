echo "Checking Docker Version"
docker -v | grep "20" &> /dev/null
if [ $? == 0 ]; then
 echo "Docker Installed"
else
 echo "Docker not installed"
 curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
 sudo apt-get update
 sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-compose -y
 echo "Verifying installation"
 docker run hello-world | grep "Hello from Docker"
 if [ $? == 0 ]; then
  echo "Docker Installed"
 else
   echo "Docker not installed"
  exit 1
 fi
fi
echo "Node Version Check Complete"

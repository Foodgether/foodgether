sudo rm -rf /home/ubuntu/foodgether_build/server
sudo mkdir /home/ubuntu/foodgether_build/server

sudo cp -R ./server/dist/* /home/ubuntu/foodgether_build/server
ls /home/ubuntu/foodgether_build/server
BUILD_ID=dontKillMe JENKINS_NODE_COOKIE=dontKillMe pm2 start /home/ubuntu/foodgether_build/server/app.js --name=server

echo "Checking PM2 Version"
npm list -g | grep "pm2" &> /dev/null
if [ $? == 0 ]; then
 echo "PM2 Installed"
else
 echo "PM2 not installed"
 sudo npm i -g pm2
fi

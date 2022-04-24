pm2 jlist | grep '\[\]' &> /dev/null
if [ $? != 0 ]; then
 echo "Stopping PM2 process"
 pm2 stop all
fi


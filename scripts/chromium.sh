echo "Checking Chromium Browser"
dpkg -l | less | grep chromium-browser &> /dev/null
if [ $? == 0 ]; then
  echo "Chromium Browser is installed"
else
 echo "Installing Chromium Browser"
 sudo apt install chromium-browser
 echo "Chromium Browser is installed"
fi


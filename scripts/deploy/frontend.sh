sudo rm -rf /home/ubuntu/foodgether_build/frontend
sudo mkdir /home/ubuntu/foodgether_build/frontend

sudo cp -R ./frontend/dist /home/ubuntu/foodgether_build/frontend
pm2 serve /home/ubuntu/foodgether_build/frontend 8181 --name=frontend --spa

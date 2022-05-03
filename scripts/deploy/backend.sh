cd server
echo "mongodb://$FOODGETHER_MONGO_USERNAME:$FOODGETHER_MONGO_PASSWORD@mongo:27017/foodgether" > .env
docker rmi -f foodgether-backend
docker build . -t foodgether-backend

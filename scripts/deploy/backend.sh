cd server
echo "mongodb+srv://$FOODGETHER_MONGO_USERNAME:$FOODGETHER_MONGO_PASSWORD@foodgether.e8cgw.mongodb.net/foodgether-prod?retryWrites=true&w=majority" > .env
docker rmi -f foodgether-backend
docker build . -t foodgether-backend

export FOODGETHER_REDIS_PASSWORD=12345
export FOODGETHER_REDIS_HOST=redis
export FOODGETHER_MONGO_USERNAME=root
export FOODGETHER_MONGO_PASSWORD=12345
cd frontend && npm i && npm run build
cd .. && cd server && npm i && npm run build

if [[ $(uname -m) == 'arm64' ]] || [[ $(uname -s) == "Darwin" ]]; then
  echo "Running in arm64 mode"
  echo "Please run mongodb separately using Atlas and input the value in .env in the server folder"
  docker-compose build foodgether-frontend foodgether-backend chrome
  docker-compose up -d foodgether-frontend foodgether-backend chrome
else
  echo "Running in full-service mode"
  docker-compose build --parallel
  docker-compose up -d
  docker run -d --name mongo \
    --network foodgether_foodgether-network \
    -e MONGODB_REPLICA_SET_MODE=primary \
    -e MONGODB_ADVERTISED_HOSTNAME=mongo \
    -e MONGODB_ROOT_PASSWORD=$FOODGETHER_MONGO_PASSWORD \
    -e MONGODB_REPLICA_SET_KEY=replicasetkey123 \
    bitnami/mongodb:latest
fi

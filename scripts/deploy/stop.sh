docker rm --force foodgether-frontend
docker rm --force foodgether-backend
docker-compose down
docker rmi $(docker images --filter=reference="foodgether-*" -q)

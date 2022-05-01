docker rm --force foodgether-frontend
docker rm --force foodgether-backend
docker-compose down
docker rm $(docker ps -aqf name="foodgether*")
docker rmi $(docker images --filter=reference="foodgether-*" -q)

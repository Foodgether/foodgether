cd server
docker rmi -f foodgether-backend
docker build . -t foodgether-backend
#docker run -d -p 3000:3000 --name foodgether-backend foodgether-backend

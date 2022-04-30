cd frontend
docker rmi -f foodgether-frontend
docker build . -t foodgether-frontend
#docker run -d -p 8181:8181 --name foodgether-frontend foodgether-frontend

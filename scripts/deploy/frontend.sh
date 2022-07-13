cd frontend
echo "VITE_FOODGETHER_BACKEND_URL=$VITE_FOODGETHER_BACKEND_URL" >> .env
echo "VITE_BASE_PATH=$VITE_BASE_PATH" >> .env
echo "VITE_FOODGETHER_GRPC_URL=$VITE_FOODGETHER_GRPC_URL" >> .env
docker build . -t foodgether-frontend
#docker run -d -p 8181:8181 --name foodgether-frontend foodgether-frontend

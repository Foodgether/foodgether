echo "Building Back End"
cd server
yarn install
yarn build
export DATABASE_URL="mongodb+srv://${FOODGETHER_MONGO_USERNAME}:${FOODGETHER_MONGO_PASSWORD}@lamprojects.e8cgw.mongodb.net/foodgether-prod?retryWrites=true&w=majority"
echo "mongodb+srv://${FOODGETHER_MONGO_USERNAME}:${FOODGETHER_MONGO_PASSWORD}@lamprojects.e8cgw.mongodb.net/foodgether-prod?retryWrites=true&w=majority" > .env
npx prisma db push

FROM node:17-alpine

RUN apt-get update && apt upgrade -y

WORKDIR /usr/src/app
COPY . .
RUN npm i -g pm2

EXPOSE 8181
CMD ["pm2-runtime", "./ecosystem.json"]

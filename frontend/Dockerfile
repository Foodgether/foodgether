FROM node:18-alpine

RUN apk update && apk upgrade

WORKDIR /usr/src/app
COPY . .
RUN npm i -g pm2

EXPOSE 8181
CMD ["pm2-runtime", "./ecosystem.json"]

FROM node:17

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update && apt upgrade -y

WORKDIR /usr/src/app
COPY . .

RUN rm -rf ./node_modules
RUN npm install
RUN npm i -g pm2
RUN ls

EXPOSE 8181
CMD ["pm2-runtime", "./ecosystem.json"]

FROM node:17

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV NODE_ENV production
RUN apt-get update && apt upgrade -y

WORKDIR /usr/src/app
COPY . .

RUN rm -rf ./node_modules
RUN rm -rf quick-start*
RUN npm install puppeteer
RUN npm install
RUN npm i -g pm2
RUN npx prisma generate

EXPOSE 8181
CMD ["pm2-runtime", "./ecosystem.json"]

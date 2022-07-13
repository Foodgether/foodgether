FROM node:18 as base
WORKDIR /usr/src/app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV NODE_ENV production
COPY . .
RUN npm install puppeteer
RUN npm i --legacy-peer-deps
RUN npx prisma generate
RUN npm i -g pm2
RUN apt update && apt upgrade -y
EXPOSE 8181
CMD ["pm2-runtime", "./ecosystem.json"]

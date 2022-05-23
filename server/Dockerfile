FROM node:18

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV NODE_ENV production

RUN apt update && apt upgrade -y

WORKDIR /usr/src/app
COPY . .

RUN rm -rf quick-start*
RUN npm install puppeteer
RUN npm install
RUN npm i -g pm2
RUN npx prisma generate
RUN npm prune --production

EXPOSE 8181
CMD ["pm2-runtime", "./ecosystem.json"]

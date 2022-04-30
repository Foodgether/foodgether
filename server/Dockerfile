FROM node:17

WORKDIR /usr/src/app
COPY . .
RUN rm -rf ./node-modules
RUN npm install
RUN npm i -g pm2
RUN ls

EXPOSE 8181
CMD ["pm2-runtime", "./ecosystem.json"]

FROM node:17

WORKDIR /usr/src/app
COPY . .
RUN npm i -g pm2
RUN ls

EXPOSE 8181
CMD ["pm2-runtime", "./ecosystem.json"]

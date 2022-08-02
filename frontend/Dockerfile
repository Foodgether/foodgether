FROM node:18-alpine AS base
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN yarn ci --legacy-peer-deps

FROM base AS builder
WORKDIR /usr/src/app
COPY . .
RUN npx patch-package
RUN yarn build

FROM node:18-alpine AS runner
RUN apk update && apk upgrade
RUN yarn install -g pm2
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
EXPOSE 8181
CMD ["pm2-runtime", "./ecosystem.json"]

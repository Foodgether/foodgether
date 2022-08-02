# Foodgether frontend

## Tech stack:

- Framework/Library: Express
- Code: TypeScript
- ORM: Prisma
- Database: MongoDB
- Cache: Redis

## Getting started

1. Install `Node 17` or `Node 18`
2. `yarn install` to install dependencies, check `package.json`
3. `npx prisma generate` to generate definitions from prisma file
4. Start Redis in Docker
5. `yarn run dev` to start local server, check `package.json`

## Environment Variable

- FOODGETHER_REDIS_HOST: Hostname to connect to redis server
- FOODGETHER_REDIS_PORT: Port to connect to redis server
- FOODGETHER_REDIS_PASSWORD: Password to autheticate with redis server
- DATABASE_URL: Mongodb uri string
- NODE_ENV: Detect whether it is production or not
- CHROME_URL: Browserless.io hostname for puppeteer connection
- CHROME_PORT: Browserless.io port for puppeteer connection
- JWT_SECRET: Secret to encrypt JWT

**`CHROME_URL`, `CHROME_PORT`, `NODE_ENV` is not required by default. Puppeteer will automatically install brower to use. It's only required in production environment**
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotEnv from 'dotenv';
import router from './routers';
import logger from './utils/logger';
import { initPrismaClient } from './prisma';
import { initRedis } from './redis';

const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
  dotEnv.config();
}
const jsonParser = bodyParser.json();
const app = express();
const port = 3000;

try {
  (async () => { await initPrismaClient(); })();
} catch (err) {
  if (isProduction) {
    logger.log('error', 'Prisma client failed to init', err);
    process.exit(1);
  }
}

try {
  (async () => { await initRedis(); })();
} catch (err) {
  if (isProduction) {
    logger.log('error', 'Redis failed to init', err);
    process.exit(1);
  }
}

app.use(morgan('tiny', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(jsonParser);
app.use('/', router);

app.listen(port, () => logger.log('info', `Express is listening at http://localhost:${port}`));

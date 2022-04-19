import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import router from './routers';
import logger from './utils/logger';

const isProduction = process.env.NODE_ENV === 'production';
const jsonParser = bodyParser.json();
const app = express();
const port = 3000;

if (!isProduction) {
  app.use(morgan('tiny', {
    stream: {
      write: message => logger.info(message.trim()),
    }
  }));
}
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(jsonParser);
app.use('/', router);

app.listen(port, () => logger.log('info', `Express is listening at http://localhost:${port}`));

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './lib/config';
import routes from './controllers';
import { logger, stream } from './utils/logger';
import { errorHandler, unknownEndpoint } from './middlewares';

require('express-async-errors');

const app = express();

app.use(helmet());
app.use(morgan('combined', { stream }));
app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => {
  logger.info('someone pinged here');
  res.send('pong');
});

app.use(routes);

app.use(unknownEndpoint);

app.use(errorHandler);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './lib/config';
import { logger, stream } from './utils/logger';

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

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});

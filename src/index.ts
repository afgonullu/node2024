import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import config from './lib/config';
import routes from './controllers';
import { logger, stream } from './utils/logger';
import { errorHandler, unknownEndpoint } from './middlewares';
import setupWebSocketServer from './controllers/websocketServer';
import setupSwagger from './controllers/swagger';

const app = express();
const server = createServer(app);

app.use(helmet());
app.use(morgan('combined', { stream }));
app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => {
  logger.info('someone pinged here');
  res.send('pong');
});

app.use(routes);

// Setup Swagger
setupSwagger(app);

// Set up WebSocket server
setupWebSocketServer(server);

app.use(unknownEndpoint);

app.use(errorHandler);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
  logger.info(`Swagger UI available at http://localhost:${config.PORT}/api-docs`);
});

import { Server as HttpServer } from 'http';
import { WebSocketServer } from 'ws';
import { Response } from 'express';
import { logger } from '../utils/logger';
import config from '../lib/config';
import { authMiddleware } from '../middlewares';
import { ExtendedRequest, ExtendedWebSocket } from '../interfaces/serverInterfaces';

const setupWebSocketServer = (server: HttpServer) => {
  logger.info('Setting up WebSocket server on /ws');

  const wss = new WebSocketServer({
    server,
    path: config.WS_PATH,
    verifyClient: async (info, callback) => {
      try {
        // Apply authentication middleware
        await authMiddleware(info.req as ExtendedRequest, {} as Response, () => {});
        callback(true);
      } catch (error) {
        logger.error('WebSocket authentication failed:', error);
        callback(false, 401, 'Unauthorized');
      }
    },
  });

  wss.on('connection', (ws: ExtendedWebSocket, req: ExtendedRequest) => {
    logger.info(`New WebSocket connection on ${config.WS_PATH}`);

    const wsx = ws;

    if (!req.user || !req.role) {
      logger.error('User or role not found in request');
      wsx.close(4000, 'User or role not found in request');
      return;
    }

    wsx.metadata = {
      user: req.user,
      role: req.role,
    };

    wsx.on('message', (message: string) => {
      if (!wsx.metadata) {
        logger.error('WebSocket metadata not found');
        wsx.close(4000, 'WebSocket metadata not found');
        return;
      }

      logger.info(`Received: ${message} from ${wsx.metadata.user}`);
      wsx.send(`Server received: ${message} from ${wsx.metadata.user}`);
    });

    wsx.on('error', (error) => {
      logger.error('WebSocket error:', error);
    });

    wsx.on('close', () => {
      logger.info('WebSocket connection closed');
    });
  });

  return wss;
};

export default setupWebSocketServer;

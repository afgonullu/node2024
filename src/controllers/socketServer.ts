import { Response } from 'express';
import { Server as HttpServer } from 'http';
import { Server, type Socket as SocketIO } from 'socket.io';
import { ExtendedRequest, ExtendedSocket, SocketMessage } from '@interfaces/serverInterfaces';
import { logger } from '@utils/logger';
import config from '@lib/config';
import { authMiddleware } from '@middlewares/index';
import flows from 'llm';

const messageHandlers: Record<string, { name: string; action: (message: string, socket: ExtendedSocket) => void }> = {
  haiku: {
    name: 'haiku-message',
    action: async (message: string, socket: ExtendedSocket) => {
      const haiku = await flows.generateHaiku(message);
      socket.emit(messageHandlers.haiku.name, haiku);
    },
  },
  echo: {
    name: 'echo-message',
    action: (message: string, socket: ExtendedSocket) => {
      socket.emit(messageHandlers.echo.name, message);
    },
  },
};

const validateMessageSchema = (message: SocketMessage) => {
  // check if message is valid json
  const { type, payload } = message;

  if (!type || !payload) {
    logger.warn('Invalid message format');
    return JSON.stringify({ error: 'Invalid message format' });
  }

  return null;
};

const validateRequest = (message: SocketMessage, socketx: ExtendedSocket, messageHandlerName: string) => {
  const schemaValidationError = validateMessageSchema(message);
  if (schemaValidationError) {
    socketx.emit(messageHandlerName, schemaValidationError);
    return false;
  }

  if (!socketx.metadata) {
    logger.error('Socket metadata not found');
    socketx.emit(messageHandlerName, 'Socket metadata not found');
    socketx.disconnect();
    return false;
  }

  return true;
};

const setupSocketServer = (server: HttpServer) => {
  logger.info(`Setting up Socket.IO server`);

  const io = new Server(server, {
    path: config.WS_PATH,
  });

  io.use(async (socket: SocketIO, next) => {
    try {
      await authMiddleware(socket.request as ExtendedRequest, {} as Response, () => {});
      next();
    } catch (error) {
      logger.error('Socket authentication failed:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: SocketIO) => {
    logger.info(`New Socket.IO connection`);
    const socketx = socket as ExtendedSocket;

    const { user, role } = socketx.request;

    if (!user || !role) {
      logger.error('User or role not found in socket request');
      socketx.disconnect();
      return;
    }

    socketx.metadata = {
      user,
      role,
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const messageHandler of Object.values(messageHandlers)) {
      socketx.on(messageHandler.name, async (message: SocketMessage) => {
        const isValid = validateRequest(message, socketx, messageHandler.name);
        if (isValid) {
          messageHandler.action(message.payload, socketx);
        }
      });
    }

    socketx.on('disconnect', () => {
      logger.info('Socket.IO connection closed');
    });
  });

  io.on('error', (error) => {
    logger.error('Socket.IO error:', error);
  });

  return io;
};

export default setupSocketServer;

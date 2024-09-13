import { Request, Response } from 'express';
import { Socket } from 'socket.io';
import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';

interface SocketMessage {
  type: string;
  payload: string;
}

interface ExtendedSocket extends Socket {
  request: IncomingMessage & {
    user: string;
    role: UserRole;
  };
  metadata?: SocketMetaData;
}

interface MessageHandler {
  (payload: string, ws: ExtendedWebSocket): Promise<void> | void;
}

interface SocketMetaData {
  user: string;
  role: UserRole;
}

interface ExtendedWebSocket extends WebSocket {
  metadata?: SocketMetaData;
}

interface ExtendedRequest extends Request {
  role?: UserRole;
  user?: string;
  userId?: string;
  sessionData?: {
    lastActive: Date;
    ipAddress: string;
  };
  context?: {
    requestId: string;
    startTime: number;
  };
  locals?: {
    [key: string]: unknown;
  };
  permissions?: string[];
}

enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

interface JWTPayload {
  role: UserRole;
  user: string;
}

type ServerResponse<T = Record<string, unknown>> = {
  status: number;
  success: boolean;
  message: string;
  data: T;
};

class ServerError<T = Record<string, unknown>> extends Error implements ServerResponse<T> {
  constructor(
    public status: number,
    public success: boolean,
    public message: string,
    public data: T,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.success = success;
    this.message = message;
    this.data = data;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

type ExtendedResponse<T> = Response<ServerResponse<T>>;

export {
  ServerResponse,
  ServerError,
  UserRole,
  ExtendedRequest,
  JWTPayload,
  ExtendedResponse,
  ExtendedWebSocket,
  ExtendedSocket,
  SocketMetaData,
  MessageHandler,
  SocketMessage,
};

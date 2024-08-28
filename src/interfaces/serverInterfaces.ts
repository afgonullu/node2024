import { Request, Response } from 'express';

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
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

type ExtendedResponse<T> = Response<ServerResponse<T>>;

export { ServerResponse, ServerError, UserRole, ExtendedRequest, JWTPayload, ExtendedResponse };

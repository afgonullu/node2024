import { ServerError } from '../interfaces/serverInterfaces';

class BadRequestError extends ServerError {
  constructor(message = 'Bad Request', data: Record<string, unknown> = {}) {
    super(400, false, message, data);
  }
}

class UnauthenticatedError extends ServerError {
  constructor(message = 'Authentication Credentials are not valid', data: Record<string, unknown> = {}) {
    super(401, false, message, data);
  }
}

class NotFoundError extends ServerError {
  constructor(message = 'Resource not found', data: Record<string, unknown> = {}) {
    super(404, false, message, data);
  }
}

class InternalServerError extends ServerError {
  constructor(message = 'Internal Server Error', data: Record<string, unknown> = {}) {
    super(500, false, message, data);
  }
}

class UnavailableError extends ServerError {
  constructor(message = 'Service is currently unavailable', data: Record<string, unknown> = {}) {
    super(503, false, message, data);
  }
}

class InvalidJSONPayloadError extends ServerError {
  constructor(message = 'Invalid JSON payload', data: Record<string, unknown> = {}) {
    super(400, false, message, data);
  }
}

export {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  InternalServerError,
  UnavailableError,
  InvalidJSONPayloadError,
};

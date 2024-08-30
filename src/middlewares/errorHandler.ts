import { NextFunction, Request, Response } from 'express';
import { ServerError } from '../interfaces/serverInterfaces';
import { logger } from '../utils/logger';

const errorHandler = (err: ServerError, _req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof ServerError) {
    res.status(err.status).json({
      success: err.success,
      message: err.message,
      data: err.data,
    });
  } else {
    // Handle unexpected errors
    logger.error('Error is not a server error, please use the server error class');
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    });
  }

  next(err);
};

export default errorHandler;

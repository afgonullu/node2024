import { NextFunction, Request, Response } from 'express';
import { ServerError, ServerResponse } from '@interfaces/serverInterfaces';
import { logger } from '@utils/logger';

const errorHandler = (err: ServerError, _req: Request, res: Response<ServerResponse>, next: NextFunction): void => {
  if (err instanceof ServerError) {
    res.status(err.status).json({
      status: err.status,
      success: err.success,
      message: err.message,
      data: err.data,
    });
  } else {
    // Handle unexpected errors
    logger.error('Error is not a server error, please use the server error class');
    res.status(500).json({
      status: 500,
      success: false,
      message: 'An unexpected error occurred',
      data: {},
    });
  }

  next(err);
};

export default errorHandler;

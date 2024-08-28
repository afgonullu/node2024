import { NextFunction, Request, Response } from 'express';

const unknownEndpoint = (_req: Request, res: Response, next: NextFunction): void => {
  res.status(404).send({ error: 'unknown endpoint' });
  next();
};

export default unknownEndpoint;

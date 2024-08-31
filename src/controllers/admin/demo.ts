import express, { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { InternalServerError } from '../../lib/serverErrors';
import { ExtendedRequest, ExtendedResponse } from '../../interfaces/serverInterfaces';

const demoRouter = express.Router();

demoRouter.get('/', (_req: Request, res: ExtendedResponse<{ name: string }>) => {
  logger.info('Demo route accessed');
  res.json({ status: 200, success: true, message: 'Demo route accessed', data: { name: 'Hi' } });
});

demoRouter.get('/error', () => {
  throw new InternalServerError('Demo route error');
});

demoRouter.get('/get-user', (req: ExtendedRequest, res: Response) => {
  res.json({ user: req.user, role: req.role });
});

export default demoRouter;

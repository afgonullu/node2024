import express, { Request, Response } from 'express';
import { logger } from '@utils/logger';
import { InternalServerError } from '@lib/serverErrors';
import { ExtendedRequest, ExtendedResponse } from '@interfaces/serverInterfaces';

const demoController = {
  getDemo: async (_req: Request, res: ExtendedResponse<{ name: string }>) => {
    logger.info('Demo route accessed');
    res.json({ status: 200, success: true, message: 'Demo route accessed', data: { name: 'Hi' } });
  },
  getDemoError: async () => {
    throw new InternalServerError('Demo route error');
  },
  getDemoUser: async (req: ExtendedRequest, res: Response) => {
    res.json({ user: req.user, role: req.role });
  },
};

const demoRouter = express.Router();

demoRouter.get('/', demoController.getDemo);
demoRouter.get('/error', demoController.getDemoError);
demoRouter.get('/get-user', demoController.getDemoUser);

export default demoRouter;

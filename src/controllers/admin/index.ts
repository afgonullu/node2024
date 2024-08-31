import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import demoRouter from '@controllers/admin/demo';
import config from '@lib/config';
import { UnauthenticatedError } from '@lib/serverErrors';
import { ExtendedRequest, UserRole } from '@interfaces/serverInterfaces';
import { authMiddleware } from '@middlewares/index';

const { SUPER_ADMIN_PASSWORD, JWT_SECRET } = config;

const adminController = {
  getAdmin: (_req: ExtendedRequest, res: Response) => {
    res.json({ message: 'Hello, world!' });
  },
  login: (req: Request, res: Response) => {
    const { username, password } = req.body as { username: string; password: string };

    const isSuperAdmin = username === 'admin' && password === SUPER_ADMIN_PASSWORD;

    if (isSuperAdmin) {
      const token = jwt.sign({ role: UserRole.SUPER_ADMIN, user: username }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      throw new UnauthenticatedError('You are not authorized to access this resource');
    }
  },
};

const adminRouter = express.Router();

adminRouter.get('/', adminController.getAdmin);
adminRouter.post('/login/', adminController.login);

adminRouter.use('/demo', authMiddleware, demoRouter);

export default adminRouter;

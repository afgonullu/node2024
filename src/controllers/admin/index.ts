import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import demoRouter from './demo';
import config from '../../lib/config';
import { InternalServerError, UnauthenticatedError } from '../../lib/serverErrors';
import { ExtendedRequest, UserRole } from '../../interfaces/serverInterfaces';
import { authMiddleware } from '../../middlewares';

const { SUPER_ADMIN_PASSWORD, JWT_SECRET } = config;
if (!SUPER_ADMIN_PASSWORD) {
  throw new InternalServerError('SUPER_ADMIN_PASSWORD is not set');
}
if (!JWT_SECRET) {
  throw new InternalServerError('JWT_SECRET is not set');
}

const router = express.Router();

router.get('/', (_req: ExtendedRequest, res: Response) => {
  res.json({ message: 'Hello, world!' });
});

router.post('/login/', (req: Request, res: Response) => {
  const { username, password } = req.body as { username: string; password: string };

  const isSuperAdmin = username === 'admin' && password === SUPER_ADMIN_PASSWORD;

  if (isSuperAdmin) {
    const token = jwt.sign({ role: UserRole.SUPER_ADMIN, user: username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    throw new UnauthenticatedError('You are not authorized to access this resource');
  }
});

router.use('/demo', authMiddleware, demoRouter);

export default router;

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ExtendedRequest, JWTPayload } from '../interfaces/serverInterfaces';
import { UnauthenticatedError } from '../lib/serverErrors';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const authMiddleware = async (req: ExtendedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new UnauthenticatedError('No token provided');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.role = decoded.role;
    req.user = decoded.user;
  } catch (error) {
    throw new UnauthenticatedError('Invalid token');
  }

  next();
};

export default authMiddleware;

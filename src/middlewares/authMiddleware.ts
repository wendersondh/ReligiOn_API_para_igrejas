import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/userTypes';

const JWT_SECRET = 'secreta';

export const authenticateJWT = (req: any, res: any, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid Token' });
  }
};

import { Request, Response, NextFunction } from 'express';

export const validateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json({ message: 'Name and email are required' });
  } else {
    next();
  }
};

import { JwtPayload } from '../types/userTypes';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

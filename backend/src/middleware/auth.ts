import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User, { IUser } from '../models/User';

// Extend the Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      req.user = user;
      next();
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
    return;
  }
};

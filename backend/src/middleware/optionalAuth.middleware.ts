import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

/**
 * Optional authentication middleware
 * Tries to authenticate if token is provided, but doesn't fail if not
 * Sets req.user if authenticated, otherwise continues without user
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // If token is invalid, just continue without user
      console.warn('Optional auth failed, continuing without user:', error);
    }
  }

  // If no token or invalid token, create a demo user for tracking
  if (!req.user) {
    // Create a demo user object for tracking purposes
    req.user = {
      _id: 'demo_user',
      username: 'demo',
      email: 'demo@example.com',
      role: 'user',
    };
  }

  next();
};


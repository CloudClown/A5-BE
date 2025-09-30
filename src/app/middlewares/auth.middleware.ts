import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/user.model';
import { sendResponse } from '../utils/apiResponse';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendResponse(res, {
        success: false,
        message: 'No token provided',
        statusCode: 401,
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as any;

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return sendResponse(res, {
        success: false,
        message: 'User not found',
        statusCode: 404,
      });
    }

    if (user.status === 'blocked') {
      return sendResponse(res, {
        success: false,
        message: 'Your account has been blocked',
        statusCode: 403,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: 'Invalid token',
      statusCode: 401,
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return sendResponse(res, {
        success: false,
        message: 'You are not authorized to access this resource',
        statusCode: 403,
      });
    }
    next();
  };
};

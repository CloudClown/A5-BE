import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/apiResponse';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendResponse(res, {
      success: false,
      message: err.message,
      error: err,
      statusCode: err.statusCode,
    });
  }

  if (err.isOperational) {
    return sendResponse(res, {
      success: false,
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  return sendResponse(res, {
    success: false,
    message: 'Something went wrong',
    statusCode: 500,
  });
};

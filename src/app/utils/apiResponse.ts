import { Response } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

export const sendResponse = <T>(
  res: Response,
  {
    success = true,
    message = '',
    data = undefined,
    error = undefined,
    statusCode = 200,
  }: ApiResponse<T> & { statusCode?: number }
) => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data !== undefined && { data }),
    ...(error !== undefined && { error }),
  });
};

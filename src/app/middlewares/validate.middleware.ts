import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
import { sendResponse } from '../utils/apiResponse';

export const validate =
  (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return sendResponse(res, {
        success: false,
        message: 'Validation failed',
        error: error,
        statusCode: 400,
      });
    }
  };
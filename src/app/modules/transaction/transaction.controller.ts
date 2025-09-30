import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import { TransactionService } from './transaction.service';

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  getTransactionHistory = catchAsync(async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      return sendResponse(res, {
        success: false,
        message: 'User not authenticated',
        data: null,
      });
    }
    const transactions = await this.transactionService.getTransactionHistory(
      req.user.id,
      req.query
    );

    if (!req.user || !req.user.id) {
      return sendResponse(res, {
        success: false,
        message: 'User not authenticated',
        data: null,
      });
    }
    const transaction = await this.transactionService.getTransactionDetails(
      req.params.id,
      req.user.id
    );
  });

  getTransactionDetails = catchAsync(async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      return sendResponse(res, {
        success: false,
        message: 'User not authenticated',
        data: null,
      });
    }

    const transaction = await this.transactionService.getTransactionDetails(
      req.params.id,
      req.user.id
    );

    sendResponse(res, {
      success: true,
      data: transaction,
    });
  });
}

const transactionService = new TransactionService();
export const transactionController = new TransactionController(transactionService);

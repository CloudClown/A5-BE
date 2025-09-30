import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import { WalletService } from './wallet.service';

export class WalletController {
  constructor(private walletService: WalletService) {}

  deposit = catchAsync(async (req: Request, res: Response) => {
    const { amount } = req.body;
    if (!req.user?._id) throw new Error('User not authenticated');

    const transaction = await this.walletService.deposit(req.user._id.toString(), amount);

    sendResponse(res, {
      success: true,
      message: 'Amount deposited successfully',
      data: transaction,
    });
  });

  withdraw = catchAsync(async (req: Request, res: Response) => {
    const { amount } = req.body;
    if (!req.user?._id) throw new Error('User not authenticated');

    const transaction = await this.walletService.withdraw(req.user._id.toString(), amount);

    sendResponse(res, {
      success: true,
      message: 'Amount withdrawn successfully',
      data: transaction,
    });
  });

  send = catchAsync(async (req: Request, res: Response) => {
    const { amount, recipientId } = req.body;
    if (!req.user?._id) throw new Error('User not authenticated');

    const transaction = await this.walletService.sendMoney(
      req.user._id.toString(),
      recipientId,
      amount
    );

    sendResponse(res, {
      success: true,
      message: 'Money sent successfully',
      data: transaction,
    });
  });
}

const walletService = new WalletService();
export const walletController = new WalletController(walletService);

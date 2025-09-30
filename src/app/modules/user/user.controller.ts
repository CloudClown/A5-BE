import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import { UserService } from './user.service';

export class UserController {
  constructor(private userService: UserService) {}

  getProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      return sendResponse(res, {
        success: false,
        message: 'User not authenticated',
        data: null,
      });
    }
    const user = await this.userService.getProfile(req.user.id);
    sendResponse(res, {
      success: true,
      data: user,
    });
  });

  getMyTransactions = catchAsync(async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      return sendResponse(res, {
        success: false,
        message: 'User not authenticated',
        data: null,
      });
    }
    const transactions = await this.userService.getUserTransactions(req.user.id);
    sendResponse(res, {
      success: true,
      data: transactions,
    });
  });
}

const userService = new UserService();
export const userController = new UserController(userService);

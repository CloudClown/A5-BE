import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import { AdminService } from './admin.service';


export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  getAllUsers = catchAsync(async (_req: Request, res: Response) => {
    const users = await this.adminService.getAllUsers();
    sendResponse(res, {
      success: true,
      data: users,
    });
  });

  getAllAgents = catchAsync(async (_req: Request, res: Response) => {
    const agents = await this.adminService.getAllAgents();
    sendResponse(res, {
      success: true,
      data: agents,
    });
  });

  updateUserRole = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    const updatedUser = await this.adminService.updateUserRole(id, role);
    sendResponse(res, {
      success: true,
      message: 'User role updated successfully',
      data: updatedUser,
    });
  });

  blockWallet = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const wallet = await this.adminService.blockWallet(id);
    sendResponse(res, {
      success: true,
      message: 'Wallet blocked successfully',
      data: wallet,
    });
  });

  getAllWallets = catchAsync(async (_req: Request, res: Response) => {
    const wallets = await this.adminService.getAllWallets();
    sendResponse(res, {
      success: true,
      data: wallets,
    });
  });

  getAllTransactions = catchAsync(async (req: Request, res: Response) => {
    const transactions = await this.adminService.getAllTransactions(req.query);
    sendResponse(res, {
      success: true,
      data: transactions,
    });
  });
}

export const adminController = new AdminController();
import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import { AuthService } from './auth.service';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = catchAsync(async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body);
    sendResponse(res, {
      success: true,
      message: 'User registered successfully',
      data: user,
      statusCode: 201,
    });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const { tokens, user } = await this.authService.login(req.body);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    sendResponse(res, {
      success: true,
      message: 'Logged in successfully',
      data: {
        accessToken: tokens.accessToken,
        user,
      },
    });
  });

  refreshToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return sendResponse(res, {
        success: false,
        message: 'Refresh token not found',
        statusCode: 401,
      });
    }

    const { accessToken } = await this.authService.refreshToken(refreshToken);

    sendResponse(res, {
      success: true,
      data: { accessToken },
    });
  });
}

const authService = new AuthService();
export const authController = new AuthController(authService);

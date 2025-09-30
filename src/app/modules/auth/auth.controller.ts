import { Request, Response } from 'express';
import { IUser } from '../../models/user.model';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import { AuthService } from './auth.service';
import { config } from '../../config/env';

// Extend express Request type to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}

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
      secure: config.env === 'production',
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

  googleCallback = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.redirect(`${config.frontend.url}/login?error=auth-failed`);
    }

    const authTokens = await this.authService.generateAuthTokens(req.user);
    const { tokens } = authTokens;

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Redirect to frontend with access token
    res.redirect(`${config.frontend.url}?token=${tokens.accessToken}`);
  });
}

const authService = new AuthService();
export const authController = new AuthController(authService);

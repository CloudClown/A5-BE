import { User } from '../../models/user.model';
import { Wallet } from '../../models/wallet.model';
import { generateToken, generateRefreshToken } from '../../utils/jwt';

export class AuthService {
  async register(userData: any) {
    const { email } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Create user
    const user = await User.create(userData);

    // Create wallet for user
    const wallet = await Wallet.create({ owner: user._id });

    // Update user with wallet reference
    user.wallet = wallet._id;
    await user.save();

    return user;
  }

  async login(credentials: { email: string; password: string }) {
    const { email, password } = credentials;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    if (user.status === 'blocked') {
      throw new Error('Your account has been blocked');
    }

    const tokens = this.generateAuthTokens(user._id);

    // Remove password from response
    const userWithoutPassword = user.toJSON();
    return { tokens, user: userWithoutPassword };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = await this.verifyRefreshToken(refreshToken);
      if (typeof decoded !== 'object' || decoded === null || !('id' in decoded)) {
        throw new Error('Invalid refresh token payload');
      }
      const accessToken = generateToken({ id: (decoded as { id: string }).id });
      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  private generateAuthTokens(userId: string) {
    return {
      accessToken: generateToken({ id: userId }),
      refreshToken: generateRefreshToken({ id: userId }),
    };
  }

  private async verifyRefreshToken(token: string) {
    try {
      return await import('../../utils/jwt').then(jwt => jwt.verifyRefreshToken(token));
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

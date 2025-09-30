import { User } from '../../models/user.model';
import { Wallet } from '../../models/wallet.model';
import { Transaction } from '../../models/transaction.model';

export class AdminService {
  async getAllUsers() {
    return User.find().select('-password').populate('wallet');
  }

  async getAllAgents() {
    return User.find({ role: 'agent' }).select('-password').populate('wallet');
  }

  async updateUserRole(userId: string, newRole: 'user' | 'agent' | 'admin') {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.role = newRole;
    await user.save();

    return user;
  }

  async blockWallet(walletId: string) {
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    wallet.status = 'blocked';
    await wallet.save();

    return wallet;
  }

  async getAllWallets() {
    return Wallet.find().populate('owner', 'name email role');
  }

  async getAllTransactions(query: any) {
    const {
      type,
      startDate,
      endDate,
      limit = 10,
      page = 1,
    } = query;

    const filter: any = {};

    if (type) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('from to', 'name email');

    const total = await Transaction.countDocuments(filter);

    return {
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    };
  }
}
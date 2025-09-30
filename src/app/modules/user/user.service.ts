import { User } from '../../models/user.model';
import { Transaction } from '../../models/transaction.model';

export class UserService {
  async getProfile(userId: string) {
    const user = await User.findById(userId)
      .select('-password')
      .populate('wallet');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getUserTransactions(userId: string) {
    const transactions = await Transaction.find({
      $or: [{ from: userId }, { to: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('from to', 'name email');

    return transactions;
  }
}

import { Transaction } from '../../models/transaction.model';

export class TransactionService {
  async getTransactionHistory(userId: string, query: any) {
    const {
      type,
      startDate,
      endDate,
      limit = 10,
      page = 1,
    } = query;

    const filter: any = {
      $or: [{ from: userId }, { to: userId }],
    };

    if (type) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate);
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

  async getTransactionDetails(transactionId: string, userId: string) {
    const transaction = await Transaction.findById(transactionId)
      .populate('from to', 'name email');

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Ensure user is part of the transaction
    if (
      transaction.from.toString() !== userId &&
      transaction.to.toString() !== userId
    ) {
      throw new Error('Unauthorized access to transaction');
    }

    return transaction;
  }
}

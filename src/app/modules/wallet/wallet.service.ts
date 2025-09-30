import mongoose from 'mongoose';
import { User } from '../../models/user.model';
import { Wallet } from '../../models/wallet.model';
import { Transaction } from '../../models/transaction.model';

export class WalletService {
  private async checkWalletStatus(walletId: string) {
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    if (wallet.status === 'blocked') {
      throw new Error('Wallet is blocked');
    }
    return wallet;
  }

  private async validateAmount(amount: number) {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
  }

  private async checkBalance(wallet: any, amount: number) {
    if (wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }
  }

  private calculateFee(amount: number, type: string): { fee: number; commission: number } {
    let fee = 0;
    let commission = 0;

    switch (type) {
      case 'withdraw':
        fee = amount * 0.015; // 1.5% fee for withdrawals
        break;
      case 'send':
        fee = amount * 0.01; // 1% fee for transfers
        break;
      case 'cash-out':
        fee = amount * 0.02; // 2% fee for cash-out
        commission = amount * 0.01; // 1% commission for agent
        break;
    }

    return { fee, commission };
  }

  async deposit(userId: string, amount: number) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await this.validateAmount(amount);

      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      const wallet = await this.checkWalletStatus(user.wallet.toString());

      // Update wallet balance
      const updatedWallet = await Wallet.findByIdAndUpdate(
        wallet._id,
        { $inc: { balance: amount } },
        { new: true, session }
      );

      // Create transaction record
      const transaction = await Transaction.create([{
        from: userId,
        to: userId,
        amount,
        type: 'deposit',
        fee: 0,
        commission: 0,
        status: 'completed',
        initiatedBy: 'user',
      }], { session });

      await session.commitTransaction();
      return transaction[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async withdraw(userId: string, amount: number) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await this.validateAmount(amount);

      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      const wallet = await this.checkWalletStatus(user.wallet.toString());
      const { fee } = this.calculateFee(amount, 'withdraw');
      const totalAmount = amount + fee;

      await this.checkBalance(wallet, totalAmount);

      // Update wallet balance
      const updatedWallet = await Wallet.findByIdAndUpdate(
        wallet._id,
        { $inc: { balance: -totalAmount } },
        { new: true, session }
      );

      // Create transaction record
      const transaction = await Transaction.create([{
        from: userId,
        to: userId,
        amount,
        type: 'withdraw',
        fee,
        commission: 0,
        status: 'completed',
        initiatedBy: 'user',
      }], { session });

      await session.commitTransaction();
      return transaction[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async sendMoney(senderId: string, recipientId: string, amount: number) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await this.validateAmount(amount);

      const sender = await User.findById(senderId).session(session);
      if (!sender) {
        throw new Error('Sender not found');
      }

      const recipient = await User.findById(recipientId).session(session);
      if (!recipient) {
        throw new Error('Recipient not found');
      }

      const senderWallet = await this.checkWalletStatus(sender.wallet.toString());
      const recipientWallet = await this.checkWalletStatus(recipient.wallet.toString());

      const { fee } = this.calculateFee(amount, 'send');
      const totalAmount = amount + fee;

      await this.checkBalance(senderWallet, totalAmount);

      // Update sender's wallet
      await Wallet.findByIdAndUpdate(
        senderWallet._id,
        { $inc: { balance: -totalAmount } },
        { session }
      );

      // Update recipient's wallet
      await Wallet.findByIdAndUpdate(
        recipientWallet._id,
        { $inc: { balance: amount } },
        { session }
      );

      // Create transaction record
      const transaction = await Transaction.create([{
        from: senderId,
        to: recipientId,
        amount,
        type: 'send',
        fee,
        commission: 0,
        status: 'completed',
        initiatedBy: 'user',
      }], { session });

      await session.commitTransaction();
      return transaction[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

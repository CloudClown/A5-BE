import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  amount: number;
  type: 'deposit' | 'withdraw' | 'send' | 'cash-in' | 'cash-out';
  fee: number;
  commission: number;
  status: 'pending' | 'completed' | 'reversed';
  initiatedBy: 'user' | 'agent';
  timestamp: Date;
}

const transactionSchema = new Schema<ITransaction>({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'send', 'cash-in', 'cash-out'],
    required: true,
  },
  fee: {
    type: Number,
    default: 0,
  },
  commission: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'reversed'],
    required: true,
    default: 'pending',
  },
  initiatedBy: {
    type: String,
    enum: ['user', 'agent'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

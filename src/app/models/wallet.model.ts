import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
  owner: mongoose.Types.ObjectId;
  balance: number;
  status: 'active' | 'blocked';
}

const walletSchema = new Schema<IWallet>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  balance: {
    type: Number,
    default: 50,
    min: 0,
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
}, {
  timestamps: true,
});

export const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);

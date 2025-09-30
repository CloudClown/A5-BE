import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(['user', 'agent', 'admin']),
  }),
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
});

export const blockWalletSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Wallet ID is required'),
  }),
});

export const walletTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be greater than 0'),
  }),
});

export const sendMoneySchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be greater than 0'),
    recipientId: z.string().min(1, 'Recipient ID is required'),
  }),
});

export const transactionQuerySchema = z.object({
  query: z.object({
    type: z.enum(['deposit', 'withdraw', 'send', 'cash-in', 'cash-out']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});
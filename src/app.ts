import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import 'express-async-errors';

import { config } from './app/config/env';
import { errorHandler } from './app/middlewares/error.middleware';
import './app/config/passport';
import { authRoutes } from './app/modules/auth/auth.routes';
import { userRoutes } from './app/modules/user/user.routes';
import { walletRoutes } from './app/modules/wallet/wallet.routes';
import { transactionRoutes } from './app/modules/transaction/transaction.routes';
import { adminRoutes } from './app/modules/admin/admin.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(cookieParser());

// Session middleware for Passport
app.use(session({
  secret: config.session.secret || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.env === 'production',
    maxAge: config.session.maxAge,
  },
}));

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/wallets', walletRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health check
// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'ok' });
// });

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome To digital-wallet API',
  });
});

// Error handling
app.use(errorHandler);

export { app };

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  API_PREFIX: z.string().default('/api/v1'),

  // Super Admin Seed
  SUPER_ADMIN_NAME: z.string().default('Super Admin'),
  SUPER_ADMIN_EMAIL: z.string().email().default('admin@digitalwallet.com'),
  SUPER_ADMIN_PASSWORD: z.string().min(6).default('admin123'),

  // Database
  DB_URL: z.string(),

  // JWT
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES: z.string().default('30d'),

  // Bcrypt
  BCRYPT_SALT_ROUND: z.string().transform(Number).default(10),

  // Wallet
  INITIAL_BALANCE_CENTS: z.coerce.number().default(5000),
  MINIMUM_BALANCE: z.coerce.number().default(0),
  WITHDRAWAL_FEE_PERCENTAGE: z.coerce.number().default(1.5),
  TRANSFER_FEE_PERCENTAGE: z.coerce.number().default(1.0),
  CASH_OUT_FEE_PERCENTAGE: z.coerce.number().default(2.0),
  AGENT_COMMISSION_PERCENTAGE: z.coerce.number().default(1.0),
  DAILY_TRANSACTION_LIMIT: z.coerce.number().default(50000),
  MONTHLY_TRANSACTION_LIMIT: z.coerce.number().default(1000000),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),

  // Session
  EXPRESS_SESSION_SECRET: z.string().optional(),
  SESSION_MAX_AGE: z.coerce.number().default(86400000),

  // Frontend
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  FRONTEND_RESET_PASSWORD_URL: z.string().default('/reset-password'),
  FRONTEND_EMAIL_VERIFY_URL: z.string().default('/verify-email'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('debug'),
  ENABLE_REQUEST_LOGGING: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().default(true)
  ),
});

const envVars = envSchema.parse(process.env);

export const config = {
  env: envVars.NODE_ENV,
  port: parseInt(envVars.PORT, 10),
  corsOrigin: envVars.CORS_ORIGIN,
  apiPrefix: envVars.API_PREFIX,

  superAdmin: {
    name: envVars.SUPER_ADMIN_NAME,
    email: envVars.SUPER_ADMIN_EMAIL,
    password: envVars.SUPER_ADMIN_PASSWORD,
  },

  mongoose: {
    url: envVars.DB_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
    refreshToken: {
      secret: envVars.JWT_REFRESH_SECRET,
      expiresIn: envVars.JWT_REFRESH_EXPIRES,
    },
  },

  bcrypt: {
    saltRounds: envVars.BCRYPT_SALT_ROUND,
  },

  wallet: {
    initialBalance: envVars.INITIAL_BALANCE_CENTS,
    minimumBalance: envVars.MINIMUM_BALANCE,
    fees: {
      withdrawal: envVars.WITHDRAWAL_FEE_PERCENTAGE,
      transfer: envVars.TRANSFER_FEE_PERCENTAGE,
      cashOut: envVars.CASH_OUT_FEE_PERCENTAGE,
      agentCommission: envVars.AGENT_COMMISSION_PERCENTAGE,
    },
    limits: {
      daily: envVars.DAILY_TRANSACTION_LIMIT,
      monthly: envVars.MONTHLY_TRANSACTION_LIMIT,
    },
  },

  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackUrl: envVars.GOOGLE_CALLBACK_URL,
  },

  session: {
    secret: envVars.EXPRESS_SESSION_SECRET,
    maxAge: envVars.SESSION_MAX_AGE,
  },

  frontend: {
    url: envVars.FRONTEND_URL,
    resetPasswordPath: envVars.FRONTEND_RESET_PASSWORD_URL,
    emailVerifyPath: envVars.FRONTEND_EMAIL_VERIFY_URL,
  },

  logging: {
    level: envVars.LOG_LEVEL,
    enableRequestLogging: envVars.ENABLE_REQUEST_LOGGING,
  },
};

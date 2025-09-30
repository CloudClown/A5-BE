import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { config } from '../config/env';

interface TokenPayload {
  id: string;
  role?: string;
  [key: string]: any;
}

export const generateToken = (payload: TokenPayload): string => {
  if (!config.jwt.secret) {
    throw new Error('JWT secret is not defined');
  }

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as SignOptions);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  if (!config.jwt.refreshToken.secret) {
    throw new Error('JWT refresh token secret is not defined');
  }

  return jwt.sign(payload, config.jwt.refreshToken.secret, {
    expiresIn: config.jwt.refreshToken.expiresIn,
  } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload | string => {
  if (!config.jwt.secret) {
    throw new Error('JWT secret is not defined');
  }

  return jwt.verify(token, config.jwt.secret);
};

export const verifyRefreshToken = (token: string): JwtPayload | string => {
  if (!config.jwt.refreshToken.secret) {
    throw new Error('JWT refresh token secret is not defined');
  }

  return jwt.verify(token, config.jwt.refreshToken.secret);
};

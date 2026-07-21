import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const ensureSecret = (secret, name) => { if (!secret) throw new AppError(`${name} is not configured.`, 503); return secret; };
export const signAccessToken = (user) => jwt.sign({ sub: user.id, role: user.role }, ensureSecret(env.accessSecret, 'JWT_ACCESS_SECRET'), { expiresIn: env.accessExpiry });
export const signRefreshToken = (user) => jwt.sign({ sub: user.id }, ensureSecret(env.refreshSecret, 'JWT_REFRESH_SECRET'), { expiresIn: env.refreshExpiry });
export const verifyRefreshToken = (token) => jwt.verify(token, env.refreshSecret);
export const randomToken = () => crypto.randomBytes(32).toString('hex');
export const cookieOptions = { httpOnly: true, secure: env.nodeEnv === 'production', sameSite: env.nodeEnv === 'production' ? 'none' : 'lax', path: '/api/v1/auth', maxAge: 7 * 24 * 60 * 60 * 1000 };

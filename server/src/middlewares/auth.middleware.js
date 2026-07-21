import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export async function protect(req, res, next) { try { const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null; if (!token) throw new AppError('Authentication required.', 401); const payload = jwt.verify(token, env.accessSecret); const user = await User.findById(payload.sub); if (!user || user.isSuspended) throw new AppError('Your account is unavailable.', 401); req.user = user; next(); } catch (error) { next(error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' ? new AppError('Invalid or expired access token.', 401) : error); } }
export const authorize = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : next(new AppError('Insufficient permissions.', 403));

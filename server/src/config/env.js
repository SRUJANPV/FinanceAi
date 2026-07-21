import dotenv from 'dotenv';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '..', '.env') });

const mongoUri = process.env.MONGODB_URI && !/[<>]/.test(process.env.MONGODB_URI)
  ? process.env.MONGODB_URI
  : undefined;

const required = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'CLIENT_URL', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD'];

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri,
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpiry: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiry: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini'
});

export const validateEnv = () => {
  if (env.nodeEnv === 'production') {
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
};
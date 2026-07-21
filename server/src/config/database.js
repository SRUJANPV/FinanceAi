import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  if (!env.mongoUri) { console.warn('MONGODB_URI is not configured; database connection skipped.'); return; }
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
  console.info('MongoDB connected');
}

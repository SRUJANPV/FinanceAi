import { ActivityLog } from '../models/ActivityLog.js';
export const logActivity = (payload) => ActivityLog.create(payload).catch((error) => console.error('Activity log error', error));

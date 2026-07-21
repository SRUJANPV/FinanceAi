import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env, validateEnv } from './config/env.js';
import { scheduleBillReminders } from './jobs/bill-reminders.job.js';

validateEnv();
connectDatabase().then(() => { scheduleBillReminders(); const server = app.listen(env.port, () => console.info(`SmartSpend API running on :${env.port}`)); const shutdown = (signal) => { console.info(`${signal} received; shutting down gracefully.`); server.close(() => process.exit(0)); }; process.once('SIGTERM', () => shutdown('SIGTERM')); process.once('SIGINT', () => shutdown('SIGINT')); }).catch((error) => { console.error('Unable to start server', error); process.exit(1); });

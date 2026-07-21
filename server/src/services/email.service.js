import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const configured = () => process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD;
export async function sendEmail({ to, subject, html }) {
  if (!configured()) { console.info(`[email skipped] ${subject} -> ${to}`); return; }
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } });
  await transporter.sendMail({ from: process.env.SMTP_FROM || 'SmartSpend AI <no-reply@smartspend.ai>', to, subject, html });
}
export const appLink = (path) => `${env.clientUrl}${path}`;

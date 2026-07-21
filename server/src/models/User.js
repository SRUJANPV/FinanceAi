import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, minlength: 8, select: false },
  avatar: String, currency: { type: String, default: 'INR' }, timezone: { type: String, default: 'Asia/Kolkata' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, isVerified: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false }, refreshTokens: { type: [{ token: String, expiresAt: Date }], default: [] },
  verificationToken: { type: String, select: false }, verificationExpires: { type: Date, select: false },
  resetPasswordToken: { type: String, select: false }, resetPasswordExpires: { type: Date, select: false }, lastLoginAt: Date
}, { timestamps: true, toJSON: { transform: (_, ret) => { delete ret.password; delete ret.refreshTokens; delete ret.verificationToken; delete ret.resetPasswordToken; return ret; } } });
userSchema.pre('save', async function hashPassword(next) { if (!this.isModified('password')) return next(); this.password = await bcrypt.hash(this.password, 12); next(); });
userSchema.methods.comparePassword = function comparePassword(value) { return bcrypt.compare(value, this.password); };
export const User = mongoose.model('User', userSchema);

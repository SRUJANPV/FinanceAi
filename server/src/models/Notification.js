import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, type: { type: String, enum: ['budget', 'bill', 'goal', 'ai', 'system'], default: 'system' }, title: { type: String, required: true }, message: { type: String, required: true }, readAt: Date, metadata: mongoose.Schema.Types.Mixed }, { timestamps: true });
notificationSchema.index({ user: 1, createdAt: -1 });
export const Notification = mongoose.model('Notification', notificationSchema);

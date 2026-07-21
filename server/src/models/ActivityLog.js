import mongoose from 'mongoose';
const activityLogSchema = new mongoose.Schema({ actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, action: { type: String, required: true }, entity: String, entityId: mongoose.Schema.Types.ObjectId, metadata: mongoose.Schema.Types.Mixed }, { timestamps: true });
activityLogSchema.index({ createdAt: -1 });
export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

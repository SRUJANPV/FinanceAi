import mongoose from 'mongoose';
const insightSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, type: { type: String, enum: ['alert', 'saving', 'forecast', 'budget', 'anomaly'], required: true }, title: String, message: String, severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' }, metadata: mongoose.Schema.Types.Mixed }, { timestamps: true });
export const Insight = mongoose.model('Insight', insightSchema);

import mongoose from 'mongoose';
const budgetSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, category: { type: String, required: true }, limit: { type: Number, required: true, min: 1 }, month: { type: String, required: true, match: /^\d{4}-\d{2}$/ }, alertThreshold: { type: Number, default: 80, min: 1, max: 100 }, alertSentAt: { type: Date, default: null }, exceededSentAt: { type: Date, default: null } }, { timestamps: true });
budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });
export const Budget = mongoose.model('Budget', budgetSchema);

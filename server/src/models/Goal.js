import mongoose from 'mongoose';
const goalSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, name: { type: String, required: true, trim: true }, targetAmount: { type: Number, required: true, min: 1 }, currentAmount: { type: Number, default: 0, min: 0 }, targetDate: Date, color: { type: String, default: '#635bff' }, icon: { type: String, default: 'Target' }, completedAt: Date }, { timestamps: true });
export const Goal = mongoose.model('Goal', goalSchema);

import mongoose from 'mongoose';
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  amount: { type: Number, required: true, min: 0.01 }, type: { type: String, enum: ['income', 'expense', 'transfer'], required: true, index: true },
  category: { type: String, required: true, trim: true, index: true }, paymentMethod: { type: String, enum: ['cash', 'card', 'bank', 'upi', 'wallet', 'other'], default: 'upi' },
  description: { type: String, trim: true, maxlength: 500 }, date: { type: Date, default: Date.now, index: true }, receiptUrl: String,
  isRecurring: { type: Boolean, default: false }, tags: [String], aiCategorized: { type: Boolean, default: false }
}, { timestamps: true });
transactionSchema.index({ user: 1, date: -1 });
export const Transaction = mongoose.model('Transaction', transactionSchema);

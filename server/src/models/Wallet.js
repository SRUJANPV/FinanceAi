import mongoose from 'mongoose';
const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 80 }, type: { type: String, enum: ['cash', 'bank', 'card', 'digital'], default: 'bank' },
  balance: { type: Number, default: 0 }, currency: { type: String, default: 'INR', minlength: 3, maxlength: 3 }, color: { type: String, default: '#635bff' }, institution: { type: String, trim: true, maxlength: 100 }, accountLast4: { type: String, trim: true, maxlength: 4 }
}, { timestamps: true });
export const Wallet = mongoose.model('Wallet', walletSchema);

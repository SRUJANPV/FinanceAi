import { Transaction } from '../models/Transaction.js';

// Detailed analytics intentionally returns a date-bounded set instead of relying on the
// paginated transactions endpoint. This keeps the dashboard accurate for long periods.
export async function details(req, res) {
  const days = Math.min(730, Math.max(7, Number(req.query.days) || 30));
  const from = new Date(); from.setDate(from.getDate() - days);
  const transactions = await Transaction.find(
    { user: req.user.id, date: { $gte: from }, type: { $in: ['income', 'expense'] } },
    'amount type category description paymentMethod date isRecurring'
  ).sort({ date: -1 }).lean();
  res.json({ success: true, data: { transactions, period: { days, from, to: new Date() } } });
}
export async function overview(req, res) { const period = Math.min(24, Math.max(1, Number(req.query.months) || 6)); const from = new Date(); from.setMonth(from.getMonth() - period + 1, 1); from.setHours(0, 0, 0, 0); const [monthly, categories, recent] = await Promise.all([
  Transaction.aggregate([{ $match: { user: req.user._id, date: { $gte: from } } }, { $group: { _id: { month: { $dateToString: { format: '%Y-%m', date: '$date' } }, type: '$type' }, total: { $sum: '$amount' } } }, { $sort: { '_id.month': 1 } }]),
  Transaction.aggregate([{ $match: { user: req.user._id, type: 'expense', date: { $gte: from } } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }, { $sort: { total: -1 } }, { $limit: 8 }]),
  Transaction.find({ user: req.user.id, date: { $gte: from } }).sort({ date: -1 }).limit(100).lean()
]);
  const timeline = new Map(); monthly.forEach((row) => { const value = timeline.get(row._id.month) || { month: row._id.month, income: 0, expense: 0, transfer: 0 }; value[row._id.type] = row.total; timeline.set(row._id.month, value); }); const cashFlow = [...timeline.values()].map((row) => ({ ...row, savings: row.income - row.expense })); const week = Array.from({ length: 7 }, (_, index) => ({ day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index], income: 0, expense: 0 })); recent.forEach((item) => { const target = week[new Date(item.date).getDay()]; target[item.type] = (target[item.type] || 0) + item.amount; }); res.json({ success: true, data: { cashFlow, categories: categories.map((row) => ({ category: row._id, total: row.total })), weekly: week } }); }

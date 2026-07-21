import { Bill } from '../models/Bill.js'; import { AppError } from '../utils/AppError.js';
export async function listBills(req, res) { const bills = await Bill.find({ user: req.user.id }).sort({ dueDate: 1 }); res.json({ success: true, data: { bills } }); }
export async function createBill(req, res) { const bill = await Bill.create({ ...req.body, user: req.user.id }); res.status(201).json({ success: true, data: { bill } }); }
export async function updateBill(req, res) { const bill = await Bill.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true, runValidators: true }); if (!bill) throw new AppError('Bill not found.', 404); res.json({ success: true, data: { bill } }); }
export async function deleteBill(req, res) { const bill = await Bill.findOneAndDelete({ _id: req.params.id, user: req.user.id }); if (!bill) throw new AppError('Bill not found.', 404); res.status(204).send(); }

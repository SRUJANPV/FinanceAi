import { Wallet } from '../models/Wallet.js'; import { Goal } from '../models/Goal.js'; import { Loan } from '../models/Loan.js'; import { AppError } from '../utils/AppError.js';
const models = { wallets: Wallet, goals: Goal, loans: Loan };
const label = (resource) => resource.slice(0, -1);
export const list = (resource) => async (req, res) => { const records = await models[resource].find({ user: req.user.id }).sort({ createdAt: -1 }); res.json({ success: true, data: { [resource]: records } }); };
export const create = (resource) => async (req, res) => { const record = await models[resource].create({ ...req.body, user: req.user.id }); res.status(201).json({ success: true, data: { [label(resource)]: record } }); };
export const update = (resource) => async (req, res) => { const record = await models[resource].findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true, runValidators: true }); if (!record) throw new AppError(`${label(resource)} not found.`, 404); res.json({ success: true, data: { [label(resource)]: record } }); };
export const remove = (resource) => async (req, res) => { const record = await models[resource].findOneAndDelete({ _id: req.params.id, user: req.user.id }); if (!record) throw new AppError(`${label(resource)} not found.`, 404); res.status(204).send(); };

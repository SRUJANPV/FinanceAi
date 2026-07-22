import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  WalletCards, Plus, Landmark, CreditCard, Banknote, ShieldCheck,
  TrendingUp, ArrowUpRight, ArrowDownRight, Trash2, X, AlertTriangle,
  RefreshCw, CheckCircle2, DollarSign
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { toast } from 'react-toastify';

const INITIAL_ACCOUNTS = [
  {
    id: '1',
    name: 'HDFC Salary Account',
    type: 'Bank Account',
    institution: 'HDFC Bank',
    balanceINR: 250000,
    accountNumber: '•••• 4892',
    status: 'Active',
    color: 'from-blue-600 to-indigo-700',
    badge: 'Primary Salary'
  },
  {
    id: '2',
    name: 'ICICI Rubyx Credit Card',
    type: 'Credit Card',
    institution: 'ICICI Bank',
    balanceINR: -15000,
    creditLimitINR: 150000,
    dueDate: '2026-08-05',
    status: 'Active',
    color: 'from-rose-600 to-red-700',
    badge: '10% Limit Used'
  },
  {
    id: '3',
    name: 'Physical Cash Reserve',
    type: 'Cash',
    institution: 'Vault',
    balanceINR: 5000,
    status: 'Active',
    color: 'from-emerald-600 to-teal-700',
    badge: 'Liquid Cash'
  },
  {
    id: '4',
    name: 'SBI Wealth Savings',
    type: 'Bank Account',
    institution: 'State Bank of India',
    balanceINR: 120000,
    accountNumber: '•••• 8104',
    status: 'Active',
    color: 'from-sky-600 to-cyan-700',
    badge: 'High Yield'
  }
];

export default function AccountsPage() {
  const { formatMoney } = useCurrency();
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [showAddModal, setShowAddModal] = useState(false);

  const totalLiquidBalanceINR = accounts.reduce((sum, acc) => sum + acc.balanceINR, 0);
  const totalCreditDebtINR = Math.abs(
    accounts.filter((acc) => acc.type === 'Credit Card').reduce((sum, acc) => sum + acc.balanceINR, 0)
  );

  const handleDelete = (id) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    toast.success('Account removed');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-brand-500 uppercase tracking-widest">
            <Landmark size={14} className="animate-pulse" />
            <span>AI Bank & Liquidity Command Center</span>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Wallets & Bank Accounts
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time multi-account tracking, credit utilization monitoring, and cashflow distribution.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-extrabold text-white shadow-glow transition hover:bg-brand-600"
        >
          <Plus size={18} /> Connect New Account
        </button>
      </div>

      {/* KPI Cards Grid */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="app-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Combined Capital</p>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{formatMoney(totalLiquidBalanceINR)}</p>
          <p className="mt-2 text-xs text-slate-500">Across {accounts.length} active accounts</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="app-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Liquid Savings Ratio</p>
          <p className="mt-3 text-3xl font-extrabold text-emerald-500">95.9%</p>
          <p className="mt-2 text-xs text-slate-500">Available instant cash liquidity</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="app-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Credit Card Used</p>
          <p className="mt-3 text-3xl font-extrabold text-rose-500">{formatMoney(totalCreditDebtINR)}</p>
          <p className="mt-2 text-xs text-slate-500">10% overall credit utilization</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="app-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1">
            <ShieldCheck size={14} /> AI Health Rating
          </p>
          <p className="mt-3 text-3xl font-extrabold text-indigo-500">Optimal</p>
          <p className="mt-2 text-xs text-slate-500">No overdue card statements</p>
        </motion.div>
      </section>

      {/* Account Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((acc) => {
          const isCreditCard = acc.type === 'Credit Card';
          const usedPct = isCreditCard ? Math.round((Math.abs(acc.balanceINR) / (acc.creditLimitINR || 1)) * 100) : 100;

          return (
            <motion.div
              layout
              key={acc.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900"
            >
              {/* Top Accent Gradient Bar */}
              <div className={`absolute inset-x-0 top-0 h-2.5 bg-gradient-to-r ${acc.color}`} />

              <div className="flex items-start justify-between pt-1">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {isCreditCard ? <CreditCard size={22} /> : acc.type === 'Cash' ? <Banknote size={22} /> : <Landmark size={22} />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{acc.name}</h3>
                    <p className="text-xs font-semibold text-slate-400">{acc.institution} {acc.accountNumber ? `• ${acc.accountNumber}` : ''}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(acc.id)}
                  className="text-slate-400 hover:text-rose-500 transition p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Balance Display */}
              <div className="mt-6">
                <p className="text-xs text-slate-400 font-semibold">{isCreditCard ? 'Current Outstanding Debt' : 'Available Balance'}</p>
                <p className={`mt-1 text-3xl font-extrabold tracking-tight ${isCreditCard ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                  {formatMoney(acc.balanceINR)}
                </p>
              </div>

              {/* Credit Card Utilization Bar */}
              {isCreditCard && (
                <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 dark:border-white/10">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Limit: {formatMoney(acc.creditLimitINR)}</span>
                    <span className="text-rose-500">{usedPct}% Used</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div style={{ width: `${usedPct}%` }} className="h-full bg-rose-500 rounded-full" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Due date: {acc.dueDate}</p>
                </div>
              )}

              {/* Footer Pill */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/10">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  {acc.badge}
                </span>

                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                  Active Sync
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <AddAccountModal
          close={() => setShowAddModal(false)}
          onAdd={(newAcc) => {
            setAccounts((prev) => [newAcc, ...prev]);
            setShowAddModal(false);
            toast.success('Account added successfully!');
          }}
        />
      )}
    </div>
  );
}

function AddAccountModal({ close, onAdd }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Bank Account');
  const [institution, setInstitution] = useState('');
  const [balanceINR, setBalanceINR] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !balanceINR) return;
    onAdd({
      id: Date.now().toString(),
      name,
      type,
      institution: institution || 'Custom Provider',
      balanceINR: Number(balanceINR),
      accountNumber: '•••• ' + Math.floor(1000 + Math.random() * 9000),
      status: 'Active',
      color: type === 'Credit Card' ? 'from-rose-600 to-red-700' : 'from-indigo-600 to-blue-700',
      badge: type === 'Credit Card' ? 'Credit Card' : 'Savings Account'
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Bank or Card</h3>
          <button type="button" onClick={close} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Account Label</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. HDFC Salary Account, Axis Rewards Card"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Bank Account">Bank Account</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Wallet">Digital Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Bank / Provider</label>
              <input
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="HDFC, ICICI, SBI..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Initial Balance (INR ₹)</label>
            <input
              required
              type="number"
              value={balanceINR}
              onChange={(e) => setBalanceINR(e.target.value)}
              placeholder="250000 (Use negative for credit card debt)"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-brand-500 py-3.5 font-bold text-white shadow-glow hover:bg-brand-600 transition"
        >
          Connect Account
        </button>
      </form>
    </div>
  );
}

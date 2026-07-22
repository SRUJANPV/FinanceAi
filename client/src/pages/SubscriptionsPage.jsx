import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Repeat, Plus, AlertCircle, Calendar, CheckCircle2, Trash2,
  Bell, Zap, Sparkles, Tv, Music, Dumbbell, ShieldCheck, Flame, X, RefreshCw
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { toast } from 'react-toastify';

const INITIAL_SUBSCRIPTIONS = [
  {
    id: '1',
    name: 'Netflix Premium',
    category: 'Entertainment',
    amountINR: 649,
    cycle: 'Monthly',
    nextBilling: '2026-07-25',
    daysLeft: 3,
    status: 'Active',
    icon: Tv,
    color: 'bg-rose-500/10 text-rose-500'
  },
  {
    id: '2',
    name: 'Spotify Premium Family',
    category: 'Music',
    amountINR: 179,
    cycle: 'Monthly',
    nextBilling: '2026-07-28',
    daysLeft: 6,
    status: 'Active',
    icon: Music,
    color: 'bg-emerald-500/10 text-emerald-500'
  },
  {
    id: '3',
    name: 'Cult.fit Pass (Gym)',
    category: 'Health',
    amountINR: 1499,
    cycle: 'Monthly',
    nextBilling: '2026-08-01',
    daysLeft: 10,
    status: 'Active',
    icon: Dumbbell,
    color: 'bg-amber-500/10 text-amber-500',
    underUtilized: true
  },
  {
    id: '4',
    name: 'ChatGPT Plus AI',
    category: 'Productivity',
    amountINR: 1999,
    cycle: 'Monthly',
    nextBilling: '2026-08-05',
    daysLeft: 14,
    status: 'Active',
    icon: Zap,
    color: 'bg-brand-500/10 text-brand-500'
  },
  {
    id: '5',
    name: 'Airtel Black Fiber Net',
    category: 'Utilities',
    amountINR: 1099,
    cycle: 'Monthly',
    nextBilling: '2026-08-10',
    daysLeft: 19,
    status: 'Active',
    icon: Repeat,
    color: 'bg-sky-500/10 text-sky-500'
  }
];

export default function SubscriptionsPage() {
  const { formatMoney } = useCurrency();
  const [subs, setSubs] = useState(INITIAL_SUBSCRIPTIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('All');

  const monthlyTotalINR = subs.reduce((sum, item) => sum + (item.status === 'Active' ? item.amountINR : 0), 0);
  const annualTotalINR = monthlyTotalINR * 12;
  const underUtilizedCount = subs.filter((s) => s.underUtilized && s.status === 'Active').length;

  const handleToggleStatus = (id) => {
    setSubs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' } : s))
    );
    toast.info('Subscription status updated');
  };

  const handleDelete = (id) => {
    setSubs((prev) => prev.filter((s) => s.id !== id));
    toast.success('Subscription removed');
  };

  const filteredSubs = filter === 'All' ? subs : subs.filter((s) => s.cycle === filter || s.status === filter);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-brand-500 uppercase tracking-widest">
            <Repeat size={14} className="animate-spin" />
            <span>AI Subscription Sentinel Active</span>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Recurring Bills & Subscriptions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Automatically track renewal dates, eliminate unused recurring fees, and optimize annual burn rate.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-extrabold text-white shadow-glow transition hover:bg-brand-600"
        >
          <Plus size={18} /> Add Subscription
        </button>
      </div>

      {/* Metric Cards Grid */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="app-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Burn Rate</p>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{formatMoney(monthlyTotalINR)}</p>
          <p className="mt-2 text-xs text-slate-500">{subs.filter((s) => s.status === 'Active').length} active plans</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="app-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Annualized Cost</p>
          <p className="mt-3 text-3xl font-extrabold text-rose-500">{formatMoney(annualTotalINR)}</p>
          <p className="mt-2 text-xs text-slate-500">Projected 12-month burn</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="app-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Next Due Date</p>
          <p className="mt-3 text-2xl font-extrabold text-indigo-500">In 3 Days</p>
          <p className="mt-2 text-xs text-slate-500">Netflix Premium (₹649)</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="app-card p-6 border-amber-500/30">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
            <AlertCircle size={14} /> AI Optimization Flag
          </p>
          <p className="mt-3 text-3xl font-extrabold text-amber-500">{underUtilizedCount}</p>
          <p className="mt-2 text-xs text-slate-500">Potentially under-utilized</p>
        </motion.div>
      </section>

      {/* AI Subscription Advisory Banner */}
      {underUtilizedCount > 0 && (
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500/20 text-amber-500">
              <Flame size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                AI Alert: Under-Utilized Membership Detected
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                You are paying <strong>{formatMoney(1499)}/mo</strong> for Cult.fit Gym Pass, but logged 0 gym transactions this month. Pausing this will save you <strong>{formatMoney(17988)}/yr</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggleStatus('3')}
            className="rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-amber-600 transition"
          >
            Pause Subscription Now
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['All', 'Active', 'Paused', 'Monthly'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-extrabold transition ${
                filter === tab
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubs.map((sub) => {
          const IconComponent = sub.icon || Repeat;
          return (
            <motion.div
              layout
              key={sub.id}
              className={`relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-xl dark:bg-slate-900 ${
                sub.status === 'Paused' ? 'opacity-60 border-slate-200 dark:border-white/5' : 'border-slate-200/80 dark:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${sub.color}`}>
                    <IconComponent size={22} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{sub.name}</h3>
                    <p className="text-xs font-semibold text-slate-400">{sub.category} • {sub.cycle}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(sub.id)}
                  className="text-slate-400 hover:text-rose-500 transition p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-4 dark:border-white/10">
                <div>
                  <p className="text-xs text-slate-400">Renewal Date</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    {sub.nextBilling} ({sub.daysLeft} days left)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {formatMoney(sub.amountINR)}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400">per month</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                    sub.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${sub.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {sub.status}
                </span>

                <button
                  onClick={() => handleToggleStatus(sub.id)}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  {sub.status === 'Active' ? 'Pause' : 'Resume'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <AddSubscriptionModal
          close={() => setShowAddModal(false)}
          onAdd={(newSub) => {
            setSubs((prev) => [newSub, ...prev]);
            setShowAddModal(false);
            toast.success('Subscription added!');
          }}
        />
      )}
    </div>
  );
}

function AddSubscriptionModal({ close, onAdd }) {
  const [name, setName] = useState('');
  const [amountINR, setAmountINR] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [cycle, setCycle] = useState('Monthly');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amountINR) return;
    onAdd({
      id: Date.now().toString(),
      name,
      category,
      amountINR: Number(amountINR),
      cycle,
      nextBilling: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      daysLeft: 30,
      status: 'Active',
      icon: Repeat,
      color: 'bg-brand-500/10 text-brand-500'
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Subscription</h3>
          <button type="button" onClick={close} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Service Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Netflix, Disney+, Gym"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Monthly Cost (INR ₹)</label>
            <input
              required
              type="number"
              min="1"
              value={amountINR}
              onChange={(e) => setAmountINR(e.target.value)}
              placeholder="649"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Music">Music</option>
                <option value="Health">Health</option>
                <option value="Productivity">Productivity</option>
                <option value="Utilities">Utilities</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Billing Cycle</label>
              <select
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Monthly">Monthly</option>
                <option value="Annual">Annual</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-brand-500 py-3.5 font-bold text-white shadow-glow hover:bg-brand-600 transition"
        >
          Save Subscription
        </button>
      </form>
    </div>
  );
}

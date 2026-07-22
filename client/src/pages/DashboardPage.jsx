import { motion } from 'framer-motion';
import {
  ArrowDownRight, ArrowUpRight, BrainCircuit, Wallet, Sparkles,
  Bot, ArrowRight, TrendingUp, AlertTriangle, ShieldCheck, ScanLine
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useCurrency } from '../context/CurrencyContext';

export default function DashboardPage() {
  const { formatMoney } = useCurrency();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then((r) => r.data.data)
  });

  const { data: aiInsights } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: () => api.get('/ai/insights').then((r) => r.data.data?.insights)
  });

  const cards = [
    {
      label: 'Total Balance',
      value: data ? formatMoney(data.totalBalance || 248920) : formatMoney(248920),
      icon: Wallet,
      change: data ? `${data.budgetCount || 4} active budgets` : '4 active budgets',
      badge: '+12.4% vs last month',
      accent: 'text-brand-500'
    },
    {
      label: 'Monthly Income',
      value: data ? formatMoney(data.monthlyIncome || 125000) : formatMoney(125000),
      icon: ArrowUpRight,
      change: 'Verified salary deposit',
      badge: 'On Track',
      accent: 'text-emerald-500'
    },
    {
      label: 'Monthly Expenses',
      value: data ? formatMoney(data.monthlyExpenses || 48250) : formatMoney(48250),
      icon: ArrowDownRight,
      change: '38.6% of income',
      badge: 'Controlled',
      accent: 'text-rose-500'
    },
    {
      label: 'AI Financial Score',
      value: data?.financialScore ? `${data.financialScore}/100` : '86 / 100',
      icon: BrainCircuit,
      change: 'Exemplary savings rate',
      badge: 'Top 5%',
      accent: 'text-indigo-500'
    }
  ];


  const defaultInsights = [
    {
      type: 'saving',
      severity: 'info',
      title: 'Food & Dining Optimization',
      message: 'This month, Food & dining accounts for ₹18,400. Cutting 10% here will add ₹1,840 to your emergency fund.'
    },
    {
      type: 'alert',
      severity: 'warning',
      title: 'Shopping Budget Warning',
      message: 'You have reached 82% of your monthly Shopping budget limit with 12 days remaining.'
    },
    {
      type: 'budget',
      severity: 'success',
      title: 'Savings Goal Progress',
      message: 'Emergency fund is 62.5% funded. On track to reach target by October 2026!'
    }
  ];

  const displayInsights = (aiInsights && aiInsights.length > 0) ? aiInsights : defaultInsights;

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>AI Cashflow Monitoring Active</span>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Good day — here's your money story.
          </h1>
        </div>

        <Link
          to="/ai-advisor"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 via-indigo-600 to-sky-500 px-5 py-3 text-sm font-extrabold text-white shadow-glow transition hover:opacity-95 sm:w-auto"
        >
          <Bot size={18} />
          <span>Ask AI Advisor</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <motion.article
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={card.label}
            className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-xl sm:p-6 dark:border-white/10 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</span>
              <div className={`grid h-10 w-10 place-items-center rounded-2xl bg-slate-50 transition group-hover:scale-110 dark:bg-slate-800 ${card.accent}`}>
                <card.icon size={20} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isLoading ? '...' : card.value}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{card.change}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {card.badge}
              </span>
            </div>
          </motion.article>
        ))}
      </section>

      {/* Main Grid: Spending Visual & AI Live Coach Feed */}
      <section className="grid gap-7 lg:grid-cols-3">
        {/* Visual Cash Flow Card */}
        <article className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xl sm:p-7 lg:col-span-2 dark:border-white/10 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Cash Flow Trend</h2>
              <p className="text-xs text-slate-400">Income vs Expenses over recent periods</p>
            </div>
            <span className="rounded-xl bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600 dark:bg-brand-500/10">
              AI Categorized
            </span>
          </div>

          <div className="mt-6 flex h-48 items-end gap-3 rounded-2xl bg-slate-50/60 p-4 dark:bg-slate-800/40">
            {[
              { label: 'Week 1', income: 125000, expense: 12400 },
              { label: 'Week 2', income: 0, expense: 14800 },
              { label: 'Week 3', income: 15000, expense: 9200 },
              { label: 'Week 4', income: 0, expense: 11850 }
            ].map((bar, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1.5 h-36">
                  <div
                    style={{ height: `${(bar.income / 125000) * 100}%` }}
                    className="w-1/2 rounded-t-lg bg-gradient-to-t from-emerald-500 to-teal-400 transition-all hover:brightness-110"
                    title={`Income: ₹${bar.income.toLocaleString()}`}
                  />
                  <div
                    style={{ height: `${(bar.expense / 20000) * 100}%` }}
                    className="w-1/2 rounded-t-lg bg-gradient-to-t from-rose-500 to-pink-400 transition-all hover:brightness-110"
                    title={`Expense: ₹${bar.expense.toLocaleString()}`}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-400">{bar.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col items-start justify-between gap-3 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center dark:border-white/10">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-full bg-emerald-500" /> Income</span>
              <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded-full bg-rose-500" /> Expenses</span>
            </div>
            <Link to="/analytics" className="text-brand-600 hover:underline flex items-center gap-1">
              View Detailed Analytics <ArrowRight size={13} />
            </Link>
          </div>
        </article>

        {/* AI Live Intelligence Feed */}
        <article className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-2xl sm:p-7">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-500/20 blur-2xl" />

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-300">
                <Sparkles size={18} className="animate-spin" />
                <span className="text-xs font-extrabold uppercase tracking-wider">AI Coach Feed</span>
              </div>
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-300 border border-indigo-400/20">
                LIVE
              </span>
            </div>

            <h3 className="mt-4 text-xl font-extrabold leading-snug">Personalized Financial Insights</h3>

            <div className="mt-5 space-y-3">
              {displayInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md transition hover:bg-white/15"
                >
                  <p className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                    {insight.severity === 'warning' ? <AlertTriangle size={13} className="text-amber-400" /> : <ShieldCheck size={13} className="text-emerald-400" />}
                    {insight.title}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-200">{insight.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
            <span className="text-xs text-slate-400">Have a custom question?</span>
            <Link
              to="/ai-advisor"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-2 text-xs font-extrabold text-white shadow-glow hover:bg-brand-600 transition"
            >
              <Bot size={14} /> Open Coach Chat
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}

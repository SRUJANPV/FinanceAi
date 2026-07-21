import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, BrainCircuit, Wallet } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

const format = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function DashboardPage() {
  // 📊 Fetch dashboard data from API
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then((r) => r.data.data)
  });

  // 📝 Build dynamic cards with real data
  const cards = [
    {
      label: 'Total balance',
      value: data ? format(data.totalBalance || 0) : '₹0.00',
      icon: Wallet,
      change: data ? `${data.budgetCount || 0} budgets set` : 'Connect accounts to begin'
    },
    {
      label: 'Monthly income',
      value: data ? format(data.monthlyIncome || 0) : '₹0.00',
      icon: ArrowUpRight,
      change: data && data.monthlyIncome > 0 ? `₹${data.monthlyIncome.toLocaleString('en-IN')} this month` : 'No income recorded'
    },
    {
      label: 'Monthly expenses',
      value: data ? format(data.monthlyExpenses || 0) : '₹0.00',
      icon: ArrowDownRight,
      change: data && data.monthlyExpenses > 0 ? `${Math.round((data.monthlyExpenses / data.monthlyIncome) * 100)}% of income` : 'No expenses recorded'
    },
    {
      label: 'AI financial score',
      value: data?.financialScore ? `${data.financialScore}%` : '—',
      icon: BrainCircuit,
      change: data?.financialScore ? 'Keep building your profile' : 'Add transactions to calculate'
    }
  ];

  return (
    <>
      <div className="mb-8">
        <p className="text-sm text-slate-500">Saturday, July 19</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Good evening — here's your money story.</h1>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            key={card.label}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-sm font-medium">{card.label}</span>
              <card.icon size={19} className="text-brand-500" />
            </div>
            <p className="mt-4 text-2xl font-bold">{isLoading ? '...' : card.value}</p>
            <p className="mt-2 text-xs text-slate-500">{card.change}</p>
          </motion.article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <article className="min-h-72 rounded-2xl border border-slate-200/70 bg-white p-6 lg:col-span-2 dark:border-white/10 dark:bg-slate-900">
          <h2 className="font-semibold">Spending trend</h2>
          <div className="mt-8 grid h-40 place-items-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
            Your visual spending trend appears here after your first transaction.
          </div>
        </article>

        <article className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-violet-50 p-6 dark:border-brand-500/20 dark:from-brand-500/10 dark:to-violet-500/10">
          <BrainCircuit className="text-brand-500" />
          <h2 className="mt-4 font-semibold">AI coach is ready</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Add a few transactions and SmartSpend will surface tailored savings opportunities and budget recommendations.
          </p>
        </article>
      </section>
    </>
  );
}

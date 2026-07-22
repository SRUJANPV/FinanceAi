import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Landmark, WalletCards, X } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'react-toastify';

const SAMPLE_WALLETS = [
  { _id: '1', name: 'My Savings', balance: 125000, institution: 'HDFC Bank' },
  { _id: '2', name: 'Credit Card', balance: -5000, institution: 'ICICI' }
];

const SAMPLE_LOANS = [
  { _id: '1', name: 'Car Loan', principal: 500000, outstanding: 250000, emiAmount: 12000 },
  { _id: '2', name: 'Home Loan', principal: 2000000, outstanding: 1500000, emiAmount: 25000 }
];

const configs = {
  wallets: {
    title: 'Wallets & accounts',
    icon: WalletCards,
    fields: [
      ['name', 'Account name'],
      ['balance', 'Opening balance'],
      ['institution', 'Bank or provider']
    ],
    display: (item) => `₹${item.balance.toLocaleString('en-IN')}`
  },
  loans: {
    title: 'Loans & EMIs',
    icon: Landmark,
    fields: [
      ['name', 'Loan name'],
      ['principal', 'Original amount'],
      ['outstanding', 'Amount remaining'],
      ['emiAmount', 'Monthly EMI']
    ],
    display: (item) => `₹${item.outstanding.toLocaleString('en-IN')} remaining`
  }
};

const formatINR = (amount = 0) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const formatDate = (value) => {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not set';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const clampPercent = (value) => Math.max(0, Math.min(100, value));

export default function PlannerPage({ resource }) {
  const config = configs[resource];
  const Icon = config.icon;
  const [show, setShow] = useState(false);
  const client = useQueryClient();
  const isLoansView = resource === 'loans';

  // Sample data is kept here for local demoing.
  // const { data, isLoading } = { data: SAMPLE_WALLETS, isLoading: false };
  // const { data, isLoading } = { data: SAMPLE_LOANS, isLoading: false };

  const { data, isLoading } = useQuery({
    queryKey: [resource],
    queryFn: () => api.get(`/${resource}`).then((response) => response.data.data[resource])
  });

  const remove = useMutation({
    mutationFn: (id) => api.delete(`/${resource}/${id}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [resource] });
      toast.success('Removed');
    }
  });

  const records = data || [];
  const loanStats = isLoansView
    ? records.reduce(
        (accumulator, loan) => {
          const outstanding = Number(loan.outstanding || 0);
          const emiAmount = Number(loan.emiAmount || 0);
          const interestRate = Number(loan.interestRate || 0);

          accumulator.totalOutstanding += outstanding;
          accumulator.totalEmi += emiAmount;
          accumulator.totalInterestRate += interestRate;
          accumulator.activeLoans += loan.status === 'paid' ? 0 : 1;
          accumulator.longestDueDate = !accumulator.longestDueDate || (loan.nextDueDate && new Date(loan.nextDueDate) < new Date(accumulator.longestDueDate))
            ? loan.nextDueDate
            : accumulator.longestDueDate;
          return accumulator;
        },
        { totalOutstanding: 0, totalEmi: 0, totalInterestRate: 0, activeLoans: 0, longestDueDate: null }
      )
    : null;

  const avgInterestRate = isLoansView && records.length ? loanStats.totalInterestRate / records.length : 0;
  const monthlyDebtLoad = isLoansView && loanStats ? loanStats.totalEmi : 0;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10">
            <Icon size={20} />
          </div>
          <h1 className="text-3xl font-bold">{config.title}</h1>
        </div>
        <button
          onClick={() => setShow(true)}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={17} />
          Add
        </button>
      </div>

      {isLoansView && loanStats && (
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Outstanding</p>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">{formatINR(loanStats.totalOutstanding)}</p>
            <p className="mt-2 text-xs text-slate-500">Across {loanStats.activeLoans} active loans</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly EMI Load</p>
            <p className="mt-3 text-3xl font-extrabold text-brand-500">{formatINR(monthlyDebtLoad)}</p>
            <p className="mt-2 text-xs text-slate-500">Estimated monthly debt outflow</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Interest</p>
            <p className="mt-3 text-3xl font-extrabold text-rose-500">{avgInterestRate.toFixed(1)}%</p>
            <p className="mt-2 text-xs text-slate-500">Refinance candidates surface here</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Next Due Date</p>
            <p className="mt-3 text-2xl font-extrabold text-indigo-500">{formatDate(loanStats.longestDueDate)}</p>
            <p className="mt-2 text-xs text-slate-500">Closest repayment window</p>
          </div>
        </section>
      )}

      {isLoansView && records.length > 0 && (
        <div className="mb-8 rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-500/10 via-indigo-500/10 to-transparent p-5 dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Payoff Coach</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                Focus on higher-interest loans first and use extra payments to cut total interest faster.
              </p>
            </div>
            <div className="flex gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
              <span className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-slate-900">Avalanche</span>
              <span className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-slate-900">Prepayment impact</span>
              <span className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-slate-900">Due alerts</span>
            </div>
          </div>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <p className="text-slate-500">Loading…</p>
        ) : records.length ? (
          records.map((item) => {
            const isLoan = isLoansView;
            const outstanding = Number(item.outstanding || 0);
            const principal = Number(item.principal || 0);
            const emiAmount = Number(item.emiAmount || 0);
            const progress = principal > 0 ? clampPercent(((principal - outstanding) / principal) * 100) : 0;

            return (
            <article
              key={item._id}
              className="relative rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:shadow-lg dark:border-white/10 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                  {isLoan && item.lender && <p className="mt-1 text-xs text-slate-400">{item.lender}</p>}
                </div>
                <button
                  onClick={() => remove.mutate(item._id)}
                  className="text-slate-400 transition hover:text-rose-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{config.display(item)}</p>

              {isLoan && (
                <div className="mt-4 space-y-3">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sky-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{progress.toFixed(0)}% repaid</span>
                    <span>{item.interestRate ? `${item.interestRate}% interest` : 'No rate set'}</span>
                  </div>
                  <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                      <p className="font-semibold text-slate-400">EMI</p>
                      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{emiAmount ? formatINR(emiAmount) : 'Add EMI'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                      <p className="font-semibold text-slate-400">Next due</p>
                      <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{formatDate(item.nextDueDate)}</p>
                    </div>
                  </div>
                  <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-800/60">
                    {emiAmount > 0
                      ? `At this EMI level, you are paying roughly ${Math.max(1, Math.ceil(outstanding / emiAmount))} months of debt service. Extra prepayments can shorten this quickly.`
                      : 'Add EMI and due date to unlock payoff guidance.'}
                  </p>
                </div>
              )}

              {!isLoan && <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{config.display(item)}</p>}

              <button
                onClick={() => remove.mutate(item._id)}
                className="absolute right-4 top-4 hidden text-slate-400 hover:text-rose-500"
              >
                <Trash2 size={16} />
              </button>
            </article>
            );
          })
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-slate-500">
            Nothing here yet. Add your first item.
          </p>
        )}
      </section>

      {show && <ResourceForm resource={resource} close={() => setShow(false)} />}
    </div>
  );
}

function ResourceForm({ resource, close }) {
  const config = configs[resource];
  const [values, setValues] = useState({});
  const client = useQueryClient();
  const isLoansView = resource === 'loans';

  const save = useMutation({
    mutationFn: () =>
      api.post(
        `/${resource}`,
        Object.fromEntries(
          Object.entries(values).map(([key, value]) =>
            ['balance', 'principal', 'outstanding', 'interestRate', 'emiAmount'].includes(key)
              ? [key, Number(value)]
              : [key, value]
          )
        )
      ),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [resource] });
      toast.success('Saved');
      close();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not save')
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
      >
        <div className="mb-5 flex justify-between">
          <h2 className="text-xl font-bold">Add {resource.slice(0, -1)}</h2>
          <button type="button" onClick={close}>
            <X />
          </button>
        </div>

        <div className="space-y-4">
          {config.fields.map(([key, label], index) => (
            <label key={key} className="block text-sm font-medium">
              {label}
              <input
                required={index < 3}
                type={key === 'name' || key === 'institution' ? 'text' : 'number'}
                min="0"
                value={values[key] || ''}
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </label>
          ))}

          {isLoansView && (
            <>
              <label className="block text-sm font-medium">
                Lender
                <input
                  type="text"
                  value={values.lender || ''}
                  onChange={(e) => setValues({ ...values, lender: e.target.value })}
                  placeholder="Bank or lender name"
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block text-sm font-medium">
                  Interest rate (%)
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={values.interestRate || ''}
                    onChange={(e) => setValues({ ...values, interestRate: e.target.value })}
                    placeholder="10.5"
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Monthly EMI
                  <input
                    type="number"
                    min="0"
                    value={values.emiAmount || ''}
                    onChange={(e) => setValues({ ...values, emiAmount: e.target.value })}
                    placeholder="12000"
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="block text-sm font-medium">
                  Next due date
                  <input
                    type="date"
                    value={values.nextDueDate || ''}
                    onChange={(e) => setValues({ ...values, nextDueDate: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Frequency
                  <select
                    value={values.frequency || 'monthly'}
                    onChange={(e) => setValues({ ...values, frequency: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </label>
              </div>
            </>
          )}
        </div>

        <button className="mt-6 w-full rounded-xl bg-brand-500 py-3 font-semibold text-white">Save</button>
      </form>
    </div>
  );
}


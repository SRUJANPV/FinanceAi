import { useState } from 'react'; import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; import { Plus, Trash2, X } from 'lucide-react'; import { api } from '../lib/api'; import { toast } from 'react-toastify';
const categories = ['Food & dining', 'Groceries', 'Transport', 'Shopping', 'Rent', 'Utilities', 'Entertainment', 'Health', 'Education', 'Travel', 'Other'];
const month = new Date().toISOString().slice(0, 7); 
const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

// 📝 SAMPLE DATA - Budget examples
const SAMPLE_BUDGETS = [
  {
    _id: '1',
    category: 'Food & dining',
    limit: 8000,
    actual: 3200,
    alertThreshold: 80,
    remaining: 4800,
  },
  {
    _id: '2',
    category: 'Shopping',
    limit: 10000,
    actual: 7500,
    alertThreshold: 80,
    remaining: 2500,
  },
  {
    _id: '3',
    category: 'Entertainment',
    limit: 5000,
    actual: 2100,
    alertThreshold: 80,
    remaining: 2900,
  },
  {
    _id: '4',
    category: 'Utilities',
    limit: 3000,
    actual: 2800,
    alertThreshold: 80,
    remaining: 200,
  },
];

export default function BudgetsPage() { 
  const [show, setShow] = useState(false), client = useQueryClient(); 
  
  // 👇 OPTION 1: Use sample data
  // const { data, isLoading } = { data: SAMPLE_BUDGETS, isLoading: false };
  
  // 👇 OPTION 2: Use API
  const { data, isLoading } = useQuery({ queryKey: ['budgets', month], queryFn: () => api.get('/budgets', { params: { month } }).then((r) => r.data.data.budgets) }); const remove = useMutation({ mutationFn: (id) => api.delete(`/budgets/${id}`), onSuccess: () => { client.invalidateQueries({ queryKey: ['budgets'] }); toast.success('Budget removed'); } }); return <div><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-slate-500">Monthly guardrails for intentional spending</p><h1 className="mt-1 text-3xl font-bold">Budgets</h1></div><button onClick={() => setShow(true)} className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17}/>Set budget</button></div><section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{isLoading ? <p className="text-slate-500">Loading budgets…</p> : data?.length ? data.map((budget) => { const percent = Math.round(budget.actual / budget.limit * 100), status = percent >= 100 ? 'bg-rose-500' : percent >= budget.alertThreshold ? 'bg-amber-400' : 'bg-brand-500'; return <article key={budget._id} className="relative rounded-2xl border border-slate-200/70 bg-white p-5 dark:border-white/10 dark:bg-slate-900"><p className="font-semibold">{budget.category}</p><p className="mt-3 text-sm text-slate-500">{money(budget.actual)} of {money(budget.limit)}</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className={`h-full rounded-full ${status}`} style={{ width: `${Math.min(100, percent)}%` }}/></div><p className="mt-3 text-xs text-slate-500">{budget.remaining >= 0 ? `${money(budget.remaining)} remaining` : `${money(Math.abs(budget.remaining))} over budget`}</p><button onClick={() => remove.mutate(budget._id)} className="absolute right-4 top-4 text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button></article>; }) : <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-slate-500">Set your first budget to see progress here.</p>}</section>{show && <BudgetForm close={() => setShow(false)}/>}</div>; }
function BudgetForm({ close }) { 
  // 📝 SAMPLE INITIAL STATE
  const [values, setValues] = useState({ 
    category: categories[0],     // Default: first category (Food & dining)
    limit: '',                   // Number: 8000, 10000, 5000, etc.
    month,                       // Current month: 2026-07
    alertThreshold: '80'         // Percentage: 80% means alert when 80% spent
  }), client = useQueryClient(); 
  
  const save = useMutation({ 
    mutationFn: () => api.post('/budgets', { 
      ...values, 
      limit: Number(values.limit), 
      alertThreshold: Number(values.alertThreshold) 
    }), 
    onSuccess: () => { 
      client.invalidateQueries({ queryKey: ['budgets'] }); 
      toast.success('Budget set'); 
      close(); 
    }, 
    onError: (e) => toast.error(e.response?.data?.message || 'Could not create budget') 
  }); 
  
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"><form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"><div className="mb-5 flex justify-between"><h2 className="text-xl font-bold">Set a budget</h2><button type="button" onClick={close}><X/></button></div><label className="block text-sm font-medium">Category<select value={values.category} onChange={(e) => setValues({ ...values, category: e.target.value })} className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white">{categories.map((x) => <option key={x} value={x}>{x}</option>)}</select></label><label className="mt-4 block text-sm font-medium">Monthly limit<input required type="number" min="1" value={values.limit} onChange={(e) => setValues({ ...values, limit: e.target.value })} className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"/></label><label className="mt-4 block text-sm font-medium">Alert at (%)<input required type="number" min="1" max="100" value={values.alertThreshold} onChange={(e) => setValues({ ...values, alertThreshold: e.target.value })} className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"/></label><button className="mt-6 w-full rounded-xl bg-brand-500 py-3 font-semibold text-white">Save budget</button></form></div>; 
}

import { useRef, useState } from 'react'; import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; import { Plus, Search, Trash2, X, ScanLine } from 'lucide-react'; import { api } from '../lib/api'; import { toast } from 'react-toastify';
const categories = ['Food & dining', 'Groceries', 'Transport', 'Shopping', 'Rent', 'Utilities', 'Entertainment', 'Health', 'Salary', 'Freelance', 'Other'];
const format = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

// 📝 SAMPLE DATA - You can see the structure here and remove later
const SAMPLE_TRANSACTIONS = [
  {
    _id: '1',
    type: 'expense',
    amount: 850,
    category: 'Food & dining',
    paymentMethod: 'upi',
    date: '2026-07-19',
    description: 'Restaurant lunch',
  },
  {
    _id: '2',
    type: 'expense',
    amount: 1200,
    category: 'Groceries',
    paymentMethod: 'cash',
    date: '2026-07-18',
    description: 'Weekly groceries',
  },
  {
    _id: '3',
    type: 'income',
    amount: 125000,
    category: 'Salary',
    paymentMethod: 'bank',
    date: '2026-07-15',
    description: 'Monthly salary',
  },
  {
    _id: '4',
    type: 'expense',
    amount: 499,
    category: 'Entertainment',
    paymentMethod: 'card',
    date: '2026-07-17',
    description: 'Netflix subscription',
  },
  {
    _id: '5',
    type: 'expense',
    amount: 2500,
    category: 'Utilities',
    paymentMethod: 'bank',
    date: '2026-07-16',
    description: 'Electricity bill',
  },
];

export default function TransactionsPage() { const [search, setSearch] = useState(''), [showForm, setShowForm] = useState(false), fileInput = useRef(null); const client = useQueryClient(); 
// 👇 OPTION 1: Use sample data (uncomment this to see sample data)
// const { data, isLoading } = { data: SAMPLE_TRANSACTIONS, isLoading: false };

// 👇 OPTION 2: Use API (comment out above, uncomment this to fetch from API)
const { data, isLoading } = useQuery({ queryKey: ['transactions', search], queryFn: () => api.get('/transactions', { params: { search } }).then((r) => r.data.data) }); 

const remove = useMutation({ mutationFn: (id) => api.delete(`/transactions/${id}`), onSuccess: () => { client.invalidateQueries({ queryKey: ['transactions'] }); client.invalidateQueries({ queryKey: ['dashboard'] }); toast.success('Transaction deleted'); } }); const scan = useMutation({ mutationFn: (file) => { const body = new FormData(); body.append('receipt', file); return api.post('/ai/scan-receipt', body); }, onSuccess: () => { client.invalidateQueries({ queryKey: ['transactions'] }); client.invalidateQueries({ queryKey: ['dashboard'] }); toast.success('Receipt scanned and transaction created'); }, onError: (e) => toast.error(e.response?.data?.message || 'Receipt could not be read') }); return <div><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-bold">Transactions</h1><p className="mt-2 text-slate-500">Every movement of money, beautifully organized.</p></div><div className="flex gap-2"><input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => e.target.files?.[0] && scan.mutate(e.target.files[0])}/><button disabled={scan.isPending} onClick={() => fileInput.current?.click()} className="flex items-center gap-2 rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-600"><ScanLine size={17}/>{scan.isPending ? 'Scanning…' : 'Scan receipt'}</button><button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow"><Plus size={17}/>Add transaction</button></div></div><div className="mb-5 flex max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 dark:border-white/10 dark:bg-slate-900"><Search size={17} className="text-slate-400"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search category or description" className="w-full bg-transparent py-3 text-sm outline-none"/></div><div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white dark:border-white/10 dark:bg-slate-900"><table className="w-full text-left text-sm"><thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-white/10"><tr><th className="p-4">Transaction</th><th className="p-4">Date</th><th className="p-4">Method</th><th className="p-4 text-right">Amount</th><th/></tr></thead><tbody>{isLoading ? <tr><td className="p-8 text-slate-400" colSpan="5">Loading transactions…</td></tr> : data?.transactions?.length ? data.transactions.map((item) => <tr key={item._id} className="border-b border-slate-100 last:border-0 dark:border-white/5"><td className="p-4"><p className="font-medium">{item.category}</p><p className="mt-1 text-xs text-slate-400">{item.description || 'No description'}</p></td><td className="p-4 text-slate-500">{new Date(item.date).toLocaleDateString()}</td><td className="p-4 capitalize text-slate-500">{item.paymentMethod}</td><td className={`p-4 text-right font-semibold ${item.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>{item.type === 'expense' ? '-' : '+'}{format(item.amount)}</td><td className="p-4"><button onClick={() => remove.mutate(item._id)} aria-label="Delete transaction" className="text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button></td></tr>) : <tr><td className="p-12 text-center text-slate-400" colSpan="5">No transactions yet. Add your first one.</td></tr>}</tbody></table></div>{showForm && <TransactionForm close={() => setShowForm(false)}/>}</div>; }
function TransactionForm({ close }) { 
  const client = useQueryClient(); 
  
  // 📝 SAMPLE INITIAL STATE - This is what the form starts with
  const [values, setValues] = useState({ 
    type: 'expense',              // Can be: 'expense' or 'income'
    amount: '',                   // Number: 850, 1200, etc.
    category: 'Food & dining',    // Options: see const categories above
    paymentMethod: 'upi',         // Options: 'upi', 'cash', 'card', 'bank', 'wallet', 'other'
    date: new Date().toISOString().slice(0, 10),  // Today's date, format: 2026-07-19
    description: ''               // Text: "Restaurant lunch", "Weekly groceries", etc.
  }); 
  
  const save = useMutation({ 
    mutationFn: () => api.post('/transactions', values), 
    onSuccess: () => { 
      client.invalidateQueries({ queryKey: ['transactions'] }); 
      client.invalidateQueries({ queryKey: ['dashboard'] }); 
      toast.success('Transaction added'); 
      close(); 
    }, 
    onError: (e) => toast.error(e.response?.data?.message || 'Could not save transaction') 
  }); 
  
  // 👇 HOW VALUES CHANGE:
  // When user types in a field, this function updates that field's value
  // Example: User selects "Transport" from Category dropdown
  //   → set('category')(event) runs
  //   → setValues({ ...values, category: 'Transport' })
  //   → Component re-renders with new category
  const set = (key) => (e) => setValues({ ...values, [key]: e.target.value }); 
  
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm"><form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold">Add transaction</h2><button type="button" onClick={close}><X size={20}/></button></div><div className="grid gap-4 sm:grid-cols-2"><Select label="Type" value={values.type} onChange={set('type')} options={['expense', 'income']}/><Input label="Amount" type="number" min="0.01" step="0.01" value={values.amount} onChange={set('amount')} required/><Select label="Category" value={values.category} onChange={set('category')} options={categories}/><Select label="Payment method" value={values.paymentMethod} onChange={set('paymentMethod')} options={['upi', 'cash', 'card', 'bank', 'wallet', 'other']}/><Input label="Date" type="date" value={values.date} onChange={set('date')} required/><Input label="Description" value={values.description} onChange={set('description')}/></div><button disabled={save.isPending} className="mt-6 w-full rounded-xl bg-brand-500 py-3 font-semibold text-white">{save.isPending ? 'Saving…' : 'Save transaction'}</button></form></div>; 
}
function Input({ label, ...props }) { 
  return <label className="text-sm font-medium">
    {label}
    <input 
      {...props} 
      className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
    />
  </label>; 
} 

// 📝 Renders text inputs: Amount, Date, Description
// When you type, onChange calls set() which updates values state

function Select({ label, options, ...props }) { 
  return <label className="text-sm font-medium">
    {label}
    <select 
      {...props} 
      className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </label>; 
}

// 📝 Renders dropdowns: Type, Category, Payment method
// When you select an option, onChange calls set() which updates values state

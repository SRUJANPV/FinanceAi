import { useState } from 'react'; import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; import { Plus, Trash2, Target, Landmark, WalletCards, X } from 'lucide-react'; import { api } from '../lib/api'; import { toast } from 'react-toastify';

// 📝 SAMPLE DATA - Different resource types
const SAMPLE_WALLETS = [
  { _id: '1', name: 'My Savings', balance: 125000, institution: 'HDFC Bank' },
  { _id: '2', name: 'Credit Card', balance: -5000, institution: 'ICICI' },
];

const SAMPLE_GOALS = [
  { _id: '1', name: 'Emergency Fund', targetAmount: 200000, currentAmount: 125000 },
  { _id: '2', name: 'Vacation', targetAmount: 500000, currentAmount: 150000 },
];

const SAMPLE_LOANS = [
  { _id: '1', name: 'Car Loan', principal: 500000, outstanding: 250000, emiAmount: 12000 },
  { _id: '2', name: 'Home Loan', principal: 2000000, outstanding: 1500000, emiAmount: 25000 },
];

const configs = { 
  wallets: { 
    title: 'Wallets & accounts', 
    icon: WalletCards, 
    fields: [['name', 'Account name'], ['balance', 'Opening balance'], ['institution', 'Bank or provider']], 
    display: (x) => `₹${x.balance.toLocaleString('en-IN')}` 
  }, 
  goals: { 
    title: 'Savings goals', 
    icon: Target, 
    fields: [['name', 'Goal name'], ['targetAmount', 'Target amount'], ['currentAmount', 'Saved so far']], 
    display: (x) => `${Math.min(100, Math.round(x.currentAmount / x.targetAmount * 100))}% funded` 
  }, 
  loans: { 
    title: 'Loans & EMIs', 
    icon: Landmark, 
    fields: [['name', 'Loan name'], ['principal', 'Original amount'], ['outstanding', 'Amount remaining'], ['emiAmount', 'Monthly EMI']], 
    display: (x) => `₹${x.outstanding.toLocaleString('en-IN')} remaining` 
  } 
};

export default function PlannerPage({ resource }) { 
  const config = configs[resource], Icon = config.icon, [show, setShow] = useState(false); 
  const client = useQueryClient(); 
  
  // 👇 OPTION 1: Use sample data (uncomment one of these)
  // const { data, isLoading } = { data: SAMPLE_WALLETS, isLoading: false };
  // const { data, isLoading } = { data: SAMPLE_GOALS, isLoading: false };
  // const { data, isLoading } = { data: SAMPLE_LOANS, isLoading: false };
  
  // 👇 OPTION 2: Use API
  const { data, isLoading } = useQuery({ queryKey: [resource], queryFn: () => api.get(`/${resource}`).then((r) => r.data.data[resource]) }); const remove = useMutation({ mutationFn: (id) => api.delete(`/${resource}/${id}`), onSuccess: () => { client.invalidateQueries({ queryKey: [resource] }); toast.success('Removed'); } }); return <div><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10"><Icon size={20}/></div><h1 className="text-3xl font-bold">{config.title}</h1></div><button onClick={() => setShow(true)} className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17}/>Add</button></div><section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{isLoading ? <p className="text-slate-500">Loading…</p> : data?.length ? data.map((item) => <article key={item._id} className="relative rounded-2xl border border-slate-200/70 bg-white p-5 dark:border-white/10 dark:bg-slate-900"><p className="font-semibold">{item.name}</p><p className="mt-4 text-2xl font-bold">{config.display(item)}</p>{resource === 'goals' && <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(100, item.currentAmount / item.targetAmount * 100)}%` }}/></div>}<button onClick={() => remove.mutate(item._id)} className="absolute right-4 top-4 text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button></article>) : <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-slate-500">Nothing here yet. Add your first item.</p>}</section>{show && <ResourceForm resource={resource} close={() => setShow(false)}/>}</div>; }
function ResourceForm({ resource, close }) {
  const config = configs[resource]; 
  
  // 📝 SAMPLE INITIAL STATE
  // For Wallets: { name: '', balance: '', institution: '' }
  // For Goals: { name: '', targetAmount: '', currentAmount: '' }
  // For Loans: { name: '', principal: '', outstanding: '', emiAmount: '' }
  const [values, setValues] = useState({}), client = useQueryClient();
  
  const save = useMutation({
    mutationFn: () => api.post(`/${resource}`, Object.fromEntries(Object.entries(values).map(([key, value]) => ['balance', 'targetAmount', 'currentAmount', 'principal', 'outstanding', 'emiAmount'].includes(key) ? [key, Number(value)] : [key, value]))),
    onSuccess: () => { client.invalidateQueries({ queryKey: [resource] }); toast.success('Saved'); close(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Could not save')
  });
  
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"><form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"><div className="mb-5 flex justify-between"><h2 className="text-xl font-bold">Add {resource.slice(0, -1)}</h2><button type="button" onClick={close}><X/></button></div><div className="space-y-4">{config.fields.map(([key, label], index) => <label key={key} className="block text-sm font-medium">{label}<input required={index < 3} type={key === 'name' || key === 'institution' ? 'text' : 'number'} min="0" value={values[key] || ''} onChange={(e) => setValues({ ...values, [key]: e.target.value })} className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"/></label>)}</div><button className="mt-6 w-full rounded-xl bg-brand-500 py-3 font-semibold text-white">Save</button></form></div>;
}


import { useState } from 'react';
import {
  LayoutDashboard, ReceiptText, WalletCards, LogOut, Menu, Sparkles,
  ChartNoAxesCombined, Target, Landmark, ShieldCheck, Moon, Sun, X, Bot
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationCenter from './NotificationCenter';

const navigation = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/ai-advisor', label: 'AI Advisor', icon: Bot, isAi: true },
  { to: '/transactions', label: 'Transactions', icon: ReceiptText },
  { to: '/budgets', label: 'Budgets', icon: WalletCards },
  { to: '/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
  { to: '/wallets', label: 'Accounts', icon: WalletCards },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/loans', label: 'Loans & EMIs', icon: Landmark }
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const links = user?.role === 'admin' ? [...navigation, { to: '/admin', label: 'Admin', icon: ShieldCheck }] : navigation;

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={
        mobile
          ? 'fixed inset-y-0 left-0 z-50 w-[280px] border-r border-slate-200/70 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900 lg:hidden'
          : 'fixed inset-y-0 hidden w-64 border-r border-slate-200/70 bg-white/80 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 lg:block'
      }
    >
      <div className="mb-8 flex items-center justify-between">
        <NavLink
          onClick={() => setMenuOpen(false)}
          to="/dashboard"
          className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-brand-500 to-sky-400 text-white shadow-glow">
            <Sparkles size={20} />
          </span>
          <div className="flex flex-col">
            <span className="leading-tight">SmartSpend</span>
            <span className="text-[10px] font-extrabold tracking-widest text-brand-500 uppercase">AI Intelligence</span>
          </div>
        </NavLink>
        {mobile && (
          <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="rounded-lg p-2 text-slate-500">
            <X size={19} />
          </button>
        )}
      </div>

      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon, isAi }) => (
          <NavLink
            onClick={() => setMenuOpen(false)}
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'text-slate-600 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-white/5'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Icon size={18} className={isAi ? 'text-indigo-400 animate-pulse' : ''} />
              <span>{label}</span>
            </div>
            {isAi && (
              <span className="rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
                NEW
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar AI Quick Action Card */}
      <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-50/80 to-slate-50 p-4 dark:border-indigo-500/20 dark:from-indigo-950/40 dark:to-slate-900">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Bot size={16} />
          <span className="text-xs font-bold">Ask AI Coach</span>
        </div>
        <p className="mt-1.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
          Get real-time answers to your tax, budget, & saving questions.
        </p>
        <button
          onClick={() => {
            setMenuOpen(false);
            navigate('/ai-advisor');
          }}
          className="mt-3 w-full rounded-xl bg-brand-500 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-brand-600"
        >
          Open Advisor Chat
        </button>
      </div>

      <div className="absolute bottom-5 left-5 right-5 border-t border-slate-100 pt-4 dark:border-white/10">
        <p className="mb-3 truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.name}</p>
        <button onClick={logout} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-rose-500">
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />
      {menuOpen && (
        <>
          <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm lg:hidden" />
          <Sidebar mobile />
        </>
      )}
      <main className="lg:ml-64">
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-slate-200/70 bg-white/75 px-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75 sm:px-8">
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden">
            <Menu size={21} />
          </button>
          <div className="hidden lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">SmartSpend AI Workspace</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => navigate('/ai-advisor')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-3 py-1.5 text-xs font-extrabold text-white shadow-glow transition hover:opacity-90"
            >
              <Bot size={15} />
              <span>AI Advisor Hub</span>
            </button>
            <button onClick={toggleTheme} aria-label="Toggle color theme" className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <NotificationCenter />
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


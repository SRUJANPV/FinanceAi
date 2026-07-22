import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Check, ChevronRight, CircleDollarSign, Github, Instagram,
  Landmark, Linkedin, Menu, ShieldCheck, Sparkles, TrendingUp, X, Mail,
  Bot, ScanLine, BrainCircuit, Lock, Zap, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  ['Features', '#features'],
  ['AI Capabilities', '#ai-features'],
  ['How It Works', '#how-it-works'],
  ['About', '#about']
];

const footerLinks = {
  Product: ['Features', 'AI Advisor', 'OCR Scanner', 'Pricing', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press Kit'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Security & Safety', 'Cookie Policy']
};

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState('advisor');

  return (
    <main className="bg-[#0b101d] text-slate-100 antialiased selection:bg-brand-500/30 selection:text-brand-400">
      {/* Navigation */}
      <Nav open={mobileOpen} setOpen={setMobileOpen} />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden px-5 pb-20 pt-10 sm:px-6 sm:pt-12 sm:pb-24 lg:pt-20 lg:pb-32">
        {/* Background Radial Lights & Grids */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-brand-500/25 via-indigo-500/20 to-sky-500/10 blur-[130px]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-7 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-300 backdrop-blur-md"
              >
                <Sparkles size={15} className="animate-pulse text-indigo-400" />
                <span>Next-Gen Autonomous Finance AI</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl"
              >
                Master your money with{' '}
                <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                  Intelligent AI
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5 text-base leading-7 text-slate-300 font-normal sm:mt-6 sm:text-lg sm:leading-8"
              >
                SmartSpend AI aggregates your accounts, parses receipts with high-precision OCR, and delivers real-time wealth coaching. Total financial clarity in one beautiful interface.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-500 via-indigo-600 to-sky-500 px-7 py-4 text-base font-extrabold text-white shadow-[0_12px_40px_rgba(99,91,255,0.4)] transition hover:-translate-y-0.5 hover:shadow-glow"
                >
                  Start Free Trial <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-800/60 px-6 py-4 text-base font-bold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
                >
                  Live Demo Access
                </Link>
              </motion.div>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400" /> Instant Bank-Grade Security
                </span>
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400" /> Zero Spreadsheet Work
                </span>
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-400" /> AI OCR Scan Included
                </span>
              </div>
            </div>

            {/* Right Interactive Card Preview */}
            <div className="lg:col-span-5">
              <InteractiveAppCard activeTab={activeDemoTab} setActiveTab={setActiveDemoTab} />
            </div>
          </div>
        </div>
      </section>

      {/* Ticker / Metrics */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
          <div>
            <p className="text-3xl font-black text-white">₹4.2 Cr+</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Transactions Analyzed</p>
          </div>
          <div>
            <p className="text-3xl font-black text-emerald-400">99.4%</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">OCR Scan Precision</p>
          </div>
          <div>
            <p className="text-3xl font-black text-indigo-400">12,000+</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Smart Spenders</p>
          </div>
          <div>
            <p className="text-3xl font-black text-sky-400">₹18,500</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Avg Annual User Savings</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Built For Professional Wealth</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Everything you need for effortless financial power.
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed text-lg">
            Say goodbye to clunky manual entry. SmartSpend AI works behind the scenes to keep your net worth growing.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={Bot}
            title="Real-Time AI Financial Advisor"
            description="Ask questions in plain English. Get instant, personalized savings recommendations and debt reduction strategies."
          />
          <FeatureCard
            icon={ScanLine}
            title="Automated Receipt & Bill Scanner"
            description="Snap or upload any purchase receipt. Our multi-modal vision AI extracts line items, totals, and merchants automatically."
          />
          <FeatureCard
            icon={BrainCircuit}
            title="Predictive Budget Guardrails"
            description="SmartSpend detects unusual spending anomalies before your budget breaks, keeping your financial health score high."
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-slate-800 bg-slate-900/60 px-6 py-24">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Simple 3-Step Setup</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight">Clarity in less than 2 minutes.</h2>
            <p className="mt-5 text-slate-400 leading-relaxed max-w-lg">
              No complex setup or software installations required. Access your workspace from any device.
            </p>

            <div className="mt-10 space-y-6">
              {[
                ['01', 'Connect or Add Accounts', 'Input income sources, savings wallets, or credit cards in seconds.'],
                ['02', 'Activate AI Categorization', 'Transactions and receipts are auto-tagged into smart spending buckets.'],
                ['03', 'Receive Actionable Advice', 'Your AI coach generates weekly savings blueprints and wealth forecasts.']
              ].map(([num, title, text]) => (
                <div key={num} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/80">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/20 text-brand-400 font-extrabold">
                    {num}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-white text-lg">{title}</h3>
                    <p className="mt-1 text-sm text-slate-400 leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Live AI Health Check</span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                Score: 86/100
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-800/80 p-4 border border-slate-700/60">
                <p className="text-xs font-semibold text-slate-400">Monthly Net Income</p>
                <p className="text-2xl font-extrabold text-white mt-1">₹1,25,000</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-800/80 p-4 border border-slate-700/60">
                  <p className="text-xs font-semibold text-slate-400">Savings Rate</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">61.4%</p>
                </div>
                <div className="rounded-2xl bg-slate-800/80 p-4 border border-slate-700/60">
                  <p className="text-xs font-semibold text-slate-400">Emergency Shield</p>
                  <p className="text-xl font-bold text-sky-400 mt-1">4.2 Months</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

function Nav({ open, setOpen }) {
  return (
    <>
    <nav className="relative z-30 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:h-24 sm:px-6">
      <Brand />
      <div className="hidden items-center gap-9 md:flex">
        {navItems.map(([label, href]) => (
          <a key={label} href={href} className="text-sm font-semibold text-slate-300 transition hover:text-brand-400">
            {label}
          </a>
        ))}
      </div>
      <div className="hidden items-center gap-4 md:flex">
        <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-2">
          Log in
        </Link>
        <Link
          to="/register"
          className="rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-glow hover:opacity-95"
        >
          Get Started
        </Link>
      </div>
      <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-slate-300 md:hidden" aria-label="Open menu">
        {open ? <X /> : <Menu />}
      </button>
    </nav>
    {open && (
      <div className="absolute inset-x-4 top-16 z-40 rounded-2xl border border-slate-700 bg-slate-900/95 p-3 shadow-2xl backdrop-blur md:hidden">
        <div className="space-y-1">
          {navItems.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800">
              {label}
            </a>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800 pt-3">
          <Link to="/login" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-slate-200 hover:bg-slate-800">Log in</Link>
          <Link to="/register" onClick={() => setOpen(false)} className="rounded-xl bg-brand-500 px-4 py-3 text-center text-sm font-bold text-white">Get Started</Link>
        </div>
      </div>
    )}
    </>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-white">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 via-indigo-600 to-sky-400 text-white shadow-glow">
        <Landmark size={20} />
      </span>
      <span>SmartSpend <span className="text-brand-400">AI</span></span>
    </Link>
  );
}

function InteractiveAppCard({ activeTab, setActiveTab }) {
  return (
    <div className="relative mx-auto w-full max-w-[500px]">
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-500 text-white">
              <Bot size={16} />
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">AI Wealth Workspace</span>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
            Active
          </span>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
            <p className="text-xs text-sky-300 font-bold">🤖 Smart Advisor Recommendation</p>
            <p className="mt-1.5 text-xs text-slate-200 leading-relaxed">
              "Your savings rate is 61.4%! Transferring ₹5,000 into an index fund monthly will compound to ₹4.1 Lakhs in 5 years."
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-800/80 p-3 border border-slate-700/60">
              <p className="text-[11px] text-slate-400">Monthly Balance</p>
              <p className="text-base font-extrabold text-white mt-1">₹2,48,920</p>
            </div>
            <div className="rounded-xl bg-slate-800/80 p-3 border border-slate-700/60">
              <p className="text-[11px] text-slate-400">Monthly Expenses</p>
              <p className="text-base font-extrabold text-rose-400 mt-1">₹48,250</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">Ready to explore?</span>
          <Link
            to="/register"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300"
          >
            Create Your Account <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 transition hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
        <Icon size={22} />
      </div>
      <h3 className="mt-6 text-xl font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{description}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer id="about" className="border-t border-slate-800 bg-[#080c16] px-6 py-16 text-slate-400">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Brand />
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              AI-driven personal finance platform designed for individuals who demand clarity, precision, and wealth growth.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">{title}</h4>
              <ul className="mt-4 space-y-2.5 text-xs">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#about" className="transition hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SmartSpend AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Component } from 'react';
import { RefreshCw } from 'lucide-react';

export default class AppErrorBoundary extends Component {
  state = { hasError: false, message: '' };
  static getDerivedStateFromError(error) { return { hasError: true, message: error?.message || 'Unknown rendering error' }; }
  componentDidCatch(error, info) { console.error('SmartSpend render error:', error, info); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return <main className="grid min-h-screen place-items-center bg-[#f8faff] p-6 text-center"><section className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600"><RefreshCw size={22}/></span><h1 className="mt-5 text-2xl font-extrabold">Let’s reload SmartSpend</h1><p className="mt-3 leading-7 text-slate-500">Something did not load correctly. The error below will help us fix it.</p><p className="mt-4 rounded-xl bg-rose-50 p-3 font-mono text-xs text-rose-700">{this.state.message}</p><button onClick={() => window.location.reload()} className="btn-primary mt-6">Refresh page</button></section></main>;
  }
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import AppErrorBoundary from './components/AppErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AiAdvisorPage from './pages/AiAdvisorPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import TransactionsPage from './pages/TransactionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PlannerPage from './pages/PlannerPage';
import BudgetsPage from './pages/BudgetsPage';
import AdminPage from './pages/AdminPage';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } });
const app = (
  <StrictMode>
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <CurrencyProvider>
            <BrowserRouter>
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route element={<AppShell />}>
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/ai-advisor" element={<AiAdvisorPage />} />
                      <Route path="/subscriptions" element={<SubscriptionsPage />} />
                      <Route path="/transactions" element={<TransactionsPage />} />
                      <Route path="/budgets" element={<BudgetsPage />} />
                      <Route path="/analytics" element={<AnalyticsPage />} />
                      <Route path="/wallets" element={<PlannerPage resource="wallets" />} />
                      <Route path="/loans" element={<PlannerPage resource="loans" />} />
                      <Route path="/admin" element={<AdminPage />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
            <ToastContainer position="bottom-right" theme="colored" />
          </CurrencyProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  </StrictMode>
);
createRoot(document.getElementById('root')).render(app);



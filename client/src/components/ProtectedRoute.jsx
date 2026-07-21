import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedRoute() { const { user, loading } = useAuth(); if (loading) return <div className="grid min-h-screen place-items-center text-brand-500">Loading your workspace…</div>; return user ? <Outlet /> : <Navigate to="/login" replace />; }

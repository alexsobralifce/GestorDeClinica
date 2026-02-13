import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/contexts/AuthContext';

export function AdminGuard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

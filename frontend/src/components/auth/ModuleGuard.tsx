import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/contexts/AuthContext';

interface ModuleGuardProps {
  module: string;
}

export function ModuleGuard({ module }: ModuleGuardProps) {
  const { hasModule, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  if (!hasModule(module)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

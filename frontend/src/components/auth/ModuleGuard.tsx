import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/contexts/AuthContext';

interface ModuleGuardProps {
  module: string;
}

export function ModuleGuard({ module }: ModuleGuardProps) {
  const { hasModule, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#4a7c65] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Debug log
  console.log('[ModuleGuard]', { module, user, hasModule: hasModule(module) });

  if (!hasModule(module)) {
    console.warn('[ModuleGuard] Access denied to module:', module, 'User:', user);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

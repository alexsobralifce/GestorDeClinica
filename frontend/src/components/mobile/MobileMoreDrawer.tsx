import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  LogOut,
  Settings,
  User,
  FileText,
  BarChart3,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/contexts/AuthContext';

interface MobileMoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMoreDrawer({ isOpen, onClose }: MobileMoreDrawerProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // const { isDark, toggleTheme } = useTheme();

  const menuItems = [
    // { label: 'Meu Perfil', icon: User, path: '/profile' }, // TODO: Implement profile page
    { label: 'Prontuário', icon: FileText, path: '/dashboard/prontuario' },
    { label: 'BI & Relatórios', icon: BarChart3, path: '/dashboard/bi/dashboard-executivo' },
    { label: 'Administrativo', icon: Briefcase, path: '/dashboard/admin/profissionais' },
    { label: 'Configurações', icon: Settings, path: '/dashboard/admin/configuracoes' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a1e] rounded-t-3xl z-50 overflow-hidden pb-8"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#e8e5df] dark:border-[#2a2a30]">
              <h2 className="text-lg font-bold text-[#2b2926] dark:text-[#e8e8ef]">Menu</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                <X className="w-6 h-6 text-[#5c5650] dark:text-[#b0b0be]" />
              </button>
            </div>

            <div className="p-4">
              {/* User Card */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-[#f5f3ef] dark:bg-[#1e1e22] rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-[#4a7c65] flex items-center justify-center text-white text-lg font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#2b2926] dark:text-[#e8e8ef]">{user?.name}</p>
                  <p className="text-xs text-[#7a7369] dark:text-[#6b6b75]">{user?.email}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleNavigation(item.path)}
                      className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-[#f5f3ef] dark:hover:bg-[#1e1e22] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#dce8e3] dark:bg-[#1e4030] flex items-center justify-center text-[#4a7c65]">
                        <Icon size={20} />
                      </div>
                      <span className="font-medium text-[#2b2926] dark:text-[#e8e8ef]">{item.label}</span>
                    </button>
                  )
                })}
              </div>

              <div className="h-px bg-[#e8e5df] dark:bg-[#2a2a30] my-6" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 rounded-xl text-[#e85d3f] hover:bg-[#fef5f3] dark:hover:bg-[#3f1610] transition-colors"
              >
                <LogOut className="w-6 h-6" />
                <span className="font-medium">Sair da conta</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

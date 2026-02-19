import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Bell,
  Menu,
  LogOut,
  X,
  ChevronDown,
  ChevronRight,
  DollarSign,
  BarChart3,
  Briefcase,
  Stethoscope,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../lib/contexts/AuthContext';
import { DeviceProvider, useDevice } from '../../contexts/DeviceContext';
import { MobileLayout } from '../mobile/MobileLayout';

interface MenuItem {
  path?: string;
  label: string;
  icon: any;
  module?: string;
  submenu?: { path: string; label: string }[];
}

export function Layout() {
  return (
    <DeviceProvider>
      <LayoutContent />
    </DeviceProvider>
  );
}

function LayoutContent() {
  const { isMobile } = useDevice();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, hasModule } = useAuth();


  const allMenuItems: MenuItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, module: 'dashboard' },
    { path: '/dashboard/agenda', label: 'Agenda', icon: Calendar, module: 'agenda' },
    { path: '/dashboard/pacientes', label: 'Pacientes', icon: Users, module: 'pacientes' },
    { path: '/dashboard/prontuario', label: 'Prontuário', icon: FileText, module: 'prontuario' },
    {
      label: 'Financeiro',
      icon: DollarSign,
      module: 'financeiro',
      submenu: [
        { path: '/dashboard/financeiro', label: 'Dashboard' },
        { path: '/dashboard/financeiro/fluxo-caixa', label: 'Fluxo de Caixa' },
        { path: '/dashboard/financeiro/contas-receber', label: 'Contas a Receber' },
        { path: '/dashboard/financeiro/contas-pagar', label: 'Contas a Pagar' },
        { path: '/dashboard/financeiro/relatorios', label: 'Relatórios' },
      ],
    },
    {
      label: 'Business Intelligence',
      icon: BarChart3,
      module: 'bi',
      submenu: [
        { path: '/dashboard/bi/dashboard-executivo', label: 'Dashboard Executivo' },
        { path: '/dashboard/bi/analise-pacientes', label: 'Análise de Pacientes' },
        { path: '/dashboard/bi/analise-financeira', label: 'Análise Financeira' },
        { path: '/dashboard/bi/previsoes', label: 'Previsões IA' },
      ],
    },
    {
      label: 'Administrativo',
      icon: Briefcase,
      module: 'admin',
      submenu: [
        { path: '/dashboard/admin/profissionais', label: 'Profissionais' },
        { path: '/dashboard/admin/convenios', label: 'Convênios' },
        { path: '/dashboard/admin/usuarios', label: 'Usuários' },
        { path: '/dashboard/admin/configuracoes', label: 'Configurações' },
      ],
    },
  ];

  // Filter menu items based on user modules
  const menuItems = allMenuItems.filter((item) =>
    !item.module || hasModule(item.module)
  );

  // Auto-expand submenu when navigating to a submenu page
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some((sub) =>
          location.pathname.startsWith(sub.path)
        );
        if (hasActiveSubmenu && !expandedMenus.includes(item.label)) {
          setExpandedMenus((prev) => [...prev, item.label]);
        }
      }
    });
  }, [location.pathname]);

  // If mobile, render the dedicated mobile layout (after all hooks)
  if (isMobile) {
    return <MobileLayout />;
  }

  const toggleSubmenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isSubmenuActive = (submenu: { path: string; label: string }[]) => {
    return submenu.some((item) => location.pathname.startsWith(item.path));
  };

  const notifications = [
    { id: 1, text: 'Paciente Maria confirmou consulta', time: '5 min atrás', unread: true },
    { id: 2, text: 'Nova solicitação de agendamento', time: '15 min atrás', unread: true },
    { id: 3, text: 'Lembrete: Consulta em 30 minutos', time: '1 hora atrás', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-mesh dark:bg-[#0f0f11]">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 z-40 h-screen w-[280px] bg-white dark:bg-[#141416] shadow-xl dark:shadow-2xl dark:shadow-black/40"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-[#e8e5df] dark:border-[#2a2a30] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#4a7c65] to-[#3d6653] dark:from-[#5faa84] dark:to-[#4a8c6e]">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2b2926] dark:text-[#e8e8ef]" style={{ fontFamily: 'var(--font-heading)' }}>
                HealthSync
              </h1>
              <p className="text-xs text-[#a8a199] dark:text-[#6b6b75]">Gestão Clínica</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto space-y-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path
                ? item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path)
                : false;
              const isSubmenuExpanded = expandedMenus.includes(item.label);
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const hasActiveSubmenu = hasSubmenu && item.submenu ? isSubmenuActive(item.submenu) : false;

              return (
                <div key={item.label}>
                  {/* Menu Principal */}
                  {item.path ? (
                    <Link to={item.path} className="relative block">
                      <motion.div
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${isActive
                          ? 'bg-[#dce8e3] text-[#325143] dark:bg-[#1e4030] dark:text-[#7ac49e]'
                          : 'text-[#5c5650] hover:bg-[#f5f3ef] dark:text-[#b0b0be] dark:hover:bg-[#1e1e22]'
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="flex-1 font-medium" style={{ fontFamily: 'var(--font-heading)' }}>
                          {item.label}
                        </span>
                      </motion.div>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-[#4a7c65] dark:bg-[#5faa84]"
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        />
                      )}
                    </Link>
                  ) : (
                    <button
                      onClick={() => hasSubmenu && toggleSubmenu(item.label)}
                      className="w-full relative block"
                    >
                      <motion.div
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${hasActiveSubmenu || isSubmenuExpanded
                          ? 'bg-[#dce8e3] text-[#325143] dark:bg-[#1e4030] dark:text-[#7ac49e]'
                          : 'text-[#5c5650] hover:bg-[#f5f3ef] dark:text-[#b0b0be] dark:hover:bg-[#1e1e22]'
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="flex-1 font-medium text-left" style={{ fontFamily: 'var(--font-heading)' }}>
                          {item.label}
                        </span>
                        {hasSubmenu && (
                          <motion.div
                            animate={{ rotate: isSubmenuExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </motion.div>
                        )}
                      </motion.div>
                      {hasActiveSubmenu && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-[#4a7c65] dark:bg-[#5faa84]"
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        />
                      )}
                    </button>
                  )}

                  {/* Submenu */}
                  <AnimatePresence>
                    {hasSubmenu && isSubmenuExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#e8e5df] dark:border-[#2a2a30] pl-4">
                          {item.submenu?.map((submenuItem) => {
                            const isSubmenuItemActive = location.pathname === submenuItem.path;

                            return (
                              <Link
                                key={submenuItem.path}
                                to={submenuItem.path}
                                className="relative block"
                              >
                                <motion.div
                                  whileHover={{ x: 4 }}
                                  transition={{ duration: 0.2 }}
                                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isSubmenuItemActive
                                    ? 'bg-[#f0f5f3] text-[#325143] dark:bg-[#132b1f] dark:text-[#7ac49e]'
                                    : 'text-[#7a7369] hover:bg-[#f9f7f4] hover:text-[#5c5650] dark:text-[#9090a0] dark:hover:bg-[#1e1e22] dark:hover:text-[#b0b0be]'
                                    }`}
                                >
                                  <ChevronRight className="h-3 w-3" />
                                  <span>{submenuItem.label}</span>
                                </motion.div>
                                {isSubmenuItemActive && (
                                  <motion.div
                                    layoutId="activeSubmenu"
                                    className="absolute left-0 top-0 h-full w-0.5 rounded-r-full bg-[#4a7c65] dark:bg-[#5faa84]"
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                  />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-[#e8e5df] dark:border-[#2a2a30] p-4">
            <div className="flex items-center gap-3 rounded-xl bg-[#f5f3ef] dark:bg-[#1e1e22] p-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#4a7c65] to-[#3d6653] dark:from-[#5faa84] dark:to-[#4a8c6e] flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '??'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2b2926] dark:text-[#e8e8ef] truncate">
                  {user?.name || 'Usuário'}
                </p>
                <p className="text-xs text-[#a8a199] dark:text-[#6b6b75]">
                  {user?.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                </p>
              </div>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="btn-icon"
                title="Sair"
              >
                <LogOut className="h-5 w-5 text-[#5c5650] dark:text-[#b0b0be]" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-0'
          }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-[#e8e5df] dark:border-[#2a2a30] bg-white/80 dark:bg-[#141416]/80 backdrop-blur-lg">
          <div className="flex h-16 items-center justify-between px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn-icon"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6 dark:text-[#b0b0be]" />
              ) : (
                <Menu className="h-6 w-6 dark:text-[#b0b0be]" />
              )}
            </button>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="btn-icon relative group"
                title={isDark ? 'Modo claro' : 'Modo escuro'}
              >
                <motion.div
                  key={isDark ? 'sun' : 'moon'}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {isDark ? (
                    <Sun className="h-5 w-5 text-amber-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-[#5c5650]" />
                  )}
                </motion.div>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="btn-icon relative"
                >
                  <Bell className="h-5 w-5 text-[#5c5650] dark:text-[#b0b0be]" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="btn-badge"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0"
                        onClick={() => setNotificationsOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-12 w-80 rounded-2xl bg-white dark:bg-[#1a1a1e] shadow-2xl dark:shadow-black/50 dark:border dark:border-[#2a2a30]"
                      >
                        <div className="border-b border-[#e8e5df] dark:border-[#2a2a30] p-4">
                          <h3 className="font-semibold text-[#2b2926] dark:text-[#e8e8ef]">
                            Notificações
                          </h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notification, index) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`border-b border-[#e8e5df] dark:border-[#2a2a30] p-4 hover:bg-[#f5f3ef] dark:hover:bg-[#1e1e22] transition-colors ${notification.unread ? 'bg-[#f0f5f3] dark:bg-[#132b1f]' : ''
                                }`}
                            >
                              <div className="flex items-start gap-2">
                                {notification.unread && (
                                  <div className="mt-1.5 h-2 w-2 rounded-full bg-[#4a7c65] dark:bg-[#5faa84]" />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm text-[#2b2926] dark:text-[#e8e8ef]">
                                    {notification.text}
                                  </p>
                                  <p className="mt-1 text-xs text-[#a8a199] dark:text-[#6b6b75]">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <div className="border-t border-[#e8e5df] dark:border-[#2a2a30] p-4">
                          <button className="btn-ghost w-full text-sm">
                            Ver todas notificações
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 dark:bg-[#0f0f11]">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
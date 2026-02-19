import { Home, Calendar, Users, BarChart3, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BottomNavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

interface BottomNavigationProps {
  onMoreClick: () => void;
}

export function BottomNavigation({ onMoreClick }: BottomNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: BottomNavItem[] = [
    {
      icon: Home,
      label: 'Início',
      path: '/dashboard',
    },
    {
      icon: Calendar,
      label: 'Agenda',
      path: '/dashboard/agenda',
    },
    {
      icon: Users,
      label: 'Pacientes',
      path: '/dashboard/pacientes',
    },
    {
      icon: BarChart3,
      label: 'Financeiro',
      path: '/dashboard/financeiro',
    },
    {
      icon: Menu,
      label: 'Mais',
      path: '#more', // Will trigger drawer
    },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bottom-nav justify-around px-2">
      {navItems.map((item) => {
        const active = isActive(item.path);
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            onClick={() => item.path === '#more' ? onMoreClick() : navigate(item.path)}
            className={`bottom-nav-item relative ${active ? 'text-[#4a7c65]' : 'text-[#a8a199]'}`}
            aria-label={item.label}
          >
            {active && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-[#e8f5e9] rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            <Icon size={24} strokeWidth={active ? 2.5 : 2} />

            <span className={`text-[10px] font-medium transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-70'}`}>
              {item.label}
            </span>

            {item.badge && (
              <span className="absolute top-1 right-2 w-4 h-4 bg-[#e85d3f] rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

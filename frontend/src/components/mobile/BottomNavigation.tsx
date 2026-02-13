import { Home, Calendar, Users, BarChart3, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface BottomNavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: BottomNavItem[] = [
    {
      icon: <Home />,
      label: 'Início',
      path: '/',
    },
    {
      icon: <Calendar />,
      label: 'Agenda',
      path: '/agenda',
    },
    {
      icon: <Users />,
      label: 'Pacientes',
      path: '/pacientes',
    },
    {
      icon: <BarChart3 />,
      label: 'Financeiro',
      path: '/financeiro',
    },
    {
      icon: <Menu />,
      label: 'Mais',
      path: '/more',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`bottom-nav-item ${isActive(item.path) ? 'active' : ''}`}
          aria-label={item.label}
        >
          {item.icon}
          <span className="bottom-nav-item-label">{item.label}</span>
          {item.badge && <span className="bottom-nav-badge" />}
        </button>
      ))}
    </nav>
  );
}

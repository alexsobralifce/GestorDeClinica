import { Bell, Menu } from 'lucide-react';
import { useAuth } from '../../lib/contexts/AuthContext';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Doutor(a)';

  // Saudação baseada no horário
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#e8e5df] pt-safe px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
          >
            <Menu className="w-6 h-6 text-[#5c5650]" />
          </button>

          <div>
            <p className="text-xs text-[#7a7369] font-medium">{greeting},</p>
            <h1 className="text-lg font-bold text-[#2b2926] leading-none">
              {firstName}
            </h1>
          </div>
        </div>

        <button className="w-10 h-10 -mr-2 flex items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10 transition-colors relative">
          <Bell className="w-6 h-6 text-[#5c5650]" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#e85d3f] rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  );
}

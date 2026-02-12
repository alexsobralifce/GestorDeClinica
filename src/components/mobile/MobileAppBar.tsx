import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router';

interface MobileAppBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function MobileAppBar({ title, showBack = false, onBack, actions }: MobileAppBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="mobile-app-bar">
      <div className="mobile-app-bar-left">
        {showBack && (
          <button
            onClick={handleBack}
            className="mobile-app-bar-icon-btn"
            aria-label="Voltar"
          >
            <ArrowLeft />
          </button>
        )}
      </div>

      <div className="mobile-app-bar-center">{title}</div>

      <div className="mobile-app-bar-right">
        {actions || (
          <button
            className="mobile-app-bar-icon-btn"
            aria-label="Mais opções"
          >
            <MoreVertical />
          </button>
        )}
      </div>
    </header>
  );
}

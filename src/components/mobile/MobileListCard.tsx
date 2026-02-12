import { ChevronRight } from 'lucide-react';

interface MobileListCardProps {
  avatar?: React.ReactNode | string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  showChevron?: boolean;
  onClick?: () => void;
}

export function MobileListCard({
  avatar,
  title,
  subtitle,
  trailing,
  showChevron = true,
  onClick,
}: MobileListCardProps) {
  return (
    <div className="mobile-list-card" onClick={onClick}>
      {/* Avatar */}
      {avatar && (
        <div className="mobile-list-card-avatar">
          {typeof avatar === 'string' ? (
            <span>{avatar.charAt(0).toUpperCase()}</span>
          ) : (
            avatar
          )}
        </div>
      )}

      {/* Content */}
      <div className="mobile-list-card-content">
        <div className="mobile-list-card-title">{title}</div>
        {subtitle && <div className="mobile-list-card-subtitle">{subtitle}</div>}
      </div>

      {/* Trailing */}
      <div className="mobile-list-card-trailing">
        {trailing}
        {showChevron && <ChevronRight size={20} color="#a8a199" />}
      </div>
    </div>
  );
}

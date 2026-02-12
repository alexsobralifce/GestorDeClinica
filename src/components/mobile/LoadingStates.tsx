import { motion } from 'motion/react';

// ==================== SKELETON SCREEN ====================

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ width = '100%', height = 16, className = '', variant = 'text' }: SkeletonProps) {
  const baseClasses = 'bg-gradient-to-r from-[#e8e5df] via-[#f5f3ef] to-[#e8e5df] bg-[length:200%_100%] animate-shimmer';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

// ==================== SKELETON CARD (Lista) ====================

export function SkeletonListCard() {
  return (
    <div className="mobile-list-card">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton width="70%" height={16} />
        <Skeleton width="50%" height={14} />
      </div>
      <Skeleton variant="circular" width={24} height={24} />
    </div>
  );
}

// ==================== SKELETON AGENDA CARD ====================

export function SkeletonAgendaCard() {
  return (
    <div className="bg-white rounded-xl p-4 mx-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <Skeleton width={60} height={24} />
        <Skeleton width={80} height={20} className="rounded-full" />
      </div>
      <Skeleton width="80%" height={16} className="mb-2" />
      <Skeleton width="60%" height={14} className="mb-3" />
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton width={120} height={14} />
      </div>
    </div>
  );
}

// ==================== SKELETON DASHBOARD CARD ====================

export function SkeletonDashboardCard() {
  return (
    <div className="flex-shrink-0 w-[140px] bg-white rounded-xl p-4">
      <Skeleton variant="circular" width={32} height={32} className="mb-2" />
      <Skeleton width="80%" height={24} className="mb-1" />
      <Skeleton width="60%" height={12} />
    </div>
  );
}

// ==================== SKELETON PAGE ====================

export function SkeletonPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* App Bar Skeleton */}
      <div className="mobile-app-bar">
        <div className="mobile-app-bar-left">
          <Skeleton variant="circular" width={40} height={40} />
        </div>
        <div className="mobile-app-bar-center">
          <Skeleton width={120} height={20} />
        </div>
        <div className="mobile-app-bar-right">
          <Skeleton variant="circular" width={40} height={40} />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonListCard key={i} />
        ))}
      </div>
    </div>
  );
}

// ==================== SPINNER ====================

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

export function Spinner({ size = 'medium', color = '#4a7c65', text }: SpinnerProps) {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-2',
    large: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-t-transparent rounded-full animate-spin`}
        style={{ borderColor: color, borderTopColor: 'transparent' }}
      />
      {text && <div className="text-sm text-[#7a7369]">{text}</div>}
    </div>
  );
}

// ==================== LOADING OVERLAY ====================

interface LoadingOverlayProps {
  text?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({ text = 'Carregando...', fullScreen = false }: LoadingOverlayProps) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/90 backdrop-blur-sm z-[9999]'
    : 'absolute inset-0 bg-white/80 backdrop-blur-sm z-10';

  return (
    <div className={containerClasses}>
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner size="large" text={text} />
      </div>
    </div>
  );
}

// ==================== PROGRESS BAR ====================

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
  showPercentage?: boolean;
}

export function ProgressBar({
  progress,
  color = '#4a7c65',
  height = 4,
  showPercentage = false,
}: ProgressBarProps) {
  return (
    <div className="w-full">
      <div
        className="w-full bg-[#e8e5df] rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-[#7a7369] mt-1 text-center">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}

// ==================== CIRCULAR PROGRESS ====================

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgress({
  progress,
  size = 48,
  strokeWidth = 4,
  color = '#4a7c65',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e8e5df"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-xs font-semibold" style={{ color }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
}

// ==================== PULL TO REFRESH INDICATOR ====================

export function PullToRefreshIndicator({ isRefreshing }: { isRefreshing: boolean }) {
  if (!isRefreshing) return null;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="flex justify-center py-4"
    >
      <Spinner size="medium" text="Atualizando..." />
    </motion.div>
  );
}

// ==================== BUTTON LOADING ====================

interface ButtonLoadingProps {
  isLoading: boolean;
  text: string;
  loadingText?: string;
  onClick?: () => void;
  className?: string;
}

export function ButtonLoading({
  isLoading,
  text,
  loadingText = 'Carregando...',
  onClick,
  className = 'btn-primary btn-mobile-full',
}: ButtonLoadingProps) {
  return (
    <button onClick={onClick} disabled={isLoading} className={className}>
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Spinner size="small" color="currentColor" />
          <span>{loadingText}</span>
        </div>
      ) : (
        text
      )}
    </button>
  );
}

// Adicionar keyframes para shimmer no CSS global
// @keyframes shimmer {
//   0% { background-position: 200% 0; }
//   100% { background-position: -200% 0; }
// }

import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface FABProps {
  icon?: React.ReactNode;
  label?: string;
  onClick: () => void;
  variant?: 'default' | 'mini' | 'extended';
}

export function FAB({ icon = <Plus />, label, onClick, variant = 'default' }: FABProps) {
  const isExtended = variant === 'extended' || !!label;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`fab ${variant === 'mini' ? 'fab-mini' : ''} ${
        isExtended ? 'fab-extended' : ''
      }`}
      aria-label={label || 'Ação principal'}
    >
      {icon}
      {isExtended && <span className="fab-extended-label">{label}</span>}
    </motion.button>
  );
}

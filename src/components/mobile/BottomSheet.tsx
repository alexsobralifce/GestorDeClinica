import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
}: BottomSheetProps) {
  // Previne scroll do body quando o sheet está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const maxHeightBySize = {
    small: '40vh',
    medium: '60vh',
    large: '90vh',
    full: '100vh',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bottom-sheet-backdrop"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bottom-sheet"
            style={{ maxHeight: maxHeightBySize[size] }}
          >
            {/* Handle */}
            <div className="bottom-sheet-handle" />

            {/* Header */}
            {title && (
              <div className="bottom-sheet-header">
                <h2 className="bottom-sheet-title">{title}</h2>
                <button
                  onClick={onClose}
                  className="bottom-sheet-close"
                  aria-label="Fechar"
                >
                  <X size={24} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="bottom-sheet-content">{children}</div>

            {/* Footer */}
            {footer && <div className="bottom-sheet-footer">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

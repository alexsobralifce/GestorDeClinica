import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from './BottomNavigation';
import { MobileHeader } from './MobileHeader';
import { useState } from 'react';
import { MobileMoreDrawer } from './MobileMoreDrawer';

export function MobileLayout() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-nav">
      <MobileHeader onMenuClick={() => setIsMenuOpen(true)} />

      <main className="pt-safe pb-safe">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNavigation onMoreClick={() => setIsMenuOpen(true)} />

      <MobileMoreDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
}

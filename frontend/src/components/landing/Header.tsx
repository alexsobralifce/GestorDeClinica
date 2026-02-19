
import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onLoginClick: () => void;
  isAuthenticated: boolean;
}

export function Header({ onLoginClick, isAuthenticated }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center px-6">
        {/* Logo - Left */}
        <div className="flex w-48 shrink-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4a7c65] to-[#3d6653] shadow-lg shadow-[#4a7c65]/20">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1F2937]" style={{ fontFamily: '"Inter Tight", sans-serif' }}>
            HealthSync Pro
          </span>
        </div>

        {/* Desktop Nav - Center */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-1">
          <a href="#features" className="rounded-full px-4 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:bg-[#f0f5f3] hover:text-[#4a7c65]">Funcionalidades</a>
          <a href="#testimonials" className="rounded-full px-4 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:bg-[#f0f5f3] hover:text-[#4a7c65]">Depoimentos</a>
          <a href="#pricing" className="rounded-full px-4 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:bg-[#f0f5f3] hover:text-[#4a7c65]">Planos</a>
          <a href="#faq" className="rounded-full px-4 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:bg-[#f0f5f3] hover:text-[#4a7c65]">FAQ</a>
        </nav>

        {/* Actions - Right */}
        <div className="hidden md:flex w-48 shrink-0 items-center justify-end gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 rounded-full bg-[#4a7c65] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4a7c65]/20 transition-all hover:scale-105 hover:bg-[#3d6653]"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#4a7c65]"
              >
                Entrar
              </button>
              <div className="h-6 w-px bg-gray-200"></div>
              <button
                onClick={onLoginClick}
                className="rounded-full bg-[#4a7c65] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4a7c65]/20 transition-all hover:scale-105 hover:bg-[#3d6653]"
              >
                Começar Grátis
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button - Right (replacing Actions on mobile) */}
        <div className="flex flex-1 justify-end md:hidden">
          <button
            className="p-2 text-[#6B7280]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl p-6 md:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold tracking-tight text-[#1F2937]" style={{ fontFamily: '"Inter Tight", sans-serif' }}>
                  Menu
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-full p-2 hover:bg-gray-100">
                  <X className="h-6 w-6 text-[#6B7280]" />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl p-4 text-lg font-medium text-[#1F2937] hover:bg-gray-50">Funcionalidades</a>
                <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl p-4 text-lg font-medium text-[#1F2937] hover:bg-gray-50">Depoimentos</a>
                <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl p-4 text-lg font-medium text-[#1F2937] hover:bg-gray-50">Planos</a>
                <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl p-4 text-lg font-medium text-[#1F2937] hover:bg-gray-50">FAQ</a>

                <hr className="my-4 border-gray-100" />

                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/dashboard');
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4a7c65] py-4 font-semibold text-white shadow-lg"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Ir para Dashboard
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLoginClick();
                      }}
                      className="w-full rounded-xl border border-gray-200 py-4 font-semibold text-[#1F2937] hover:bg-gray-50"
                    >
                      Fazer Login
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLoginClick();
                      }}
                      className="w-full rounded-xl bg-[#4a7c65] py-4 font-semibold text-white shadow-lg"
                    >
                      Criar Conta Grátis
                    </button>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

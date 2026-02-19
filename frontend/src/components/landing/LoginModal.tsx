import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, Eye, EyeOff, Stethoscope, LogIn } from 'lucide-react';
import { useAuth } from '../../lib/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Email ou senha incorretos. Tente novamente.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl"
        style={{
          background: 'rgba(22, 30, 25, 0.95)',
          borderColor: 'rgba(74, 124, 101, 0.2)',
          borderWidth: '1px',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(74, 124, 101, 0.08)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-white/40 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #4a7c65, #5faa84)',
                boxShadow: '0 8px 24px rgba(74, 124, 101, 0.3)',
              }}
            >
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: '"Inter Tight", sans-serif' }}>
              Bem-vindo
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Entre para acessar sua clínica
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border px-4 py-3 text-white transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    fontSize: '0.95rem',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(74, 124, 101, 0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(74, 124, 101, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/70">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border px-4 py-3 pr-12 text-white transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    fontSize: '0.95rem',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(74, 124, 101, 0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(74, 124, 101, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 transition-colors text-white/40 hover:text-white/80"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold text-white transition-all duration-200 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #4a7c65, #5faa84)',
                boxShadow: '0 4px 15px rgba(74, 124, 101, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Entrando...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Entrar
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-xs text-white/30">
            HealthSync © 2026 — Gestão Clínica
          </p>
        </div>
      </motion.div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, LogIn, Stethoscope, Loader2 } from 'lucide-react';

export function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Wait for auth to load before redirecting
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      // Redirect to dashboard after successful login
      navigate('/dashboard', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0f1a14 0%, #1a2e24 30%, #0d1b14 60%, #162416 100%)',
        }}
      >
        <div className="animate-spin h-8 w-8 border-4 border-[#4a7c65] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Redirect to dashboard after successful login
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err?.message || err?.response?.data?.error || 'Erro ao realizar login. Tente novamente.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0f1a14 0%, #1a2e24 30%, #0d1b14 60%, #162416 100%)',
        fontFamily: 'var(--font-heading)',
      }}
    >
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4a7c65 0%, transparent 70%)' }}
        />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #5faa84 0%, transparent 70%)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 mx-4 w-full max-w-md"
      >
        {/* Card */}
        <div
          className="rounded-3xl border p-8 shadow-2xl backdrop-blur-xl"
          style={{
            background: 'rgba(22, 30, 25, 0.85)',
            borderColor: 'rgba(74, 124, 101, 0.2)',
            boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(74, 124, 101, 0.08)',
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8 flex flex-col items-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #4a7c65, #5faa84)',
                boxShadow: '0 8px 24px rgba(74, 124, 101, 0.3)',
              }}
            >
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              HealthSync
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Gestão Clínica
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
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
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 transition-colors"
                  style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="overflow-hidden rounded-xl border px-4 py-3 text-sm"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
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
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Entrar
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
          HealthSync © 2026 — Gestão Clínica
        </p>
      </motion.div>
    </div>
  );
}

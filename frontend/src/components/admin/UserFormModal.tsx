import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import apiClient from '../../lib/api/client';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  modules: string[];
  active: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingUser: UserData | null;
}

const ALL_MODULES = [
  { key: 'dashboard', label: 'Dashboard', description: 'Painel principal com resumo' },
  { key: 'agenda', label: 'Agenda', description: 'Agendamento de consultas' },
  { key: 'pacientes', label: 'Pacientes', description: 'Cadastro de pacientes' },
  { key: 'prontuario', label: 'Prontuário', description: 'Prontuário eletrônico' },
  { key: 'financeiro', label: 'Financeiro', description: 'Controle financeiro completo' },
  { key: 'bi', label: 'Business Intelligence', description: 'Análises e relatórios' },
  { key: 'admin', label: 'Administrativo', description: 'Gestão do sistema' },
];

export default function UserFormModal({ isOpen, onClose, onSuccess, editingUser }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'ADMIN' | 'USER'>('USER');
  const [modules, setModules] = useState<string[]>(['dashboard']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setRole(editingUser.role);
      setModules(editingUser.modules);
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRole('USER');
      setModules(['dashboard']);
    }
    setError('');
  }, [editingUser, isOpen]);

  const toggleModule = (key: string) => {
    setModules((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Nome e email são obrigatórios');
      return;
    }

    if (!editingUser && !password) {
      setError('Senha é obrigatória para novos usuários');
      return;
    }

    if (password && password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (role === 'USER' && modules.length === 0) {
      setError('Selecione pelo menos um módulo');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        name: name.trim(),
        email: email.trim(),
        role,
        modules: role === 'ADMIN' ? ALL_MODULES.map((m) => m.key) : modules,
      };

      if (password) {
        payload.password = password;
      }

      if (editingUser) {
        await apiClient.put(`/users/${editingUser.id}`, payload);
      } else {
        await apiClient.post('/users', payload);
      }

      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
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
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="relative w-full max-w-lg rounded-2xl border border-[#e8e5df] bg-white p-6 shadow-2xl dark:border-[#2a2a30] dark:bg-[#1a1a1e]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2
                  className="text-xl font-bold text-[#2b2926] dark:text-[#e8e8ef]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-[#a8a199] transition-colors hover:bg-[#f5f3ef] dark:hover:bg-[#2a2a30]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#5c5650] dark:text-[#b0b0be]">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#e8e5df] bg-white px-4 py-2.5 text-[#2b2926] transition-all focus:border-[#4a7c65] focus:outline-none focus:ring-2 focus:ring-[#4a7c65]/20 dark:border-[#2a2a30] dark:bg-[#141416] dark:text-[#e8e8ef]"
                    placeholder="Nome do usuário"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#5c5650] dark:text-[#b0b0be]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#e8e5df] bg-white px-4 py-2.5 text-[#2b2926] transition-all focus:border-[#4a7c65] focus:outline-none focus:ring-2 focus:ring-[#4a7c65]/20 dark:border-[#2a2a30] dark:bg-[#141416] dark:text-[#e8e8ef]"
                    placeholder="email@exemplo.com"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#5c5650] dark:text-[#b0b0be]">
                    {editingUser ? 'Nova senha (deixe em branco para manter)' : 'Senha'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-[#e8e5df] bg-white px-4 py-2.5 pr-12 text-[#2b2926] transition-all focus:border-[#4a7c65] focus:outline-none focus:ring-2 focus:ring-[#4a7c65]/20 dark:border-[#2a2a30] dark:bg-[#141416] dark:text-[#e8e8ef]"
                      placeholder={editingUser ? '••••••••' : 'Mínimo 6 caracteres'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8a199]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#5c5650] dark:text-[#b0b0be]">
                    Perfil
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['USER', 'ADMIN'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all ${role === r
                            ? r === 'ADMIN'
                              ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                              : 'border-[#4a7c65] bg-[#f0f5f3] text-[#4a7c65] dark:bg-[#4a7c65]/20'
                            : 'border-[#e8e5df] text-[#7a7369] hover:border-[#c8c3bb] dark:border-[#2a2a30] dark:text-[#6b6b75]'
                          }`}
                      >
                        {r === 'ADMIN' ? '🛡️ Administrador' : '👤 Usuário'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modules */}
                {role === 'USER' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#5c5650] dark:text-[#b0b0be]">
                      Módulos permitidos
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {ALL_MODULES.map((mod) => (
                        <button
                          key={mod.key}
                          type="button"
                          onClick={() => toggleModule(mod.key)}
                          className={`rounded-xl border px-3 py-2 text-left text-sm transition-all ${modules.includes(mod.key)
                              ? 'border-[#4a7c65] bg-[#f0f5f3] text-[#4a7c65] dark:bg-[#4a7c65]/20'
                              : 'border-[#e8e5df] text-[#7a7369] hover:border-[#c8c3bb] dark:border-[#2a2a30] dark:text-[#6b6b75]'
                            }`}
                        >
                          <div className="font-medium">{mod.label}</div>
                          <div className="text-xs opacity-70">{mod.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {role === 'ADMIN' && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                    Administradores têm acesso total a todos os módulos.
                  </div>
                )}

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-[#e8e5df] py-2.5 text-sm font-medium text-[#5c5650] transition-all hover:bg-[#f5f3ef] dark:border-[#2a2a30] dark:text-[#b0b0be]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex flex-1 items-center justify-center gap-2 py-2.5 disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : editingUser ? (
                      'Salvar'
                    ) : (
                      'Criar Usuário'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

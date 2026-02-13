import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, UserX, UserCheck, Search, Shield, User, Loader2 } from 'lucide-react';
import apiClient from '../../lib/api/client';
import UserFormModal from './UserFormModal';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  modules: string[];
  active: boolean;
  created_at: string;
}

const MODULE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  agenda: 'Agenda',
  pacientes: 'Pacientes',
  prontuario: 'Prontuário',
  financeiro: 'Financeiro',
  bi: 'Business Intelligence',
  admin: 'Administrativo',
};

export default function UsersManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (user: UserData) => {
    try {
      if (user.active) {
        await apiClient.delete(`/users/${user.id}`);
      } else {
        await apiClient.put(`/users/${user.id}`, { active: true });
      }
      fetchUsers();
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Erro ao alterar status do usuário');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-3xl font-bold text-[#2b2926]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Gestão de Usuários
          </h1>
          <p className="mt-1 text-[#7a7369]">Gerencie os acessos e permissões do sistema</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setEditingUser(null);
            setModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo Usuário
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a8a199]" />
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-[#e8e5df] bg-white py-3.5 pl-12 pr-4 text-[#2b2926] placeholder-[#a8a199] shadow-sm transition-all focus:border-[#4a7c65] focus:outline-none focus:ring-2 focus:ring-[#4a7c65]/20"
          style={{ fontFamily: 'var(--font-heading)' }}
        />
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#4a7c65]" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-[#a8a199]">
          <User className="mb-3 h-12 w-12" />
          <p className="text-lg font-medium">Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl border border-[#e8e5df] bg-white p-5 shadow-sm transition-all hover:shadow-lg ${!user.active ? 'opacity-60' : ''
                  }`}
              >
                {/* User header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${user.role === 'ADMIN'
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                          : 'bg-gradient-to-br from-[#4a7c65] to-[#3d6653]'
                        }`}
                    >
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-[#2b2926]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {user.name}
                      </h3>
                      <p className="text-sm text-[#7a7369]">{user.email}</p>
                    </div>
                  </div>

                  <span
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${user.role === 'ADMIN'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-[#dce8e3] text-[#4a7c65]'
                      }`}
                  >
                    <Shield className="h-3 w-3" />
                    {user.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                  </span>
                </div>

                {/* Modules */}
                <div className="mb-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#a8a199]">
                    Módulos
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.role === 'ADMIN' ? (
                      <span className="rounded-lg bg-amber-50 px-2 py-0.5 text-xs text-amber-600">
                        Acesso total
                      </span>
                    ) : (
                      user.modules.map((mod) => (
                        <span
                          key={mod}
                          className="rounded-lg bg-[#f0f5f3] px-2 py-0.5 text-xs text-[#4a7c65]"
                        >
                          {MODULE_LABELS[mod] || mod}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-[#e8e5df] pt-3">
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setModalOpen(true);
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#e8e5df] py-2 text-sm font-medium text-[#5c5650] transition-all hover:border-[#4a7c65] hover:text-[#4a7c65]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleActive(user)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-sm font-medium transition-all ${user.active
                        ? 'border-red-200 text-red-500 hover:bg-red-50'
                        : 'border-green-200 text-green-600 hover:bg-green-50'
                      }`}
                  >
                    {user.active ? (
                      <>
                        <UserX className="h-3.5 w-3.5" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-3.5 w-3.5" />
                        Ativar
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <UserFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSuccess={() => {
          setModalOpen(false);
          setEditingUser(null);
          fetchUsers();
        }}
        editingUser={editingUser}
      />
    </div>
  );
}

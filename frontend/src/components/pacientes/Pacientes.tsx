import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  UserPlus,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  Heart,
  Edit,
  Trash2,
  Calendar,
  User,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { usePacientes } from '../../lib/contexts/PacienteContext';
import { PacienteModal } from './PacienteModal';
import { Patient } from '../../lib/api/patients';

import { useDevice } from '../../contexts/DeviceContext';
import { PacientesMobile } from '../mobile/PacientesMobile';

export function Pacientes() {
  const { isMobile } = useDevice();
  const { pacientes, deletePaciente, selecionarPaciente, loading, refreshPacientes } = usePacientes();

  if (isMobile) {
    return <PacientesMobile />;
  }
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [pacienteEditando, setPacienteEditando] = useState<Patient | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const pacientesFiltrados = pacientes.filter(
    (paciente) =>
      paciente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paciente.cpf && paciente.cpf.includes(searchTerm)) ||
      (paciente.phone && paciente.phone.includes(searchTerm))
  );

  const calcularIdade = (dataNascimento?: string) => {
    if (!dataNascimento) return 0;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const handleNovoPaciente = () => {
    setModalMode('create');
    setPacienteEditando(null);
    setModalOpen(true);
  };

  const handleEditarPaciente = (paciente: Patient) => {
    setModalMode('edit');
    setPacienteEditando(paciente);
    setModalOpen(true);
  };

  const handleExcluirPaciente = async (id: string) => {
    if (confirmDelete === id) {
      await deletePaciente(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleVerProntuario = (paciente: Patient) => {
    selecionarPaciente(paciente.id);
  };

  return (
    <div className="content-container">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="heading-primary mb-2">
              Pacientes
            </h1>
            <div className="flex items-center gap-3">
              <div className="badge badge-neutral">
                <User className="h-3.5 w-3.5" />
                {pacientes.length} paciente{pacientes.length !== 1 && 's'}
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-[#a8a199]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Atualizando...
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refreshPacientes()}
              className="btn-secondary"
              title="Atualizar lista"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNovoPaciente}
              className="btn-primary flex items-center gap-2.5"
            >
              <UserPlus className="h-5 w-5" />
              <span>Novo Paciente</span>
            </motion.button>
          </div>
        </div>

        {/* Busca */}
        <div className="card">
          <div className="card-content">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a8a199]" />
              <input
                type="text"
                placeholder="Buscar por nome, CPF ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-transparent bg-[#f9f7f4] text-[#2b2926] placeholder-[#a8a199] transition-all duration-200 focus:outline-none focus:border-[#4a7c65] focus:bg-white focus:ring-4 focus:ring-[#4a7c65]/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Pacientes */}
      <div className="grid grid-cols-1 gap-5">
        <AnimatePresence mode="popLayout">
          {pacientesFiltrados.map((paciente, index) => (
            <motion.div
              key={paciente.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                delay: index * 0.05,
                layout: { duration: 0.3 }
              }}
              className="card group"
            >
              <div className="card-content-lg">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Avatar e Informações Principais */}
                  <div className="flex items-start gap-5 flex-1 min-w-0">
                    {/* Avatar */}
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      className="flex-shrink-0"
                    >
                      <div className="relative">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4a7c65] to-[#3d6653] text-white text-2xl font-bold shadow-lg">
                          {paciente.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-[#f9f7f4]">
                          <div className="h-3 w-3 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Dados do Paciente */}
                    <div className="flex-1 min-w-0">
                      {/* Nome */}
                      <h3 className="text-2xl font-bold text-[#2b2926] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        {paciente.name}
                      </h3>

                      {/* Informações demográficas */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className="badge badge-neutral">
                          <Calendar className="h-3.5 w-3.5" />
                          {calcularIdade(paciente.birth_date)} anos
                        </div>
                        {/* blood_type removed as it is not in Patient interface */}
                        <span className="text-sm text-[#a8a199]">
                          {paciente.cpf}
                        </span>
                      </div>

                      {/* Contatos */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0f5f3]">
                            <Phone className="h-4 w-4 text-[#4a7c65]" />
                          </div>
                          <span className="text-sm text-[#5c5650] font-medium">
                            {paciente.phone || 'Sem telefone'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0f5f3]">
                            <Mail className="h-4 w-4 text-[#4a7c65]" />
                          </div>
                          <span className="text-sm text-[#5c5650]">
                            {paciente.email || 'Sem e-mail'}
                          </span>
                        </div>
                      </div>

                      {/* Alertas Clínicos */}
                      {((paciente.allergies && paciente.allergies.length > 0) || (paciente.medical_conditions && paciente.medical_conditions.length > 0)) && (
                        <div className="flex flex-wrap gap-2">
                          {paciente.allergies && paciente.allergies.length > 0 && (
                            <div className="badge badge-danger">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              {paciente.allergies.length} alergia(s)
                            </div>
                          )}
                          {paciente.medical_conditions && paciente.medical_conditions.length > 0 && (
                            <div className="badge badge-warning">
                              <Heart className="h-3.5 w-3.5" />
                              {paciente.medical_conditions.length} condição(ões)
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-row lg:flex-col gap-2 justify-start lg:justify-start">
                    <Link
                      to={`/dashboard/prontuario/${paciente.id}`}
                      onClick={() => handleVerProntuario(paciente)}
                      className="btn-premium text-sm whitespace-nowrap"
                    >
                      <FileText className="h-4 w-4" />
                      Prontuário
                    </Link>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditarPaciente(paciente)}
                      className="btn-secondary text-sm whitespace-nowrap"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleExcluirPaciente(paciente.id)}
                      className={`btn text-sm whitespace-nowrap transition-all ${confirmDelete === paciente.id
                        ? 'btn-danger'
                        : 'btn-ghost text-[#e85d3f] hover:bg-[#e85d3f]/10'
                        }`}
                    >
                      <Trash2 className="h-4 w-4" />
                      {confirmDelete === paciente.id ? 'Confirmar?' : 'Excluir'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Estado vazio */}
        {!loading && pacientesFiltrados.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
          >
            <div className="card-content-lg text-center py-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#f5f3ef] to-[#e8e5df]">
                  <Search className="h-12 w-12 text-[#a8a199]" />
                </div>
              </motion.div>
              <h3 className="heading-secondary mb-3">
                Nenhum paciente encontrado
              </h3>
              <p className="text-muted max-w-md mx-auto">
                {searchTerm
                  ? 'Tente buscar por outro termo ou ajuste os filtros'
                  : 'Cadastre o primeiro paciente clicando no botão "Novo Paciente" acima'}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      <PacienteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        paciente={pacienteEditando || undefined}
        mode={modalMode}
      />
    </div >
  );
}
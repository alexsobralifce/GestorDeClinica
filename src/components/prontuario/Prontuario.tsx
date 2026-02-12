import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  FileText,
  Upload,
  Mic,
  Activity,
  Heart,
  AlertTriangle,
  Calendar,
  User,
  Phone,
  Mail,
  Download,
  Eye,
  Plus,
  Stethoscope,
  Clock,
  X,
  Pill,
  FileImage,
  Paperclip,
  Save,
  Printer,
  Share2,
} from 'lucide-react';
import { pacientesMock, prontuariosMock, profissionaisMock, especialidadeConfig } from '../../lib/types';
import type { RegistroProntuario } from '../../lib/types';

export function Prontuario() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'timeline' | 'documentos' | 'medicamentos'>('timeline');
  const [isRecording, setIsRecording] = useState(false);
  const [showNovoRegistro, setShowNovoRegistro] = useState(false);

  const paciente = pacientesMock.find(p => p.id === id);
  const registros = prontuariosMock
    .filter(p => p.pacienteId === id)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  if (!paciente) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-[#7a7369]">Paciente não encontrado</p>
          <Link to="/pacientes" className="mt-4 inline-block text-[#4a7c65] hover:underline">
            Voltar para lista de pacientes
          </Link>
        </div>
      </div>
    );
  }

  const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link to="/pacientes" className="inline-flex items-center gap-2 text-[#7a7369] hover:text-[#4a7c65]">
        <ArrowLeft className="h-4 w-4" />
        Voltar para pacientes
      </Link>

      {/* Header do Paciente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#4a7c65]/5 to-transparent" />
        
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Avatar */}
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4a7c65] to-[#3d6653] text-3xl font-bold text-white">
            {paciente.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>

          {/* Informações principais */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#2b2926]" style={{ fontFamily: 'var(--font-heading)' }}>
              {paciente.nome}
            </h1>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#7a7369]">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {calcularIdade(paciente.dataNascimento)} anos
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {paciente.telefone}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {paciente.email}
              </span>
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                {paciente.grupoSanguineo}
              </span>
            </div>

            {/* Alertas médicos */}
            {(paciente.alergias.length > 0 || paciente.condicoes.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {paciente.alergias.map(alergia => (
                  <span
                    key={alergia}
                    className="inline-flex items-center gap-1 rounded-full bg-[#fde8e3] px-3 py-1 text-sm font-medium text-[#7a2b1d]"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Alergia: {alergia}
                  </span>
                ))}
                {paciente.condicoes.map(condicao => (
                  <span
                    key={condicao}
                    className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-3 py-1 text-sm font-medium text-[#92400e]"
                  >
                    <Heart className="h-4 w-4" />
                    {condicao}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNovoRegistro(true)}
              className="btn-premium"
            >
              <Plus className="h-5 w-5" />
              Novo Registro
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary"
            >
              <Upload className="h-5 w-5" />
              Anexar Exame
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-4 border-b border-[#e8e5df]">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`relative pb-3 font-medium transition-colors ${
              activeTab === 'timeline'
                ? 'text-[#4a7c65]'
                : 'text-[#7a7369] hover:text-[#5c5650]'
            }`}
          >
            Timeline
            {activeTab === 'timeline' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4a7c65]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('documentos')}
            className={`relative pb-3 font-medium transition-colors ${
              activeTab === 'documentos'
                ? 'text-[#4a7c65]'
                : 'text-[#7a7369] hover:text-[#5c5650]'
            }`}
          >
            Documentos
            {activeTab === 'documentos' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4a7c65]"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('medicamentos')}
            className={`relative pb-3 font-medium transition-colors ${
              activeTab === 'medicamentos'
                ? 'text-[#4a7c65]'
                : 'text-[#7a7369] hover:text-[#5c5650]'
            }`}
          >
            Medicamentos
            {activeTab === 'medicamentos' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4a7c65]"
              />
            )}
          </button>
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <AnimatePresence mode="wait">
        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Timeline com linha vertical orgânica */}
            <div className="card relative">
              {/* Linha vertical - diferencial memorável */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3b82f6] via-[#10b981] via-[#8b5cf6] to-[#f59e0b] rounded-full opacity-20" />

              <div className="space-y-8">
                {registros.map((registro, index) => {
                  const profissional = profissionaisMock.find(p => p.id === registro.profissionalId);
                  const especialidade = especialidadeConfig[registro.especialidade];
                  const data = new Date(registro.data);

                  return (
                    <motion.div
                      key={registro.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-16"
                    >
                      {/* Marcador na linha */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                        className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg"
                        style={{ backgroundColor: especialidade.cor }}
                      >
                        <Stethoscope className="h-6 w-6 text-white" />
                      </motion.div>

                      {/* Card do registro */}
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="rounded-2xl border-2 p-6 transition-all hover:shadow-lg"
                        style={{
                          borderColor: especialidade.cor,
                          backgroundColor: especialidade.corClara,
                        }}
                      >
                        {/* Header */}
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-[#2b2926]">
                              {registro.titulo}
                            </h3>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#5c5650]">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {profissional?.nome}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {data.toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {data.toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                          <span
                            className="rounded-full px-3 py-1 text-xs font-medium text-white"
                            style={{ backgroundColor: especialidade.cor }}
                          >
                            {especialidade.label}
                          </span>
                        </div>

                        {/* Conteúdo */}
                        <div className="prose prose-sm max-w-none">
                          <p className="text-[#2b2926]">{registro.conteudo}</p>
                        </div>

                        {/* Anexos */}
                        {registro.anexos && registro.anexos.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium text-[#5c5650]">Anexos:</p>
                            {registro.anexos.map(anexo => (
                              <div
                                key={anexo.id}
                                className="flex items-center justify-between rounded-lg bg-white/50 p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-[#7a7369]" />
                                  <span className="text-sm text-[#2b2926]">{anexo.nome}</span>
                                </div>
                                <div className="flex gap-2">
                                  <button className="btn-icon">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button className="btn-icon">
                                    <Download className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}

                {registros.length === 0 && (
                  <div className="py-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-[#d4cfc5]" />
                    <p className="mt-4 text-[#7a7369]">
                      Nenhum registro no prontuário ainda
                    </p>
                    <button
                      onClick={() => setShowNovoRegistro(true)}
                      className="btn-primary mt-4"
                    >
                      Adicionar primeiro registro
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'documentos' && (
          <motion.div
            key="documentos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <p className="text-center text-[#7a7369]">
              Funcionalidade de documentos em desenvolvimento
            </p>
          </motion.div>
        )}

        {activeTab === 'medicamentos' && (
          <motion.div
            key="medicamentos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <p className="text-center text-[#7a7369]">
              Funcionalidade de medicamentos em desenvolvimento
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Novo Registro */}
      <AnimatePresence>
        {showNovoRegistro && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#2b2926]/50 backdrop-blur-sm"
              onClick={() => setShowNovoRegistro(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#2b2926]">
                  Novo Registro no Prontuário
                </h2>
                <button
                  onClick={() => setShowNovoRegistro(false)}
                  className="btn-icon"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                    Título
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Consulta de Rotina, Evolução Fisioterapêutica..."
                    className="input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                    Tipo de Registro
                  </label>
                  <select className="input">
                    <option value="consulta">Consulta</option>
                    <option value="evolucao">Evolução</option>
                    <option value="exame">Exame</option>
                    <option value="prescricao">Prescrição</option>
                  </select>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-[#5c5650]">
                      Conteúdo
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsRecording(!isRecording)}
                      className={`btn-ghost text-sm ${isRecording ? 'text-[#e85d3f]' : ''}`}
                    >
                      <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
                      {isRecording ? 'Gravando...' : 'Gravar por voz'}
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    className="input resize-none font-mono text-sm"
                    placeholder="Digite ou grave a evolução clínica..."
                  />
                  <p className="mt-2 text-xs text-[#a8a199]">
                    Use a gravação por voz para transcrição automática com IA
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNovoRegistro(false)}
                    className="btn-ghost flex-1"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Salvar Registro
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
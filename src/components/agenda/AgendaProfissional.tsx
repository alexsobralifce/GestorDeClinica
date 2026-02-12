import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Search,
  Filter,
  User,
  Phone,
  Mail,
  MapPin,
  Check,
  X,
  AlertCircle,
  Video,
  Users,
  Grid3x3,
  List,
  Download,
  Printer,
  MoreVertical,
} from 'lucide-react';
import { useAgendamentos } from '../../lib/AgendamentoContext';
import { pacientesMock, profissionaisMock, statusConfig, especialidadeConfig } from '../../lib/types';
import type { Agendamento } from '../../lib/types';

export function AgendaProfissional() {
  const { agendamentos, addAgendamento } = useAgendamentos();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [selectedEspecialidade, setSelectedEspecialidade] = useState<string | null>(null);
  const [selectedProfissional, setSelectedProfissional] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showNovoAgendamento, setShowNovoAgendamento] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    pacienteId: '',
    profissionalId: '',
    data: '',
    horaInicio: '',
    duracao: '30',
    tipo: 'primeira-consulta' as Agendamento['tipo'],
    sala: '',
    observacoes: '',
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];

  // Horários (8h às 19h)
  const horarios = Array.from({ length: 23 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  // Filtrar agendamentos
  const agendamentosFiltrados = agendamentos.filter(agendamento => {
    if (agendamento.data !== selectedDateStr) return false;

    const profissional = profissionaisMock.find(p => p.id === agendamento.profissionalId);
    const paciente = pacientesMock.find(p => p.id === agendamento.pacienteId);

    if (selectedEspecialidade && profissional?.especialidade !== selectedEspecialidade) {
      return false;
    }

    if (selectedProfissional && agendamento.profissionalId !== selectedProfissional) {
      return false;
    }

    if (selectedStatus && agendamento.status !== selectedStatus) {
      return false;
    }

    if (searchTerm && !paciente?.nome.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Agrupar por profissional
  const agendamentosPorProfissional = profissionaisMock.reduce((acc, prof) => {
    if (selectedProfissional && prof.id !== selectedProfissional) return acc;
    if (selectedEspecialidade && prof.especialidade !== selectedEspecialidade) return acc;

    acc[prof.id] = agendamentosFiltrados.filter(a => a.profissionalId === prof.id);
    return acc;
  }, {} as Record<string, Agendamento[]>);

  const profissionaisVisiveis = Object.keys(agendamentosPorProfissional);

  // Estatísticas do dia
  const totalAgendamentos = agendamentosFiltrados.length;
  const confirmados = agendamentosFiltrados.filter(a => a.status === 'confirmado').length;
  const pendentes = agendamentosFiltrados.filter(a => a.status === 'pendente').length;
  const concluidos = agendamentosFiltrados.filter(a => a.status === 'concluido').length;

  const calcularPosicao = (horaInicio: string, duracao: number) => {
    const [hora, minuto] = horaInicio.split(':').map(Number);
    const minutosDesde8h = (hora - 8) * 60 + minuto;
    const top = (minutosDesde8h / 30) * 60; // 60px por 30min
    const height = (duracao / 30) * 60;
    return { top, height };
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="heading-primary mb-0">Agenda Clínica</h1>
          <p className="text-muted mt-2">Gestão profissional de consultas e agendamentos</p>
        </div>
        <div className="cluster-lg">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary"
          >
            <Printer className="h-5 w-5" />
            Imprimir
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary"
          >
            <Download className="h-5 w-5" />
            Exportar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNovoAgendamento(true)}
            className="btn-premium"
          >
            <Plus className="h-5 w-5" />
            Novo Agendamento
          </motion.button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card hover:shadow-md transition-all"
        >
          <div className="card-content-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#7a7369] mb-1">Total</p>
                <p className="text-2xl font-bold text-[#2b2926]">{totalAgendamentos}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4a7c65]/10">
                <CalendarIcon className="h-5 w-5 text-[#4a7c65]" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card hover:shadow-md transition-all"
        >
          <div className="card-content-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#7a7369] mb-1">Confirmados</p>
                <p className="text-2xl font-bold text-[#10b981]">{confirmados}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10b981]/10">
                <Check className="h-5 w-5 text-[#10b981]" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card hover:shadow-md transition-all"
        >
          <div className="card-content-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#7a7369] mb-1">Pendentes</p>
                <p className="text-2xl font-bold text-[#f59e0b]">{pendentes}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f59e0b]/10">
                <Clock className="h-5 w-5 text-[#f59e0b]" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card hover:shadow-md transition-all"
        >
          <div className="card-content-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[#7a7369] mb-1">Concluídos</p>
                <p className="text-2xl font-bold text-[#3b82f6]">{concluidos}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b82f6]/10">
                <Check className="h-5 w-5 text-[#3b82f6]" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navegação e Filtros */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Navegação de Data */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#f5f3ef] rounded-xl p-1">
                <button
                  onClick={() => changeDate(-1)}
                  className="btn-icon-sm hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="px-4 min-w-[280px] text-center">
                  <p className="text-lg font-bold text-[#2b2926] capitalize">
                    {formatDate(selectedDate)}
                  </p>
                </div>
                <button
                  onClick={() => changeDate(1)}
                  className="btn-icon-sm hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={goToToday}
                className="btn-filter"
              >
                Hoje
              </button>
            </div>

            {/* Busca e Filtros */}
            <div className="flex flex-wrap gap-3 flex-1 lg:flex-initial">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7a7369]" />
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 text-sm"
                />
              </div>

              <div className="cluster">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`btn-filter ${viewMode === 'timeline' ? 'active' : ''}`}
                >
                  <List className="h-4 w-4" />
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`btn-filter ${viewMode === 'grid' ? 'active' : ''}`}
                >
                  <Grid3x3 className="h-4 w-4" />
                  Grade
                </button>
              </div>
            </div>
          </div>

          {/* Filtros Avançados */}
          <div className="mt-4 pt-4 border-t border-[#e8e5df]">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedEspecialidade(null);
                  setSelectedProfissional(null);
                  setSelectedStatus(null);
                }}
                className={`btn-filter ${!selectedEspecialidade && !selectedProfissional && !selectedStatus ? 'active' : ''}`}
              >
                Todos
              </button>

              {Object.entries(especialidadeConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedEspecialidade(selectedEspecialidade === key ? null : key)}
                  className={`btn-filter ${selectedEspecialidade === key ? 'active' : ''}`}
                  style={selectedEspecialidade === key ? { backgroundColor: config.cor, color: 'white', borderColor: config.cor } : {}}
                >
                  {config.label}
                </button>
              ))}

              <div className="w-px h-6 bg-[#e8e5df]" />

              {Object.entries(statusConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedStatus(selectedStatus === key ? null : key)}
                  className={`btn-filter ${selectedStatus === key ? 'active' : ''}`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: config.cor }}
                  />
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visualização Timeline */}
      {viewMode === 'timeline' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card"
        >
          <div className="card-content p-0 overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header com Profissionais */}
              <div className="grid border-b-2 border-[#e8e5df] bg-[#f5f3ef]" style={{ gridTemplateColumns: `120px repeat(${profissionaisVisiveis.length}, 1fr)` }}>
                <div className="p-4 border-r border-[#e8e5df]">
                  <p className="text-sm font-semibold text-[#5c5650]">Horário</p>
                </div>
                {profissionaisVisiveis.map(profId => {
                  const prof = profissionaisMock.find(p => p.id === profId)!;
                  const config = especialidadeConfig[prof.especialidade];
                  return (
                    <div key={profId} className="p-4 border-r border-[#e8e5df] last:border-r-0">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: config.cor }}
                        >
                          {prof.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#2b2926]">{prof.nome.split(' ')[0]}</p>
                          <p className="text-xs text-[#7a7369]">{config.label}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Timeline Grid */}
              <div className="relative">
                <div className="grid" style={{ gridTemplateColumns: `120px repeat(${profissionaisVisiveis.length}, 1fr)` }}>
                  {/* Coluna de Horários */}
                  <div className="border-r border-[#e8e5df]">
                    {horarios.map(horario => (
                      <div
                        key={horario}
                        className="h-[60px] px-4 py-2 border-b border-[#e8e5df] text-sm text-[#7a7369] font-medium"
                      >
                        {horario}
                      </div>
                    ))}
                  </div>

                  {/* Colunas de Profissionais */}
                  {profissionaisVisiveis.map(profId => {
                    const profAgendamentos = agendamentosPorProfissional[profId] || [];
                    const prof = profissionaisMock.find(p => p.id === profId)!;
                    const config = especialidadeConfig[prof.especialidade];

                    return (
                      <div key={profId} className="relative border-r border-[#e8e5df] last:border-r-0">
                        {/* Grade de Horários */}
                        {horarios.map(horario => (
                          <div
                            key={horario}
                            className="h-[60px] border-b border-[#e8e5df] hover:bg-[#faf9f7] transition-colors cursor-pointer"
                          />
                        ))}

                        {/* Agendamentos Posicionados */}
                        {profAgendamentos.map((agendamento, index) => {
                          const paciente = pacientesMock.find(p => p.id === agendamento.pacienteId)!;
                          const statusCfg = statusConfig[agendamento.status];
                          const { top, height } = calcularPosicao(agendamento.horaInicio, agendamento.duracao);

                          return (
                            <motion.div
                              key={agendamento.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="absolute left-1 right-1 rounded-lg p-2 cursor-pointer hover:shadow-lg transition-all overflow-hidden group"
                              style={{
                                top: `${top}px`,
                                height: `${Math.max(height - 2, 56)}px`,
                                backgroundColor: config.corClara,
                                borderLeft: `4px solid ${config.cor}`,
                              }}
                            >
                              <div className="flex flex-col h-full justify-between">
                                <div>
                                  <p className="text-sm font-bold text-[#2b2926] truncate">
                                    {paciente.nome}
                                  </p>
                                  <p className="text-xs text-[#5c5650] truncate">
                                    {agendamento.horaInicio} - {agendamento.tipo.replace('-', ' ')}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <span
                                    className="text-xs px-2 py-0.5 rounded-md font-medium"
                                    style={{
                                      backgroundColor: statusCfg.cor + '20',
                                      color: statusCfg.cor,
                                    }}
                                  >
                                    {statusCfg.label}
                                  </span>
                                  {agendamento.tipo === 'telemedicina' && (
                                    <Video className="h-3 w-3 text-[#3b82f6]" />
                                  )}
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-[#4a7c65]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Visualização em Grade */}
      {viewMode === 'grid' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {agendamentosFiltrados.length === 0 ? (
            <div className="col-span-full card">
              <div className="card-content-lg text-center">
                <CalendarIcon className="mx-auto h-16 w-16 text-[#d4cfc5] mb-4" />
                <h3 className="text-xl font-semibold text-[#2b2926] mb-2">Nenhum agendamento encontrado</h3>
                <p className="text-[#7a7369] mb-6">
                  Não há agendamentos para os filtros selecionados
                </p>
                <button
                  onClick={() => setShowNovoAgendamento(true)}
                  className="btn-primary"
                >
                  <Plus className="h-5 w-5" />
                  Criar Agendamento
                </button>
              </div>
            </div>
          ) : (
            agendamentosFiltrados.map((agendamento, index) => {
              const paciente = pacientesMock.find(p => p.id === agendamento.pacienteId)!;
              const profissional = profissionaisMock.find(p => p.id === agendamento.profissionalId)!;
              const statusCfg = statusConfig[agendamento.status];
              const espConfig = especialidadeConfig[profissional.especialidade];

              return (
                <motion.div
                  key={agendamento.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="card-content">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: espConfig.cor }}
                        >
                          {paciente.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-[#2b2926]">{paciente.nome}</p>
                          <p className="text-sm text-[#7a7369]">{profissional.nome}</p>
                        </div>
                      </div>
                      <button className="btn-icon-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-[#5c5650]">
                        <Clock className="h-4 w-4" />
                        <span>{agendamento.horaInicio} - {agendamento.duracao} minutos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#5c5650]">
                        <MapPin className="h-4 w-4" />
                        <span>Sala {agendamento.sala}</span>
                      </div>
                      {agendamento.tipo === 'telemedicina' && (
                        <div className="flex items-center gap-2 text-sm text-[#3b82f6]">
                          <Video className="h-4 w-4" />
                          <span>Telemedicina</span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#e8e5df]">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: statusCfg.cor + '20',
                          color: statusCfg.cor,
                          borderColor: statusCfg.cor + '40',
                        }}
                      >
                        {statusCfg.label}
                      </span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: espConfig.cor + '20',
                          color: espConfig.cor,
                          borderColor: espConfig.cor + '40',
                        }}
                      >
                        {espConfig.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      )}

      {/* Modal Novo Agendamento */}
      <AnimatePresence>
        {showNovoAgendamento && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#2b2926]/50 backdrop-blur-sm"
              onClick={() => setShowNovoAgendamento(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#2b2926]">Novo Agendamento</h2>
                <button onClick={() => setShowNovoAgendamento(false)} className="btn-icon">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form className="form-container p-0">
                <div className="form-grid">
                  <div className="field-group">
                    <label className="field-label">Paciente</label>
                    <select className="input-field">
                      <option value="">Selecione o paciente</option>
                      {pacientesMock.map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Profissional</label>
                    <select className="input-field">
                      <option value="">Selecione o profissional</option>
                      {profissionaisMock.map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Data</label>
                    <input type="date" className="input-field" />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Horário</label>
                    <input type="time" className="input-field" />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Duração (min)</label>
                    <select className="input-field">
                      <option value="30">30 minutos</option>
                      <option value="45">45 minutos</option>
                      <option value="60">60 minutos</option>
                      <option value="90">90 minutos</option>
                    </select>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Sala</label>
                    <input type="text" className="input-field" placeholder="Ex: 101" />
                  </div>

                  <div className="field-group field-span-2">
                    <label className="field-label">Tipo de Consulta</label>
                    <select className="input-field">
                      <option value="primeira-consulta">Primeira Consulta</option>
                      <option value="retorno">Retorno</option>
                      <option value="emergencia">Emergência</option>
                      <option value="telemedicina">Telemedicina</option>
                    </select>
                  </div>

                  <div className="field-group field-span-2">
                    <label className="field-label">Observações (opcional)</label>
                    <textarea className="input-field" rows={3} placeholder="Adicione observações..."></textarea>
                  </div>
                </div>

                <div className="form-submit flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNovoAgendamento(false)}
                    className="btn-ghost flex-1"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Agendar Consulta
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
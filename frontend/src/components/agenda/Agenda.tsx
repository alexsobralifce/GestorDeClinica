import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAgendamentos } from '../../lib/AgendamentoContext';
import { pacientesMock, profissionaisMock, statusConfig, especialidadeConfig } from '../../lib/types';
import type { Agendamento } from '../../lib/types';

import { useDevice } from '../../contexts/DeviceContext';
import { AgendaMobile } from '../mobile/AgendaMobile';

export function Agenda() {
  const { isMobile } = useDevice();
  const { agendamentos, addAgendamento } = useAgendamentos();

  if (isMobile) {
    return <AgendaMobile />;
  }
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEspecialidade, setSelectedEspecialidade] = useState<string | null>(null);
  const [selectedProfissional, setSelectedProfissional] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [showFilters, setShowFilters] = useState(false);
  const [showNovoAgendamento, setShowNovoAgendamento] = useState(false);

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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [searchPaciente, setSearchPaciente] = useState('');

  const especialidades = Object.entries(especialidadeConfig);

  // Filtrar agendamentos
  const agendamentosFiltrados = agendamentos.filter(agendamento => {
    const profissional = profissionaisMock.find(p => p.id === agendamento.profissionalId);

    if (selectedEspecialidade && profissional?.especialidade !== selectedEspecialidade) {
      return false;
    }

    if (selectedProfissional && agendamento.profissionalId !== selectedProfissional) {
      return false;
    }

    return true;
  });

  // Horários do dia (9h às 18h)
  const horarios = Array.from({ length: 18 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const profissionaisFiltrados = selectedEspecialidade
    ? profissionaisMock.filter(p => p.especialidade === selectedEspecialidade)
    : profissionaisMock;

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const agendamentosHoje = agendamentosFiltrados.filter(a => a.data === selectedDateStr);

  const pacientesFiltrados = pacientesMock.filter(p =>
    p.nome.toLowerCase().includes(searchPaciente.toLowerCase()) ||
    p.cpf.includes(searchPaciente)
  );

  const calcularHoraFim = (horaInicio: string, duracao: string) => {
    const [hora, minuto] = horaInicio.split(':').map(Number);
    const duracaoNum = parseInt(duracao);
    const totalMinutos = hora * 60 + minuto + duracaoNum;
    const novaHora = Math.floor(totalMinutos / 60);
    const novoMinuto = totalMinutos % 60;
    return `${novaHora.toString().padStart(2, '0')}:${novoMinuto.toString().padStart(2, '0')}`;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.pacienteId) errors.pacienteId = 'Selecione um paciente';
    if (!formData.profissionalId) errors.profissionalId = 'Selecione um profissional';
    if (!formData.data) errors.data = 'Selecione uma data';
    if (!formData.horaInicio) errors.horaInicio = 'Selecione um horário';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const horaFim = calcularHoraFim(formData.horaInicio, formData.duracao);

    const novoAgendamento: Omit<Agendamento, 'id'> = {
      pacienteId: formData.pacienteId,
      profissionalId: formData.profissionalId,
      data: formData.data,
      horaInicio: formData.horaInicio,
      horaFim: horaFim,
      duracao: parseInt(formData.duracao),
      tipo: formData.tipo,
      status: 'pendente',
      sala: formData.sala || undefined,
      observacoes: formData.observacoes || undefined,
    };

    addAgendamento(novoAgendamento);

    // Reset form
    setFormData({
      pacienteId: '',
      profissionalId: '',
      data: '',
      horaInicio: '',
      duracao: '30',
      tipo: 'primeira-consulta',
      sala: '',
      observacoes: '',
    });
    setSearchPaciente('');
    setFormErrors({});
    setShowNovoAgendamento(false);
  };

  const handlePacienteSelect = (pacienteId: string) => {
    setFormData(prev => ({ ...prev, pacienteId }));
    setSearchPaciente(pacientesMock.find(p => p.id === pacienteId)?.nome || '');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#2b2926]" style={{ fontFamily: 'var(--font-heading)' }}>
            Agenda
          </h1>
          <p className="mt-2 text-[#7a7369] capitalize">
            {formatDate(selectedDate)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2.5 ${showFilters ? 'bg-[#dce8e3] text-[#325143]' : ''}`}
          >
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNovoAgendamento(true)}
            className="btn-primary flex items-center gap-2.5"
          >
            <Plus className="h-5 w-5" />
            <span>Novo Agendamento</span>
          </motion.button>
        </div>
      </div>

      {/* Filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card overflow-hidden"
          >
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                  Especialidade
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedEspecialidade(null)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${selectedEspecialidade === null
                      ? 'bg-[#4a7c65] text-white'
                      : 'bg-[#f5f3ef] text-[#5c5650] hover:bg-[#e8e5df]'
                      }`}
                  >
                    Todas
                  </button>
                  {especialidades.map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedEspecialidade(key)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${selectedEspecialidade === key
                        ? 'text-white'
                        : 'hover:bg-opacity-20'
                        }`}
                      style={{
                        backgroundColor: selectedEspecialidade === key ? config.cor : config.corClara,
                        color: selectedEspecialidade === key ? 'white' : config.cor,
                      }}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                  Profissional
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedProfissional(null)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${selectedProfissional === null
                      ? 'bg-[#4a7c65] text-white'
                      : 'bg-[#f5f3ef] text-[#5c5650] hover:bg-[#e8e5df]'
                      }`}
                  >
                    Todos
                  </button>
                  {profissionaisFiltrados.map(profissional => (
                    <button
                      key={profissional.id}
                      onClick={() => setSelectedProfissional(profissional.id)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${selectedProfissional === profissional.id
                        ? 'bg-[#4a7c65] text-white'
                        : 'bg-[#f5f3ef] text-[#5c5650] hover:bg-[#e8e5df]'
                        }`}
                    >
                      {profissional.nome}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navegação de Data */}
      <div className="card">
        <div className="flex items-center justify-between">
          <button
            onClick={() => changeDate(-1)}
            className="btn-ghost"
          >
            <ChevronLeft className="h-5 w-5" />
            Anterior
          </button>

          <button
            onClick={() => setSelectedDate(new Date())}
            className="btn-secondary"
          >
            <CalendarIcon className="h-5 w-5" />
            Hoje
          </button>

          <button
            onClick={() => changeDate(1)}
            className="btn-ghost"
          >
            Próximo
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Grid de Agenda */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header com profissionais */}
            <div className="grid gap-4 border-b border-[#e8e5df] pb-4" style={{ gridTemplateColumns: '80px repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div className="text-sm font-medium text-[#7a7369]">Horário</div>
              {profissionaisFiltrados.map(profissional => {
                const especialidade = especialidadeConfig[profissional.especialidade];
                return (
                  <div key={profissional.id} className="text-center">
                    <div
                      className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: especialidade.cor }}
                    >
                      {profissional.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <p className="text-sm font-semibold text-[#2b2926]">
                      {profissional.nome.split(' ')[0]}
                    </p>
                    <p className="text-xs text-[#7a7369]">
                      {especialidade.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Grid de horários */}
            <div className="relative mt-4">
              {horarios.map((horario, index) => (
                <div
                  key={horario}
                  className="grid gap-4 border-b border-[#e8e5df] py-3"
                  style={{ gridTemplateColumns: '80px repeat(auto-fit, minmax(200px, 1fr))' }}
                >
                  <div className="text-sm font-medium text-[#7a7369]">
                    {horario}
                  </div>

                  {profissionaisFiltrados.map(profissional => {
                    const agendamento = agendamentosHoje.find(
                      a => a.profissionalId === profissional.id && a.horaInicio === horario
                    );

                    if (agendamento) {
                      const paciente = pacientesMock.find(p => p.id === agendamento.pacienteId);
                      const status = statusConfig[agendamento.status];
                      const especialidade = especialidadeConfig[profissional.especialidade];

                      return (
                        <motion.div
                          key={`${profissional.id}-${horario}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="relative cursor-pointer overflow-hidden rounded-xl p-3 shadow-md transition-shadow hover:shadow-lg"
                          style={{
                            backgroundColor: especialidade.corClara,
                            borderLeft: `4px solid ${especialidade.cor}`,
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#2b2926]">
                                {paciente?.nome}
                              </p>
                              <p className="mt-1 flex items-center gap-1 text-xs text-[#5c5650]">
                                <Clock className="h-3 w-3" />
                                {agendamento.horaInicio} - {agendamento.horaFim}
                              </p>
                              {agendamento.sala && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-[#5c5650]">
                                  <MapPin className="h-3 w-3" />
                                  {agendamento.sala}
                                </p>
                              )}
                            </div>
                            <span
                              className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium"
                              style={{
                                backgroundColor: status.corFundo,
                                color: status.cor,
                              }}
                            >
                              {status.label}
                            </span>
                          </div>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={`${profissional.id}-${horario}`}
                        whileHover={{ backgroundColor: 'rgba(74, 124, 101, 0.05)' }}
                        className="cursor-pointer rounded-xl border border-dashed border-[#d4cfc5] p-3 transition-colors"
                      >
                        <p className="text-center text-xs text-[#a8a199]">
                          Disponível
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#2b2926]">
                  Novo Agendamento
                </h2>
                <button
                  onClick={() => setShowNovoAgendamento(false)}
                  className="btn-icon"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                    Paciente *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a8a199] z-10" />
                    <input
                      type="text"
                      placeholder="Buscar paciente por nome ou CPF..."
                      className={`input pl-10 ${formErrors.pacienteId ? 'input-error' : ''}`}
                      value={searchPaciente}
                      onChange={e => {
                        setSearchPaciente(e.target.value);
                        if (!e.target.value) {
                          setFormData(prev => ({ ...prev, pacienteId: '' }));
                        }
                      }}
                    />
                    {searchPaciente && pacientesFiltrados.length > 0 && !formData.pacienteId && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute left-0 right-0 top-full mt-2 max-h-48 overflow-y-auto rounded-xl border-2 border-[#4a7c65]/20 bg-white shadow-xl z-20"
                      >
                        {pacientesFiltrados.map((paciente) => (
                          <button
                            key={paciente.id}
                            type="button"
                            onClick={() => handlePacienteSelect(paciente.id)}
                            className="flex w-full items-start gap-3 border-b border-[#e8e5df] p-3 text-left transition-colors hover:bg-[#f0f5f3] last:border-0"
                          >
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#4a7c65] to-[#3d6653] text-sm font-bold text-white">
                              {paciente.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#2b2926]">{paciente.nome}</p>
                              <p className="text-xs text-[#7a7369]">{paciente.cpf}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                  {formErrors.pacienteId && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-[#e85d3f]">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.pacienteId}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                      Data *
                    </label>
                    <input
                      type="date"
                      className={`input ${formErrors.data ? 'input-error' : ''}`}
                      value={formData.data}
                      onChange={e => setFormData(prev => ({ ...prev, data: e.target.value }))}
                    />
                    {formErrors.data && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-[#e85d3f]">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.data}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                      Horário *
                    </label>
                    <input
                      type="time"
                      className={`input ${formErrors.horaInicio ? 'input-error' : ''}`}
                      value={formData.horaInicio}
                      onChange={e => setFormData(prev => ({ ...prev, horaInicio: e.target.value }))}
                    />
                    {formErrors.horaInicio && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-[#e85d3f]">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.horaInicio}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                    Profissional *
                  </label>
                  <select
                    className={`input ${formErrors.profissionalId ? 'input-error' : ''}`}
                    value={formData.profissionalId}
                    onChange={e => setFormData(prev => ({ ...prev, profissionalId: e.target.value }))}
                  >
                    <option value="">Selecione um profissional...</option>
                    {profissionaisMock.map(prof => (
                      <option key={prof.id} value={prof.id}>
                        {prof.nome} - {especialidadeConfig[prof.especialidade].label}
                      </option>
                    ))}
                  </select>
                  {formErrors.profissionalId && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-[#e85d3f]">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.profissionalId}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                      Tipo de Consulta
                    </label>
                    <select
                      className="input"
                      value={formData.tipo}
                      onChange={e => setFormData(prev => ({ ...prev, tipo: e.target.value as Agendamento['tipo'] }))}
                    >
                      <option value="primeira-consulta">Primeira Consulta</option>
                      <option value="retorno">Retorno</option>
                      <option value="sessao-terapeutica">Sessão Terapêutica</option>
                      <option value="teleconsulta">Teleconsulta</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                      Duração
                    </label>
                    <select
                      className="input"
                      value={formData.duracao}
                      onChange={e => setFormData(prev => ({ ...prev, duracao: e.target.value }))}
                    >
                      <option value="30">30 minutos</option>
                      <option value="45">45 minutos</option>
                      <option value="60">1 hora</option>
                      <option value="90">1h 30min</option>
                      <option value="120">2 horas</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                    Sala (opcional)
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Ex: Consultório 1, Sala de Fisioterapia..."
                    value={formData.sala}
                    onChange={e => setFormData(prev => ({ ...prev, sala: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5c5650]">
                    Observações (opcional)
                  </label>
                  <textarea
                    rows={3}
                    className="input resize-none"
                    placeholder="Informações adicionais sobre a consulta..."
                    value={formData.observacoes}
                    onChange={e => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNovoAgendamento(false);
                      setFormErrors({});
                      setSearchPaciente('');
                    }}
                    className="btn-ghost flex-1"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    type="submit"
                    className="btn-primary flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle className="h-5 w-5" />
                    Confirmar Agendamento
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
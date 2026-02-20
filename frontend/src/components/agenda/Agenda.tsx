import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react';
import { statusConfig, especialidadeConfig } from '../../lib/types';

import { useDevice } from '../../contexts/DeviceContext';
import { AgendaMobile } from '../mobile/AgendaMobile';
import { NovoAgendamentoModal } from './NovoAgendamentoModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function Agenda() {
  const { isMobile } = useDevice();

  if (isMobile) {
    return <AgendaMobile />;
  }
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEspecialidade, setSelectedEspecialidade] = useState<string | null>(null);
  const [selectedProfissional, setSelectedProfissional] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showNovoAgendamento, setShowNovoAgendamento] = useState(false);

  // States de dados reais
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [profissionais, setProfissionais] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [appRes, pacRes, profRes] = await Promise.all([
        axios.get(`${API_URL}/appointments`, { headers }),
        axios.get(`${API_URL}/patients`, { headers }),
        axios.get(`${API_URL}/professionals`, { headers }),
      ]);
      setAgendamentos(Array.isArray(appRes.data) ? appRes.data : []);
      setPacientes(Array.isArray(pacRes.data) ? pacRes.data : []);
      setProfissionais(Array.isArray(profRes.data) ? profRes.data : []);
    } catch (err) {
      console.error('Erro ao carregar agenda:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const especialidades = Object.entries(especialidadeConfig);

  // Filtrar agendamentos
  const agendamentosFiltrados = agendamentos.filter(agendamento => {
    const profissional = profissionais.find(p => p.id === agendamento.professional_id);

    if (selectedEspecialidade && profissional?.specialty !== especialidadeConfig[selectedEspecialidade as keyof typeof especialidadeConfig]?.label) {
      return false;
    }

    if (selectedProfissional && agendamento.professional_id !== selectedProfissional) {
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
    ? profissionais.filter(p => p.specialty === especialidadeConfig[selectedEspecialidade as keyof typeof especialidadeConfig]?.label)
    : profissionais;

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const agendamentosHoje = agendamentosFiltrados.filter(a => {
    const dataAgendamento = a.appointment_date.split('T')[0];
    return dataAgendamento === selectedDateStr;
  });

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
                const especialidadeKey = Object.entries(especialidadeConfig).find(([, cfg]) => cfg.label === profissional.specialty)?.[0] || 'fisioterapia';
                const especialidade = especialidadeConfig[especialidadeKey as keyof typeof especialidadeConfig];
                return (
                  <div key={profissional.id} className="text-center">
                    <div
                      className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: profissional.color || especialidade.cor }}
                    >
                      {profissional.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </div>
                    <p className="text-sm font-semibold text-[#2b2926]">
                      {profissional.name.split(' ')[0]}
                    </p>
                    <p className="text-xs text-[#7a7369]">
                      {profissional.specialty}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Grid de horários */}
            <div className="relative mt-4">
              {horarios.map((horario) => (
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
                      a => a.professional_id === profissional.id && a.start_time.startsWith(horario)
                    );

                    if (agendamento) {
                      const paciente = pacientes.find(p => p.id === agendamento.patient_id);

                      const statusMap: Record<string, string> = {
                        'scheduled': 'pendente',
                        'confirmed': 'confirmado',
                        'completed': 'realizado',
                        'cancelled': 'cancelado',
                        'no_show': 'faltou'
                      };
                      const statusKey = statusMap[agendamento.status] || 'pendente';
                      const status = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig['pendente'];

                      const especialidadeKey = Object.entries(especialidadeConfig).find(([, cfg]) => cfg.label === profissional.specialty)?.[0] || 'fisioterapia';
                      const especialidade = especialidadeConfig[especialidadeKey as keyof typeof especialidadeConfig];

                      return (
                        <motion.div
                          key={`${profissional.id}-${horario}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="relative cursor-pointer overflow-hidden rounded-xl p-3 shadow-md transition-shadow hover:shadow-lg"
                          style={{
                            backgroundColor: especialidade.corClara,
                            borderLeft: `4px solid ${profissional.color || especialidade.cor}`,
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#2b2926]">
                                {paciente?.name || agendamento.patient_name}
                              </p>
                              <p className="mt-1 flex items-center gap-1 text-xs text-[#5c5650]">
                                <Clock className="h-3 w-3" />
                                {agendamento.start_time.slice(0, 5)} - {agendamento.end_time.slice(0, 5)}
                              </p>
                              {agendamento.notes && (
                                <p className="mt-1 text-xs text-[#5c5650] truncate">
                                  {agendamento.notes}
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

      {/* Modal Novo Agendamento (Importado) */}
      <NovoAgendamentoModal
        isOpen={showNovoAgendamento}
        onClose={() => setShowNovoAgendamento(false)}
        onSuccess={() => {
          fetchData(); // Recarrega do banco de dados quando finaliza
        }}
      />
    </div>
  );
}
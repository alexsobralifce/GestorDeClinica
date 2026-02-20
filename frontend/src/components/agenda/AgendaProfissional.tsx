import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../lib/api/client';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Search,
  Grid3x3,
  List,
  Download,
  Printer,
  MoreVertical,
  MapPin,
  Check,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { statusConfig, especialidadeConfig } from '../../lib/types';
import { NovoAgendamentoModal } from './NovoAgendamentoModal';



export function AgendaProfissional() {
  const { isDark } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [selectedEspecialidade, setSelectedEspecialidade] = useState<string | null>(null);
  const [selectedProfissional, setSelectedProfissional] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showNovoAgendamento, setShowNovoAgendamento] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [profissionais, setProfissionais] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [appRes, pacRes, profRes] = await Promise.all([
        apiClient.get('/appointments'),
        apiClient.get('/patients'),
        apiClient.get('/professionals'),
      ]);
      setAgendamentos(Array.isArray(appRes.data) ? appRes.data : []);
      setPacientes(Array.isArray(pacRes.data) ? pacRes.data : []);
      setProfissionais(Array.isArray(profRes.data) ? profRes.data : []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
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
  const agendamentosFiltrados = agendamentos.filter((agendamento: any) => {
    const dataAgendamento = agendamento.appointment_date?.split('T')[0];
    if (dataAgendamento !== selectedDateStr) return false;

    const profissional = profissionais.find((p: any) => p.id === agendamento.professional_id);
    const paciente = pacientes.find((p: any) => p.id === agendamento.patient_id);

    if (selectedEspecialidade && profissional?.specialty !== especialidadeConfig[selectedEspecialidade as keyof typeof especialidadeConfig]?.label) {
      return false;
    }

    if (selectedProfissional && agendamento.professional_id !== selectedProfissional) {
      return false;
    }

    // Status mapping para filtro
    const statusMap: Record<string, string> = {
      'scheduled': 'pendente',
      'confirmed': 'confirmado',
      'completed': 'realizado',
      'cancelled': 'cancelado',
      'no_show': 'faltou'
    };
    const agendamentoStatusKey = statusMap[agendamento.status] || 'pendente';

    if (selectedStatus && agendamentoStatusKey !== selectedStatus) {
      return false;
    }

    if (searchTerm && !paciente?.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Agrupar por profissional
  const agendamentosPorProfissional = profissionais.reduce((acc: any, prof: any) => {
    if (selectedProfissional && prof.id !== selectedProfissional) return acc;
    if (selectedEspecialidade && prof.specialty !== especialidadeConfig[selectedEspecialidade as keyof typeof especialidadeConfig]?.label) return acc;

    acc[prof.id] = agendamentosFiltrados.filter((a: any) => a.professional_id === prof.id);
    return acc;
  }, {} as Record<string, any[]>);

  const profissionaisVisiveis = Object.keys(agendamentosPorProfissional);

  // Estatísticas do dia
  const totalAgendamentos = agendamentosFiltrados.length;
  const statusMap: Record<string, string> = {
    'scheduled': 'pendente',
    'confirmed': 'confirmado',
    'completed': 'realizado',
    'cancelled': 'cancelado',
    'no_show': 'faltou'
  };
  const confirmados = agendamentosFiltrados.filter((a: any) => statusMap[a.status] === 'confirmado').length;
  const pendentes = agendamentosFiltrados.filter((a: any) => statusMap[a.status] === 'pendente' || !statusMap[a.status]).length;
  const concluidos = agendamentosFiltrados.filter((a: any) => statusMap[a.status] === 'realizado').length;

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
      <div className="card mt-6">
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
                  const prof = profissionais.find((p: any) => p.id === profId)!;
                  const especialidadeKey = Object.entries(especialidadeConfig).find(([, cfg]) => cfg.label === prof.specialty)?.[0] || 'fisioterapia';
                  const config = especialidadeConfig[especialidadeKey as keyof typeof especialidadeConfig];
                  return (
                    <div key={profId} className="p-4 border-r border-[#e8e5df] last:border-r-0">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: prof.color || config.cor }}
                        >
                          {prof.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#2b2926]">{prof.name.split(' ')[0]}</p>
                          <p className="text-xs text-[#7a7369]">{prof.specialty || config.label}</p>
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
                    const prof = profissionais.find((p: any) => p.id === profId)!;
                    const especialidadeKey = Object.entries(especialidadeConfig).find(([, cfg]) => cfg.label === prof.specialty)?.[0] || 'fisioterapia';
                    const config = especialidadeConfig[especialidadeKey as keyof typeof especialidadeConfig];

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
                        {profAgendamentos.map((agendamento: any, index: number) => {
                          const paciente = pacientes.find((p: any) => p.id === agendamento.patient_id)!;
                          const statusMap: Record<string, string> = {
                            'scheduled': 'pendente',
                            'confirmed': 'confirmado',
                            'completed': 'realizado',
                            'cancelled': 'cancelado',
                            'no_show': 'faltou'
                          };
                          const statusKey = statusMap[agendamento.status] || 'pendente';
                          const statusCfg = statusConfig[statusKey as keyof typeof statusConfig];

                          // Ajuste de "start_time" da API que vem como HH:MM:SS
                          const horaInicioFormatada = agendamento.start_time?.substring(0, 5) || '12:00';
                          const { top, height } = calcularPosicao(horaInicioFormatada, agendamento.duration || 60);

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
                                backgroundColor: isDark ? '#1e1e22' : config.corClara,
                                borderLeft: `4px solid ${config.cor}`,
                                borderRight: isDark ? `1px solid ${config.cor}40` : undefined,
                                borderTop: isDark ? `1px solid ${config.cor}40` : undefined,
                                borderBottom: isDark ? `1px solid ${config.cor}40` : undefined,
                              }}
                            >
                              <div className="flex flex-col h-full justify-between">
                                <div>
                                  <p className="text-sm font-bold text-[#2b2926] dark:text-[#e8e8ef] truncate">
                                    {paciente.name}
                                  </p>
                                  <p className="text-xs text-[#5c5650] dark:text-[#a8a199] truncate">
                                    {horaInicioFormatada} - {(agendamento.specialty || 'Sessão')}
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
            agendamentosFiltrados.map((agendamento: any, index: number) => {
              const paciente = pacientes.find((p: any) => p.id === agendamento.patient_id);
              const profissional = profissionais.find((p: any) => p.id === agendamento.professional_id);
              if (!paciente || !profissional) return null;

              const statusMap: Record<string, string> = {
                'scheduled': 'pendente',
                'confirmed': 'confirmado',
                'completed': 'realizado',
                'cancelled': 'cancelado',
                'no_show': 'faltou'
              };
              const statusKey = statusMap[agendamento.status] || 'pendente';
              const statusCfg = statusConfig[statusKey as keyof typeof statusConfig];

              const especialidadeKey = Object.entries(especialidadeConfig).find(([, cfg]) => cfg.label === profissional.specialty)?.[0] || 'fisioterapia';
              const espConfig = especialidadeConfig[especialidadeKey as keyof typeof especialidadeConfig];

              const horaInicioFormatada = agendamento.start_time?.substring(0, 5) || '12:00';

              return (
                <motion.div
                  key={agendamento.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card hover:shadow-lg transition-all cursor-pointer group dark:bg-[#1e1e22] dark:border-[#2a2a30]"
                >
                  <div className="card-content">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: espConfig.cor }}
                        >
                          {paciente.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-[#2b2926] dark:text-[#e8e8ef]">{paciente.name}</p>
                          <p className="text-sm text-[#7a7369] dark:text-[#a8a199]">{profissional.name}</p>
                        </div>
                      </div>
                      <button className="btn-icon-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-[#5c5650] dark:text-[#b0b0be]">
                        <Clock className="h-4 w-4" />
                        <span>{horaInicioFormatada} - {agendamento.duration} minutos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#5c5650] dark:text-[#b0b0be]">
                        <MapPin className="h-4 w-4" />
                        <span>Sala {agendamento.notes || '101'}</span>
                      </div>
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
      <NovoAgendamentoModal
        isOpen={showNovoAgendamento}
        onClose={() => setShowNovoAgendamento(false)}
        onSuccess={() => {
          // TODO: Mudar AgendaProfissional para consumir dados reais no futuro
          window.location.reload(); // Provisório para forçar o recarregamento na timeline
        }}
      />
    </div>
  );
}
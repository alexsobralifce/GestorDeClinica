import { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import {
  BottomNavigation,
  MobileAppBar,
  FAB,
  DatePickerScroll,
  BottomSheet,
} from '../mobile';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AgendaMobile() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [showNovoAgendamento, setShowNovoAgendamento] = useState(false);

  // Dados de exemplo
  const consultas = [
    {
      id: '1',
      horario: '08:00',
      paciente: 'Maria Silva',
      idade: 45,
      convenio: 'Unimed',
      profissional: 'Dr. João Santos',
      especialidade: 'Cardiologia',
      status: 'confirmado',
      tipo: 'Retorno',
    },
    {
      id: '2',
      horario: '09:00',
      paciente: 'Carlos Oliveira',
      idade: 32,
      convenio: 'Particular',
      profissional: 'Dra. Ana Costa',
      especialidade: 'Clínica Geral',
      status: 'confirmado',
      tipo: 'Primeira consulta',
    },
    {
      id: '3',
      horario: '10:30',
      paciente: 'Beatriz Almeida',
      idade: 58,
      convenio: 'Amil',
      profissional: 'Dr. Pedro Lima',
      especialidade: 'Ortopedia',
      status: 'pendente',
      tipo: 'Avaliação',
    },
    {
      id: '4',
      horario: '14:00',
      paciente: 'Rafael Santos',
      idade: 28,
      convenio: 'Particular',
      profissional: 'Dr. João Santos',
      especialidade: 'Cardiologia',
      status: 'confirmado',
      tipo: 'Exame',
    },
    {
      id: '5',
      horario: '15:30',
      paciente: 'Juliana Costa',
      idade: 35,
      convenio: 'Bradesco',
      profissional: 'Dra. Ana Costa',
      especialidade: 'Clínica Geral',
      status: 'confirmado',
      tipo: 'Consulta',
    },
  ];

  // Agrupar consultas por período
  const agruparPorPeriodo = () => {
    const manha = consultas.filter((c) => parseInt(c.horario) < 12);
    const tarde = consultas.filter(
      (c) => parseInt(c.horario) >= 12 && parseInt(c.horario) < 18
    );
    const noite = consultas.filter((c) => parseInt(c.horario) >= 18);

    return { manha, tarde, noite };
  };

  const { manha, tarde, noite } = agruparPorPeriodo();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-[#10b981]/10 text-[#10b981]';
      case 'pendente':
        return 'bg-[#f59e0b]/10 text-[#f59e0b]';
      case 'cancelado':
        return 'bg-[#e85d3f]/10 text-[#e85d3f]';
      default:
        return 'bg-[#e8e5df] text-[#7a7369]';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getEspecialidadeColor = (especialidade: string) => {
    switch (especialidade) {
      case 'Cardiologia':
        return '#3b82f6';
      case 'Ortopedia':
        return '#10b981';
      case 'Clínica Geral':
        return '#8b5cf6';
      default:
        return '#4a7c65';
    }
  };

  const renderConsultas = (lista: typeof consultas, periodo: string) => {
    if (lista.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-[#7a7369] uppercase tracking-wider mb-3 px-4">
          {periodo} ({lista.length} {lista.length === 1 ? 'consulta' : 'consultas'})
        </h3>
        <div className="space-y-2">
          {lista.map((consulta, index) => (
            <motion.div
              key={consulta.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-4 mx-4 active:bg-[#faf9f7] transition-colors"
              style={{
                borderLeft: `4px solid ${getEspecialidadeColor(consulta.especialidade)}`,
              }}
            >
              {/* Header: Horário e Status */}
              <div className="flex items-start justify-between mb-3">
                <div className="text-xl font-bold text-[#4a7c65]">{consulta.horario}</div>
                <span className={`text-xs px-2 py-1 rounded-md ${getStatusColor(consulta.status)}`}>
                  {getStatusLabel(consulta.status)}
                </span>
              </div>

              {/* Paciente Info */}
              <div className="mb-3">
                <div className="text-base font-semibold text-[#2b2926] mb-1">
                  {consulta.paciente}
                </div>
                <div className="text-sm text-[#7a7369]">
                  {consulta.idade} anos • {consulta.convenio}
                </div>
              </div>

              {/* Profissional Info */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                  style={{ backgroundColor: getEspecialidadeColor(consulta.especialidade) }}
                >
                  {consulta.profissional.split(' ')[1][0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#2b2926]">{consulta.profissional}</div>
                  <div
                    className="text-xs"
                    style={{ color: getEspecialidadeColor(consulta.especialidade) }}
                  >
                    {consulta.especialidade}
                  </div>
                </div>
              </div>

              {/* Tipo */}
              <div className="text-xs text-[#7a7369] bg-[#f5f3ef] px-2 py-1 rounded-md inline-block">
                {consulta.tipo}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-nav">
      {/* App Bar */}
      <MobileAppBar
        title="Agenda"
        actions={
          <button
            onClick={() => setShowFilters(true)}
            className="mobile-app-bar-icon-btn"
            aria-label="Filtros"
          >
            <Filter />
          </button>
        }
      />

      {/* Date Picker Horizontal Scroll */}
      <DatePickerScroll
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        hasEventsOn={[new Date()]}
      />

      {/* Selected Date Display */}
      <div className="px-4 py-3 bg-white border-b border-[#e8e5df]">
        <div className="text-lg font-semibold text-[#2b2926]">
          {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </div>
        <div className="text-sm text-[#7a7369]">
          {consultas.length} {consultas.length === 1 ? 'consulta agendada' : 'consultas agendadas'}
        </div>
      </div>

      {/* Lista de Consultas Agrupadas */}
      <div className="py-4">
        {renderConsultas(manha, 'Manhã')}
        {renderConsultas(tarde, 'Tarde')}
        {renderConsultas(noite, 'Noite')}

        {consultas.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-[#f5f3ef] rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-[#a8a199]" />
            </div>
            <div className="text-lg font-semibold text-[#2b2926] mb-2">
              Nenhuma consulta agendada
            </div>
            <div className="text-sm text-[#7a7369] mb-6">
              Toque no botão + para adicionar uma nova consulta
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sheet - Filtros */}
      <BottomSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros"
        footer={
          <>
            <button className="btn-secondary btn-mobile-full">Limpar</button>
            <button className="btn-primary btn-mobile-full">Aplicar Filtros</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="field-label">Profissional</label>
            <select className="input-field">
              <option>Todos</option>
              <option>Dr. João Santos</option>
              <option>Dra. Ana Costa</option>
              <option>Dr. Pedro Lima</option>
            </select>
          </div>

          <div>
            <label className="field-label">Especialidade</label>
            <select className="input-field">
              <option>Todas</option>
              <option>Cardiologia</option>
              <option>Ortopedia</option>
              <option>Clínica Geral</option>
            </select>
          </div>

          <div>
            <label className="field-label">Status</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-6 h-6" defaultChecked />
                <span>Confirmado</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-6 h-6" defaultChecked />
                <span>Pendente</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-6 h-6" />
                <span>Cancelado</span>
              </label>
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* FAB */}
      <FAB onClick={() => setShowNovoAgendamento(true)} icon={<Plus />} />
    </div>
  );
}

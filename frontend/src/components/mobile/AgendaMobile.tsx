import { useState, useMemo } from 'react';
import { Plus, Calendar, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  MobileAppBar,
  FAB,
} from '../mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameDay, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAgendamentos } from '../../lib/AgendamentoContext';
import { pacientesMock, profissionaisMock, statusConfig, especialidadeConfig } from '../../lib/types';
import { useNavigate } from 'react-router-dom';
import { Agendamento } from '../../lib/types';

export function AgendaMobile() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { agendamentos } = useAgendamentos();

  // Gerar dias da semana atual para o calendário
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Filtrar agendamentos do dia selecionado
  const agendamentosDoDia = useMemo(() => {
    return agendamentos.filter(a => {
      // Correção de fuso horário simples: comparar string YYYY-MM-DD
      const dataAgendamento = a.data;
      const dataSelecionada = format(selectedDate, 'yyyy-MM-dd');
      return dataAgendamento === dataSelecionada;
    }).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  }, [agendamentos, selectedDate]);

  // Agrupar por período
  const { manha, tarde, noite } = useMemo(() => {
    const m: Agendamento[] = [], t: Agendamento[] = [], n: Agendamento[] = [];
    agendamentosDoDia.forEach(a => {
      const hora = parseInt(a.horaInicio.split(':')[0]);
      if (hora < 12) m.push(a);
      else if (hora < 18) t.push(a);
      else n.push(a);
    });
    return { manha: m, tarde: t, noite: n };
  }, [agendamentosDoDia]);

  const renderAgendamentoCard = (agendamento: any, index: number) => {
    const paciente = pacientesMock.find(p => p.id === agendamento.pacienteId);
    const profissional = profissionaisMock.find(p => p.id === agendamento.profissionalId);
    const status = statusConfig[agendamento.status as keyof typeof statusConfig];
    const especialidade = especialidadeConfig[profissional?.especialidade || 'medicina'];

    return (
      <motion.div
        key={agendamento.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => navigate(`/dashboard/agenda/${agendamento.id}`)}
        className="bg-white rounded-xl p-4 shadow-sm border border-[#e8e5df] active:bg-[#faf9f7] transition-all relative overflow-hidden mb-3"
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: especialidade.cor }}
        />

        <div className="flex items-start justify-between mb-3 pl-2">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#4a7c65]" />
            <span className="text-lg font-bold text-[#2b2926]">{agendamento.horaInicio}</span>
          </div>
          <span
            className="text-xs px-2 py-1 rounded-md font-medium"
            style={{ backgroundColor: status.corFundo, color: status.cor }}
          >
            {status.label}
          </span>
        </div>

        <div className="pl-2 space-y-2">
          <div>
            <h3 className="font-semibold text-[#2b2926] text-base">{paciente?.nome}</h3>
            <p className="text-xs text-[#7a7369]">{paciente?.telefone}</p>
          </div>

          <div className="flex items-center justify-between text-xs text-[#7a7369] pt-2 border-t border-[#f5f3ef]">
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: especialidade.cor }}
              />
              <span>{profissional?.nome.split(' ')[0]}</span>
            </div>
            <span>{especialidade.label}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderPeriodo = (lista: any[], titulo: string) => {
    if (lista.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-xs font-bold text-[#7a7369] uppercase tracking-wider mb-3 ml-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7a7369]"></span>
          {titulo}
        </h3>
        {lista.map((a, i) => renderAgendamentoCard(a, i))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-nav">
      <MobileAppBar
        title="Agenda"
        actions={
          <button className="p-2 rounded-full hover:bg-black/5 text-[#4a7c65]">
            <Search size={22} />
          </button>
        }
      />

      {/* Calendar Strip */}
      <div className="bg-white border-b border-[#e8e5df] sticky top-[60px] z-30 pt-2 pb-4 shadow-sm">
        <div className="flex items-center justify-between px-4 mb-4">
          <button onClick={() => setSelectedDate(subDays(selectedDate, 7))} className="p-1 text-[#7a7369]">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-sm font-semibold text-[#2b2926] capitalize">
            {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <button onClick={() => setSelectedDate(addDays(selectedDate, 7))} className="p-1 text-[#7a7369]">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex justify-between px-2">
          {weekDays.map((day, idx) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center justify-center w-10 h-14 rounded-2xl transition-all ${isSelected
                  ? 'bg-[#4a7c65] text-white shadow-md scale-105'
                  : 'text-[#7a7369] hover:bg-[#f5f3ef]'
                  }`}
              >
                <span className="text-xs font-medium mb-1 capitalize">
                  {format(day, 'EEE', { locale: ptBR }).replace('.', '')}
                </span>
                <span className={`text-base font-bold ${isSelected ? 'text-white' : isToday ? 'text-[#4a7c65]' : 'text-[#2b2926]'
                  }`}>
                  {format(day, 'd')}
                </span>
                {isToday && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-[#4a7c65] mt-1"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div className="px-4 py-6">
        <div className="mb-4 text-sm text-[#7a7369]">
          {agendamentosDoDia.length === 0 ? 'Nenhum agendamento' : `${agendamentosDoDia.length} agendamentos para hoje`}
        </div>

        {agendamentosDoDia.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate.toISOString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPeriodo(manha, 'Manhã')}
              {renderPeriodo(tarde, 'Tarde')}
              {renderPeriodo(noite, 'Noite')}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-[#7a7369]">
            <div className="w-16 h-16 bg-[#e8e5df] rounded-full flex items-center justify-center mb-4 text-[#5c5650]">
              <Calendar size={32} />
            </div>
            <p className="font-medium">Agenda livre</p>
            <p className="text-sm opacity-70">Nenhum paciente agendado para este dia.</p>
          </div>
        )}
      </div>

      <FAB
        onClick={() => { }} // TODO: Abrir modal de novo agendamento
        icon={<Plus size={24} />}
      />
    </div>
  );
}

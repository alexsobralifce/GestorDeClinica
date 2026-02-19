import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  UserPlus,
  FileText,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { FAB } from '../mobile';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAgendamentos } from '../../lib/AgendamentoContext';
import { pacientesMock, profissionaisMock, statusConfig, especialidadeConfig } from '../../lib/types';

export function DashboardMobile() {
  const navigate = useNavigate();
  const { agendamentos } = useAgendamentos();

  // Estatísticas
  const hoje = new Date().toISOString().split('T')[0];
  const agendamentosHoje = agendamentos.filter(a => a.data === hoje);
  const confirmados = agendamentosHoje.filter(a => a.status === 'confirmado').length;
  const pendentes = agendamentosHoje.filter(a => a.status === 'pendente').length;

  // Próximas consultas (Hoje e Futuro)
  const hojeDate = new Date();
  hojeDate.setHours(0, 0, 0, 0);

  const proximasConsultas = agendamentos
    .filter(a => {
      const dataAgendamento = new Date(a.data);
      // Ajuste de timezone simplificado
      const dataAgendamentoLocal = new Date(
        dataAgendamento.getUTCFullYear(),
        dataAgendamento.getUTCMonth(),
        dataAgendamento.getUTCDate()
      );
      return dataAgendamentoLocal >= hojeDate;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.data}T${a.horaInicio}`);
      const dateB = new Date(`${b.data}T${b.horaInicio}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  const summaryData = [
    {
      icon: <Calendar size={24} />,
      value: agendamentosHoje.length.toString(),
      label: 'Hoje',
      color: '#4a7c65',
      bgColor: '#dce8e3',
    },
    {
      icon: <CheckCircle size={24} />,
      value: confirmados.toString(),
      label: 'Confirmados',
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      icon: <Clock size={24} />,
      value: pendentes.toString(),
      label: 'Pendentes',
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      icon: <Users size={24} />,
      value: pacientesMock.length.toString(),
      label: 'Pacientes',
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
  ];

  const quickActions = [
    {
      icon: <UserPlus size={32} />,
      label: 'Novo Paciente',
      onClick: () => navigate('/dashboard/pacientes'), // Ajustado para rota correta
    },
    {
      icon: <Calendar size={32} />,
      label: 'Agendamento',
      onClick: () => navigate('/dashboard/agenda'), // Simplificado para navegar para agenda
    },
    {
      icon: <FileText size={32} />,
      label: 'Prontuário',
      onClick: () => navigate('/dashboard/prontuario'),
    },
    {
      icon: <DollarSign size={32} />,
      label: 'Financeiro',
      onClick: () => navigate('/dashboard/financeiro'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-nav">
      {/* Header com Gradiente */}
      <div
        className="pt-safe px-4 pb-6"
        style={{
          background: 'linear-gradient(135deg, #4a7c65 0%, #3d6653 100%)',
        }}
      >
        <div className="flex items-center justify-between mb-6 mt-4">
          <div>
            <h1 className="text-white text-2xl font-bold mb-1">Visão Geral</h1>
            <p className="text-white/80 text-sm">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>

        {/* Summary Cards - Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 snap-x pb-2">
          {summaryData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[110px] bg-white rounded-xl p-3 snap-start flex flex-col items-center text-center shadow-sm"
            >
              <div
                className="mb-2 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: item.bgColor, color: item.color }}
              >
                {item.icon}
              </div>
              <div className="text-xl font-bold text-[#2b2926] leading-tight">{item.value}</div>
              <div className="text-xs text-[#7a7369] font-medium mt-1">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-8">
        {/* Seção: Próximas Consultas */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#2b2926]">Próximos Agendamentos</h2>
            <button
              onClick={() => navigate('/dashboard/agenda')}
              className="text-sm text-[#4a7c65] font-semibold"
            >
              Ver agenda
            </button>
          </div>

          <div className="space-y-3">
            {proximasConsultas.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-xl border border-dashed border-[#d4cfc5]">
                <p className="text-[#7a7369]">Nenhum agendamento próximo</p>
              </div>
            ) : (
              proximasConsultas.map((agendamento, index) => {
                const paciente = pacientesMock.find(p => p.id === agendamento.pacienteId);
                const profissional = profissionaisMock.find(p => p.id === agendamento.profissionalId);
                const status = statusConfig[agendamento.status];
                const especialidade = especialidadeConfig[profissional?.especialidade || 'medicina'];

                return (
                  <motion.div
                    key={agendamento.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => navigate('/dashboard/agenda')} // Leva para a agenda por enquanto
                    className="bg-white rounded-xl p-4 border border-[#e8e5df] active:bg-[#faf9f7] transition-all relative overflow-hidden shadow-sm"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: especialidade.cor }}
                    />

                    <div className="flex items-start justify-between mb-2 pl-2">
                      <div>
                        <div className="text-lg font-bold text-[#2b2926] leading-none mb-1">
                          {agendamento.horaInicio}
                        </div>
                        <div className="text-xs text-[#7a7369]">
                          {new Date(agendamento.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </div>
                      </div>

                      <span
                        className="text-xs px-2 py-1 rounded-md font-medium"
                        style={{ backgroundColor: status.corFundo, color: status.cor }}
                      >
                        {status.label}
                      </span>
                    </div>

                    <div className="pl-2">
                      <div className="text-base font-semibold text-[#2b2926] mb-0.5">
                        {paciente?.nome}
                      </div>
                      <div className="text-xs text-[#7a7369] flex items-center gap-1">
                        <span style={{ color: especialidade.cor }} className="font-medium">
                          {profissional?.nome.split(' ')[0]} {profissional?.nome.split(' ').pop()}
                        </span>
                        <span>•</span>
                        <span>{especialidade.label}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* Seção: Ações Rápidas */}
        <section>
          <h2 className="text-lg font-bold text-[#2b2926] mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className="bg-white rounded-xl p-4 border border-[#e8e5df] flex flex-col items-center justify-center gap-3 min-h-[110px] shadow-sm active:bg-[#faf9f7] active:border-[#4a7c65] transition-colors"
              >
                <div className="text-[#4a7c65] bg-[#dce8e3] p-2 rounded-lg">{action.icon}</div>
                <span className="text-sm font-semibold text-[#2b2926] text-center">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Alertas (Se houver pendentes) */}
        {pendentes > 0 && (
          <section>
            <h2 className="text-lg font-bold text-[#2b2926] mb-3">
              Atenção
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#fffbeb] rounded-xl p-4 border border-[#fcd34d] shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="text-[#f59e0b] mt-0.5">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#92400e] mb-1">
                    {pendentes} agendamentos pendentes
                  </div>
                  <div className="text-xs text-[#b45309]">
                    Verifique a agenda para confirmar ou remarcar solicitações.
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}
      </div>

      <FAB
        onClick={() => navigate('/dashboard/agenda')}
        label="Novo"
        variant="extended"
      />
    </div>
  );
}
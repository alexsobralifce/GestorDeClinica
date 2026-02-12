import { useState } from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  UserPlus,
  FileText,
  Pill,
  AlertCircle,
} from 'lucide-react';
import { BottomNavigation, FAB } from '../mobile';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export function DashboardMobile() {
  const navigate = useNavigate();
  const [showNovoAgendamento, setShowNovoAgendamento] = useState(false);

  // Dados de exemplo
  const summaryData = [
    {
      icon: <Calendar size={32} />,
      value: '12',
      label: 'Consultas hoje',
      color: '#4a7c65',
    },
    {
      icon: <Clock size={32} />,
      value: '3',
      label: 'Aguardando',
      color: '#f59e0b',
    },
    {
      icon: <DollarSign size={32} />,
      value: 'R$ 45,8k',
      label: 'Receita do mês',
      color: '#10b981',
    },
    {
      icon: <Users size={32} />,
      value: '156',
      label: 'Pacientes ativos',
      color: '#3b82f6',
    },
  ];

  const proximasConsultas = [
    {
      id: '1',
      horario: '14:00',
      paciente: 'Maria Silva',
      tipo: 'Consulta de retorno',
      profissional: 'Dr. João Santos',
    },
    {
      id: '2',
      horario: '15:00',
      paciente: 'Carlos Oliveira',
      tipo: 'Primeira consulta',
      profissional: 'Dra. Ana Costa',
    },
    {
      id: '3',
      horario: '16:30',
      paciente: 'Beatriz Almeida',
      tipo: 'Avaliação',
      profissional: 'Dr. João Santos',
    },
  ];

  const quickActions = [
    {
      icon: <UserPlus size={32} />,
      label: 'Novo Paciente',
      onClick: () => navigate('/pacientes/novo'),
    },
    {
      icon: <Calendar size={32} />,
      label: 'Agendamento',
      onClick: () => setShowNovoAgendamento(true),
    },
    {
      icon: <FileText size={32} />,
      label: 'Prescrição',
      onClick: () => navigate('/prontuario/prescricao'),
    },
    {
      icon: <Pill size={32} />,
      label: 'Atestado',
      onClick: () => navigate('/prontuario/atestado'),
    },
  ];

  const alertas = [
    {
      id: '1',
      tipo: 'warning',
      titulo: '3 pagamentos pendentes',
      descricao: 'Total: R$ 1.850,00',
    },
    {
      id: '2',
      tipo: 'info',
      titulo: '5 consultas para confirmar',
      descricao: 'Para amanhã, 16/02',
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
            <h1 className="text-white text-2xl font-bold mb-1">Olá, Dr. João</h1>
            <p className="text-white/80 text-sm">Segunda, 15 de Janeiro</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-semibold">JS</span>
          </div>
        </div>

        {/* Summary Cards - Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 snap-x">
          {summaryData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[140px] bg-white rounded-xl p-4 snap-start"
            >
              <div style={{ color: item.color }} className="mb-2">
                {item.icon}
              </div>
              <div className="text-2xl font-bold text-[#2b2926] mb-1">{item.value}</div>
              <div className="text-xs text-[#7a7369]">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Seção: Agenda de Hoje */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#2b2926]">Agenda de Hoje</h2>
            <button
              onClick={() => navigate('/agenda')}
              className="text-sm text-[#4a7c65] font-medium"
            >
              Ver tudo →
            </button>
          </div>

          <div className="space-y-2">
            {proximasConsultas.map((consulta, index) => (
              <motion.div
                key={consulta.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/agenda/${consulta.id}`)}
                className="bg-white rounded-xl p-4 border-l-4 border-[#4a7c65] active:bg-[#faf9f7] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-xl font-bold text-[#4a7c65]">{consulta.horario}</div>
                  <span className="text-xs bg-[#10b981]/10 text-[#10b981] px-2 py-1 rounded-md">
                    Confirmado
                  </span>
                </div>
                <div className="text-base font-semibold text-[#2b2926] mb-1">
                  {consulta.paciente}
                </div>
                <div className="text-sm text-[#7a7369] mb-2">{consulta.tipo}</div>
                <div className="flex items-center gap-2 text-xs text-[#7a7369]">
                  <div className="w-6 h-6 rounded-full bg-[#4a7c65]/10 flex items-center justify-center">
                    <span className="text-[#4a7c65] text-xs font-semibold">
                      {consulta.profissional.split(' ')[1][0]}
                    </span>
                  </div>
                  {consulta.profissional}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Seção: Ações Rápidas */}
        <section>
          <h2 className="text-lg font-semibold text-[#2b2926] mb-3">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className="bg-white rounded-xl p-4 border border-[#e8e5df] flex flex-col items-center justify-center gap-2 min-h-[100px] active:bg-[#faf9f7] transition-colors"
              >
                <div className="text-[#4a7c65]">{action.icon}</div>
                <span className="text-sm font-medium text-[#2b2926] text-center">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Seção: Alertas e Notificações */}
        <section>
          <h2 className="text-lg font-semibold text-[#2b2926] mb-3">
            Alertas e Notificações
          </h2>
          <div className="space-y-2">
            {alertas.map((alerta) => (
              <motion.div
                key={alerta.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl p-4 border-l-4 ${
                  alerta.tipo === 'warning' ? 'border-[#f59e0b]' : 'border-[#3b82f6]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      alerta.tipo === 'warning'
                        ? 'bg-[#f59e0b]/10 text-[#f59e0b]'
                        : 'bg-[#3b82f6]/10 text-[#3b82f6]'
                    }`}
                  >
                    <AlertCircle size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#2b2926] mb-1">
                      {alerta.titulo}
                    </div>
                    <div className="text-sm text-[#7a7369]">{alerta.descricao}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* FAB */}
      <FAB
        onClick={() => setShowNovoAgendamento(true)}
        label="Nova Consulta"
        variant="extended"
      />
    </div>
  );
}
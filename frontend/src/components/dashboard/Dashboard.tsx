import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  UserPlus,
  Activity
} from 'lucide-react';
import { useAgendamentos } from '../../lib/AgendamentoContext';
import { pacientesMock, profissionaisMock, statusConfig, especialidadeConfig } from '../../lib/types';
import { useDevice } from '../../contexts/DeviceContext';
import { DashboardMobile } from '../mobile/DashboardMobile';

export function Dashboard() {
  const { isMobile } = useDevice();
  const { agendamentos } = useAgendamentos();

  if (isMobile) {
    return <DashboardMobile />;
  }

  // Estatísticas
  const hoje = new Date().toISOString().split('T')[0];
  const agendamentosHoje = agendamentos.filter(a => a.data === hoje);
  const confirmados = agendamentosHoje.filter(a => a.status === 'confirmado').length;
  const pendentes = agendamentosHoje.filter(a => a.status === 'pendente').length;

  const hojeDate = new Date();
  hojeDate.setHours(0, 0, 0, 0);

  const proximosAgendamentos = agendamentos
    .filter(a => {
      const dataAgendamento = new Date(a.data);
      // Ajusta timezone se necessário ou garante comparação correta de datas
      // A string YYYY-MM-DD é interpretada como UTC, então usamos o timezone offset para garantir dia local correto
      // Ou simplificamente comparamos apenas dia/mes/ano ou timestamps zerados
      const dataAgendamentoLocal = new Date(
        dataAgendamento.getUTCFullYear(),
        dataAgendamento.getUTCMonth(),
        dataAgendamento.getUTCDate()
      );

      return dataAgendamentoLocal >= hojeDate;
    })
    .sort((a, b) => {
      // Ordenar por data e hora
      const dateA = new Date(`${a.data}T${a.horaInicio}`);
      const dateB = new Date(`${b.data}T${b.horaInicio}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  const stats = [
    {
      label: 'Consultas Hoje',
      value: agendamentosHoje.length,
      change: '+12%',
      trend: 'up',
      icon: Calendar,
      color: '#4a7c65',
      bgColor: '#dce8e3',
    },
    {
      label: 'Confirmadas',
      value: confirmados,
      change: `${confirmados} de ${agendamentosHoje.length}`,
      trend: 'neutral',
      icon: CheckCircle,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      label: 'Pendentes',
      value: pendentes,
      change: 'Aguardando confirmação',
      trend: 'neutral',
      icon: Clock,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      label: 'Total Pacientes',
      value: pacientesMock.length,
      change: '+3 este mês',
      trend: 'up',
      icon: Users,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-[#2b2926]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-[#7a7369]"
        >
          Bem-vindo de volta, Dr. Carlos. Aqui está um resumo de hoje.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="card card-hover"
            >
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-[#7a7369]">{stat.label}</p>
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                      className="mt-2 text-4xl font-bold text-[#2b2926]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {stat.value}
                    </motion.p>
                    <div className="mt-2 flex items-center gap-1 text-sm">
                      {stat.trend === 'up' && (
                        <TrendingUp className="h-4 w-4 text-[#10b981]" />
                      )}
                      <span className={stat.trend === 'up' ? 'text-[#10b981]' : 'text-[#7a7369]'}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <Icon className="h-6 w-6" style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Próximos Agendamentos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card lg:col-span-2"
        >
          <div className="mb-6 flex items-center justify-between pl-3">
            <div>
              <h3 className="text-xl font-semibold text-[#2b2926]">
                Próximos Agendamentos
              </h3>
              <p className="mt-1 text-sm text-[#7a7369]">
                Agenda dos próximos dias
              </p>
            </div>
            <Link to="/dashboard/agenda" className="btn-ghost text-sm">
              Ver agenda completa
            </Link>
          </div>

          <div className="space-y-3">
            {proximosAgendamentos.map((agendamento, index) => {
              const paciente = pacientesMock.find(p => p.id === agendamento.pacienteId);
              const profissional = profissionaisMock.find(p => p.id === agendamento.profissionalId);
              const status = statusConfig[agendamento.status];
              const especialidade = especialidadeConfig[profissional?.especialidade || 'medicina'];

              return (
                <motion.div
                  key={agendamento.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex items-center gap-4 rounded-xl border border-[#e8e5df] p-4 transition-all hover:border-[#4a7c65] hover:shadow-md"
                >
                  {/* Avatar do Paciente */}
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: especialidade.cor }}
                  >
                    {paciente?.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>

                  <div
                    className="h-12 w-1 rounded-full"
                    style={{ backgroundColor: especialidade.cor }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-[#2b2926]">
                          {paciente?.nome}
                        </p>
                        <p className="text-sm text-[#7a7369]">
                          {profissional?.nome} • {especialidade.label}
                        </p>
                      </div>
                      <span
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: status.corFundo,
                          color: status.cor,
                        }}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-[#7a7369]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(agendamento.data).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {agendamento.horaInicio}
                      </span>
                      {agendamento.sala && (
                        <span>{agendamento.sala}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Ações Rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card space-y-4"
        >
          <h3 className="text-xl font-semibold text-[#2b2926]">
            Ações Rápidas
          </h3>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-[#4a7c65] to-[#3d6653] p-4 text-left text-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Novo Agendamento</p>
                <p className="text-sm text-white/80">Agendar consulta</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center gap-3 rounded-xl bg-[#f5f3ef] p-4 text-left transition-all hover:bg-[#e8e5df]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dbeafe]">
                <FileText className="h-5 w-5 text-[#3b82f6]" />
              </div>
              <div>
                <p className="font-semibold text-[#2b2926]">Novo Prontuário</p>
                <p className="text-sm text-[#7a7369]">Registrar atendimento</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center gap-3 rounded-xl bg-[#f5f3ef] p-4 text-left transition-all hover:bg-[#e8e5df]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fef3c7]">
                <Users className="h-5 w-5 text-[#f59e0b]" />
              </div>
              <div>
                <p className="font-semibold text-[#2b2926]">Buscar Paciente</p>
                <p className="text-sm text-[#7a7369]">Ver histórico</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center gap-3 rounded-xl bg-[#f5f3ef] p-4 text-left transition-all hover:bg-[#e8e5df]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ede9fe]">
                <Activity className="h-5 w-5 text-[#8b5cf6]" />
              </div>
              <div>
                <p className="font-semibold text-[#2b2926]">Relatórios</p>
                <p className="text-sm text-[#7a7369]">Visualizar métricas</p>
              </div>
            </motion.button>
          </div>

          {/* Alertas */}
          <div className="mt-6 space-y-3 rounded-xl bg-[#fef3c7] p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#f59e0b]" />
              <div>
                <p className="text-sm font-semibold text-[#92400e]">
                  {pendentes} confirmações pendentes
                </p>
                <p className="mt-1 text-xs text-[#92400e]/80">
                  Verifique os agendamentos que precisam de confirmação
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profissionais em Atendimento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h3 className="mb-6 text-xl font-semibold text-[#2b2926]">
          Status dos Profissionais
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profissionaisMock.map((profissional, index) => {
            const especialidade = especialidadeConfig[profissional.especialidade];
            const agendamentosHojeProfissional = agendamentosHoje.filter(
              a => a.profissionalId === profissional.id
            );

            return (
              <motion.div
                key={profissional.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="rounded-xl border-2 border-[#e8e5df] p-4 transition-all hover:border-[#4a7c65]"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ backgroundColor: especialidade.cor }}
                  >
                    {profissional.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[#2b2926]">
                      {profissional.nome}
                    </p>
                    <p className="text-xs text-[#7a7369]">
                      {especialidade.label}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-[#10b981]" />
                      <span className="text-xs text-[#7a7369]">
                        {agendamentosHojeProfissional.length} consultas hoje
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
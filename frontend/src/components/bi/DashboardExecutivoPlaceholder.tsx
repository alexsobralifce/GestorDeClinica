import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Activity, Sparkles } from 'lucide-react';

export function DashboardExecutivoPlaceholder() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#2b2926]" style={{ fontFamily: 'var(--font-heading)' }}>
          Dashboard Executivo
        </h1>
        <p className="mt-2 text-[#7a7369]">
          Visão estratégica do negócio com métricas-chave e previsões inteligentes
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#4a7c65] to-[#3d6653]">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-[#7a7369] mb-1">Faturamento</p>
          <p className="text-3xl font-bold text-[#2b2926] mb-2">R$ 245.680</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#4a7c65] font-medium">↗ 15.3%</span>
            <span className="text-[#a8a199]">vs mês anterior</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c89f7a]/10">
              <Users className="h-6 w-6 text-[#c89f7a]" />
            </div>
          </div>
          <p className="text-sm text-[#7a7369] mb-1">Ticket Médio</p>
          <p className="text-3xl font-bold text-[#2b2926] mb-2">R$ 385</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#4a7c65] font-medium">↗ 8.1%</span>
            <span className="text-[#a8a199]">vs mês anterior</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6b9dd8]/10">
              <Activity className="h-6 w-6 text-[#6b9dd8]" />
            </div>
          </div>
          <p className="text-sm text-[#7a7369] mb-1">Taxa Ocupação</p>
          <p className="text-3xl font-bold text-[#2b2926] mb-2">87%</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#4a7c65] font-medium">↗ 3.2%</span>
            <span className="text-[#a8a199]">vs mês anterior</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e85d3f]/10">
              <BarChart3 className="h-6 w-6 text-[#e85d3f]" />
            </div>
          </div>
          <p className="text-sm text-[#7a7369] mb-1">NPS Score</p>
          <p className="text-3xl font-bold text-[#2b2926] mb-2">82</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#4a7c65] font-medium">↗ 5 pontos</span>
            <span className="text-[#a8a199]">vs mês anterior</span>
          </div>
        </motion.div>
      </div>

      {/* IA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-8 bg-gradient-to-br from-[#4a7c65]/10 via-[#6b9dd8]/5 to-[#c89f7a]/10 border-2 border-[#4a7c65]/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-8 w-8 text-[#4a7c65]" />
          <div>
            <h3 className="text-2xl font-bold text-[#2b2926]" style={{ fontFamily: 'var(--font-heading)' }}>
              Previsões Inteligentes com IA
            </h3>
            <p className="text-sm text-[#7a7369]">
              Análises preditivas para tomada de decisão estratégica
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-white/50">
            <p className="text-sm font-medium text-[#5c5650] mb-2">Faturamento Próximo Mês</p>
            <p className="text-2xl font-bold text-[#2b2926]">R$ 268.400</p>
            <p className="text-xs text-[#7a7369] mt-1">IC: R$ 245k - R$ 292k</p>
          </div>
          
          <div className="p-4 rounded-xl bg-white/50">
            <p className="text-sm font-medium text-[#5c5650] mb-2">Ocupação Próxima Semana</p>
            <p className="text-2xl font-bold text-[#2b2926]">91%</p>
            <p className="text-xs text-[#7a7369] mt-1">12 horários disponíveis</p>
          </div>
          
          <div className="p-4 rounded-xl bg-white/50">
            <p className="text-sm font-medium text-[#5c5650] mb-2">Risco de Churn</p>
            <p className="text-2xl font-bold text-[#e85d3f]">8 pacientes</p>
            <p className="text-xs text-[#7a7369] mt-1">Requerem atenção</p>
          </div>
        </div>
      </motion.div>

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-12 text-center"
      >
        <h2 className="text-2xl font-bold text-[#2b2926] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Dashboard Completo em Desenvolvimento
        </h2>
        <p className="text-[#7a7369] max-w-2xl mx-auto">
          Visualizações interativas, análises por especialidade, top profissionais, 
          horários de pico, procedimentos mais realizados e muito mais.
        </p>
      </motion.div>
    </div>
  );
}

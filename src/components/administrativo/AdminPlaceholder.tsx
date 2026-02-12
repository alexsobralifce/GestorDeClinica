import { motion } from 'motion/react';
import { Briefcase, Users, Building2, Settings } from 'lucide-react';

export function AdminPlaceholder() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#2b2926]" style={{ fontFamily: 'var(--font-heading)' }}>
          Administrativo
        </h1>
        <p className="mt-2 text-[#7a7369]">
          Gestão de profissionais, convênios e configurações do sistema
        </p>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8 text-center hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4a7c65] to-[#3d6653]">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#2b2926] mb-2">Profissionais</h3>
          <p className="text-sm text-[#7a7369] mb-4">
            Cadastro completo, vínculo, financeiro e permissões
          </p>
          <div className="text-3xl font-bold text-[#4a7c65]">12</div>
          <p className="text-xs text-[#7a7369]">profissionais ativos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8 text-center hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c89f7a]/10">
              <Building2 className="h-8 w-8 text-[#c89f7a]" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#2b2926] mb-2">Convênios</h3>
          <p className="text-sm text-[#7a7369] mb-4">
            Contratos, tabelas de preços e regras de autorização
          </p>
          <div className="text-3xl font-bold text-[#c89f7a]">8</div>
          <p className="text-xs text-[#7a7369]">convênios ativos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-8 text-center hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6b9dd8]/10">
              <Settings className="h-8 w-8 text-[#6b9dd8]" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#2b2926] mb-2">Configurações</h3>
          <p className="text-sm text-[#7a7369] mb-4">
            Clínica, agenda, financeiro, notificações e segurança
          </p>
          <div className="text-3xl font-bold text-[#6b9dd8]">100%</div>
          <p className="text-xs text-[#7a7369]">sistema configurado</p>
        </motion.div>
      </div>

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-12 text-center bg-gradient-to-br from-[#4a7c65]/5 to-transparent"
      >
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4a7c65] to-[#3d6653]">
            <Briefcase className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-[#2b2926] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Módulos Administrativos em Desenvolvimento
        </h2>
        <p className="text-lg text-[#7a7369] mb-8 max-w-2xl mx-auto">
          Cadastro multi-step de profissionais, gestão completa de convênios com tabelas de preços, 
          e configurações avançadas do sistema estão sendo implementados.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 rounded-xl bg-white border-2 border-[#e8e5df]">
            <h4 className="font-bold text-[#2b2926] mb-2">Profissionais</h4>
            <ul className="text-sm text-[#7a7369] space-y-1 text-left">
              <li>• Cadastro completo em 5 etapas</li>
              <li>• Gestão de vínculo e financeiro</li>
              <li>• Configuração de agenda</li>
              <li>• Controle de permissões RBAC</li>
            </ul>
          </div>
          
          <div className="p-6 rounded-xl bg-white border-2 border-[#e8e5df]">
            <h4 className="font-bold text-[#2b2926] mb-2">Convênios</h4>
            <ul className="text-sm text-[#7a7369] space-y-1 text-left">
              <li>• Gestão de contratos</li>
              <li>• Tabelas de preços</li>
              <li>• Regras de autorização</li>
              <li>• Integração com portais</li>
            </ul>
          </div>
          
          <div className="p-6 rounded-xl bg-white border-2 border-[#e8e5df]">
            <h4 className="font-bold text-[#2b2926] mb-2">Configurações</h4>
            <ul className="text-sm text-[#7a7369] space-y-1 text-left">
              <li>• Dados da clínica</li>
              <li>• Regras de agenda</li>
              <li>• Parâmetros financeiros</li>
              <li>• Segurança e auditoria</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

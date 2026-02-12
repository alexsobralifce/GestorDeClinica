import { useState } from 'react';
import { Filter, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import {
  BottomNavigation,
  MobileAppBar,
  TabsMobile,
  BottomSheet,
} from '../mobile';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function FinanceiroMobile() {
  const [activeTab, setActiveTab] = useState('receber');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('todos');

  // Dados de exemplo
  const summaryData = [
    {
      icon: <DollarSign size={32} />,
      value: 'R$ 45.890',
      label: 'Saldo Atual',
      change: '+12%',
      changePositive: true,
      color: '#4a7c65',
    },
    {
      icon: <TrendingUp size={32} />,
      value: 'R$ 28.450',
      label: 'A Receber (30d)',
      change: '18 contas',
      changePositive: true,
      color: '#10b981',
    },
    {
      icon: <TrendingDown size={32} />,
      value: 'R$ 12.300',
      label: 'A Pagar (30d)',
      change: '7 contas',
      changePositive: false,
      color: '#e85d3f',
    },
    {
      icon: <DollarSign size={32} />,
      value: 'R$ 89.200',
      label: 'Receita do Mês',
      change: '+8%',
      changePositive: true,
      color: '#3b82f6',
    },
  ];

  const contasReceber = [
    {
      id: '1',
      descricao: 'Consulta - Maria Silva',
      beneficiario: 'Maria Silva',
      vencimento: new Date(),
      valor: 250.0,
      status: 'pendente',
      convenio: 'Unimed',
    },
    {
      id: '2',
      descricao: 'Exame - Carlos Oliveira',
      beneficiario: 'Carlos Oliveira',
      vencimento: new Date(Date.now() + 86400000), // +1 dia
      valor: 180.0,
      status: 'pendente',
      convenio: 'Particular',
    },
    {
      id: '3',
      descricao: 'Consulta - Beatriz Almeida',
      beneficiario: 'Beatriz Almeida',
      vencimento: new Date(Date.now() - 86400000), // -1 dia
      valor: 300.0,
      status: 'vencido',
      convenio: 'Amil',
    },
  ];

  const contasPagar = [
    {
      id: '1',
      descricao: 'Aluguel Clínica',
      pagador: 'Imobiliária XYZ',
      vencimento: new Date(Date.now() + 172800000), // +2 dias
      valor: 3500.0,
      status: 'pendente',
      categoria: 'Infraestrutura',
    },
    {
      id: '2',
      descricao: 'Material Hospitalar',
      pagador: 'MedSupply',
      vencimento: new Date(Date.now() + 604800000), // +7 dias
      valor: 1200.0,
      status: 'pendente',
      categoria: 'Suprimentos',
    },
  ];

  const tabs = [
    { id: 'receber', label: `A Receber (${contasReceber.length})` },
    { id: 'pagar', label: `A Pagar (${contasPagar.length})` },
  ];

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'pendente', label: 'Pendente' },
    { id: 'vencido', label: 'Vencido' },
    { id: 'pago', label: 'Pago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago':
        return 'bg-[#10b981]/10 text-[#10b981]';
      case 'pendente':
        return 'bg-[#f59e0b]/10 text-[#f59e0b]';
      case 'vencido':
        return 'bg-[#e85d3f]/10 text-[#e85d3f]';
      default:
        return 'bg-[#e8e5df] text-[#7a7369]';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pago':
        return 'Pago';
      case 'pendente':
        return 'Pendente';
      case 'vencido':
        return 'Vencido';
      default:
        return status;
    }
  };

  const getVencimentoBadge = (vencimento: Date) => {
    const hoje = new Date();
    const diff = Math.floor((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      return { label: 'Vencido', color: 'bg-[#e85d3f] text-white' };
    } else if (diff === 0) {
      return { label: 'Hoje', color: 'bg-[#f59e0b] text-white' };
    } else if (diff <= 3) {
      return { label: `${diff}d`, color: 'bg-[#f59e0b]/20 text-[#f59e0b]' };
    } else {
      return { label: format(vencimento, 'dd/MM'), color: 'bg-[#e8e5df] text-[#7a7369]' };
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] pb-nav">
      {/* App Bar */}
      <MobileAppBar
        title="Financeiro"
        actions={
          <div className="flex gap-1">
            <button
              onClick={() => setShowFilters(true)}
              className="mobile-app-bar-icon-btn"
              aria-label="Filtros"
            >
              <Filter />
            </button>
            <button className="mobile-app-bar-icon-btn" aria-label="Exportar">
              <Download />
            </button>
          </div>
        }
      />

      {/* Summary Cards - Horizontal Scroll */}
      <div className="bg-white py-4 border-b border-[#e8e5df]">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 snap-x">
          {summaryData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[160px] bg-gradient-to-br from-white to-[#faf9f7] rounded-xl p-4 border border-[#e8e5df] snap-start"
            >
              <div style={{ color: item.color }} className="mb-2">
                {item.icon}
              </div>
              <div className="text-xl font-bold text-[#2b2926] mb-1">{item.value}</div>
              <div className="text-xs text-[#7a7369] mb-2">{item.label}</div>
              <div
                className={`text-xs font-medium ${
                  item.changePositive ? 'text-[#10b981]' : 'text-[#e85d3f]'
                }`}
              >
                {item.change}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chart (Simplificado - pode ser expandido) */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 border border-[#e8e5df]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#2b2926]">Fluxo de Caixa</h3>
            <select className="text-sm border border-[#e8e5df] rounded-lg px-3 py-1">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Este mês</option>
            </select>
          </div>

          {/* Chart Placeholder - Implementar com biblioteca */}
          <div className="h-[200px] bg-gradient-to-br from-[#f5f3ef] to-white rounded-lg flex items-center justify-center border border-[#e8e5df]">
            <div className="text-center">
              <TrendingUp size={48} className="text-[#4a7c65] mx-auto mb-2" />
              <div className="text-sm text-[#7a7369]">Gráfico de Fluxo de Caixa</div>
              <div className="text-xs text-[#a8a199]">(Implementar com Recharts)</div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
              <span className="text-sm text-[#7a7369]">Entradas: R$ 89k</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#e85d3f] rounded-full"></div>
              <span className="text-sm text-[#7a7369]">Saídas: R$ 43k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <TabsMobile tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Filter Chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide bg-white border-b border-[#e8e5df]">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedFilter === filter.id
                ? 'bg-[#4a7c65] text-white'
                : 'bg-[#f5f3ef] text-[#5c5650]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Lista de Contas */}
      <div className="p-4 space-y-3">
        {activeTab === 'receber' &&
          contasReceber.map((conta, index) => {
            const vencimentoBadge = getVencimentoBadge(conta.vencimento);
            return (
              <motion.div
                key={conta.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-4 border-l-4 border-[#10b981]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-base font-semibold text-[#2b2926] mb-1">
                      {conta.descricao}
                    </div>
                    <div className="text-sm text-[#7a7369]">{conta.beneficiario}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#10b981]">
                      R$ {conta.valor.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-md ${vencimentoBadge.color}`}>
                    {vencimentoBadge.label}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-md ${getStatusColor(conta.status)}`}>
                    {getStatusLabel(conta.status)}
                  </span>
                  <span className="text-xs bg-[#f5f3ef] text-[#5c5650] px-2 py-1 rounded-md">
                    {conta.convenio}
                  </span>
                </div>
              </motion.div>
            );
          })}

        {activeTab === 'pagar' &&
          contasPagar.map((conta, index) => {
            const vencimentoBadge = getVencimentoBadge(conta.vencimento);
            return (
              <motion.div
                key={conta.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-4 border-l-4 border-[#e85d3f]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-base font-semibold text-[#2b2926] mb-1">
                      {conta.descricao}
                    </div>
                    <div className="text-sm text-[#7a7369]">{conta.pagador}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#e85d3f]">
                      R$ {conta.valor.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-md ${vencimentoBadge.color}`}>
                    {vencimentoBadge.label}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-md ${getStatusColor(conta.status)}`}>
                    {getStatusLabel(conta.status)}
                  </span>
                  <span className="text-xs bg-[#f5f3ef] text-[#5c5650] px-2 py-1 rounded-md">
                    {conta.categoria}
                  </span>
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Bottom Sheet - Filtros */}
      <BottomSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros Avançados"
        footer={
          <>
            <button className="btn-secondary btn-mobile-full">Limpar</button>
            <button className="btn-primary btn-mobile-full">Aplicar</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="field-label">Período</label>
            <select className="input-field">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
              <option>Este mês</option>
              <option>Personalizado</option>
            </select>
          </div>

          <div>
            <label className="field-label">Categoria</label>
            <select className="input-field">
              <option>Todas</option>
              <option>Consultas</option>
              <option>Exames</option>
              <option>Procedimentos</option>
            </select>
          </div>

          <div>
            <label className="field-label">Valor</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="input-field" placeholder="Min" />
              <input type="number" className="input-field" placeholder="Max" />
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

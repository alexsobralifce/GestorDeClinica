import { useState } from 'react';
import { Filter, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import {
  MobileAppBar,
  TabsMobile,
  BottomSheet,
} from '../mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useFluxoCaixa } from '../../lib/contexts/FluxoCaixaContext';

interface FinanceiroMobileProps {
  initialTab?: string;
}

export function FinanceiroMobile({ initialTab = 'receber' }: FinanceiroMobileProps) {
  const { projecao, fluxos, filtros, aplicarFiltros } = useFluxoCaixa();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('todos');

  // Summary Data from Projecao
  const summaryData = [
    {
      icon: <DollarSign size={32} />,
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(projecao.saldoFinal),
      label: 'Saldo Projetado',
      change: `${projecao.comparativoMesAnterior.saldo.variacao > 0 ? '+' : ''}${projecao.comparativoMesAnterior.saldo.variacao}%`,
      changePositive: projecao.comparativoMesAnterior.saldo.variacao >= 0,
      color: '#4a7c65',
    },
    {
      icon: <TrendingUp size={32} />,
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(projecao.entradas.previstas),
      label: 'A Receber',
      change: `${projecao.entradas.previstas > 0 ? 'Pendentes' : 'Em dia'}`,
      changePositive: true,
      color: '#10b981',
    },
    {
      icon: <TrendingDown size={32} />,
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(projecao.saidas.previstas),
      label: 'A Pagar',
      change: `${projecao.saidas.previstas > 0 ? 'Pendentes' : 'Em dia'}`,
      changePositive: false,
      color: '#e85d3f',
    },
    {
      icon: <DollarSign size={32} />,
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(projecao.entradas.total),
      label: 'Receita Total',
      change: `${projecao.comparativoMesAnterior.receita.variacao > 0 ? '+' : ''}${projecao.comparativoMesAnterior.receita.variacao}%`,
      changePositive: projecao.comparativoMesAnterior.receita.variacao >= 0,
      color: '#3b82f6',
    },
  ];

  const contasReceber = fluxos.filter(f => f.tipo === 'entrada').sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  const contasPagar = fluxos.filter(f => f.tipo === 'saida').sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  const tabs = [
    { id: 'receber', label: `A Receber (${contasReceber.length})` },
    { id: 'pagar', label: `A Pagar (${contasPagar.length})` },
  ];

  const filterOptions = [
    { id: 'todos', label: 'Todos' },
    { id: 'pendente', label: 'Pendente' }, // Mapear para 'previsto'
    { id: 'pago', label: 'Pago' }, // Mapear para 'confirmado'
    { id: 'atrasado', label: 'Atrasado' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-[#10b981]/10 text-[#10b981]';
      case 'previsto':
        return 'bg-[#f59e0b]/10 text-[#f59e0b]';
      case 'atrasado':
        return 'bg-[#e85d3f]/10 text-[#e85d3f]';
      default:
        return 'bg-[#e8e5df] text-[#7a7369]';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'previsto':
        return 'Previsto';
      case 'atrasado':
        return 'Atrasado';
      default:
        return status;
    }
  };

  const getVencimentoBadge = (vencimento: Date | string) => {
    const dataVencimento = new Date(vencimento);
    const hoje = new Date();
    const diff = Math.floor((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      return { label: 'Vencido', color: 'bg-[#e85d3f] text-white' };
    } else if (diff === 0) {
      return { label: 'Hoje', color: 'bg-[#f59e0b] text-white' };
    } else if (diff <= 3) {
      return { label: `${diff}d`, color: 'bg-[#f59e0b]/20 text-[#f59e0b]' };
    } else {
      return { label: format(dataVencimento, 'dd/MM'), color: 'bg-[#e8e5df] text-[#7a7369]' };
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
                className={`text-xs font-medium ${item.changePositive ? 'text-[#10b981]' : 'text-[#e85d3f]'
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
            <select
              className="text-sm border border-[#e8e5df] rounded-lg px-3 py-1 bg-white"
              value={filtros.periodo.preset}
              onChange={(e) => aplicarFiltros({ periodo: { ...filtros.periodo, preset: e.target.value as any } })}
            >
              <option value="semana">Últimos 7 dias</option>
              <option value="mes">Este mês</option>
              <option value="trimestre">Últimos 3 meses</option>
            </select>
          </div>

          {/* Chart Placeholder - Implementar com biblioteca */}
          <div className="h-[200px] bg-gradient-to-br from-[#f5f3ef] to-white rounded-lg flex items-center justify-center border border-[#e8e5df]">
            <div className="text-center">
              <TrendingUp size={48} className="text-[#4a7c65] mx-auto mb-2" />
              <div className="text-sm text-[#7a7369]">Gráfico de Fluxo de Caixa</div>
              <div className="text-xs text-[#a8a199]">{filtros.periodo.preset === 'mes' ? 'Visualizando Mês Atual' : 'Visualizando Período'}</div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
              <span className="text-sm text-[#7a7369]">Entradas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#e85d3f] rounded-full"></div>
              <span className="text-sm text-[#7a7369]">Saídas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <TabsMobile tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Filter Chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide bg-white border-b border-[#e8e5df]">
        {filterOptions.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilter === filter.id
              ? 'bg-[#4a7c65] text-white'
              : 'bg-[#f5f3ef] text-[#5c5650]'
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Lista de Contas */}
      <div className="p-4 space-y-3 pb-24">
        <AnimatePresence mode="popLayout">
          {activeTab === 'receber' &&
            contasReceber.map((conta, index) => {
              if (selectedFilter !== 'todos' &&
                ((selectedFilter === 'pendente' && conta.status !== 'previsto') ||
                  (selectedFilter === 'pago' && conta.status !== 'confirmado') ||
                  (selectedFilter === 'atrasado' && conta.status !== 'atrasado'))) {
                return null;
              }

              const vencimentoBadge = getVencimentoBadge(conta.data);
              return (
                <motion.div
                  key={conta.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-4 border-l-4 border-[#10b981] shadow-sm mb-3"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-base font-semibold text-[#2b2926] mb-1">
                        {conta.descricao}
                      </div>
                      <div className="text-sm text-[#7a7369]">{conta.categoria}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#10b981]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(conta.valor)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-md ${vencimentoBadge.color}`}>
                      {vencimentoBadge.label}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-md ${getStatusColor(conta.status)}`}>
                      {getStatusLabel(conta.status)}
                    </span>
                    {conta.convenioId && (
                      <span className="text-xs bg-[#f5f3ef] text-[#5c5650] px-2 py-1 rounded-md">
                        Convênio
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}

          {activeTab === 'pagar' &&
            contasPagar.map((conta, index) => {
              if (selectedFilter !== 'todos' &&
                ((selectedFilter === 'pendente' && conta.status !== 'previsto') ||
                  (selectedFilter === 'pago' && conta.status !== 'confirmado') ||
                  (selectedFilter === 'atrasado' && conta.status !== 'atrasado'))) {
                return null;
              }

              const vencimentoBadge = getVencimentoBadge(conta.data);
              return (
                <motion.div
                  key={conta.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-4 border-l-4 border-[#e85d3f] shadow-sm mb-3"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-base font-semibold text-[#2b2926] mb-1">
                        {conta.descricao}
                      </div>
                      <div className="text-sm text-[#7a7369]">{conta.categoria}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#e85d3f]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(conta.valor)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-md ${vencimentoBadge.color}`}>
                      {vencimentoBadge.label}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-md ${getStatusColor(conta.status)}`}>
                      {getStatusLabel(conta.status)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      {/* Bottom Sheet - Filtros */}
      <BottomSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros Avançados"
        footer={
          <>
            <button className="btn-secondary btn-mobile-full" onClick={() => setShowFilters(false)}>Cancelar</button>
            <button className="btn-primary btn-mobile-full" onClick={() => setShowFilters(false)}>Aplicar</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="field-label">Período</label>
            <select
              className="input-field"
              value={filtros.periodo.preset}
              onChange={(e) => aplicarFiltros({ periodo: { ...filtros.periodo, preset: e.target.value as any } })}
            >
              <option value="semana">Últimos 7 dias</option>
              <option value="mes">Este mês</option>
              <option value="trimestre">Últimos 3 meses</option>
            </select>
          </div>

          <div>
            <label className="field-label">Tipo</label>
            <div className="flex gap-2">
              <button
                onClick={() => aplicarFiltros({ tipo: 'todos' })}
                className={`px-4 py-2 rounded-lg text-sm border ${filtros.tipo === 'todos' ? 'bg-[#4a7c65] text-white' : 'bg-white'}`}
              >Todos</button>
              <button
                onClick={() => aplicarFiltros({ tipo: 'entrada' })}
                className={`px-4 py-2 rounded-lg text-sm border ${filtros.tipo === 'entrada' ? 'bg-[#4a7c65] text-white' : 'bg-white'}`}
              >Entradas</button>
              <button
                onClick={() => aplicarFiltros({ tipo: 'saida' })}
                className={`px-4 py-2 rounded-lg text-sm border ${filtros.tipo === 'saida' ? 'bg-[#4a7c65] text-white' : 'bg-white'}`}
              >Saídas</button>
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

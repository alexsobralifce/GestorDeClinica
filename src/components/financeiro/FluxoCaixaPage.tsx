import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Filter,
  Download,
  Plus,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Receipt,
} from 'lucide-react';
import { useFluxoCaixa } from '../../lib/contexts/FluxoCaixaContext';
import { KPICard } from '../shared/KPICard';
import { GraficoFluxoCaixa } from './GraficoFluxoCaixa';
import { DespesaModal } from '../shared/DespesaModal';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function FluxoCaixaPage() {
  const { projecao, loading, filtros, aplicarFiltros } = useFluxoCaixa();
  const [showFiltros, setShowFiltros] = useState(false);
  const [showDespesaModal, setShowDespesaModal] = useState(false);
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'mes' | 'trimestre' | 'ano'>('mes');

  const handlePeriodoChange = (preset: 'hoje' | 'semana' | 'mes' | 'trimestre' | 'ano') => {
    const hoje = new Date();
    let inicio: Date;
    let fim: Date;

    switch (preset) {
      case 'hoje':
        inicio = new Date(hoje.setHours(0, 0, 0, 0));
        fim = new Date(hoje.setHours(23, 59, 59, 999));
        break;
      case 'semana':
        inicio = new Date(hoje.setDate(hoje.getDate() - hoje.getDay()));
        fim = new Date(hoje.setDate(hoje.getDate() - hoje.getDay() + 6));
        break;
      case 'mes':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        break;
      case 'trimestre':
        const mesAtual = hoje.getMonth();
        const trimestreInicio = Math.floor(mesAtual / 3) * 3;
        inicio = new Date(hoje.getFullYear(), trimestreInicio, 1);
        fim = new Date(hoje.getFullYear(), trimestreInicio + 3, 0);
        break;
      case 'ano':
        inicio = new Date(hoje.getFullYear(), 0, 1);
        fim = new Date(hoje.getFullYear(), 11, 31);
        break;
    }

    aplicarFiltros({
      periodo: { inicio, fim, preset },
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const COLORS = {
    entrada: ['#4a7c65', '#5a8c75', '#6a9c85', '#7aac95', '#8abca5'],
    saida: ['#e85d3f', '#f06d4f', '#f87d5f', '#ff8d6f', '#ff9d7f'],
  };

  if (loading) {
    return (
      <div className="content-container">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#4a7c65] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#7a7369]">Carregando dados financeiros...</p>
          </div>
        </div>
      </div>
    );
  }

  // Proteção contra dados não carregados
  if (!projecao || !filtros) {
    return (
      <div className="content-container">
        <div className="card">
          <div className="card-content-lg text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e85d3f] to-[#d54426]">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="heading-secondary mb-3">Erro ao carregar dados</h2>
            <p className="text-muted mb-6">
              Não foi possível carregar os dados do fluxo de caixa.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-premium"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="heading-primary mb-2">
              Fluxo de Caixa
            </h1>
            <p className="text-muted">
              Gestão financeira em tempo real com projeções inteligentes
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="btn-filter"
              onClick={() => setShowFiltros(!showFiltros)}
            >
              <Filter className="h-5 w-5" />
              Filtros
            </button>
            <button className="btn-secondary">
              <Download className="h-5 w-5" />
              Exportar
            </button>
            <button className="btn-premium">
              <Plus className="h-5 w-5" />
              Nova Transação
            </button>
          </div>
        </div>

        {/* Filtros de Período */}
        <div className="flex flex-wrap gap-2.5">
          <button
            className={`btn-filter ${filtros.periodo.preset === 'hoje' ? 'active' : ''}`}
            onClick={() => handlePeriodoChange('hoje')}
          >
            Hoje
          </button>
          <button
            className={`btn-filter ${filtros.periodo.preset === 'semana' ? 'active' : ''}`}
            onClick={() => handlePeriodoChange('semana')}
          >
            Semana
          </button>
          <button
            className={`btn-filter ${filtros.periodo.preset === 'mes' ? 'active' : ''}`}
            onClick={() => handlePeriodoChange('mes')}
          >
            Mês
          </button>
          <button
            className={`btn-filter ${filtros.periodo.preset === 'trimestre' ? 'active' : ''}`}
            onClick={() => handlePeriodoChange('trimestre')}
          >
            Trimestre
          </button>
          <button
            className={`btn-filter ${filtros.periodo.preset === 'ano' ? 'active' : ''}`}
            onClick={() => handlePeriodoChange('ano')}
          >
            Ano
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          titulo="Saldo Atual"
          valor={projecao.saldoFinal}
          tipo="monetario"
          tendencia={projecao.comparativoMesAnterior.saldo.variacao}
          icone={Wallet}
          cor="primary"
          delay={0.1}
        />
        <KPICard
          titulo="Entradas do Período"
          valor={projecao.entradas.confirmadas}
          tipo="monetario"
          tendencia={projecao.comparativoMesAnterior.receita.variacao}
          icone={TrendingUp}
          cor="success"
          delay={0.2}
        />
        <KPICard
          titulo="Saídas do Período"
          valor={projecao.saidas.confirmadas}
          tipo="monetario"
          tendencia={projecao.comparativoMesAnterior.despesa.variacao}
          icone={TrendingDown}
          cor="danger"
          delay={0.3}
        />
        <KPICard
          titulo="Saldo Projetado"
          valor={projecao.saldoFinal}
          tipo="monetario"
          subtitle={`Previsão: ${formatCurrency(projecao.totalEntradas - projecao.totalSaidas)}`}
          icone={Calendar}
          cor="info"
          delay={0.4}
        />
      </div>

      {/* Alertas */}
      <AnimatePresence>
        {projecao.alertas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {projecao.alertas.map((alerta) => {
              const icons = {
                info: Info,
                warning: AlertTriangle,
                error: XCircle,
                success: CheckCircle,
              };
              const colors = {
                info: 'bg-[#6b9dd8]/10 border-[#6b9dd8]/30 text-[#6b9dd8]',
                warning: 'bg-[#f5a623]/10 border-[#f5a623]/30 text-[#f5a623]',
                error: 'bg-[#e85d3f]/10 border-[#e85d3f]/30 text-[#e85d3f]',
                success: 'bg-[#4a7c65]/10 border-[#4a7c65]/30 text-[#4a7c65]',
              };
              const Icon = icons[alerta.tipo];

              return (
                <motion.div
                  key={alerta.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`card p-4 border-2 ${colors[alerta.tipo]}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#2b2926] mb-1">{alerta.titulo}</h4>
                      <p className="text-sm text-[#5c5650]">{alerta.mensagem}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gráfico Principal */}
      <GraficoFluxoCaixa dados={projecao.timeline} />

      {/* Análise por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receitas por Categoria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-xl font-bold text-[#2b2926] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Receitas por Categoria
          </h3>
          
          {projecao.entradas.porCategoria.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={projecao.entradas.porCategoria}
                    dataKey="valor"
                    nameKey="categoria"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.percentual.toFixed(1)}%`}
                  >
                    {projecao.entradas.porCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.entrada[index % COLORS.entrada.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '2px solid #e8e5df',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                {projecao.entradas.porCategoria.map((cat, index) => (
                  <div key={cat.categoria} className="flex items-center justify-between p-3 rounded-xl bg-[#f9f7f4]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS.entrada[index % COLORS.entrada.length] }}
                      />
                      <span className="text-sm font-medium text-[#2b2926]">{cat.categoria}</span>
                    </div>
                    <span className="text-sm font-bold text-[#4a7c65]">{formatCurrency(cat.valor)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-[#7a7369] py-8">Nenhuma receita no período</p>
          )}
        </motion.div>

        {/* Despesas por Categoria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <h3 className="text-xl font-bold text-[#2b2926] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Despesas por Categoria
          </h3>
          
          {projecao.saidas.porCategoria.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={projecao.saidas.porCategoria}
                    dataKey="valor"
                    nameKey="categoria"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.percentual.toFixed(1)}%`}
                  >
                    {projecao.saidas.porCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.saida[index % COLORS.saida.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '2px solid #e8e5df',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                {projecao.saidas.porCategoria.map((cat, index) => (
                  <div key={cat.categoria} className="flex items-center justify-between p-3 rounded-xl bg-[#f9f7f4]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS.saida[index % COLORS.saida.length] }}
                      />
                      <span className="text-sm font-medium text-[#2b2926]">{cat.categoria}</span>
                    </div>
                    <span className="text-sm font-bold text-[#e85d3f]">{formatCurrency(cat.valor)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-[#7a7369] py-8">Nenhuma despesa no período</p>
          )}
        </motion.div>
      </div>

      {/* Resumo Comparativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card p-6 bg-gradient-to-br from-[#4a7c65]/5 to-transparent"
      >
        <h3 className="text-xl font-bold text-[#2b2926] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          Comparativo com Período Anterior
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-xl bg-white">
            <p className="text-sm text-[#7a7369] mb-2">Receitas</p>
            <p className="text-2xl font-bold text-[#4a7c65] mb-1">
              {formatCurrency(projecao.comparativoMesAnterior.receita.valor)}
            </p>
            <p className={`text-sm font-medium ${
              projecao.comparativoMesAnterior.receita.variacao >= 0 ? 'text-[#4a7c65]' : 'text-[#e85d3f]'
            }`}>
              {projecao.comparativoMesAnterior.receita.variacao >= 0 ? '↗' : '↘'}{' '}
              {Math.abs(projecao.comparativoMesAnterior.receita.variacao).toFixed(1)}%
            </p>
          </div>

          <div className="text-center p-4 rounded-xl bg-white">
            <p className="text-sm text-[#7a7369] mb-2">Despesas</p>
            <p className="text-2xl font-bold text-[#e85d3f] mb-1">
              {formatCurrency(projecao.comparativoMesAnterior.despesa.valor)}
            </p>
            <p className={`text-sm font-medium ${
              projecao.comparativoMesAnterior.despesa.variacao >= 0 ? 'text-[#e85d3f]' : 'text-[#4a7c65]'
            }`}>
              {projecao.comparativoMesAnterior.despesa.variacao >= 0 ? '↗' : '↘'}{' '}
              {Math.abs(projecao.comparativoMesAnterior.despesa.variacao).toFixed(1)}%
            </p>
          </div>

          <div className="text-center p-4 rounded-xl bg-white">
            <p className="text-sm text-[#7a7369] mb-2">Saldo</p>
            <p className="text-2xl font-bold text-[#2b2926] mb-1">
              {formatCurrency(projecao.comparativoMesAnterior.saldo.valor)}
            </p>
            <p className={`text-sm font-medium ${
              projecao.comparativoMesAnterior.saldo.variacao >= 0 ? 'text-[#4a7c65]' : 'text-[#e85d3f]'
            }`}>
              {projecao.comparativoMesAnterior.saldo.variacao >= 0 ? '↗' : '↘'}{' '}
              {Math.abs(projecao.comparativoMesAnterior.saldo.variacao).toFixed(1)}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* Botão Flutuante para Nova Despesa */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowDespesaModal(true)}
        className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#e85d3f] to-[#d54426] text-white shadow-2xl z-40"
        title="Registrar Despesa"
      >
        <Receipt className="h-7 w-7" />
      </motion.button>

      {/* Modal de Despesa */}
      <DespesaModal
        isOpen={showDespesaModal}
        onClose={() => setShowDespesaModal(false)}
      />
    </div>
  );
}
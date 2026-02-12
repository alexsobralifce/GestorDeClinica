import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Receipt,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Filter,
  Download,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Tag,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock Data
const transacoesMock = [
  { id: '1', tipo: 'receita', descricao: 'Consulta - Maria Silva', valor: 250, data: '2026-02-10', categoria: 'Consulta', status: 'pago', paciente: 'Maria Silva' },
  { id: '2', tipo: 'despesa', descricao: 'Material Odontológico', valor: 450, data: '2026-02-09', categoria: 'Material', status: 'pago', fornecedor: 'Dental Supply' },
  { id: '3', tipo: 'receita', descricao: 'Sessão Fisioterapia - João Pedro', valor: 180, data: '2026-02-08', categoria: 'Fisioterapia', status: 'pago', paciente: 'João Pedro' },
  { id: '4', tipo: 'despesa', descricao: 'Aluguel Clínica', valor: 3500, data: '2026-02-05', categoria: 'Fixo', status: 'pago', fornecedor: 'Imobiliária' },
  { id: '5', tipo: 'receita', descricao: 'Consulta - Ana Costa', valor: 300, data: '2026-02-05', categoria: 'Consulta', status: 'pendente', paciente: 'Ana Costa' },
  { id: '6', tipo: 'despesa', descricao: 'Energia Elétrica', valor: 680, data: '2026-02-03', categoria: 'Fixo', status: 'pago', fornecedor: 'Companhia de Energia' },
  { id: '7', tipo: 'receita', descricao: 'Pacote 10 Sessões - Carlos Mendes', valor: 1500, data: '2026-02-02', categoria: 'Pacote', status: 'pago', paciente: 'Carlos Mendes' },
  { id: '8', tipo: 'despesa', descricao: 'Software Gestão Clínica', valor: 200, data: '2026-02-01', categoria: 'Tecnologia', status: 'pago', fornecedor: 'Tech Health' },
];

const fluxoDiarioMock = [
  { data: '01/02', receitas: 1500, despesas: 200, saldo: 1300 },
  { data: '02/02', receitas: 300, despesas: 680, saldo: -380 },
  { data: '03/02', receitas: 450, despesas: 200, saldo: 250 },
  { data: '05/02', receitas: 300, despesas: 3500, saldo: -3200 },
  { data: '08/02', receitas: 680, despesas: 150, saldo: 530 },
  { data: '09/02', receitas: 250, despesas: 450, saldo: -200 },
  { data: '10/02', receitas: 850, despesas: 120, saldo: 730 },
  { data: '11/02', receitas: 400, despesas: 0, saldo: 400 },
  { data: '12/02', receitas: 950, despesas: 280, saldo: 670 },
];

const receitasPorCategoria = [
  { name: 'Consultas', value: 2500, cor: '#4a7c65' },
  { name: 'Fisioterapia', value: 1800, cor: '#6b9985' },
  { name: 'Pacotes', value: 1500, cor: '#8fb5a4' },
  { name: 'Outros', value: 400, cor: '#b9d1c7' },
];

const despesasPorCategoria = [
  { name: 'Fixas', value: 4180, cor: '#e85d3f' },
  { name: 'Material', value: 1250, cor: '#f06d4f' },
  { name: 'Tecnologia', value: 800, cor: '#f87d5f' },
  { name: 'Outros', value: 450, cor: '#ff8d6f' },
];

export function FinanceiroPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transacoes' | 'relatorios'>('dashboard');
  const [periodo, setPeriodo] = useState<'hoje' | 'semana' | 'mes' | 'ano'>('mes');
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'receita' | 'despesa'>('todos');
  const [showNovaTransacao, setShowNovaTransacao] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const transacoesFiltradas = transacoesMock.filter(t => {
    const matchTipo = tipoFiltro === 'todos' || t.tipo === tipoFiltro;
    const matchSearch = t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (t.paciente?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                       (t.fornecedor?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchTipo && matchSearch;
  });

  // Cálculos
  const totalReceitas = transacoesMock.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0);
  const totalDespesas = transacoesMock.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0);
  const saldoTotal = totalReceitas - totalDespesas;
  const receitasPendentes = transacoesMock.filter(t => t.tipo === 'receita' && t.status === 'pendente').reduce((sum, t) => sum + t.valor, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="card-content-sm bg-white border-2 border-[#e8e5df]">
          <p className="text-sm font-medium text-[#2b2926]">{payload[0].payload.data}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="heading-primary mb-0">Gestão Financeira</h1>
          <p className="text-muted mt-2">Controle completo do fluxo de caixa e finanças da clínica</p>
        </div>
        <div className="cluster-lg">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary"
          >
            <Download className="h-5 w-5" />
            Exportar Relatório
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNovaTransacao(true)}
            className="btn-premium"
          >
            <Plus className="h-5 w-5" />
            Nova Transação
          </motion.button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="card">
        <div className="flex gap-1 p-1 bg-[#f5f3ef] rounded-xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white text-[#4a7c65] shadow-sm'
                : 'text-[#7a7369] hover:text-[#5c5650]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Dashboard
            </div>
          </button>
          <button
            onClick={() => setActiveTab('transacoes')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'transacoes'
                ? 'bg-white text-[#4a7c65] shadow-sm'
                : 'text-[#7a7369] hover:text-[#5c5650]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Receipt className="h-5 w-5" />
              Transações
            </div>
          </button>
          <button
            onClick={() => setActiveTab('relatorios')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'relatorios'
                ? 'bg-white text-[#4a7c65] shadow-sm'
                : 'text-[#7a7369] hover:text-[#5c5650]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Relatórios
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card hover:shadow-lg transition-all"
              >
                <div className="card-content">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#7a7369] mb-2">Total Receitas</p>
                      <p className="text-3xl font-bold text-[#2b2926]">{formatCurrency(totalReceitas)}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <ArrowUpRight className="h-4 w-4 text-[#10b981]" />
                        <span className="text-sm text-[#10b981] font-medium">+12.5% vs mês anterior</span>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669]">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card hover:shadow-lg transition-all"
              >
                <div className="card-content">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#7a7369] mb-2">Total Despesas</p>
                      <p className="text-3xl font-bold text-[#2b2926]">{formatCurrency(totalDespesas)}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <ArrowDownRight className="h-4 w-4 text-[#e85d3f]" />
                        <span className="text-sm text-[#e85d3f] font-medium">+8.2% vs mês anterior</span>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d3f] to-[#d54426]">
                      <TrendingDown className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card hover:shadow-lg transition-all"
              >
                <div className="card-content">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#7a7369] mb-2">Saldo do Período</p>
                      <p className={`text-3xl font-bold ${saldoTotal >= 0 ? 'text-[#10b981]' : 'text-[#e85d3f]'}`}>
                        {formatCurrency(saldoTotal)}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <DollarSign className="h-4 w-4 text-[#4a7c65]" />
                        <span className="text-sm text-[#4a7c65] font-medium">
                          Margem: {((saldoTotal / totalReceitas) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#4a7c65] to-[#3d6653]">
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card hover:shadow-lg transition-all"
              >
                <div className="card-content">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#7a7369] mb-2">A Receber</p>
                      <p className="text-3xl font-bold text-[#2b2926]">{formatCurrency(receitasPendentes)}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="h-4 w-4 text-[#f59e0b]" />
                        <span className="text-sm text-[#f59e0b] font-medium">3 pendências</span>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#d97706]">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fluxo de Caixa */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card"
              >
                <div className="card-content">
                  <h3 className="heading-secondary">Fluxo de Caixa Diário</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={fluxoDiarioMock}>
                      <defs>
                        <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e85d3f" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#e85d3f" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8e5df" />
                      <XAxis dataKey="data" stroke="#7a7369" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#7a7369" style={{ fontSize: '12px' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#10b981" fillOpacity={1} fill="url(#colorReceitas)" />
                      <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#e85d3f" fillOpacity={1} fill="url(#colorDespesas)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Receitas por Categoria */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="card"
              >
                <div className="card-content">
                  <h3 className="heading-secondary">Receitas por Categoria</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={receitasPorCategoria}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {receitasPorCategoria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Despesas por Categoria */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card"
            >
              <div className="card-content">
                <h3 className="heading-secondary mb-6">Despesas por Categoria</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {despesasPorCategoria.map((categoria, index) => (
                    <motion.div
                      key={categoria.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="p-4 rounded-xl border-2 transition-all hover:shadow-md"
                      style={{ borderColor: categoria.cor, backgroundColor: `${categoria.cor}10` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#5c5650]">{categoria.name}</span>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoria.cor }} />
                      </div>
                      <p className="text-2xl font-bold text-[#2b2926]">{formatCurrency(categoria.value)}</p>
                      <p className="text-xs text-[#7a7369] mt-1">
                        {((categoria.value / totalDespesas) * 100).toFixed(1)}% do total
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'transacoes' && (
          <motion.div
            key="transacoes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filtros */}
            <div className="card">
              <div className="card-content">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7a7369]" />
                    <input
                      type="text"
                      placeholder="Buscar por descrição, paciente ou fornecedor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                  <div className="cluster">
                    <button
                      onClick={() => setTipoFiltro('todos')}
                      className={`btn-filter ${tipoFiltro === 'todos' ? 'active' : ''}`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setTipoFiltro('receita')}
                      className={`btn-filter ${tipoFiltro === 'receita' ? 'active' : ''}`}
                    >
                      <TrendingUp className="h-4 w-4" />
                      Receitas
                    </button>
                    <button
                      onClick={() => setTipoFiltro('despesa')}
                      className={`btn-filter ${tipoFiltro === 'despesa' ? 'active' : ''}`}
                    >
                      <TrendingDown className="h-4 w-4" />
                      Despesas
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Transações */}
            <div className="card">
              <div className="card-content p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-[#e8e5df]">
                        <th className="text-left p-4 text-sm font-semibold text-[#5c5650]">Data</th>
                        <th className="text-left p-4 text-sm font-semibold text-[#5c5650]">Descrição</th>
                        <th className="text-left p-4 text-sm font-semibold text-[#5c5650]">Categoria</th>
                        <th className="text-left p-4 text-sm font-semibold text-[#5c5650]">Valor</th>
                        <th className="text-left p-4 text-sm font-semibold text-[#5c5650]">Status</th>
                        <th className="text-right p-4 text-sm font-semibold text-[#5c5650]">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transacoesFiltradas.map((transacao, index) => (
                        <motion.tr
                          key={transacao.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-[#e8e5df] hover:bg-[#faf9f7] transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-[#7a7369]" />
                              <span className="text-sm text-[#2b2926]">
                                {new Date(transacao.data).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                transacao.tipo === 'receita' ? 'bg-[#10b981]/10' : 'bg-[#e85d3f]/10'
                              }`}>
                                {transacao.tipo === 'receita' ? (
                                  <ArrowUpRight className="h-5 w-5 text-[#10b981]" />
                                ) : (
                                  <ArrowDownRight className="h-5 w-5 text-[#e85d3f]" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#2b2926]">{transacao.descricao}</p>
                                <p className="text-xs text-[#7a7369]">
                                  {transacao.paciente || transacao.fornecedor}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#f5f3ef] text-xs font-medium text-[#5c5650]">
                              <Tag className="h-3 w-3" />
                              {transacao.categoria}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`text-sm font-bold ${
                              transacao.tipo === 'receita' ? 'text-[#10b981]' : 'text-[#e85d3f]'
                            }`}>
                              {transacao.tipo === 'receita' ? '+' : '-'} {formatCurrency(transacao.valor)}
                            </span>
                          </td>
                          <td className="p-4">
                            {transacao.status === 'pago' ? (
                              <span className="badge badge-success">
                                <Check className="h-3 w-3" />
                                Pago
                              </span>
                            ) : (
                              <span className="badge badge-warning">
                                <Clock className="h-3 w-3" />
                                Pendente
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <button className="btn-icon-sm">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="btn-icon-sm">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="btn-icon-sm hover:bg-[#fde8e3]">
                                <Trash2 className="h-4 w-4 text-[#e85d3f]" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'relatorios' && (
          <motion.div
            key="relatorios"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <div className="card-content-lg text-center">
              <BarChart3 className="mx-auto h-16 w-16 text-[#d4cfc5] mb-4" />
              <h3 className="text-xl font-semibold text-[#2b2926] mb-2">Relatórios Avançados</h3>
              <p className="text-[#7a7369]">
                Módulo de relatórios customizados em desenvolvimento
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Nova Transação */}
      <AnimatePresence>
        {showNovaTransacao && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#2b2926]/50 backdrop-blur-sm"
              onClick={() => setShowNovaTransacao(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#2b2926]">Nova Transação</h2>
                <button onClick={() => setShowNovaTransacao(false)} className="btn-icon">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form className="form-container p-0">
                <div className="form-grid">
                  <div className="field-group field-span-2">
                    <label className="field-label">Tipo</label>
                    <div className="cluster">
                      <button type="button" className="btn-filter active">
                        <TrendingUp className="h-4 w-4" />
                        Receita
                      </button>
                      <button type="button" className="btn-filter">
                        <TrendingDown className="h-4 w-4" />
                        Despesa
                      </button>
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Descrição</label>
                    <input type="text" className="input-field" placeholder="Ex: Consulta - Maria Silva" />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Valor</label>
                    <input type="number" className="input-field" placeholder="R$ 0,00" />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Data</label>
                    <input type="date" className="input-field" />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Categoria</label>
                    <select className="input-field">
                      <option>Consulta</option>
                      <option>Fisioterapia</option>
                      <option>Pacote</option>
                      <option>Outros</option>
                    </select>
                  </div>

                  <div className="field-group field-span-2">
                    <label className="field-label">Observações (opcional)</label>
                    <textarea className="input-field" rows={3} placeholder="Adicione observações..."></textarea>
                  </div>
                </div>

                <div className="form-submit flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNovaTransacao(false)}
                    className="btn-ghost flex-1"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Salvar Transação
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
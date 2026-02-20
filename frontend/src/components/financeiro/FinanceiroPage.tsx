import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, Wallet,
  Plus, Search, Filter, Download, Trash2, Check, X,
  RefreshCw, ArrowUpRight, ArrowDownRight, Clock,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { financialApi, FinancialTransaction, FinancialSummary } from '../../lib/api/financial';
import apiClient from '../../lib/api/client';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category { id: string; name: string; type: string; color: string; }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);
}
function fmtDate(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR');
}
function getPeriodDates(period: 'hoje' | 'semana' | 'mes' | 'ano') {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const strDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  switch (period) {
    case 'hoje': return { start: strDate(now), end: strDate(now) };
    case 'semana': {
      const s = new Date(now); s.setDate(now.getDate() - now.getDay());
      const e = new Date(s); e.setDate(s.getDate() + 6);
      return { start: strDate(s), end: strDate(e) };
    }
    case 'mes': return { start: strDate(new Date(now.getFullYear(), now.getMonth(), 1)), end: strDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)) };
    case 'ano': return { start: strDate(new Date(now.getFullYear(), 0, 1)), end: strDate(new Date(now.getFullYear(), 11, 31)) };
  }
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  paid: { label: 'Pago', cls: 'bg-green-100 text-green-800' },
  pending: { label: 'Pendente', cls: 'bg-amber-100 text-amber-800' },
  overdue: { label: 'Atrasado', cls: 'bg-red-100 text-red-800' },
  cancelled: { label: 'Cancelado', cls: 'bg-gray-100 text-gray-600' },
};

const PAYMENT_METHODS = ['pix', 'transferencia', 'boleto', 'cartao', 'dinheiro', 'cheque'];
const PM_LABELS: Record<string, string> = { pix: 'PIX', transferencia: 'Transferência', boleto: 'Boleto', cartao: 'Cartão', dinheiro: 'Dinheiro', cheque: 'Cheque' };

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border-2 border-[#e8e5df] rounded-xl p-3 shadow-lg">
      <p className="text-xs font-medium text-[#7a7369] mb-1">{label}</p>
      {payload.map((e: any, i: number) => (
        <p key={i} className="text-sm" style={{ color: e.color }}>
          {e.name}: {fmt(e.value)}
        </p>
      ))}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({ title, value, icon: Icon, color, trend, subtitle }: {
  title: string; value: number; icon: any; color: string; trend?: number; subtitle?: string;
}) {
  const colorMap: Record<string, string> = {
    primary: 'from-[#4a7c65] to-[#3d6653]',
    success: 'from-[#4a7c65] to-[#3d6653]',
    danger: 'from-[#e85d3f] to-[#d54426]',
    warning: 'from-[#f59e0b] to-[#d97706]',
    info: 'from-[#6b9dd8] to-[#4a7cc8]',
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card hover:shadow-lg transition-all">
      <div className="card-content">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#7a7369] mb-2">{title}</p>
            <p className="text-2xl font-bold text-[#2b2926]">{fmt(value)}</p>
            {subtitle && <p className="text-xs text-[#7a7369] mt-1">{subtitle}</p>}
            {trend !== undefined && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${trend >= 0 ? 'text-[#4a7c65]' : 'text-[#e85d3f]'}`}>
                {trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(trend).toFixed(1)}% vs mês anterior
              </p>
            )}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorMap[color]}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Nova Transação Modal ──────────────────────────────────────────────────────
function NovaTransacaoModal({ onClose, onSaved, categories }: {
  onClose: () => void;
  onSaved: () => void;
  categories: Category[];
}) {
  const [form, setForm] = useState({
    type: 'income' as 'income' | 'expense',
    description: '', amount: '', transaction_date: new Date().toISOString().slice(0, 10),
    due_date: '', payment_date: '', status: 'paid' as const,
    payment_method: 'pix', category_id: '', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const filteredCategories = categories.filter(c => c.type === form.type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.transaction_date) {
      setError('Preencha descrição, valor e data.');
      return;
    }
    setSaving(true);
    try {
      await financialApi.create({
        type: form.type,
        description: form.description,
        amount: parseFloat(form.amount),
        transaction_date: form.transaction_date,
        due_date: form.due_date || undefined,
        payment_date: form.payment_date || undefined,
        status: form.status,
        payment_method: form.payment_method || undefined,
        category_id: form.category_id || undefined,
        notes: form.notes || undefined,
      });
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao salvar transação');
    } finally { setSaving(false); }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#2b2926]/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#2b2926]">Nova Transação</h2>
          <button onClick={onClose} className="btn-icon"><X className="h-5 w-5" /></button>
        </div>

        {/* Type selector */}
        <div className="flex rounded-xl overflow-hidden border-2 border-[#e8e5df] mb-6">
          {(['income', 'expense'] as const).map(t => (
            <button key={t} type="button"
              onClick={() => setForm(f => ({ ...f, type: t, category_id: '' }))}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${form.type === t
                ? t === 'income' ? 'bg-[#4a7c65] text-white' : 'bg-[#e85d3f] text-white'
                : 'text-[#7a7369] hover:bg-[#f5f3ef]'}`}
            >
              {t === 'income' ? '↑ Receita' : '↓ Despesa'}
            </button>
          ))}
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">Descrição *</label>
            <input type="text" className="input-field" placeholder="Descreva a transação..."
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Valor *</label>
              <input type="number" step="0.01" min="0" className="input-field" placeholder="0,00"
                value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Data *</label>
              <input type="date" className="input-field"
                value={form.transaction_date} onChange={e => setForm(f => ({ ...f, transaction_date: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Status</label>
              <select className="input-field" value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
                <option value="paid">Pago</option>
                <option value="pending">Pendente</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="field-label">Forma de Pagamento</label>
              <select className="input-field" value={form.payment_method}
                onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}>
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{PM_LABELS[m]}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="field-label">Categoria</label>
              <select className="input-field" value={form.category_id}
                onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                <option value="">Sem categoria</option>
                {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Vencimento</label>
              <input type="date" className="input-field"
                value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
            </div>
            <div>
              <label className="field-label">Data Pagamento</label>
              <input type="date" className="input-field"
                value={form.payment_date} onChange={e => setForm(f => ({ ...f, payment_date: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="field-label">Observações</label>
            <textarea className="input-field" rows={2}
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white border-2 border-[#e8e5df] rounded-xl font-semibold text-[#5c5650] hover:bg-[#f5f3ef] hover:border-[#d4cfc5] transition-all shadow-sm">Cancelar</button>
            <button type="submit" disabled={saving}
              className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all ${form.type === 'income' ? 'bg-[#4a7c65] hover:bg-[#3d6653]' : 'bg-[#e85d3f] hover:bg-[#d54426]'}`}>
              {saving ? 'Salvando...' : 'Salvar Transação'}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

import { useDevice } from '../../contexts/DeviceContext';
import { FinanceiroMobile } from '../mobile/FinanceiroMobile';
import { FluxoCaixaProvider } from '../../lib/contexts/FluxoCaixaContext';

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function FinanceiroPage() {
  const { isMobile } = useDevice();

  if (isMobile) {
    return (
      <FluxoCaixaProvider>
        <FinanceiroMobile />
      </FluxoCaixaProvider>
    );
  }
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transacoes' | 'relatorios'>('dashboard');
  const [periodo, setPeriodo] = useState<'hoje' | 'semana' | 'mes' | 'ano'>('mes');
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'todos' | 'income' | 'expense'>('todos');
  const [search, setSearch] = useState('');
  const [showNova, setShowNova] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { start, end } = getPeriodDates(periodo);
    try {
      const [txList, sumData, catData] = await Promise.all([
        financialApi.getAll({ start_date: start, end_date: end, ...(typeFilter !== 'todos' ? { type: typeFilter } : {}) }),
        financialApi.getSummary({ start_date: start, end_date: end }),
        apiClient.get('/categories').then(r => r.data),
      ]);
      setTransactions(Array.isArray(txList) ? txList : []);
      setSummary(sumData);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (e) { /* show empty state */ }
    finally { setLoading(false); }
  }, [periodo, typeFilter]);

  useEffect(() => { load(); }, [load]);

  const filtered = transactions.filter(t =>
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    (t.patient_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.professional_name || '').toLowerCase().includes(search.toLowerCase())
  );

  // Build daily chart data from transactions
  const dailyMap: Record<string, { data: string; receitas: number; despesas: number }> = {};
  transactions.forEach(t => {
    const d = t.transaction_date?.slice(0, 10) || '';
    if (!dailyMap[d]) dailyMap[d] = { data: d.slice(8) + '/' + d.slice(5, 7), receitas: 0, despesas: 0 };
    if (t.type === 'income') dailyMap[d].receitas += t.amount;
    else dailyMap[d].despesas += t.amount;
  });
  const dailyData = Object.values(dailyMap).sort((a, b) => a.data.localeCompare(b.data));

  // Category breakdown
  const incomeByCategory: Record<string, number> = {};
  const expenseByCategory: Record<string, number> = {};
  transactions.forEach(t => {
    const name = t.category_name || 'Outros';
    if (t.type === 'income') incomeByCategory[name] = (incomeByCategory[name] || 0) + t.amount;
    else expenseByCategory[name] = (expenseByCategory[name] || 0) + t.amount;
  });
  const incomePieData = Object.entries(incomeByCategory).map(([name, value]) => ({ name, value }));
  const expensePieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  const PIE_COLORS_IN = ['#4a7c65', '#5a9070', '#70a885', '#8abca5', '#a5d0bc'];
  const PIE_COLORS_EX = ['#e85d3f', '#f06d4f', '#f87d5f', '#ff8d6f', '#ffad9f'];

  const PERIOD_LABELS: Record<string, string> = { hoje: 'Hoje', semana: 'Esta semana', mes: 'Este mês', ano: 'Este ano' };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="heading-primary mb-0">Gestão Financeira</h1>
          <p className="text-muted mt-2">Controle completo do fluxo de caixa e finanças da clínica</p>
        </div>
        <div className="cluster-lg">
          <button onClick={load} className="btn-secondary">
            <RefreshCw className="h-4 w-4" /> Atualizar
          </button>
          <button onClick={() => setShowNova(true)} className="btn-premium">
            <Plus className="h-5 w-5" /> Nova Transação
          </button>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex flex-wrap gap-2">
        {(['hoje', 'semana', 'mes', 'ano'] as const).map(p => (
          <button key={p} onClick={() => setPeriodo(p)}
            className={`btn-filter ${periodo === p ? 'active' : ''}`}>
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-content py-0">
          <nav className="flex gap-1 -mb-px">
            {([['dashboard', 'Dashboard'], ['transacoes', 'Transações'], ['relatorios', 'Relatórios']] as const).map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all ${activeTab === tab
                  ? 'border-[#4a7c65] text-[#4a7c65]'
                  : 'border-transparent text-[#7a7369] hover:text-[#2b2926]'}`}>
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── DASHBOARD TAB ── */}
        {activeTab === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6">
            {/* KPIs */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="card h-28 animate-pulse bg-[#f5f3ef]" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Receitas do Período" value={summary?.total_income ?? 0} icon={TrendingUp} color="success" />
                <KPICard title="Despesas do Período" value={summary?.total_expenses ?? 0} icon={TrendingDown} color="danger" />
                <KPICard title="Saldo" value={(summary?.total_income ?? 0) - (summary?.total_expenses ?? 0)} icon={Wallet} color="primary" />
                <KPICard title="Receitas Pendentes" value={summary?.pending_income ?? 0} icon={Clock} color="warning"
                  subtitle={`${summary?.income_count ?? 0} transações`} />
              </div>
            )}

            {/* Daily Flow Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-[#2b2926] mb-6">Fluxo Diário</h3>
              {dailyData.length === 0 && !loading ? (
                <div className="flex items-center justify-center h-48 text-[#7a7369]">
                  Nenhuma transação no período selecionado
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={dailyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4a7c65" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4a7c65" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e85d3f" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#e85d3f" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8e5df" />
                    <XAxis dataKey="data" tick={{ fontSize: 12, fill: '#7a7369' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#7a7369' }} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#4a7c65" strokeWidth={2} fill="url(#colorReceitas)" />
                    <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#e85d3f" strokeWidth={2} fill="url(#colorDespesas)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { title: 'Receitas por Categoria', data: incomePieData, colors: PIE_COLORS_IN },
                { title: 'Despesas por Categoria', data: expensePieData, colors: PIE_COLORS_EX },
              ].map(({ title, data, colors }) => (
                <div key={title} className="card p-6">
                  <h3 className="text-lg font-bold text-[#2b2926] mb-4">{title}</h3>
                  {data.length === 0 ? (
                    <p className="text-center text-[#7a7369] py-8">Sem dados no período</p>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => fmt(v)} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-3 space-y-1">
                        {data.map((d, i) => (
                          <div key={d.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                              <span className="text-[#5c5650]">{d.name}</span>
                            </div>
                            <span className="font-medium text-[#2b2926]">{fmt(d.value)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── TRANSAÇÕES TAB ── */}
        {activeTab === 'transacoes' && (
          <motion.div key="transacoes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6">
            {/* Filters */}
            <div className="card">
              <div className="card-content">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7a7369]" />
                    <input type="text" placeholder="Buscar transação, paciente..." value={search}
                      onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
                  </div>
                  <div className="flex gap-2">
                    {([['todos', 'Todos'], ['income', 'Receitas'], ['expense', 'Despesas']] as const).map(([v, l]) => (
                      <button key={v} onClick={() => setTypeFilter(v)}
                        className={`btn-filter ${typeFilter === v ? 'active' : ''}`}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="card overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="w-10 h-10 border-4 border-[#4a7c65] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <DollarSign className="h-12 w-12 text-[#d4cfc5] mb-3" />
                  <p className="text-[#7a7369]">Nenhuma transação encontrada</p>
                  <button onClick={() => setShowNova(true)} className="btn-primary mt-4">
                    <Plus className="h-4 w-4" /> Nova transação
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#f5f3ef] border-b-2 border-[#e8e5df]">
                      <tr>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-[#5c5650]">Descrição</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-[#5c5650]">Categoria</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-[#5c5650]">Data</th>
                        <th className="text-right px-6 py-4 text-sm font-semibold text-[#5c5650]">Valor</th>
                        <th className="text-center px-6 py-4 text-sm font-semibold text-[#5c5650]">Status</th>
                        <th className="text-center px-6 py-4 text-sm font-semibold text-[#5c5650]">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((t, idx) => {
                        const st = STATUS_LABELS[t.status] || { label: t.status, cls: 'bg-gray-100 text-gray-600' };
                        return (
                          <motion.tr key={t.id}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className="border-b border-[#e8e5df] hover:bg-[#faf9f7] transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.type === 'income' ? 'bg-[#4a7c65]/10' : 'bg-[#e85d3f]/10'}`}>
                                  {t.type === 'income'
                                    ? <TrendingUp className="h-4 w-4 text-[#4a7c65]" />
                                    : <TrendingDown className="h-4 w-4 text-[#e85d3f]" />}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-[#2b2926]">{t.description}</p>
                                  {t.patient_name && <p className="text-xs text-[#7a7369]">{t.patient_name}</p>}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {t.category_name ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                                  style={{ backgroundColor: (t.category_color || '#ccc') + '20', color: t.category_color || '#666' }}>
                                  {t.category_name}
                                </span>
                              ) : (
                                <span className="text-xs text-[#7a7369]">—</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-[#2b2926]">{fmtDate(t.transaction_date)}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className={`text-sm font-bold ${t.type === 'income' ? 'text-[#4a7c65]' : 'text-[#e85d3f]'}`}>
                                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${st.cls}`}>{st.label}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                {t.status === 'pending' && (
                                  <button
                                    onClick={async () => { await financialApi.update(t.id, { status: 'paid', payment_date: new Date().toISOString().slice(0, 10) }); load(); }}
                                    className="btn-icon-sm bg-[#4a7c65]/10 hover:bg-[#4a7c65]/20"
                                    title="Confirmar pagamento">
                                    <Check className="h-4 w-4 text-[#4a7c65]" />
                                  </button>
                                )}
                                <button
                                  onClick={async () => { await financialApi.delete(t.id); load(); }}
                                  className="btn-icon-sm hover:bg-[#fde8e3]"
                                  title="Excluir">
                                  <Trash2 className="h-4 w-4 text-[#e85d3f]" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-[#f5f3ef] border-t-2 border-[#e8e5df]">
                      <tr>
                        <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-[#5c5650]">
                          {filtered.length} transação(ões)
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="text-sm font-bold text-[#4a7c65]">
                            +{fmt(filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0))}
                          </span>
                          <span className="text-sm text-[#7a7369] mx-1">/</span>
                          <span className="text-sm font-bold text-[#e85d3f]">
                            -{fmt(filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0))}
                          </span>
                        </td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── RELATÓRIOS TAB ── */}
        {activeTab === 'relatorios' && (
          <motion.div key="relatorios" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6">
            {/* DRE Simplificado */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-[#2b2926] mb-6">DRE Simplificado — {PERIOD_LABELS[periodo]}</h3>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-4 border-[#4a7c65] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { label: 'Receitas Brutas', value: summary?.total_income ?? 0, cls: 'text-[#4a7c65]', bold: false },
                    { label: 'Receitas Pendentes', value: -(summary?.pending_income ?? 0), cls: 'text-[#7a7369]', bold: false },
                    { label: 'Receitas Confirmadas', value: (summary?.total_income ?? 0) - (summary?.pending_income ?? 0), cls: 'text-[#2b2926]', bold: true },
                    { label: '', value: 0, cls: '', bold: false },
                    { label: 'Despesas Totais', value: -(summary?.total_expenses ?? 0), cls: 'text-[#e85d3f]', bold: false },
                    { label: 'Despesas Pendentes', value: (summary?.pending_expenses ?? 0), cls: 'text-[#7a7369]', bold: false },
                    { label: '', value: 0, cls: '', bold: false },
                    { label: 'Resultado Líquido', value: (summary?.total_income ?? 0) - (summary?.total_expenses ?? 0), cls: (summary?.total_income ?? 0) - (summary?.total_expenses ?? 0) >= 0 ? 'text-[#4a7c65]' : 'text-[#e85d3f]', bold: true },
                  ].map((row, i) => row.label ? (
                    <div key={i} className={`flex items-center justify-between py-3 ${row.bold ? 'border-t-2 border-[#e8e5df] mt-2 pt-3' : 'border-b border-[#f0ece5]'}`}>
                      <span className={`text-sm ${row.bold ? 'font-bold text-[#2b2926]' : 'text-[#5c5650]'}`}>{row.label}</span>
                      <span className={`text-sm font-semibold ${row.cls}`}>{fmt(Math.abs(row.value))}</span>
                    </div>
                  ) : <div key={i} className="h-2" />)}
                </div>
              )}
            </div>

            {/* Monthly Bar Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-[#2b2926] mb-6">Análise de Receitas vs Despesas</h3>
              {dailyData.length === 0 ? (
                <p className="text-center text-[#7a7369] py-8">Sem dados no período selecionado</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={dailyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8e5df" />
                    <XAxis dataKey="data" tick={{ fontSize: 12, fill: '#7a7369' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#7a7369' }} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Bar dataKey="receitas" name="Receitas" fill="#4a7c65" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="despesas" name="Despesas" fill="#e85d3f" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nova Transação Modal */}
      <AnimatePresence>
        {showNova && (
          <NovaTransacaoModal
            onClose={() => setShowNova(false)}
            onSaved={load}
            categories={categories}
          />
        )}
      </AnimatePresence>
    </div>
  );
}